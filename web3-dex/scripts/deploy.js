
const hre = require("hardhat");


async function main(){
  const tokenADeployment = await hre.ethers.deployContract("Token",["TokenA","TokenA"]);
  await tokenADeployment.waitForDeployment();
  const tokenBDeployment = await hre.ethers.deployContract("Token",["TokenB","TokenB"]);
  await tokenBDeployment.waitForDeployment();
  const contract = await hre.ethers.deployContract("AMM",[tokenADeployment.target , tokenBDeployment.target]);
  await contract.waitForDeployment();
  const address = contract.target;
  hre.run("verify",{address:address});
  hre.run("verify",{address:tokenADeployment.target});
  hre.run("verify",{address:tokenBDeployment.target});
  console.log("Deployed AMM Contract Address : ",address);
  console.log("Deployed TokenA contract address : ",tokenADeployment.target);
  console.log("Deployed TokenB contract address  : ",tokenBDeployment.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
