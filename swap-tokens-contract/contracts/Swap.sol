// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";



contract Swap {
    ERC20 token;
    constructor(address tokenAddress) {
        token = ERC20(tokenAddress);
    }
    function swapTokenGetEth(uint256 tokenValue)public {
        require(token.transferFrom(msg.sender, address(this), tokenValue * 1e18));
        payable(msg.sender).transfer( (tokenValue * 10**18) / getPriceForEthByToken());
    }
    function swapEthGetToken() public payable {
        token.transfer(msg.sender,msg.value * getPriceForEthByToken());
    }

    function getPriceForEthByToken() public pure returns(uint256) {
        return 2;
    }
}