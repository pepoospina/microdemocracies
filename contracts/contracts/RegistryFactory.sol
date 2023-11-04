//// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./Registry.sol";
    
contract RegistryFactory {
    Registry private master;

    event RegistryCreated(address creator, address newRegistry, bytes32 salt);

    constructor(address payable _master) {
        master = Registry(_master);
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
        Registry(proxy).initRegistry(__symbol, __name, addresses, foundersCids);

        emit RegistryCreated(msg.sender, proxy, salt);

        return proxy;
    }
}
