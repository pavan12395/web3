// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract SwapContract {
    ERC20 token;
    AggregatorV3Interface priceFeed;
    constructor(address linkTokenAddress,address priceFeedAddress) {
        token = ERC20(linkTokenAddress);
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }
    function swapTokenGetEth(uint256 tokenValue)public {
        require(token.transferFrom(msg.sender, address(this), tokenValue * 1e18));
        payable(msg.sender).transfer( (tokenValue * 10**18) / getPriceForEthByToken());
    }
    function swapEthGetToken() public payable {
        token.transfer(msg.sender,msg.value * getPriceForEthByToken());
    }
    function getPriceForEthByToken() public view returns(uint256) {
        (,int256 result,,,) = priceFeed.latestRoundData();
        return uint256(result);
    }
}