# Government Proposal Voting Platform

## Introduction
The **Government Proposal Voting Platform** is a decentralized application that allows governments to post proposals related to various sectors like social welfare, education, finance, healthcare, and culture. Citizens can vote **for** or **against** the proposals, helping the government understand whether the policy is beneficial to the people.

## The Problem with Government Decision-Making
In many countries, central governments make important decisions related to social welfare, education, healthcare, finance, and cultural development. However, the main issue is that these decisions are often made **without direct input from the people**. The government assumes that a policy will benefit the people, but they have no real way of knowing for sure **before implementing it**.

For example:
- The government might introduce a **new education policy**, but teachers and students may feel it doesn’t address the real issues.
- A **new healthcare plan** may look good on paper, but doctors and patients might disagree on its practicality.
- A **financial policy** may be introduced, but businesses and workers may think it’s harmful instead of beneficial.

## The Solution: A Decentralized Voting Platform
Your project solves this problem by **giving people a voice** before a decision is finalized. Instead of the government making blind decisions, your platform allows them to **propose ideas on a decentralized platform**, and the **citizens vote** to determine if the proposal is beneficial or not.

## Features
- **Government Proposal Submission**: Only authorized government officials can create and post proposals.
- **Public Voting System**: Citizens can vote **for** or **against** a proposal.
- **Proposal Status**: If a proposal gets more **for** votes, it is approved; otherwise, it is rejected.
- **Proposal Deadline**: Each proposal has a deadline for voting.
- **Proposal Tagging**: Proposals are categorized with relevant tags (e.g., Education, Health, Finance).

## How the Platform Works
1. The government submits a proposal along with a deadline and category tag.
2. Citizens vote **for** or **against** the proposal.
3. After the deadline:
   - If the **for** votes are greater, the proposal is approved.
   - Otherwise, it is rejected.
4. The decision is recorded on the blockchain for transparency.

## Technology Stack
- **Blockchain**: Ensures decentralization and transparency.
- **Smart Contracts**: Used to manage proposal creation, voting, and approval/rejection.
- **Frontend**: Next.js



## Contribution
Feel free to contribute to the project! Fork the repository, create a pull request, and help improve the platform.

## License
This project is open-source and available under the **MIT License**.

## Installation

This project uses npm and pnpm as package managers.  To install the necessary dependencies, follow these steps:

**Backend (Smart Contract):**

1. Navigate to the `contract` directory: `cd contract`
2. Install dependencies: `npm install` 

**Frontend (Next.js Application):**

1. Navigate to the `client` directory: `cd ../client`
2. Install dependencies: `npm install`

## Usage

**Backend:**

1. Compile the smart contracts:  (Specific command will depend on your Hardhat configuration, likely `npx hardhat compile` or similar).
2. Deploy the smart contract: (Use the deployment scripts located in `contract/scripts/`, likely a command such as `npx hardhat run scripts/deploy.js`).

**Frontend:**

1. Start the development server: `npm run dev` or `pnpm run dev` (This command is assumed; adjust if different in your `package.json`).
2. Access the application in your browser at the specified address (usually `http://localhost:3000`).

## Contact Information

Please contact the project maintainers for any questions or issues.  