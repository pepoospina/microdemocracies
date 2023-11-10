//// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./Registry.sol";
    
contract RegistryFactory {
    using Strings for uint256;
    Registry private master;
    uint256 public mrCounter;

    event RegistryCreated(address creator, address newRegistry, uint256 indexed number);

    constructor(address payable _master) {
        master = Registry(_master);
        mrCounter = 0;
    }

    function contractAddress(bytes32 salt) public view returns (address) {
        return Clones.predictDeterministicAddress(address(master), salt);
    }

    function create(
        string memory __symbol, 
        string memory __name, 
        address[] memory addresses, 
        string[] memory foundersCids,
        bytes32 salt
    ) external returns (address payable proxy) {
        proxy = payable(Clones.cloneDeterministic(address(master), salt));
        
        mrCounter++;
        string memory name = string(abi.encodePacked(__name, Strings.toString(mrCounter)));

        Registry(proxy).initRegistry(__symbol, name, addresses, foundersCids);

        emit RegistryCreated(msg.sender, proxy, mrCounter);

        return proxy;
    }
}
