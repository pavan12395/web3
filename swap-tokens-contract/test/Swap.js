const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");


describe("Swap",function () {
    let owner;
    let addr1;
    let addr2;
    let tokenContract;
    let swapContract;
    it("Deploying Contract and balance Of the Owner should be 50 tokens",async function(){
        [owner,addr1,addr2] = await ethers.getSigners();
        const token = await ethers.getContractFactory("Token");
        tokenContract = await token.deploy();
        expect(tokenContract.address).to.not.equal(0);
        const ownerBalance = await tokenContract.balanceOf(owner.address);
        expect(ownerBalance).to.equal(BigInt(50 * 1e18));
     });
     it("Swap Contract deployment",async function() {
           const swap = await ethers.getContractFactory("Swap");
           swapContract = await swap.deploy(tokenContract.target);
           expect(swapContract.target).to.not.equal(0);
           await tokenContract.connect(owner).transfer(swapContract.target,BigInt(25*1e18));
           const ownerBalance = await tokenContract.balanceOf(owner.address);
           const swapBalance = await tokenContract.balanceOf(swapContract.target);
           expect(ownerBalance).to.equal(BigInt(25 * 1e18));
           expect(swapBalance).to.equal(BigInt(25*1e18));
     });
     it("SwapEthGettoken",async function(){
        await swapContract.connect(owner).swapEthGetToken({value : BigInt(5*1e18)});
        const swapContractEth = await ethers.provider.getBalance(swapContract.target);
        const swapContractToken = await tokenContract.balanceOf(swapContract.target);
        const ownerEth = await ethers.provider.getBalance(owner.address);
        const ownerToken = await tokenContract.balanceOf(owner.address);
        expect(swapContractEth).to.equal(BigInt(5 * 1e18));
        expect(swapContractToken).to.equal(BigInt(15*1e18));
        expect(ownerToken).to.equal(BigInt(35*1e18));
        expect(ownerEth).to.lessThanOrEqual(BigInt(95*1e18));
     })
     it("SwapTokenGetEth Call Test",async function(){
        await tokenContract.connect(owner).approve(swapContract.target,BigInt(30*1e18));
        await swapContract.swapTokenGetEth(10);
        const swapContractEth = await ethers.provider.getBalance(swapContract.target);
        const swapContractToken = await tokenContract.balanceOf(swapContract.target);
        const ownerEth = await ethers.provider.getBalance(owner.address);
        const ownerToken = await tokenContract.balanceOf(owner.address);
        expect(swapContractEth).to.equal(BigInt(0));
        expect(swapContractToken).to.equal(BigInt(25*1e18));
        expect(ownerToken).to.equal(BigInt(25*1e18));
        expect(ownerEth).to.lessThanOrEqual(BigInt(100*1e18));

     });
});