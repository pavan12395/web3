const ethers = require("ethers");
const fs = require("fs-extra");
const contractAddress = "0x1f4321A122e0A7E0B0F8B1F2Bf5794767d9E0A56";
const rpcUrl = "http://127.0.0.1:7545";
const abiPath = "./out/_contracts_FundMe_sol_FundMe.abi";
const binaryPath = "./out/_contracts_FundMe_sol_FundMe.bin";
const abi = fs.readFileSync(abiPath, "utf8"); 
const binary = fs.readFileSync(binaryPath, "utf8"); 
const ownerPrivateKey = "0x40548a068b6e32770888c77cda4d68861ec656b1211fbf88e221d4e004bec44f";
const normalPrivateKey = "0xe076b6760587a66cc2821c449a600d102371434729b9442c6deff0009d5de898";

function getContract(privateKey){
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, wallet);
    return contract;
}

async function TestHello(){
    const FundMe = getContract(ownerPrivateKey);
    const result = await FundMe.hello();
    console.log(result);
}

async function TestWithdrawFunds(){
    const FundMe = getContract(ownerPrivateKey);
    const result = await FundMe.withdrawFunds();
    return result;
}

async function TestGetPaymentDetails(){
    const FundMe = getContract(ownerPrivateKey);
    const result = await FundMe.getPaymentDetailsForUser();
    const answer= ethers.utils.formatEther(result);
    console.log(answer + " ETH");
}

async function TestPayment(){
    const ETH_VALUE_AS_STRING = "1.12";
    const FundMe = getContract(ownerPrivateKey);
    const result = await FundMe.payment({value: ethers.utils.parseEther(ETH_VALUE_AS_STRING)});
    return result;
}

function main(){
    // TestPayment().then((result)=>
    // {
    //     console.log("Got Result : ",result);
    // }).catch((err)=>
    // {
    //     console.log("Error : "+err);
    // });
    TestGetPaymentDetails();
    // TestWithdrawFunds().then((result)=>
    // {
    //     console.log("Got Result : ",result);
    // }).catch((err)=>
    // {
    //     console.log("Error : "+err);
    // });
    
}


main();