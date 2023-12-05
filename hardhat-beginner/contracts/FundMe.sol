// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FundMe {
    mapping(address => uint) public balances;
    uint fundersSize;
    address[] funders;
    uint public minimumPaymentEthereum = 0.01 * 10**18;
    address immutable public owner;

    constructor() {
        owner = msg.sender;
        fundersSize = 0;
    }

    function checkFunder(address funder) internal view returns(bool){
        for(uint i=0;i<fundersSize;i++){
            if(funders[i]==funder){return true;}
        }
        return false;
    }

    function payment() external payable {
        require(msg.value >= minimumPaymentEthereum, "Value less than 0.01 Ethereum");
        if(!checkFunder(msg.sender)){
            funders.push(msg.sender);
            fundersSize+=1;
        }
        balances[msg.sender] += msg.value;
    }

    function withdrawFunds() external {
        require(msg.sender == owner, "Method can only be invoked by Owner");
        payable(owner).transfer(address(this).balance);
        for(uint i=0;i<fundersSize;i++){
            balances[funders[i]]=0;
        }
    }

    function getPaymentDetailsForUser() external view returns(uint) {
        require(checkFunder(msg.sender),"Funder Not Present in the DataBase");
        return balances[msg.sender];
    }
    function getFunders() external view returns (address[] memory) {
        return funders;
    }
    function isOwner() external view returns (bool){
        return msg.sender == owner;
    }
    function greet(string memory message) external pure returns(string memory) {
        return message;
    }
}



/*
Requirements :- 
    a method where people can pay me
    a method where owner can withdraw funds
    a method where owner can fetch who paid how much
    a method where owner can fetch all the details of who paid
    a requirement where the user has to pay more than 0.01 ETH or else we throw an error.
*/