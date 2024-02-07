const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Transfer",function(){
    let owner;
    let addr1;
    let addr2;
    let tokenContract;
    let transferContract;

    it("Deploying Contract and balance Of the Owner should be 50 tokens",async function(){
        [owner,addr1,addr2] = await ethers.getSigners();
        const token = await ethers.getContractFactory("Token");
        tokenContract = await token.deploy();
        expect(tokenContract.target).to.not.equal(0);
        const ownerBalance = await tokenContract.balanceOf(owner.address);
        expect(ownerBalance).to.equal(BigInt(50 * 1e18));
     });

     it("Deploying Transfer Contract",async function(){
        const transfer = await ethers.getContractFactory("Transfer");
        transferContract = await transfer.deploy(tokenContract.target);
        await transferContract.waitForDeployment();
        expect(transferContract.address).to.not.equal(0);
     });

     it("Testing the pay functionality here",async function(){
        await tokenContract.connect(owner).approve(transferContract.target,BigInt(10*1e18));
        const allowance = await tokenContract.allowance(owner.address,transferContract.target);
        expect(allowance).to.equal(BigInt(10 * 1e18));
        await transferContract.pay(10);
        const ownerBalance = await tokenContract.balanceOf(owner.address);
        const transferBalance = await tokenContract.balanceOf(transferContract.target);
        expect(ownerBalance).to.equal(BigInt(40 * 1e18));
        expect(transferBalance).to.equal(BigInt(10*1e18));
     });

     it("Testing the retrieve functionality here",async function(){
        try {
         await transferContract.retrieve(10);
        }
        catch(e){
            console.log(e);
        }
         const ownerBalance = await tokenContract.balanceOf(owner.address);
         const transferBalance = await tokenContract.balanceOf(transferContract.target);
         expect(ownerBalance).to.equal(BigInt(50 * 1e18));
         expect(transferBalance).to.equal(BigInt(0));
     });
});