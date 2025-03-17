const hre = require("hardhat");

async function main() {
    // Get the contract factory
    const VotingSystem = await hre.ethers.getContractFactory("VotingSystem");

    // Deploy the contract
    const votingSystem = await VotingSystem.deploy();

    // Wait for deployment to complete (Fix: use waitForDeployment)
    await votingSystem.waitForDeployment();

    // Get contract address (Fix: use target)
    console.log(`VotingSystem contract deployed at: ${votingSystem.target}`);
}

// Run the script and handle errors
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
