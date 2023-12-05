
const hre = require("hardhat");

async function main() {

  const contract = await hre.ethers.deployContract("FundMe");

  await contract.waitForDeployment();

  const address = contract.target;

  console.log("Deployed Contract Address : ",address);
}




main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
