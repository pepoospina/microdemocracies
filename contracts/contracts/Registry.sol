// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "prb-math/contracts/PRBMathUD60x18.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

/**
 * @title Registry
 */

contract Registry is Context, IERC721, IERC721Metadata {
    using PRBMathUD60x18 for uint256;

    uint256 public PENDING_PERIOD = 180 days;
    uint256 public VOTING_PERIOD = 15 days;
    uint256 public QUIET_ENDING_PERIOD = 2 days;

    uint256 public FOUNDERS_VOUCHER = type(uint256).max;
    string internal baseURI = "ipfs://";
    string internal _symbol;
    string internal _name;

    struct Vouch {
        string personCid;
        uint256 vouchDate;
    }

    struct Vouches {
        uint256 number;
        mapping(uint256 => Vouch) vouches;
    }

    struct Account {
        address account;    
        uint256 voucher;
        bool valid;
        uint256 timesChallenged;
    }

    struct Challenge {
        bool executed;
        int8 lastOutcome;
        uint256 creationDate;
        uint256 endDate;
        mapping(uint256 => int8) votes;
        uint256 nVoted;
        uint256 nFor;
    }

    mapping(uint256 => Vouches) vouches;

    /** 
     * two mappings hold the address to token id relationship,
     * but this is a one-to-one relationship. TokenIds
     * are preferred as they can be memorized by users.
     */
    mapping(uint256 => Account) accounts;
    mapping(address => uint256) owned;

    mapping(uint256 => Challenge[]) challenges;

    uint256 __totalSupply; // sum of currenlty valid accounts
    uint256 public _nEntries; // sequential number that increments with every vouch (and gives the tokenId)

    event VouchEvent(uint256 indexed from, uint256 indexed to, string personCid);
    event InvalidatedAccountEvent(uint256 indexed tokenId);
    event InvalidatedByChallenge(uint256 indexed tokenId);
    event InvalidatedByInvalidVoucher(uint256 indexed tokenId);

    event ChallengeEvent(uint256 indexed tokenId);
    event ChallengeExecuted(uint256 tokenId, int8 outcome);        
    event VoteEvent(uint256 indexed voterTokenId, uint256 tokenId, int8 vote);
    event InvalidatedVoteEvent(uint256 indexed tokenId, uint256 indexed voterTokenId);
    event VotingPeriodExtendedEvent(uint256 newEndDate);

    /** Errors */
    error ErrorAccountSolidified();
    error CantChallengeInvalidAccount();
    error ChallangeAlreadyActive();    
    error ErrorVoteOnOwnChallenge();
    error ErrorChallangeAlreadyExecuted();
    error ErrorChallangeNotActive();
    error ErrorVotingPeriodEnded();
    error ErrorVoterCantVote();
    error ErrorAlreadyVoted();
    error ErrorVoucherIsValid();
    error ErrorVoucherNotValid();
    error ErrorAccountNotValid();
    error ErrorVoteNotFound();
    error ErrorVoterValid();
    error VoucherNoLongerInvalid();
    error AccountAlreadyOwnsOneToken();
    error UnexpectedExecutedCondition();

    /***************
    EXTERNAL FUNCTIONS
    ***************/
    constructor(string memory __symbol, string memory __name, address[] memory addresses, string[] memory foundersCids) {
        _symbol = __symbol;
        _name = __name;
        __totalSupply = 0;
        _nEntries = 0;
        for (uint8 ix = 0; ix < addresses.length; ix++) {
            /** special case of founder vouchers being a dumb token ID */
            accounts[FOUNDERS_VOUCHER].valid = true;
            _vouch(FOUNDERS_VOUCHER, addresses[ix], foundersCids[ix]);
        }
    }

    /** 
     * The msgSender must be a valid account in the registry and vouch
     * for the provided account and personCid pair
     */
    function vouch(address account, string calldata personCid) external {
        uint256 vouchTokenId = _tokenIdOf(_msgSender());
        _vouch(vouchTokenId, account, personCid);
    }

    function getCurrentChallenge(uint256 _tokenId) internal returns (Challenge storage) {
        uint256 timesChallenged = accounts[_tokenId].timesChallenged;
        
        if (challenges[_tokenId].length != timesChallenged + 1) {
            /** the currentChallenge must be the last challenge in the array, 
             * the first time is read it does not exist so we create it */
            challenges[_tokenId].push();
        }
        
        return challenges[_tokenId][timesChallenged];
    }

    function challenge(uint256 _tokenId) external {
        if(isSolidified(_tokenId)) {
            revert ErrorAccountSolidified();
        }

        if(!accounts[_tokenId].valid) {
            revert CantChallengeInvalidAccount();
        }

        Challenge storage _challenge = getCurrentChallenge(_tokenId);
        if(_challenge.creationDate > 0) revert ChallangeAlreadyActive();
        if(_challenge.executed) revert UnexpectedExecutedCondition();

        _challenge.creationDate = block.timestamp;
        _challenge.endDate = block.timestamp + VOTING_PERIOD;
        _challenge.lastOutcome = -1;

        emit ChallengeEvent(_tokenId);
    }

    function vote(uint256 _tokenId, int8 _vote) external {
        uint256 voterTokenId = _tokenIdOf(_msgSender());
        Challenge storage _challenge = getCurrentChallenge(_tokenId);
        
        if(_challenge.creationDate == 0) revert ErrorChallangeNotActive();
        if(_challenge.executed) revert ErrorChallangeAlreadyExecuted();
        if(block.timestamp > _challenge.endDate) revert ErrorVotingPeriodEnded();
        if(!canVote(voterTokenId, _tokenId)) revert ErrorVoterCantVote();
        if(_challenge.votes[voterTokenId] != 0) revert ErrorAlreadyVoted();

        _challenge.votes[voterTokenId] = _vote == 1 ? int8(1) : int8(-1);
        _challenge.nVoted += 1;
        _challenge.nFor += _vote == 1 ? 1 : 0;

        emit VoteEvent(voterTokenId, _tokenId, _vote);

        _executeVote(_challenge, _tokenId);
    }

    function executeVote(uint256 _tokenId) external {
        Challenge storage _challenge = getCurrentChallenge(_tokenId);
        _executeVote(_challenge, _tokenId);
    }

    function invalidateInvalidVoucher(uint256 tokenId) external {
        uint256 voucherTokenId = accounts[tokenId].voucher;
        if(accounts[voucherTokenId].valid) revert ErrorVoucherIsValid();

        emit InvalidatedByInvalidVoucher(tokenId);
        _invalidateAccount(tokenId);
    }

    function invalidateVote(uint256 _tokenId, uint256 _voterTokenId) external {
        Challenge storage _challenge = getCurrentChallenge(_tokenId);
        _invalidateVote(_tokenId, _challenge, _voterTokenId);
    }

    /***************
    VIEW FUNCTIONS
    ***************/
    function totalSupply() external view returns (uint256) {
        return _totalSupply();
    }

    function _totalSupply() internal view returns (uint256) {
        return __totalSupply;
    }

    function getTokenPersonCid(uint256 tokenId) public view returns (string memory) {
        uint256 voucherTokenId = accounts[tokenId].voucher;
        return vouches[voucherTokenId].vouches[tokenId].personCid;
    }

    function getTotalVoters(uint256 _tokenId) public view returns (uint256) {
        uint256 voucherTokenId = accounts[_tokenId].voucher;
        Vouches storage _vouches = vouches[voucherTokenId];

        /**
         * The number of vouches for valid accounts minus the voted account plus the voucher
         * number = _vouches.number - 1 + 1
         */
        uint256 number = _vouches.number;

        /** special case for the founder accounts where the voucher cannot vote */
        if (voucherTokenId == FOUNDERS_VOUCHER) {
            number = _vouches.number - 1;
        }

        return number;
    }

    /** 
     * A tokenId can vote if
     * - The voter account is valid
     * - AND either
     * - voterTokenId was vouched by voucherTokenId (which is the voucher of the challenged tokenId)
     * - OR the voterTokenId is the voucherTokenId themselves.
     * 
     * The FOUNDERS_VOUCHER can, in theory vote on founders challenges, but no address owns that 
     * token and so no problem
     * */
    function canVote(uint256 voterTokenId, uint256 challengedTokenId) public view returns (bool) {
        if (voterTokenId == challengedTokenId) return false;
        if (voterTokenId == 0) return false;

        uint256 voucherTokenId = accounts[challengedTokenId].voucher;
        if(!accounts[voucherTokenId].valid) revert VoucherNoLongerInvalid();

        bool isInCircle = accounts[voterTokenId].voucher == voucherTokenId || voterTokenId == voucherTokenId;

        if (accounts[voterTokenId].valid && isInCircle) return true;
        
        return false;
    }

    function isSolidified(uint256 tokenId) public view returns (bool) {
        Account memory account = accounts[tokenId];
        uint256 vouchDate = vouches[account.voucher].vouches[tokenId].vouchDate;

        bool isPending = vouchDate == 0 || block.timestamp <= vouchDate + PENDING_PERIOD;
        return !isPending && account.valid;
    }

    function tokenIdOf(address owner) external view returns(uint256){
        return _tokenIdOf(owner);
    }

    function _tokenIdOf(address owner) internal view returns(uint256){
        return owned[owner];
    }

    function balanceOf(address account) public view override returns (uint256 balance) {
        return _balanceOf(account);
    }

    function _balanceOf(address account) internal view returns (uint256 balance) {
        uint256 tokenId = _tokenIdOf(account);
        return tokenId != 0 && accounts[tokenId].valid ? 1 : 0;
    }

    function ownerOf(uint256 tokenId) external view override returns (address owner) {
        return _ownerOf(tokenId); 
    }

    function _ownerOf(uint256 tokenId) internal view returns (address owner) {
        return accounts[tokenId].account; 
    }

    function getChallenge(uint256 tokenId) external view returns (uint256 creationDate, uint256 endDate, int8 lastOutcome, uint256 nVoted, uint256 nFor, bool executed) {
        uint256 challengeIndex = accounts[tokenId].timesChallenged;
        return this.getSpecificChallenge(tokenId, challengeIndex);
    }

    function getChallengeVote(uint256 tokenId, uint256 voterTokenId) external view returns (int8) {
        uint256 challengeIndex = accounts[tokenId].timesChallenged;
        return this.getSpecificChallengeVote(tokenId, voterTokenId, challengeIndex);
    }

    function getSpecificChallenge(uint256 tokenId, uint256 challengeIndex) external view returns (uint256 creationDate, uint256 endDate, int8 lastOutcome, uint256 nVoted, uint256 nFor, bool executed) {
        Challenge storage _challenge = challenges[tokenId][challengeIndex];
        return (_challenge.creationDate, _challenge.endDate, _challenge.lastOutcome, _challenge.nVoted, _challenge.nFor, _challenge.executed);
    }

    function getSpecificChallengeVote(uint256 tokenId, uint256 voterTokenId, uint256 challengeIndex) external view returns (int8) {
        Challenge storage _challenge = challenges[tokenId][challengeIndex];
        return _challenge.votes[voterTokenId];
    }

    function getVoucherVouchesNumber(uint256 voucherTokenId) public view returns (uint256) {
        Vouches storage _vouches = vouches[voucherTokenId];
        return _vouches.number;
    }

    function getTokenVouch(uint256 tokenId) public view returns (Vouch memory) {
        uint256 voucher = accounts[tokenId].voucher;
        return vouches[voucher].vouches[tokenId];
    }

    function getAccount(uint256 tokenId) public view returns (Account memory) {
        return accounts[tokenId];
    }

    function nextTokenId() internal returns (uint256) {
        return ++_nEntries;
    }

    /***************
    INTERNAL FUNCTIONS
    ***************/

    /** Claiming is always enabled (effectively possible only when a non-zero approved merkleRoot is set) */
    function _vouch(uint256 _voucherTokenId, address _account, string memory _personCid) internal {
        uint256 _tokenId = nextTokenId();
        if(!accounts[_voucherTokenId].valid) revert ErrorVoucherNotValid();
        if (owned[_account] != 0) revert AccountAlreadyOwnsOneToken();
        
        Vouches storage tokenVouches = vouches[_voucherTokenId];
        Vouch storage __vouch = tokenVouches.vouches[_tokenId];

        /** 
         * Store the vouch data, validate and store the account data, set the owned mapping and update the 
         * total number of vouches and entries in the registry
         */
        __vouch.personCid = _personCid;
        __vouch.vouchDate = block.timestamp;

        accounts[_tokenId].account = _account;
        accounts[_tokenId].voucher = _voucherTokenId;
        accounts[_tokenId].valid = true;

        owned[_account] = _tokenId;

        tokenVouches.number += 1;
        __totalSupply += 1;

        emit Transfer(address(0), _account, _tokenId);
        emit VouchEvent(_voucherTokenId, _tokenId, _personCid);
    }

    function _invalidateAccount(uint256 tokenId) internal {
        Account storage account = accounts[tokenId];

        if (!account.valid) revert ErrorAccountNotValid();
        
        /** 
         * invalidate and remove the one-to-one relationship
         * between the accounts and the owned mappings
         */
        account.valid = false;
        
        owned[account.account] = 0;
        account.account = address(0);

        /** decrease the number of valid members of the circle */
        vouches[account.voucher].number -= 1;
        /** decrease the number of total entries in the registry */
        __totalSupply -= 1;

        emit InvalidatedAccountEvent(tokenId);
    }

    function _executeVote(Challenge storage _challenge, uint256 _tokenId) internal {
        bool executed = false;
        uint256 activeRatio = 0;
        uint256 relRatio = 0;

        /** 
         * keep track of outcome changes, if outcome changed recently,
         * extend the voting period
         */
        if (_challenge.nVoted > 0) {
            relRatio = _challenge.nFor.mul(uint256(1e18).div(_challenge.nVoted.mul(1e18)));
        }

        int8 currentOutcome = relRatio >= 0.5e18 ? int8(1) : int8(-1);
        
        /** Initialize the lastoutcome */
        if (_challenge.lastOutcome != currentOutcome) {
            _challenge.lastOutcome = currentOutcome;
            
            uint256 timeRemaining = _challenge.endDate - block.timestamp;

            if(timeRemaining < QUIET_ENDING_PERIOD) {
                uint256 newEndDate = _challenge.endDate + (QUIET_ENDING_PERIOD - timeRemaining);
                emit VotingPeriodExtendedEvent(newEndDate);
                _challenge.endDate = newEndDate;
            }
        }

        /** if challenge still pending */
        if (block.timestamp <= _challenge.endDate) {
            /** vote period not ended, the challenge is settled with absolute majority */
            uint256 totalVoters = getTotalVoters(_tokenId);
            activeRatio = _challenge.nFor.mul(uint256(1e18).div(totalVoters.mul(1e18)));
        } else {
            /** time period ended, the challenge is settled with relative majority */
            executed = true;
            activeRatio = relRatio;
        }

        int8 outcome = activeRatio >= 0.5e18 ? int8(1) : int8(-1);

        if (outcome == int8(1)) {
            executed = true;
            emit InvalidatedByChallenge(_tokenId);
            _invalidateAccount(_tokenId);
        }

        if(executed) {
            emit ChallengeExecuted(_tokenId, outcome);
            _challenge.executed = true;
            accounts[_tokenId].timesChallenged++;
        }
    }

    /**
     * Votes must be manually invalidated when a voter passes from valid to invalid. Automatic invalidation consume storage and this seems good enough
     * A voter should call "vote" to invalidate an account and "_invalidateVote" on all the open challenges of the recently invalidated account.
     */
    function _invalidateVote(uint256 tokenId, Challenge storage _challenge, uint256 voterTokenId) internal {
        if(_challenge.votes[voterTokenId] == 0) revert ErrorVoteNotFound();
        if(accounts[voterTokenId].valid) revert ErrorVoterValid();

        /** decrease the total number of voters */
        _challenge.nVoted -= 1;

        /** delete the positive vote of the invalid voter*/
        if (_challenge.votes[voterTokenId] == 1) {
            _challenge.nFor -= 1;
        }

        emit InvalidatedVoteEvent(tokenId, voterTokenId);
    }

    function supportsInterface(bytes4 interfaceId) external view override returns (bool) {}

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external override {}

    function safeTransferFrom(address from, address to, uint256 tokenId) external override {}

    function transferFrom(address from, address to, uint256 tokenId) external override {}

    function approve(address to, uint256 tokenId) external override {}

    function setApprovalForAll(address operator, bool approved) external override {}

    function getApproved(uint256) external view override returns (address operator) {
        return address(0);
    }

    function isApprovedForAll(address, address) external view override returns (bool) {
        return false;
    }

    function name() external view override returns (string memory) {
        return _name;
    }

    function symbol() external view override returns (string memory) {
        return _symbol;
    }

    function tokenURI(uint256 tokenId) external view override returns (string memory) {
        uint256 voucherTokenId = accounts[tokenId].voucher;
        string memory cid = vouches[voucherTokenId].vouches[tokenId].personCid;
        return string(abi.encodePacked(baseURI, cid)); 
    }
}
