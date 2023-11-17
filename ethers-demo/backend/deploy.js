const ethers = require("ethers");
const fs = require("fs-extra");

const abiPath = "./out/_contracts_FundMe_sol_FundMe.abi";
const binaryPath = "./out/_contracts_FundMe_sol_FundMe.bin";
const ownerAddress = "0x40548a068b6e32770888c77cda4d68861ec656b1211fbf88e221d4e004bec44f";
async function main() {
    const provider = new ethers.providers.JsonRpcProvider(
      "http://127.0.0.1:7545"

    );

    const wallet = new ethers.Wallet(
      ownerAddress,
      provider
    );

    const abi = fs.readFileSync(abiPath, "utf8"); 
    const binary = fs.readFileSync(binaryPath, "utf8"); 

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log("Contract is deploying...");

    const contract = await contractFactory.deploy();
    console.log(contract);
    console.log("Contract deployed! 🥂🥂");

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });