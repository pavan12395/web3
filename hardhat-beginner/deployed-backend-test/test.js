const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();


const provider = new ethers.JsonRpcProvider(process.env.GOERLI_URL);
const contractAddress = '0x98d751E32C9933189E36427787ae629c8e594e6b';
const ownerPrivateKey  = process.env.GOERLI_CONTRACT_OWNER_PRIVATE_KEY;
const contractAbi = JSON.parse(fs.readFileSync("../artifacts/contracts/FundMe.sol/FundMe.json","utf-8")).abi;
const ownerSigner = new ethers.Wallet(ownerPrivateKey).connect(provider);
const FundMeOwner = new ethers.Contract(contractAddress,contractAbi,ownerSigner);
async function TestGreet(message){
    response = await FundMeOwner.greet(message);
    console.log(response);
}

async function TestGetPaymentDetailsForUserOwner(){
    const balance = await FundMeOwner.getPaymentDetailsForUser();
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


async function TestWithdrawFundsOwner() {
    try{
        await FundMeOwner.withdrawFunds();
    }
    catch(e){
        console.log("Exception : ",e);
    }
}

// TestGreet();
TestGetPaymentDetailsForUserOwner();
// TestSendPaymentOwner();
// TestWithdrawFundsOwner();