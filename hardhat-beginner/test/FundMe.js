const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

let FundMe = null;
let owner = "";
let normalUser = "";

describe("FundMe",function() {

  it("Init",async function(){
    const [publicKey1,publicKey2]  = await ethers.getSigners();
    owner = publicKey1;
    normalUser = publicKey2;
    console.log("Owner : ",owner);
    console.log("Normaluser : ",normalUser);
  })

  it("Deployment",async function(){
    FundMe = await ethers.deployContract("FundMe");
    console.log("FundMe deployed address : ",FundMe);
  });

  it("Empty Funders Initally",async function(){
    const funders = await FundMe.getFunders();
    expect(funders.length).to.equal(0);
  })

  it("Payment from user Test",async function(){
     await FundMe.payment({value : ethers.parseEther('1.0')});
     const etherValue = await FundMe.getPaymentDetailsForUser();
     const answer = ethers.formatEther(etherValue);
     expect(answer).to.equal('1.0');
  });

  it("Funders Test",async function(){
    const funders = await FundMe.connect(normalUser).getFunders();
    console.log(funders);
    expect(funders[0]).to.equal(owner.address);
  });

  it("WithDraw Funds by Normal User Test",async function(){
    try{
      await FundMe.connect(normalUser).withdrawFunds();
      expect(true).to.be.false;
    }
    catch(e){
      console.log("Error caused : ",e);
      expect(true).to.be.true;
    }

  });

  it("Withdraw Funds by Owner Test",async function(){
    try{
     await FundMe.connect(owner).withdrawFunds();
     const etherValue = await ethers.provider.getBalance(owner.address);
     const ownerBalance = ethers.parseEther(etherValue.toString());
     console.log("OwnerBalance : ",ownerBalance);
     expect(ownerBalance).to.equal("100");
    }
    catch(e){
      console.log("Error caused : ",e);
      expect(true).to.be.false;
    }
  })
});