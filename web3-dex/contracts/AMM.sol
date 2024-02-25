// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./SafeMath.sol";





contract AMM {
    using SafeMath for uint256; // Import SafeMath library

    IERC20 internal tokenA;
    IERC20 internal tokenB;
    uint internal reserveA;
    uint internal reserveB;
    mapping(address => uint) tokenAPercentages;
    mapping(address => uint) tokenBPercentages;
    address[] public liquidityProviders;
    
    constructor(address tokenAAddress, address tokenBAddress) {
        tokenA = IERC20(tokenAAddress);
        tokenB = IERC20(tokenBAddress);
        reserveA = 0;
        reserveB = 0;
    }

    struct UserShareDetails {
        uint tokenAAmountPercentage;
        uint tokenBAmountPercentage;
    }

    struct LiqudityDetails {
        uint tokenAAmount;
        uint tokenBAmount;
    }

    function getLiquidityPoolDetails() public view returns (LiqudityDetails memory) {
        LiqudityDetails memory result;
        result.tokenAAmount = reserveA;
        result.tokenBAmount = reserveB;
        return result;
    }

    function getUserShareDetails() public view returns (UserShareDetails memory) {
        UserShareDetails memory result;
        if (!_containsLP()) {
            result.tokenAAmountPercentage = 0;
            result.tokenBAmountPercentage = 0;
        } else {
            result.tokenAAmountPercentage = tokenAPercentages[msg.sender];
            result.tokenBAmountPercentage = tokenBPercentages[msg.sender];
        }
        return result;
    }

    function deposit(uint tokenAAmount, uint tokenBAmount) public {
        require(tokenAAmount > 0, "Amount for deposit cannot be empty");
        uint factor = 10 ** 18;
        if (reserveA > 0) {
            uint256 ratio1 = (factor * tokenAAmount) / tokenBAmount;
            uint256 ratio2 = (factor * reserveA) / reserveB;
            if(ratio1 > ratio2){
                require(ratio1-ratio2<=100000,"Amounts not equal");
            }
            else {
                require(ratio2-ratio1<=100000,"Amounts not equal");
            }
        }
        tokenA.transferFrom(msg.sender, address(this), tokenAAmount);
        tokenB.transferFrom(msg.sender, address(this), tokenBAmount);        
        _updateTokenPercentageDeposit(tokenAAmount,tokenBAmount);
        reserveA = reserveA.add(tokenAAmount);
        reserveB = reserveB.add(tokenBAmount);
    }
    function _updateTokenPercentageDeposit(uint tokenAAmount,uint tokenBAmount) private {
        uint factor = 10 ** 18;
        if(!_containsLP()){
            liquidityProviders.push(msg.sender);
            tokenAPercentages[msg.sender] = 0;
            tokenBPercentages[msg.sender] = 0;
        }
        for(uint i=0;i<liquidityProviders.length;i++){
            address user = liquidityProviders[i];
            uint oldTokenAUserShare = (tokenAPercentages[user] * reserveA) / factor;
            uint oldTokenBUserShare = (tokenBPercentages[user] * reserveB) / factor;
            if(user == msg.sender){
                tokenAPercentages[user] = factor.mul((oldTokenAUserShare + tokenAAmount)) / (reserveA + tokenAAmount);
                tokenBPercentages[user] = factor.mul((oldTokenBUserShare + tokenBAmount)) / (reserveB + tokenBAmount);
            }
            else {
                tokenAPercentages[user] = factor.mul(oldTokenAUserShare) / (reserveA + tokenAAmount);
                tokenBPercentages[user] = factor.mul(oldTokenBUserShare) / (reserveB + tokenBAmount);
            }
        }
    }
    function _containsLP() private view returns (bool) {
        for (uint i = 0; i < liquidityProviders.length; i++) {
            if (liquidityProviders[i] == msg.sender) {
                return true;
            }
        }
        return false;
    }

    function withdrawAllFunds() public {
        require(_containsLP(), "Given User not a Liquidity Provider");
        uint factor = 10 ** 18;
        uint tokenAAmount = (tokenAPercentages[msg.sender] * reserveA) / factor;
        uint tokenBAmount = (tokenBPercentages[msg.sender] * reserveB) / factor;
        for(uint i=0;i<liquidityProviders.length;i++){
            address user = liquidityProviders[i];
            if(user != msg.sender){
                uint oldTokenAUserShare = (tokenAPercentages[user] * reserveA) / factor;
                uint oldTokenBUserShare = (tokenBPercentages[user] * reserveB) / factor;
                tokenAPercentages[user] = factor.mul(oldTokenAUserShare) / (reserveA - tokenAAmount);
                tokenBPercentages[user] = factor.mul(oldTokenBUserShare) / (reserveB - tokenBAmount);
            }
            else {
                tokenAPercentages[user] = 0;
                tokenBPercentages[user] = 0;
            }
        }
        reserveA = reserveA - tokenAAmount;
        reserveB = reserveB - tokenBAmount;
        tokenA.transfer(msg.sender,tokenAAmount);
        tokenB.transfer(msg.sender,tokenBAmount);
    }
    function trade(address tokenAddress, uint amount) public {
        if (tokenAddress == address(tokenA)) {
            require(reserveA >= amount);
            uint amountIn = amount.mul(97) / 100;
            uint tokenBAmountAfterTransaction = reserveA.mul(reserveB) / (reserveA.add(amountIn));
            uint payOutTokenBAmount = reserveB.sub(tokenBAmountAfterTransaction);
            tokenA.transferFrom(msg.sender, address(this), amount);
            tokenB.transfer(msg.sender, payOutTokenBAmount);
            reserveA = reserveA.add(amount);
            reserveB = reserveB.sub(payOutTokenBAmount);
        } else if (tokenAddress == address(tokenB)) {
            uint amountIn = amount.mul(97) / 100;
            uint tokenAAmountAfterTransaction = reserveA.mul(reserveB) / (reserveB.add(amountIn));
            uint payOutTokenAAmount = reserveA.sub(tokenAAmountAfterTransaction);
            tokenB.transferFrom(msg.sender, address(this), amount);
            tokenA.transfer(msg.sender, payOutTokenAAmount);
            reserveB = reserveB.add(amount);
            reserveA = reserveA.sub(payOutTokenAAmount);
        }
    }
}
