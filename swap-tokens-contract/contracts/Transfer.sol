// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract Transfer {
    ERC20 token;
    constructor(address tokenAddress){
        token = ERC20(tokenAddress);
    }
    function pay(uint256 tokenValue) public {
        require(token.transferFrom(msg.sender,address(this),tokenValue * 1e18),"Token transfer failed");
    }
    function retrieve(uint256 tokenValue) public {
        token.transfer(msg.sender,tokenValue * 1e18);
    }
}