const ethers = require("ethers");
const fs = require("fs-extra");

async function deploy() {
    try {
        // Replace "http://127.0.0.1:7545" with the correct URL of your local Ethereum node
        const nodeUrl = "http://127.0.0.1:7545";
        const provider = new ethers.JsonRpcProvider(nodeUrl);

        // Replace the private key with the private key of your deploying account
        const privateKey = "0x3e097ba19442000b6adc5898b92b515b5383bcd1674fb45139c34397747c7804";
        const wallet = new ethers.Wallet(privateKey, provider);

        // Read ABI and bytecode from files
        const abi = fs.readFileSync("./out/SimpleStorage_sol_SimpleStorage.abi", "utf8");
        const bytecode = fs.readFileSync("./out/SimpleStorage_sol_SimpleStorage.bin", "utf8");

        // Create a contract factory
        const contractFactory = new ethers.ContractFactory(abi, bytecode, wallet);

        console.log("Deploying the contract. Please wait...");

        // Deploy the contract
        const contract = await contractFactory.deploy();
        // await contract.deployTransaction().wait(1);
        console.log("Contract deployed to address:", contract);
        await test(contract);
        return contract; // Return the contract instance for further use if needed
    } catch (error) {
        console.log(error);
        throw error; // Rethrow the error for better error propagation
    }
}

async function test(contract){
    let transactionResponse = await contract.storeValue("hello world");
    console.log("Store Value Response : ",transactionResponse);
    transactionResponse = await contract.getValue();
    console.log("Get Value Response : ",transactionResponse);
}

deploy()
    .then(() => process.exit(0))
    .catch(error => {
        console.error("Error deploying contract:", error);
        process.exit(1);
    });
