"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

interface WalletContextType {
  account: string | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  // Connect to Wallet
  const connectWallet = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const web3Provider = new ethers.BrowserProvider((window as any).ethereum);
        await (window as any).ethereum.request({ method: "eth_requestAccounts" });

        const signer = await web3Provider.getSigner();
        const address = await signer.getAddress();

        setProvider(web3Provider);
        setAccount(address);
        setIsConnected(true);
        localStorage.setItem("walletConnected", "true");
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      alert("MetaMask or another Ethereum wallet is required.");
    }
  };

  // Disconnect Wallet
  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    localStorage.removeItem("walletConnected");
  };

  // Handle account change
  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setIsConnected(true);
      localStorage.setItem("walletConnected", "true");
    } else {
      disconnectWallet();
    }
  };

  // Auto-connect and listen for wallet changes
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const ethereum = (window as any).ethereum;

      const autoConnect = async () => {
        const wasConnected = localStorage.getItem("walletConnected") === "true";
        if (wasConnected) {
          try {
            const web3Provider = new ethers.BrowserProvider(ethereum);
            setProvider(web3Provider);

            const accounts = await ethereum.request({ method: "eth_accounts" });
            if (accounts.length > 0) {
              setAccount(accounts[0]);
              setIsConnected(true);
            } else {
              localStorage.removeItem("walletConnected");
            }
          } catch (error) {
            console.error("Auto-connect failed:", error);
            localStorage.removeItem("walletConnected");
          }
        }
      };

      autoConnect();
      ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);

  return (
    <WalletContext.Provider value={{ account, isConnected, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used within a WalletProvider");
  return context;
};
