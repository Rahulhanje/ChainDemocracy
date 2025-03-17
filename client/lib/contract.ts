import { ethers } from "ethers";
import abi from "./abi.json";
import { Main } from "next/document";

// Extend the Window interface to include the ethereum property
declare global {
  interface Window {
    ethereum?: any;
  }
}

const contractabi = abi.abi;
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL as string;
const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY as string;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Function to get the contract with the correct signer
export const getContract = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("Ethereum wallet is not installed");
    }

    const web3Provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await web3Provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractabi, signer);

    console.log("Contract Instance from getContract:", contract);
    return contract;
  } catch (error) {
    console.error("Error getting contract:", error);
    throw error;
  }
};

// Function to check if the connected user is the government (contract owner)
export const getIsGovernment = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("Ethereum wallet is not installed");
    }

    const web3Provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await web3Provider.getSigner();
    const userAddress = await signer.getAddress();

    const contract = await getContract();
    console.log("Contract Instance:", contract);

    // Call government() and check response
    const ownerAddress = await contract.government();
    console.log("Owner Address from Contract:", ownerAddress);
    console.log("User Address:", userAddress);

    if (!ownerAddress || ownerAddress === "0x") {
      throw new Error("Invalid response from contract");
    }

    return ownerAddress.toLowerCase() === userAddress.toLowerCase();
  } catch (error) {
    console.error("Error checking owner:", error);
    return false;
  }
};


// Function to create a proposal
export const createProposal = async (
    title: string,
    description: string,
    category: string,
    duration: number
): Promise<void> => {
    try {
        const contract = await getContract();
        const tx = await contract.createProposal(title, description, category, duration);
        await tx.wait();
        console.log("Proposal created successfully!");
        console.log("Contract Address:", contract.address);
        console.log(await contract.functions);

    } catch (error) {
        console.error("Error creating proposal:", error);
    }
};

interface Proposal {
    id: number;
    title: string;
    description: string;
    category: string;
    deadline: number;
    createdAt: number;
    upvotes: number;
    downvotes: number;
    finalized: boolean;
}

export async function getAllProposals() {
    const contract = await getContract();
    const count = await contract.proposalCount();
    const proposals = [];
    
    for (let id = 1; id <= Number(count); id++) {
      try {
        const proposal = await contract.getProposal(id);
        
        // Ensuring we use the correct indexes that match the first file
        const formattedProposal = {
          id: id,
          title: proposal[0],
          description: proposal[1],
          category: proposal[2],
          deadline: Number(proposal[3]),
          createdAt: Number(proposal[4]),  // Make sure this matches the index in the first file
          upvotes: Number(proposal[5]),    // Make sure this matches the index in the first file
          downvotes: Number(proposal[6]),
          finalized: proposal[7],
          proposer: proposal[8],
        };
        
        proposals.push(formattedProposal);
      } catch (error) {
        console.error(`Error fetching proposal ID ${id}:`, error);
      }
    }
    
    return proposals;
  }

export const getProposal = async (proposalId: number) => {
    try {
        // Connect to Ethereum provider
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);

        // Get signer (to interact with contract)
        const signer = await provider.getSigner();

        // Initialize contract
        const contract = await getContract();
        // Call `getProposal` function
        const proposal = await contract.getProposal(proposalId);

        // Format and return proposal data
        const formattedProposal = {
                        title: proposal[0],
                        description: proposal[1],
                        category: proposal[2],
                        deadline: Number(proposal[3]),
                        createdAt: Number(proposal[4]),
                        upvotes: Number(proposal[5]),
                        downvotes: Number(proposal[6]),
                        finalized: proposal[7],
                        proposer: proposal[8], // Boolean value, no conversion needed
        };

        console.log("Proposals:", formattedProposal);
        console.log("upvotes from contract", formattedProposal.upvotes);
        return formattedProposal;
    } catch (error) {
        console.error("Error fetching proposal:", error);
        return null;
    }
};



export const hasVoted = async (proposalId: number, voter: string): Promise<boolean> => {
    try {
        const contract = await getContract();
        const voted = await contract.hasVoted(proposalId, voter);
        console.log(`User ${voter} has voted:`, voted);
        return voted;
    } catch (error) {
        console.error("Error checking vote status:", error);
        return false;
    }
};

export const vote = async (proposalId: number, voteType: boolean): Promise<void> => {
    try {
        const contract = await getContract();
        const tx = await contract.vote(proposalId, voteType);
        await tx.wait();
        console.log("Vote submitted successfully!");
    } catch (error) {
        console.error("Error submitting vote:", error);
    }
};

export const getGovernmentAddress = async (): Promise<string> => {
    try {
        const contract = await getContract();
        const address = await contract.government();

        console.log("Government address:", address);
        return address;
    } catch (error) {
        console.error("Error fetching government address:", error);
        return "";
    }
};


export const getProposalCount = async (): Promise<number> => {
    try {
        const contract = await getContract();
        const count = await contract.proposalCount();
        console.log("Total proposals:", count.toString());
        return count.toNumber();
    } catch (error) {
        console.error("Error fetching proposal count:", error);
        return 0;
    }
};

// Corrected getContractFunctions()

export const getContractFunctions = async (): Promise<string[]> => {
    try {
        const contract = await getContract();
        if (!contract) {
            console.error("Contract instance is undefined.");
            return [];
        }

        // Extract function names safely
        const functionNames = contract.interface.fragments
            .filter((fragment) => fragment.type === "function")
            .map((fn: any) => fn.name); // Use 'any' to avoid TS errors

        console.log("Contract functions:", functionNames);
        return functionNames;
    } catch (error) {
        console.error("Error fetching contract functions:", error);
        return [];
    }
};

// Corrected getContractAddress()
export const getContractAddress = async (): Promise<string> => {
    try {
        const contract = await getContract();
        if (!contract) {
            console.error("Contract is undefined.");
            return "";
        }
        const address = await contract.getAddress(); // Corrected line
        console.log("Contract address:", address);
        return address;
    } catch (error) {
        console.error("Error fetching contract address:", error);
        return "";
    }
};