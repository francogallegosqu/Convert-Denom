require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "goerli",
   networks: {
      hardhat: {},
      goerli: {
         url: process.env.API_URL,
         accounts: [process.env.PRIVATE_KEY]
      }
   },
};
