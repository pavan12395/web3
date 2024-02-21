
const hre = require("hardhat");


async function main(){
  const priceFeedAddress = "0xb4c4a493AB6356497713A78FFA6c60FB53517c63";
  const tokenAddress = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
  const contract = await hre.ethers.deployContract("SwapContract",[tokenAddress,priceFeedAddress]);
  await contract.waitForDeployment();
  const address = contract.target;
  hre.run("verify",{address:address});
  console.log("Deployed Contract Address : ",address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
