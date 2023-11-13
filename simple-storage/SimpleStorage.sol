pragma solidity ^0.8.0;
// SPDX-License-Identifier: MIT

import "./Ownable.sol";


contract SimpleStorage {
    mapping(address => string) data;
    function storeValue(string calldata value) external {
        require(keccak256(abi.encodePacked(value))!=keccak256(abi.encodePacked("")),"Value should not be null");
        data[msg.sender] = value;
    }
    function getValue() external view returns(string memory) {
        require(keccak256(abi.encodePacked(data[msg.sender]))!=keccak256(abi.encodePacked("")),"No data found for this wallet");
        return data[msg.sender];
    }
}


