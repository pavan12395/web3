// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract AMM {
    IERC20 internal tokenA;
    IERC20 internal tokenB;
    uint internal reserveA;
    uint internal reserveB;
    mapping(address => uint) tokenAUserShares;
    mapping(address => uint) tokenBUserShares;
    address[] public liquidityProviders;
    constructor(address tokenAAddress,address tokenBAddress){
        tokenA = IERC20(tokenAAddress);
        tokenB = IERC20(tokenBAddress);
        reserveA = 0;
        reserveB = 0;
    }
    function deposit(uint tokenAAmount,uint tokenBAmount) public {
        if(reserveA>0){
            require(tokenAAmount * reserveB == tokenBAmount * reserveA);
            tokenA.transferFrom(msg.sender,address(this),tokenAAmount);
            tokenB.transferFrom(msg.sender, address(this), tokenBAmount);
            reserveA += tokenAAmount;
            reserveB += tokenBAmount;
        }
    }



    function withdraw(uint tokenAAmount,uint tokenBAmount) public {
        require(tokenAAmount * reserveB == tokenBAmount * reserveA);
        require(tokenAUserShares[msg.sender] >= tokenAAmount && tokenBUserShares[msg.sender] >= tokenBAmount);
        tokenA.transfer(msg.sender,tokenAAmount);
        tokenB.transfer(msg.sender,tokenBAmount);
        reserveA -= tokenAAmount;
        reserveB -= tokenBAmount;
    }

    function withDrawAllFunds() public {
        uint tokenAAmount = tokenAUserShares[msg.sender];
        uint tokenBAmount = tokenBUserShares[msg.sender];
        if(tokenAAmount!=0 && tokenBAmount!=0){
            tokenA.transfer(msg.sender,tokenAAmount);
            tokenB.transfer(msg.sender,tokenBAmount);
            reserveA -= tokenAAmount;
            reserveB -= tokenBAmount;
        }
    }

    function trade(address tokenAddress,uint amount) public {
        if(tokenAddress == address(tokenA)){
            require(reserveA >= amount);
            uint amountIn = (amount * 97) / 100;
            uint tokenBAmountAfterTransaction = (reserveA * reserveB) / (reserveA + amountIn);
            uint payOutTokenBAmount = reserveB - tokenBAmountAfterTransaction;
            tokenA.transferFrom(msg.sender,address(this),amount);
            tokenB.transfer(msg.sender,payOutTokenBAmount);
            uint tokenBAmount = reserveB - (reserveA * reserveB) / (reserveA + amount);
            reserveA += amount;
            reserveB -= tokenBAmount;
        }
        else if(tokenAddress == address(tokenB)){
            uint amountIn = (amount * 97) / 100;
            uint tokenAAmountAfterTransaction = (reserveA * reserveB) / (reserveB + amountIn);
            uint payOutTokenAAmount = reserveA - tokenAAmountAfterTransaction;
            tokenB.transferFrom(msg.sender,address(this),amount);
            tokenA.transfer(msg.sender,payOutTokenAAmount);
            uint tokenAAmount = reserveA - (reserveA * reserveB) / (reserveB + amount);
            reserveB += amount;
            reserveA -= tokenAAmount;
        }
    }

    function udpateUserShares() internal {

    }
}