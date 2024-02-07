const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");


describe("Token",function () {
     let owner;
     let addr1;
     let addr2;
     let tokenContract;
     it("Deploying Contract and balance Of the Owner should be 50 tokens",async function(){
        [owner,addr1,addr2] = await ethers.getSigners();
        const token = await ethers.getContractFactory("Token");
        tokenContract = await token.deploy();
        expect(tokenContract.address).to.not.equal(0);
        const ownerBalance = await tokenContract.balanceOf(owner.address);
        expect(ownerBalance).to.equal(BigInt(50 * 1e18));
     });
     it("Transfer Some tokens to other Accounts",async function(){
        let ownerBalance = await tokenContract.balanceOf(owner.address);
        let userBalance = await tokenContract.balanceOf(addr1.address);
        expect(ownerBalance).to.equal(BigInt(50 * 1e18));
        expect(userBalance).to.equal(0);
        await tokenContract.connect(owner).transfer(addr1.address,BigInt(20*1e18));
        ownerBalance = await tokenContract.balanceOf(owner.address);
        userBalance = await tokenContract.balanceOf(addr1.address);
        expect(userBalance).to.equal(BigInt(20*1e18));
        expect(ownerBalance).to.equal(BigInt(30*1e18));
     });

     it("Approve user to use 10 tokens from owner wallet",async function(){
        await tokenContract.connect(owner).approve(addr1.address,BigInt(10*1e18));
        let allowance = await tokenContract.allowance(owner.address,addr1.address);
        expect(allowance).to.equal(BigInt(10 * 1e18));
        await tokenContract.connect(addr1).transferFrom(owner.address,addr2.address,BigInt(5 * 1e18));
        const addr2Balance = await tokenContract.balanceOf(addr2.address);
        expect(addr2Balance).to.equal(BigInt(5 * 1e18));
        allowance = await tokenContract.allowance(owner.address,addr1.address);
        expect(allowance).to.equal(BigInt(5*1e18));
     });
});
