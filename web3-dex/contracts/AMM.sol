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
    function deposit(uint tokenAAmount,uint tokenBAmount) public returns(uint) {
        require(tokenAAmount > 0,"Amount for deposit cannot be empty");
        if(reserveA>0){
            require(tokenAAmount * reserveB == tokenBAmount * reserveA,"Amounts not equal");
        }
        tokenA.transferFrom(msg.sender,address(this),tokenAAmount);
        tokenB.transferFrom(msg.sender, address(this), tokenBAmount);
        _updateUserSharesPercentageDeposit(tokenAAmount,tokenBAmount);
        reserveA += tokenAAmount;
        reserveB += tokenBAmount;
        return 0;
    }

    function _updateUserSharesPercentageDeposit(uint tokenAAmount,uint tokenBAmount) private {
        uint newReserveA = reserveA + tokenAAmount;
        uint newReserveB = reserveB + tokenBAmount;
        if(!_containsLP()){
            liquidityProviders.push(msg.sender);
            tokenAUserShares[msg.sender] = (100 * tokenAAmount) / newReserveA;
            tokenBUserShares[msg.sender] = (100 * tokenBAmount) / newReserveB;
        }
        else {
            uint tokenAOldShare = (tokenAUserShares[msg.sender] * reserveA) / 100;
            uint tokenBOldShare = (tokenBUserShares[msg.sender] * reserveB) / 100;
            tokenAUserShares[msg.sender] = (100 * (tokenAOldShare + tokenAAmount)) / (newReserveA);
            tokenBUserShares[msg.sender] = (100 * (tokenBOldShare + tokenBAmount)) / (newReserveB);
        }
        for(uint i=0;i<liquidityProviders.length;i++){
            address userAddress = liquidityProviders[i];
            if(userAddress != msg.sender){
                uint tokenAOldShare = (tokenAUserShares[userAddress] * reserveA) / 100;
                uint tokenBOldShare = (tokenBUserShares[userAddress] * reserveB) / 100; 
                tokenAUserShares[userAddress] = (100 * (tokenAOldShare)) / (newReserveA);
                tokenBUserShares[userAddress] = (100 * (tokenBOldShare)) / (newReserveB); 
            }
        }
    }

    function _updateUserSharesPercentageWithdrawal(uint tokenAAmount,uint tokenBAmount) private {
        uint newReserveA = reserveA - tokenAAmount;
        uint newReserveB = reserveB - tokenBAmount;
        tokenAUserShares[msg.sender] = 0;
        tokenBUserShares[msg.sender] = 0;
        for(uint i=0;i<liquidityProviders.length;i++){
            address userAddress = liquidityProviders[i];
            if(userAddress != msg.sender){
                uint tokenAOldShare = (tokenAUserShares[msg.sender] * reserveA) / 100;
                uint tokenBOldShare = (tokenBUserShares[msg.sender] * reserveB) / 100; 
                tokenAUserShares[msg.sender] = (100 * (tokenAOldShare)) / (newReserveA);
                tokenBUserShares[msg.sender] = (100 * (tokenBOldShare)) / (newReserveB); 
            }
        }
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
        require(_containsLP(),"Given User not a LiqudityProvider");
        uint tokenAAmount = tokenAUserShares[msg.sender] * reserveA;
        uint tokenBAmount = tokenBUserShares[msg.sender] * reserveB;
        if(tokenAAmount!=0 && tokenBAmount!=0){
            tokenA.transfer(msg.sender,tokenAAmount);
            tokenB.transfer(msg.sender,tokenBAmount);
            _updateUserSharesPercentageWithdrawal(tokenAAmount,tokenBAmount);
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
            reserveA += amount;
            reserveB -= payOutTokenBAmount;
        }
        else if(tokenAddress == address(tokenB)){
            uint amountIn = (amount * 97) / 100;
            uint tokenAAmountAfterTransaction = (reserveA * reserveB) / (reserveB + amountIn);
            uint payOutTokenAAmount = reserveA - tokenAAmountAfterTransaction;
            tokenB.transferFrom(msg.sender,address(this),amount);
            tokenA.transfer(msg.sender,payOutTokenAAmount);
            reserveB += amount;
            reserveA -= payOutTokenAAmount;
        }
    }
}