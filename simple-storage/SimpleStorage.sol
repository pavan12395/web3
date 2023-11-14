// SPDX-License-Identifier: MIT


pragma solidity ^0.8.7;

contract SimpleStorage {
    mapping(address => string) data;
    function storeValue(string calldata value) external {
        require(keccak256(abi.encodePacked(value))!=keccak256(abi.encodePacked("")));
        data[msg.sender] = value;
    }
    function getValue() external view returns(string memory) {
        require(keccak256(abi.encodePacked(data[msg.sender]))!=keccak256(abi.encodePacked("")));
        return data[msg.sender];
    }
}


