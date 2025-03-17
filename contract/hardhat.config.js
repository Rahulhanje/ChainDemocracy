require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Load environment variables from .env file

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/lm-5HuFVAUv1lyxyR_bSibSffOSw-xS0`, // Replace with Alchemy or Infura URL
      accounts: [`0x${process.env.PRIVATE_KEY}`], // Private key of the deployer wallet
    },
    hardhat: {
      chainId: 1337
    }
  },
};
