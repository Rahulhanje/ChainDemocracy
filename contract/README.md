# Voting System Smart Contract for ChainDemocracy

## Project Overview

This project contains a Solidity smart contract for a voting system, along with deployment scripts and tests using Hardhat.  The system utilizes a modular design, incorporating a separate lock module.

## Features

* **Voting System Smart Contract:** A decentralized and transparent voting system implemented on the Ethereum blockchain.
* **Modular Design:**  Uses separate modules for enhanced code organization and maintainability (Lock Module).
* **Hardhat Integration:** Built using Hardhat for development, testing, and deployment.
* **Solidity Compilation Artifacts:** Compiled contract artifacts are stored for deployment.
* **Deployment Scripts:**  Scripts (`deploy.js`) are provided for easy contract deployment.
* **Unit Tests:** Tests (`VotingSystem.js`) ensure the functionality and security of the smart contract.


## Usage

1. **Compile the contracts:**  `npx hardhat compile`
2. **Deploy the contracts:** `npx hardhat run scripts/deploy.js --network sepolia`  (You will likely need to configure your Hardhat network in `hardhat.config.js` with appropriate provider details and private keys before deploying).
3. **Run tests:** `npx hardhat test`


## Contact Information

Please contact the project maintainers for any questions or issues.
