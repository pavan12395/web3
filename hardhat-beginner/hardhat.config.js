require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks : {
  ganache : {
      url : "http://127.0.0.1:7545",
  },
  goerli : {
    url : process.env.GOERLI_URL,
    accounts : [process.env.GOERLI_CONTRACT_OWNER_PRIVATE_KEY]
  }},
  solidity: "0.8.19",
};


/*
Deployed Goerli Contract :- 0x98d751E32C9933189E36427787ae629c8e594e6b
*/