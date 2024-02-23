// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor(string memory name,string memory symbol) ERC20(name,symbol) {
        _mint(msg.sender, 50 * 10 ** 18);
    }
    function mintForMe(uint amount) public {
        _mint(msg.sender, amount * 10 ** 18);
    }
}