const ethers = require("ethers");
const fs = require("fs-extra");

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
const contractAddress = '0x21a88363854C5B89eae6dB182C236178814e3aaf';
const ownerPrivateKey  = "0x5901ce9cb0deb02dff1766c9d663c5312ba42fda4d9e1b1888ea73bab12279fc";
const peerPrivateKey = "0xd381302ff54a6387831fd9b8e216e446c0009b9cefacfe36ee8720b1dbd508be";
const contractAbi = JSON.parse(fs.readFileSync("../artifacts/contracts/FundMe.sol/FundMe.json","utf-8")).abi;
const ownerSigner = new ethers.Wallet(ownerPrivateKey).connect(provider);
const peerSigner = new ethers.Wallet(peerPrivateKey).connect(provider);
const FundMeOwner = new ethers.Contract(contractAddress,contractAbi,ownerSigner);
const FundMePeer = new ethers.Contract(contractAddress,contractAbi,peerSigner);
async function TestGreet(message){
    response = await FundMeOwner.greet(message);
    console.log(response);
}

async function TestGetPaymentDetailsForUserOwner(){
    const balance = await FundMeOwner.getPaymentDetailsForUser();
    const etherValue = ethers.formatEther(balance);
    console.log("Balance Retrieved : ",etherValue);
}

async function TestGetPaymentDetailsForUserPeer(){
    const balance = await FundMePeer.getPaymentDetailsForUser();
    const etherValue = ethers.formatEther(balance);
    console.log("Balance Retrieved : ",etherValue);
}

async function TestSendPaymentOwner() {
    try{
    value = "0.1";
    const weiValue = ethers.parseEther(value); // This converts "value" to WEI automatically
    const tx = await FundMeOwner.payment({ value: weiValue });
    const receipt = await tx.wait();
    console.log("Payment transaction successful:", receipt.transactionHash);
    }
    catch(e){
        console.log("Exception : ",e);
    }
}

async function TestSendPaymentPeer(){
    try{
        value = "0.1";
        const weiValue = ethers.parseEther(value); // This converts "value" to WEI automatically
        const tx = await FundMePeer.payment({ value: weiValue });
        const receipt = await tx.wait();
        console.log("Payment transaction successful:", receipt.transactionHash);
        }
        catch(e){
            console.log("Exception : ",e);
        }
}


async function TestWithdrawFundsOwner() {
    try{
        await FundMeOwner.withdrawFunds();
    }
    catch(e){
        console.log("Exception : ",e);
    }
}

async function TestWithdrawFundsPeer() {
    try{
        await FundMePeer.withdrawFunds();
    }
    catch(e){
        console.log("Exception : ",e);
    }
}
// TestSendPaymentPeer();
TestGetPaymentDetailsForUserPeer();