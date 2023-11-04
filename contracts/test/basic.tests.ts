import { expect } from 'chai';
import { ethers } from 'hardhat';

import { constants, BigNumber, Event } from 'ethers';

import { Registry, RegistryFactory } from '../typechain';
import { SECONDS_IN_DAY, deployRegistry, deployRegistryFactory, fastForwardToTimestamp, getEvents, getTimestamp, registryFrom, shouldFail } from './support';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { deriveEntity, hashObject } from '@app/utils/cid-hash';
import { Entity, PAP } from '@app/types';

interface User {
  s: SignerWithAddress;
  tokenId: number;
  person: Entity<PAP>;
}

const WRONG_TOKEN_ID = 9999999999;
const FOUNDERS_VOUCHER = '115792089237316195423570985008687907853269984665640564039457584007913129639935';

const vouchHelper = async (registry: Registry, by: User, vouched: User) => {
  const tx1 = await registryFrom(registry.address, by.s).vouch(vouched.s.address, vouched.person.cid);
  const res1 = await tx1.wait();
  const vouchEvent = res1.events?.find((e) => e.event === 'VouchEvent');
  const transferEvent = res1.events?.find((e) => e.event === 'Transfer');

  /** store the tokenId in the User object */
  vouched.tokenId = transferEvent?.args?.tokenId;

  return { vouchEvent, transferEvent, tokenId: vouched.tokenId };
};

const voteHelper = async (registry: Registry, by: User, challengedTokenId: number, vote: 1 | -1) => {
  const tx1 = await registryFrom(registry.address, by.s).vote(challengedTokenId, vote);
  const res1 = await tx1.wait();
  const voteEvent = res1.events?.find((e: Event) => e.event === 'VoteEvent');
  const invalidatedByChallengeEvent = res1.events?.find((e: Event) => e.event === 'InvalidatedByChallenge');
  const invalidatedByInvalidVoucherEvent = res1.events?.find((e: Event) => e.event === 'InvalidatedByInvalidVoucherEvent');
  const invalidatedAccountEvent = res1.events?.find((e: Event) => e.event === 'InvalidatedAccountEvent');
  const votingPeriodExtendedEvent = res1.events?.find((e: Event) => e.event === 'VotingPeriodExtendedEvent');
  const challengeExecuted = res1.events?.find((e: Event) => e.event === 'ChallengeExecuted');

  return {
    voteEvent,
    invalidatedAccountEvent,
    invalidatedByChallengeEvent,
    invalidatedByInvalidVoucherEvent,
    votingPeriodExtendedEvent,
    challengeExecuted,
  };
};

const challengeHelper = async (registry: Registry, by: User, challengedTokenId: number) => {
  const tx = await registryFrom(registry.address, by.s).challenge(challengedTokenId);
  const res = await tx.wait();
  return res.events?.find((e: Event) => e.event === 'ChallengeEvent');
};

const personCidHelper = async (registry: Registry, tokenId: number) => {
  const { personCid } = await registry.getTokenVouch(tokenId);
  return personCid;
};

describe('Registry', () => {
  let registry: Registry;
  let factory: RegistryFactory;
  let counter = 0;
  let deployTxHash: string;

  let deployer: SignerWithAddress;

  let f0: User;
  let f1: User;
  let f2: User;
  let f3: User;
  const N0 = 4;

  let v11: User;
  let v12: User;
  let v13: User;
  const N1 = 3;

  let v111: User;
  let v112: User;
  let v113: User;
  const N11 = 3;

  let v1131: User;
  let v1132: User;
  const N113 = 2;

  let v31: User;
  let v32: User;
  let v33: User;
  let v34: User;
  let v35: User;
  const N4 = 5;

  let c1: User;

  let founders: User[];

  let NCUM: number;

  before(async () => {
    let signers = await ethers.getSigners();
    deployer = signers[signers.length - 1];

    [f0, f1, f2, f3, v11, v12, v13, v111, v112, v113, v1131, v1132, c1, v31, v32, v33, v34, v35] = await Promise.all(
      signers.map(async (s, ix) => {
        const pap: PAP = { person: { personal: { firstName: `personOfSigner${ix}` } }, account: s.address };
        const personEntity = await deriveEntity(pap);
        return { s, tokenId: WRONG_TOKEN_ID, person: personEntity };
      })
    );

    founders = [f0, f1, f2, f3];

    const addresses = founders.map((f) => (f.person && f.person.object.account) as string);
    const personCids = founders.map((f) => (f.person && f.person.cid) as string);

    /** */
    const master = await deployRegistry(deployer);
    factory = await deployRegistryFactory(master.address, deployer);
    const tx = await factory.create('ABC', 'Test Community', addresses, personCids, ethers.utils.keccak256(ethers.utils.toUtf8Bytes(counter.toString())));
    counter++;
    const rec = await tx.wait();

    const createdEvent = rec.events?.find((e) => e.event === 'RegistryCreated');
    expect(createdEvent).to.exist;

    if (!createdEvent || !createdEvent.args) throw new Error('Event not found');
    const address = createdEvent?.args.newRegistry;
    registry = await ethers.getContractAt('Registry', address);

    deployTxHash = rec.transactionHash;
  });

  it('was deployed with founders', async () => {
    const events = await getEvents(deployTxHash, registry);
    const vouchEvents = events.filter((e) => e.name === 'VouchEvent');
    const transferEvents = events.filter((e) => e.name === 'Transfer');

    expect(vouchEvents).to.have.length(N0);
    expect(transferEvents).to.have.length(N0);

    transferEvents.forEach((e, ix) => {
      const tokenId = ix + 1;
      expect(e.args.from).to.eq(constants.AddressZero);
      expect(e.args.to).to.eq(founders[ix].s.address);
      expect(e.args.tokenId).to.eq(tokenId);
    });

    f0.tokenId = transferEvents.find((e) => e.args.to === f0.s.address)?.args.tokenId;
    f1.tokenId = transferEvents.find((e) => e.args.to === f1.s.address)?.args.tokenId;
    f2.tokenId = transferEvents.find((e) => e.args.to === f2.s.address)?.args.tokenId;
    f3.tokenId = transferEvents.find((e) => e.args.to === f3.s.address)?.args.tokenId;

    vouchEvents.forEach((e, ix) => {
      const tokenId = ix + 1;
      expect(e.args.from).to.eq(BigNumber.from(FOUNDERS_VOUCHER));
      expect(e.args.to).to.eq(tokenId);
      expect(e.args.personCid).to.eq(founders[ix].person?.cid);
    });

    expect(await registry.VOTING_PERIOD()).to.eq(15 * SECONDS_IN_DAY);
    expect(await registry.PENDING_PERIOD()).to.eq(180 * SECONDS_IN_DAY);

    expect(await registry.balanceOf(f0.s.address)).to.eq(1);
    expect(await registry.balanceOf(f1.s.address)).to.eq(1);
    expect(await registry.balanceOf(f2.s.address)).to.eq(1);
    expect(await registry.balanceOf(f3.s.address)).to.eq(1);

    expect(await registry.balanceOf(deployer.address)).to.eq(0);

    expect(await registry.ownerOf(f0.tokenId)).to.eq(f0.s.address);
    expect(await registry.ownerOf(f1.tokenId)).to.eq(f1.s.address);
    expect(await registry.ownerOf(f2.tokenId)).to.eq(f2.s.address);
    expect(await registry.ownerOf(f3.tokenId)).to.eq(f3.s.address);

    await Promise.all(
      [f0, f1, f2, f3].map(async (f) => {
        const account = await registry.getAccount(f0.tokenId);
        expect(account.account).to.eq(f0.s.address);
        expect(account.voucher).to.eq(FOUNDERS_VOUCHER);
        expect(account.valid).to.be.true;
        expect(account.timesChallenged).to.eq(0);
      })
    );

    expect(await personCidHelper(registry, f0.tokenId)).to.eq(founders[0].person?.cid);
    expect(await personCidHelper(registry, f1.tokenId)).to.eq(founders[1].person?.cid);
    expect(await personCidHelper(registry, f2.tokenId)).to.eq(founders[2].person?.cid);
    expect(await personCidHelper(registry, f3.tokenId)).to.eq(founders[3].person?.cid);

    expect(await registry.getVoucherVouchesNumber(FOUNDERS_VOUCHER)).eq(N0);
    expect(await registry.getTotalVoters(f0.tokenId)).eq(N0 - 1);
    expect(await registry.totalSupply()).eq(N0);

    expect(await registry.canVote(0, f0.tokenId)).to.be.false;
    expect(await registry.canVote(FOUNDERS_VOUCHER, f0.tokenId)).to.be.true;
    expect(await registry.canVote(f0.tokenId, f0.tokenId)).to.be.false;
    expect(await registry.canVote(f1.tokenId, f0.tokenId)).to.be.true;
    expect(await registry.canVote(f2.tokenId, f0.tokenId)).to.be.true;
    expect(await registry.canVote(f3.tokenId, f0.tokenId)).to.be.true;
    expect(await registry.canVote(v11.tokenId, f0.tokenId)).to.be.false;

    expect(await registry.isSolidified(0)).to.be.false;
    expect(await registry.isSolidified(f0.tokenId)).to.be.false;
    expect(await registry.isSolidified(f1.tokenId)).to.be.false;
    expect(await registry.isSolidified(f2.tokenId)).to.be.false;
    expect(await registry.isSolidified(f3.tokenId)).to.be.false;
    expect(await registry.isSolidified(v11.tokenId)).to.be.false;
  });

  describe('Founders', () => {
    it('non vouched cant vouch', async () => {
      expect(await registry.balanceOf(v11.s.address)).to.eq(0);

      await shouldFail(async () => {
        await vouchHelper(registry, v11, v111);
      }, 'ErrorVoucherNotValid()');

      expect(await registry.balanceOf(f0.s.address)).to.eq(1);
      expect(await registry.balanceOf(v111.s.address)).to.eq(0);
      expect(await registry.balanceOf(f3.s.address)).to.eq(1);

      expect(await registry.getTotalVoters(v111.tokenId)).eq(0);

      expect(await registry.getVoucherVouchesNumber(FOUNDERS_VOUCHER)).eq(N0);
      expect(await registry.getTotalVoters(f0.tokenId)).eq(N0 - 1);

      expect(await registry.totalSupply()).eq(N0);

      expect(await registry.canVote(deployer.address, f0.tokenId)).to.be.false;
      expect(await registry.canVote(f0.tokenId, f0.tokenId)).to.be.false;
      expect(await registry.canVote(f1.tokenId, f0.tokenId)).to.be.true;
      expect(await registry.canVote(f2.tokenId, f0.tokenId)).to.be.true;
      expect(await registry.canVote(f3.tokenId, f0.tokenId)).to.be.true;
      expect(await registry.canVote(v11.tokenId, f0.tokenId)).to.be.false;

      expect(await registry.isSolidified(FOUNDERS_VOUCHER)).to.be.false;
      expect(await registry.isSolidified(0)).to.be.false;
      expect(await registry.isSolidified(f0.tokenId)).to.be.false;
      expect(await registry.isSolidified(f1.tokenId)).to.be.false;
      expect(await registry.isSolidified(f2.tokenId)).to.be.false;
      expect(await registry.isSolidified(f3.tokenId)).to.be.false;
      expect(await registry.isSolidified(v11.tokenId)).to.be.false;
    });

    it('founder can vouch', async () => {
      const { vouchEvent, transferEvent } = await vouchHelper(registry, f0, v11);
      expect(vouchEvent).to.exist;
      expect(transferEvent).to.exist;

      expect(await registry.balanceOf(f0.s.address)).to.eq(1);
      expect(await registry.balanceOf(v11.s.address)).to.eq(1);
      expect(await registry.balanceOf(v111.s.address)).to.eq(0);
      expect(await registry.balanceOf(f3.s.address)).to.eq(1);

      expect(await registry.tokenIdOf(v11.s.address)).to.eq(v11.tokenId);

      expect(await registry.getVoucherVouchesNumber(f0.tokenId)).eq(1);
      expect(await registry.getTotalVoters(v11.tokenId)).eq(1);

      expect(await registry.getVoucherVouchesNumber(FOUNDERS_VOUCHER)).eq(N0);
      expect(await registry.getTotalVoters(f0.tokenId)).eq(N0 - 1);

      expect(await registry.totalSupply()).eq(N0 + 1);

      expect(await registry.canVote(deployer.address, f0.tokenId)).to.be.false;
      expect(await registry.canVote(f0.tokenId, f0.tokenId)).to.be.false;
      expect(await registry.canVote(f1.tokenId, f0.tokenId)).to.be.true;
      expect(await registry.canVote(f2.tokenId, f0.tokenId)).to.be.true;
      expect(await registry.canVote(f3.tokenId, f0.tokenId)).to.be.true;
      expect(await registry.canVote(v11.tokenId, f0.tokenId)).to.be.false;
      expect(await registry.canVote(v111.tokenId, f0.tokenId)).to.be.false;

      expect(await registry.canVote(f0.tokenId, v11.tokenId)).to.be.true;
      expect(await registry.canVote(v11.tokenId, v11.tokenId)).to.be.false;
      expect(await registry.canVote(v12.tokenId, v11.tokenId)).to.be.false;
      expect(await registry.canVote(v111.tokenId, v11.tokenId)).to.be.false;

      expect(await registry.isSolidified(deployer.address)).to.be.false;
      expect(await registry.isSolidified(f0.tokenId)).to.be.false;
      expect(await registry.isSolidified(f1.tokenId)).to.be.false;
      expect(await registry.isSolidified(f2.tokenId)).to.be.false;
      expect(await registry.isSolidified(f3.tokenId)).to.be.false;
      expect(await registry.isSolidified(v11.tokenId)).to.be.false;

      await vouchHelper(registry, f0, v12);

      await vouchHelper(registry, f0, v13);

      expect(await registry.balanceOf(v11.s.address)).to.eq(1);
      expect(await registry.balanceOf(v12.s.address)).to.eq(1);
      expect(await registry.balanceOf(v13.s.address)).to.eq(1);

      expect(await registry.getVoucherVouchesNumber(f0.tokenId)).eq(N1);
      expect(await registry.getTotalVoters(v11.tokenId)).eq(N1);
    });

    describe('After founder vouched', () => {
      it('vouched can vouch', async () => {
        const event = await vouchHelper(registry, v11, v111);

        expect(event).to.exist;

        expect(await registry.balanceOf(f0.s.address)).to.eq(1);
        expect(await registry.balanceOf(v11.s.address)).to.eq(1);
        expect(await registry.balanceOf(v111.s.address)).to.eq(1);
        expect(await registry.balanceOf(v112.s.address)).to.eq(0);
        expect(await registry.balanceOf(v113.s.address)).to.eq(0);
        expect(await registry.balanceOf(f3.s.address)).to.eq(1);

        expect(await registry.getVoucherVouchesNumber(v11.tokenId)).eq(1);
        expect(await registry.getTotalVoters(v111.tokenId)).eq(1);

        expect(await registry.getVoucherVouchesNumber(FOUNDERS_VOUCHER)).eq(N0);
        expect(await registry.getTotalVoters(v11.tokenId)).eq(N0 - 1);

        expect(await registry.totalSupply()).eq(N0 + N1 + 1);

        expect(await registry.canVote(f0.tokenId, f0.tokenId)).to.be.false;
        expect(await registry.canVote(f1.tokenId, f0.tokenId)).to.be.true;
        expect(await registry.canVote(f2.tokenId, f0.tokenId)).to.be.true;
        expect(await registry.canVote(f3.tokenId, f0.tokenId)).to.be.true;
        expect(await registry.canVote(v11.tokenId, f0.tokenId)).to.be.false;
        expect(await registry.canVote(v111.tokenId, f0.tokenId)).to.be.false;

        expect(await registry.canVote(f1.tokenId, v11.tokenId)).to.be.false;
        expect(await registry.canVote(f0.tokenId, v11.tokenId)).to.be.true;
        expect(await registry.canVote(v12.tokenId, v11.tokenId)).to.be.true;
        expect(await registry.canVote(v111.tokenId, v11.tokenId)).to.be.false;

        expect(await registry.canVote(f0.tokenId, v111.tokenId)).to.be.false;
        expect(await registry.canVote(v11.tokenId, v111.tokenId)).to.be.true;
        expect(await registry.canVote(v111.tokenId, v111.tokenId)).to.be.false;

        expect(await registry.isSolidified(deployer.address)).to.be.false;
        expect(await registry.isSolidified(f0.tokenId)).to.be.false;
        expect(await registry.isSolidified(f1.tokenId)).to.be.false;
        expect(await registry.isSolidified(f2.tokenId)).to.be.false;
        expect(await registry.isSolidified(f3.tokenId)).to.be.false;
        expect(await registry.isSolidified(v11.tokenId)).to.be.false;
      });

      it('vouched can vouch again', async () => {
        await vouchHelper(registry, v11, v112);

        expect(await registry.totalSupply()).to.eq(N0 + N1 + 2);
        expect(await registry.getVoucherVouchesNumber(v11.tokenId)).to.eq(2);
        expect(await registry.getTotalVoters(v112.tokenId)).to.eq(2);

        await vouchHelper(registry, v11, v113);

        expect(await registry.totalSupply()).to.eq(N0 + N1 + N11);
        expect(await registry.getVoucherVouchesNumber(v11.tokenId)).to.eq(3);
        expect(await registry.getTotalVoters(v112.tokenId)).to.eq(3);

        expect(await registry.balanceOf(f0.s.address)).to.eq(1);
        expect(await registry.balanceOf(v11.s.address)).to.eq(1);
        expect(await registry.balanceOf(v111.s.address)).to.eq(1);
        expect(await registry.balanceOf(v112.s.address)).to.eq(1);
        expect(await registry.balanceOf(v113.s.address)).to.eq(1);
        expect(await registry.balanceOf(f3.s.address)).to.eq(1);
      });

      it('voched by vouched can vouch (3rd level now)', async () => {
        await vouchHelper(registry, v113, v1131);

        expect(await registry.totalSupply()).eq(N0 + N1 + N11 + 1);
        expect(await registry.getVoucherVouchesNumber(v113.tokenId)).eq(1);
        expect(await registry.getTotalVoters(v1131.tokenId)).eq(1);

        await vouchHelper(registry, v113, v1132);

        expect(await registry.totalSupply()).eq(N0 + N1 + N11 + N113);
        expect(await registry.getVoucherVouchesNumber(v113.tokenId)).eq(2);
        expect(await registry.getTotalVoters(v1131.tokenId)).eq(N113);

        expect(await registry.balanceOf(f0.s.address)).to.eq(1);
        expect(await registry.balanceOf(v11.s.address)).to.eq(1);
        expect(await registry.balanceOf(v111.s.address)).to.eq(1);
        expect(await registry.balanceOf(v112.s.address)).to.eq(1);
        expect(await registry.balanceOf(v113.s.address)).to.eq(1);
        expect(await registry.balanceOf(f3.s.address)).to.eq(1);
      });

      describe('Challenging', () => {
        it('cant challenge invalid account', async () => {
          /** just in case check challenging an invalid account */
          await shouldFail(async () => {
            await challengeHelper(registry, c1, v32.tokenId);
          }, 'CantChallengeInvalidAccount()');
        });

        it('can challenge valid account', async () => {
          const event = await challengeHelper(registry, c1, v11.tokenId);
          const { creationDate, nFor, nVoted } = await registry.getChallenge(v11.tokenId);

          expect(event).to.exist;
          expect(creationDate.gt(0)).to.be.true;
          expect(nFor).to.eq(0);
          expect(nVoted).to.eq(0);

          expect(await registry.getTotalVoters(v11.tokenId)).to.eq(N1);
        });

        it('other founders not the voucher of v11 cant vote', async () => {
          await shouldFail(async () => {
            await voteHelper(registry, f2, v11.tokenId, 1);
          }, 'ErrorVoterCantVote()');
        });

        it('challenged user cant vote', async () => {
          await shouldFail(async () => {
            await voteHelper(registry, v11, v11.tokenId, 1);
          }, 'ErrorVoteOnOwnChallenge()');
        });

        it('founder 1 can vote', async () => {
          expect(await registry.totalSupply()).eq(N0 + N1 + N11 + N113);
          expect(await registry.getTotalVoters(v11.tokenId)).to.eq(N1);

          /** founder 0 vote (33%) */
          const voteEvent = await voteHelper(registry, f0, v11.tokenId, 1);
          const { creationDate, nFor, nVoted } = await registry.getChallenge(v11.tokenId);

          expect(voteEvent).to.exist;
          expect(creationDate.gt(0)).to.be.true;
          expect(nFor).to.eq(1);
          expect(nVoted).to.eq(1);

          /** v11 should still be valid */
          expect(await registry.totalSupply()).eq(N0 + N1 + N11 + N113);
          expect(await registry.balanceOf(v11.s.address)).eq(1);
        });

        it('derived from v11 cant be invalidated just yet', async () => {
          shouldFail(async () => {
            await registryFrom(registry.address, c1.s).invalidateInvalidVoucher(v111.tokenId);
          }, 'ErrorVoucherIsValid()');
        });

        it('v12 can vote and settle challenge', async () => {
          expect(await registry.totalSupply()).eq(N0 + N1 + N11 + N113);
          expect(await registry.getTotalVoters(v11.tokenId)).to.eq(N1);

          /** v12 vote (66%) */
          const { voteEvent, invalidatedByChallengeEvent, invalidatedAccountEvent } = await voteHelper(registry, v12, v11.tokenId, 1);
          const { nFor, nVoted } = await registry.getSpecificChallenge(v11.tokenId, 0);

          expect(voteEvent).to.exist;
          expect(nFor).to.eq(2);
          expect(nVoted).to.eq(2);

          expect(voteEvent).to.exist;
          expect(invalidatedByChallengeEvent).to.exist;
          expect(invalidatedAccountEvent).to.exist;

          expect(await registry.totalSupply()).eq(N0 + N1 + N11 + N113 - 1);
          expect(await registry.balanceOf(v11.s.address)).eq(0);
        });

        it('all those derived from v11 can be invalidated', async () => {
          expect(await registry.totalSupply()).eq(N0 + N1 + N11 + N113 - 1);

          for (const account of [v111, v112, v113, v1131, v1132]) {
            const tx1 = await registryFrom(registry.address, c1.s).invalidateInvalidVoucher(account.tokenId);
            const res1 = await tx1.wait();

            const InvalidatedByInvalidVoucherEvent = res1.events?.find((e: Event) => e.event === 'InvalidatedByInvalidVoucher');
            const InvalidatedAccountEvent = res1.events?.find((e: Event) => e.event === 'InvalidatedAccountEvent');

            expect(InvalidatedByInvalidVoucherEvent).to.exist;
            expect(InvalidatedAccountEvent).to.exist;
            expect(await registry.balanceOf(account.s.address)).to.eq(0);
          }

          expect(await registry.totalSupply()).eq(N0 + N1 - 1);
        });
      });
    });

    describe('Revouch', async () => {
      it('can revouch', async () => {
        expect(await registry.totalSupply()).eq(N0 + N1 - 1);

        for (const vouchPair of [
          [f0, v11],
          [v11, v111],
          [v11, v112],
          [v11, v113],
          [v113, v1131],
          [v113, v1132],
        ]) {
          const voucher = vouchPair[0];
          const vouched = vouchPair[1];

          await vouchHelper(registry, voucher, vouched);
          expect(await registry.balanceOf(vouched.s.address)).to.eq(1);
        }

        NCUM = N0 + N1 + N11 + N113;
        expect(await registry.totalSupply()).eq(NCUM);
      });
    });

    describe('New vouches', async () => {
      it('new vouches', async () => {
        expect(await registry.totalSupply()).eq(NCUM);

        for (const vouchPair of [
          [f3, v31],
          [f3, v32],
          [f3, v33],
          [f3, v34],
          [f3, v35],
        ]) {
          const voucher = vouchPair[0];
          const vouched = vouchPair[1];

          const event = await vouchHelper(registry, voucher, vouched);

          expect(event).to.exist;
          expect(await registry.balanceOf(vouched.s.address)).to.eq(1);
        }

        expect(await registry.totalSupply()).eq(NCUM + N4);
        NCUM = NCUM + N4;
      });
    });

    describe('Challenge outside of voting period', () => {
      before(async () => {
        const event = await challengeHelper(registry, c1, v31.tokenId);

        expect(event).to.exist;
      });

      it('is still valid', async () => {
        expect(await registry.balanceOf(v31.s.address)).to.eq(1);
      });

      it('challenge fails if no one vote', async () => {
        const last = await getTimestamp();
        await fastForwardToTimestamp(last.add(15 * SECONDS_IN_DAY + 1));

        /** cant vote anymore */
        await shouldFail(async () => {
          await voteHelper(registry, f3, v31.tokenId, 1);
        }, 'ErrorVotingPeriodEnded()');

        expect(await registry.balanceOf(v31.s.address)).to.eq(1);

        const tx = await registryFrom(registry.address, c1.s).executeVote(v31.tokenId);
        await tx.wait();

        expect(await registry.balanceOf(v31.s.address)).to.eq(1);
      });

      it('can re-challenge unsucessful challenge', async () => {
        expect(await registry.totalSupply()).eq(NCUM);
        const event = await challengeHelper(registry, c1, v31.tokenId);

        expect(event).to.exist;
        expect(await registry.getTotalVoters(v31.tokenId)).to.eq(N4);

        /** previous challenge data */

        const account = await registry.getAccount(v31.tokenId);

        expect(account.account).to.eq(v31.s.address);
        expect(account.voucher).to.eq(f3.tokenId);
        expect(account.valid).to.be.true;
        expect(account.timesChallenged).to.eq(1);

        expect(await registry.getChallengeVote(v31.tokenId, v32.tokenId)).to.eq(0);

        const { nFor, nVoted } = await registry.getChallenge(v31.tokenId);
        expect(nFor).to.eq(0);
        expect(nVoted).to.eq(0);
      });

      it('challenge passes with relative majority', async () => {
        expect(await registry.totalSupply()).eq(NCUM);
        const event = await challengeHelper(registry, c1, v32.tokenId);

        expect(event).to.exist;
        expect(await registry.getTotalVoters(v31.tokenId)).to.eq(N4);

        const { voteEvent, invalidatedAccountEvent, challengeExecuted } = await voteHelper(registry, v33, v32.tokenId, 1);
        expect(voteEvent).to.exist;
        expect(invalidatedAccountEvent).to.not.exist;
        expect(challengeExecuted).to.not.exist;
        expect(await registry.totalSupply()).eq(NCUM);

        /** only 1 of 4 votes */
        const { creationDate, nFor, nVoted } = await registry.getChallenge(v32.tokenId);
        expect(nFor).to.eq(1);
        expect(nVoted).to.eq(1);

        /** nothing happens if execute vote */
        expect(await registry.balanceOf(v32.s.address)).to.eq(1);

        const tx = await registryFrom(registry.address, c1.s).executeVote(v32.tokenId);
        await tx.wait();

        expect(await registry.balanceOf(v32.s.address)).to.eq(1);

        /** fastForwardToTimestamp */
        await fastForwardToTimestamp(creationDate.add(15 * SECONDS_IN_DAY + 1));

        const tx2 = await registryFrom(registry.address, c1.s).executeVote(v32.tokenId);
        const res2 = await tx2.wait();
        const invalidatedAccountEvent2 = res2.events?.find((e: Event) => e.event === 'InvalidatedAccountEvent');
        const invalidatedByChallenge2 = res2.events?.find((e: Event) => e.event === 'InvalidatedByChallenge');
        const challengeExecuted2 = res2.events?.find((e: Event) => e.event === 'ChallengeExecuted');

        expect(invalidatedAccountEvent2).to.exist;
        expect(invalidatedByChallenge2).to.exist;
        expect(challengeExecuted2).to.exist;

        expect(await registry.balanceOf(v32.s.address)).to.eq(0);
        expect(await registry.totalSupply()).eq(NCUM - 1);

        NCUM = NCUM - 1;
      });

      it('challenge period extended if outcome swaps just before endDate', async () => {
        /** revouch v32, it gets a different tokenId */
        const { vouchEvent } = await vouchHelper(registry, f3, v32);
        expect(vouchEvent).to.exist;

        expect(await registry.totalSupply()).eq(NCUM + 1);
        NCUM = NCUM + 1;

        const event = await challengeHelper(registry, c1, v32.tokenId);
        const details0 = await registry.getChallenge(v32.tokenId);
        expect(details0.nFor).to.eq(0);
        expect(details0.nVoted).to.eq(0);
        expect(details0.endDate).to.eq(details0.creationDate.add(15 * SECONDS_IN_DAY));
        expect(details0.lastOutcome).to.eq(-1);

        expect(event).to.exist;
        expect(await registry.getTotalVoters(v31.tokenId)).to.eq(N4);

        const voteRes1 = await voteHelper(registry, f3, v32.tokenId, -1);
        expect(voteRes1.voteEvent).to.exist;
        expect(voteRes1.invalidatedAccountEvent).to.not.exist;
        expect(await registry.totalSupply()).eq(NCUM);

        /** only 1 of 4 votes */
        const details1 = await registry.getChallenge(v32.tokenId);
        expect(details1.nFor).to.eq(0);
        expect(details1.nVoted).to.eq(1);
        expect(details1.endDate).to.eq(details1.creationDate.add(15 * SECONDS_IN_DAY));
        expect(details1.lastOutcome).to.eq(-1);

        /** nothing happens if execute vote */
        expect(await registry.balanceOf(v32.s.address)).to.eq(1);

        const tx = await registryFrom(registry.address, c1.s).executeVote(v32.tokenId);
        await tx.wait();

        expect(await registry.balanceOf(v32.s.address)).to.eq(1);

        /** fastForward to 1 day before endDate */
        await fastForwardToTimestamp(details1.endDate.sub(1 * SECONDS_IN_DAY));

        const voteRes2 = await voteHelper(registry, v31, v32.tokenId, 1);

        expect(voteRes2.voteEvent).to.exist;
        expect(voteRes2.invalidatedAccountEvent).to.not.exist;
        expect(voteRes2.votingPeriodExtendedEvent).to.exist;

        const lastVoteDate = (await ethers.provider.getBlock((voteRes2.voteEvent as Event).blockNumber)).timestamp;
        const newEndDate = lastVoteDate + 2 * SECONDS_IN_DAY;

        expect(await registry.balanceOf(v32.s.address)).to.eq(1);

        const details3 = await registry.getChallenge(v32.tokenId);
        expect(details3.nFor).to.eq(1);
        expect(details3.nVoted).to.eq(2);
        expect(details3.endDate).to.eq(newEndDate);

        /** forward time to passed the original endDate */
        await fastForwardToTimestamp(details1.endDate.add(1));

        /** try to execute the vote, but nothing should happen */
        const tx2 = await registryFrom(registry.address, c1.s).executeVote(v32.tokenId);
        const res2 = await tx2.wait();

        const invalidatedAccountEvent = res2.events?.find((e: Event) => e.event === 'InvalidatedAccountEvent');
        const invalidatedByChallenge = res2.events?.find((e: Event) => e.event === 'InvalidatedByChallenge');
        const challengeExecuted = res2.events?.find((e: Event) => e.event === 'ChallengeExecuted');

        expect(invalidatedAccountEvent).to.not.exist;
        expect(invalidatedByChallenge).to.not.exist;
        expect(challengeExecuted).to.not.exist;

        expect(await registry.balanceOf(v32.s.address)).to.eq(1);
        expect(await registry.totalSupply()).eq(NCUM);

        /** fastForward time to passed the new endDate */
        await fastForwardToTimestamp(BigNumber.from(newEndDate + 1));

        const tx3 = await registryFrom(registry.address, c1.s).executeVote(v32.tokenId);
        const res3 = await tx3.wait();

        const invalidatedAccountEvent2 = res3.events?.find((e: Event) => e.event === 'InvalidatedAccountEvent');
        const invalidatedByChallenge2 = res3.events?.find((e: Event) => e.event === 'InvalidatedByChallenge');
        const challengeExecuted2 = res3.events?.find((e: Event) => e.event === 'ChallengeExecuted');

        expect(invalidatedAccountEvent2).to.exist;
        expect(invalidatedByChallenge2).to.exist;
        expect(challengeExecuted2).to.exist;

        expect(await registry.balanceOf(v32.s.address)).to.eq(0);
        expect(await registry.totalSupply()).eq(NCUM - 1);

        NCUM = NCUM - 1;
      });

      it('cant re-challenge invalid account', async () => {
        await shouldFail(async () => {
          await challengeHelper(registry, c1, v32.tokenId);
        }, 'CantChallengeInvalidAccount()');
      });
    });

    describe('Challenge founder', async () => {
      before(async () => {
        const event = await challengeHelper(registry, c1, f3.tokenId);
        expect(event).to.exist;

        const { creationDate, nFor, nVoted } = await registry.getChallenge(f3.tokenId);

        expect(creationDate.gt(0)).to.be.true;
        expect(nFor.eq(0)).to.be.true;
        expect(nVoted.eq(0)).to.be.true;

        expect(await registry.getTotalVoters(v11.tokenId)).to.eq(N0 - 1);
      });

      it('challenged founder cant vote', async () => {
        await shouldFail(async () => {
          await voteHelper(registry, f2, f2.tokenId, 1);
        }, 'ErrorVoteOnOwnChallenge()');
      });

      it('other founders can vote', async () => {
        expect(await registry.totalSupply()).eq(NCUM);
        expect(await registry.getTotalVoters(v11.tokenId)).to.eq(N0 - 1);

        /** founder 0 vote (33%) */
        const { voteEvent: voteEvent1 } = await voteHelper(registry, f0, f3.tokenId, 1);
        const { nFor: nFor1, nVoted: nVoted1 } = await registry.getChallenge(f3.tokenId);

        expect(voteEvent1).to.exist;
        expect(nFor1).to.eq(1);
        expect(nVoted1).to.eq(1);

        /** founder 0 cant vote again */
        await shouldFail(async () => {
          await voteHelper(registry, f1, f2.tokenId, 1);
        }, 'ErrorAlreadyVoted()');

        const { nFor: nFor2, nVoted: nVoted2 } = await registry.getChallenge(f3.tokenId);
        expect(nFor2).to.eq(1);
        expect(nVoted2).to.eq(1);

        /** founder 2 can vote, and reach 66%, the challenge should close */
        const { voteEvent: voteEvent2, invalidatedAccountEvent, invalidatedByChallengeEvent } = await voteHelper(registry, f1, f3.tokenId, 1);

        const { nFor: nFor3, nVoted: nVoted3 } = await registry.getSpecificChallenge(f3.tokenId, 0);
        expect(nFor3).to.eq(2);
        expect(nVoted3).to.eq(2);

        expect(voteEvent2).to.exist;
        expect(invalidatedAccountEvent).to.exist;
        expect(invalidatedByChallengeEvent).to.exist;

        /** One less entry in the registry */
        expect(await registry.totalSupply()).eq(NCUM - 1);

        /** Founder 4 should not be valid */
        expect(await registry.balanceOf(f3.s.address)).eq(0);
      });

      it('invalid founder cant vouch anymore', async () => {
        await shouldFail(async () => {
          await vouchHelper(registry, f3, v112);
        }, 'ErrorVoucherNotValid()');
      });
    });
  });
});
