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

    struct Pair {
        uint tokenAAmount;
        uint tokenBAmount;
    }

    function getLiqudityPoolDetails() public view returns(Pair memory){
        Pair memory result;
        result.tokenAAmount = reserveA;
        result.tokenBAmount = reserveB;
        return result;
    }

    function getUserShareDetails() public view returns(Pair memory){
        Pair memory result;
        if(!_containsLP()){
            result.tokenAAmount = 0;
            result.tokenBAmount = 0;
        }
        else {
            result.tokenAAmount = tokenAUserShares[msg.sender];
            result.tokenBAmount = tokenBUserShares[msg.sender];
        }
        return result;
    }
    function deposit(uint tokenAAmount,uint tokenBAmount) public {
        require(tokenAAmount > 0,"Amount for deposit cannot be empty");
        if(reserveA>0){
            require(tokenAAmount * reserveB == tokenBAmount * reserveA , "Equivalent Amounts should be deposited");
        }
        if(!_containsLP()){
            liquidityProviders.push(msg.sender);
        }
        tokenA.transferFrom(msg.sender,address(this),tokenAAmount);
        tokenB.transferFrom(msg.sender, address(this), tokenBAmount);
        tokenAUserShares[msg.sender] = (tokenAUserShares[msg.sender] * reserveA + tokenAAmount) / (reserveA + tokenAAmount);
        tokenBUserShares[msg.sender] = (tokenBUserShares[msg.sender] * reserveB + tokenBAmount) / (reserveB + tokenBAmount);
        reserveA += tokenAAmount;
        reserveB += tokenBAmount;
    }

    function _containsLP() private view returns (bool) {
        for(uint i=0;i<liquidityProviders.length;i++){
            if(liquidityProviders[i] == msg.sender){
                return true;
            }
        }
        return false;
    }

    function withDrawAllFunds() public {
        uint tokenAAmount = tokenAUserShares[msg.sender] * reserveA;
        uint tokenBAmount = tokenBUserShares[msg.sender] * reserveB;
        if(tokenAAmount!=0 && tokenBAmount!=0){
            tokenA.transfer(msg.sender,tokenAAmount);
            tokenB.transfer(msg.sender,tokenBAmount);
            reserveA -= tokenAAmount;
            reserveB -= tokenBAmount;
            tokenAUserShares[msg.sender] = 0;
            tokenBUserShares[msg.sender] = 0;
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
            _updateUsersSharePercentage(amount-amountIn , amount , tokenBAmount-payOutTokenBAmount , tokenBAmount);
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
            _updateUsersSharePercentage(tokenAAmount - payOutTokenAAmount , tokenAAmount , amount-amountIn , amount);
            reserveB += amount;
            reserveA -= tokenAAmount;
        }
    }

    function _updateUsersSharePercentage(uint shareTokenA , uint tokenAAmount , uint shareTokenB , uint tokenBAmount ) private {
        for(uint i=0;i<liquidityProviders.length;i++){
            address userAddress = liquidityProviders[i];
            uint tokenAUserPercentage = tokenAUserShares[userAddress];
            uint tokenBUserPercentage = tokenBUserShares[userAddress]; 
            if(tokenAUserPercentage != 0){
                uint userRewardTokenA = shareTokenA * tokenAUserPercentage;
                uint userRewardTokenB = shareTokenB * tokenBUserPercentage;
                tokenAUserPercentage = (reserveA * tokenAUserPercentage + userRewardTokenA) / (reserveA + tokenAAmount);
                tokenBUserPercentage = (reserveB * tokenBUserPercentage + userRewardTokenB) / (reserveB + tokenBAmount);
                tokenAUserShares[userAddress] = tokenAUserPercentage;
                tokenBUserShares[userAddress] = tokenBUserPercentage;
            }
        }
    }
}