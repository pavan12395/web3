require("@nomicfoundation/hardhat-toolbox");


require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks : {
    ganache : {
        url : "http://127.0.0.1:7545",
    },
    goerli : {
      url : process.env.GOERLI_URL,
      accounts : [process.env.GOERLI_CONTRACT_OWNER_PRIVATE_KEY]
    }},
    etherscan: {
      apiKey: process.env.ETHERSCAN_API_KEY,
    },
    sourcify: {
      enabled: true
    }
};
