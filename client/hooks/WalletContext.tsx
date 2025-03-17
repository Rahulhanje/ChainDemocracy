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

  // Handle multiple wallet providers
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check for multiple providers
      const providers = (window as any).ethereum?.providers;
      if (providers) {
        // Use MetaMask if available among multiple providers
        const metaMaskProvider = providers.find((p: any) => p.isMetaMask);
        if (metaMaskProvider) {
          (window as any).ethereum = metaMaskProvider;
        }
      }
    }
  }, []);

  // Debug provider availability
  useEffect(() => {
    const checkProvider = () => {
      console.log("Ethereum provider available:", Boolean((window as any).ethereum));
      if ((window as any).ethereum) {
        console.log("Provider details:", {
          isMetaMask: (window as any).ethereum.isMetaMask,
          isBraveWallet: (window as any).ethereum.isBraveWallet
        });
      }
    };
    
    checkProvider();
    // Check again after a delay
    setTimeout(checkProvider, 1000);
  }, []);

  // Connect to Wallet
  const connectWallet = async () => {
    if (typeof window === "undefined") return;
    
    // Wait a moment to ensure provider is injected
    return new Promise<void>((resolve, reject) => {
      setTimeout(async () => {
        const ethereum = (window as any).ethereum;
        
        if (!ethereum) {
          alert("MetaMask or another Ethereum wallet is required. Please install the extension.");
          reject(new Error("No Ethereum provider found"));
          return;
        }
        
        try {
          const web3Provider = new ethers.BrowserProvider(ethereum);
          // Request accounts explicitly
          const accounts = await ethereum.request({ method: "eth_requestAccounts" });
          
          if (accounts.length > 0) {
            const address = accounts[0];
            setProvider(web3Provider);
            setAccount(address);
            setIsConnected(true);
            localStorage.setItem("walletConnected", "true");
            resolve();
          } else {
            reject(new Error("No accounts returned"));
          }
        } catch (error) {
          console.error("Wallet connection failed:", error);
          alert("Failed to connect wallet. Please try again.");
          reject(error);
        }
      }, 100); // Small delay to ensure provider is available
    });
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

  // Handle chain change
  const handleChainChanged = () => {
    // Refresh the page on chain change as recommended by MetaMask
    window.location.reload();
  };

  // Auto-connect and listen for wallet changes
  useEffect(() => {
    const setupWalletListeners = async () => {
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

        // Wait for provider to be fully initialized
        setTimeout(async () => {
          await autoConnect();
          
          // Set up event listeners
          ethereum.on("accountsChanged", handleAccountsChanged);
          ethereum.on("chainChanged", handleChainChanged);
          ethereum.on("disconnect", disconnectWallet);
        }, 500);

        return () => {
          // Clean up event listeners
          if (ethereum.removeListener) {
            ethereum.removeListener("accountsChanged", handleAccountsChanged);
            ethereum.removeListener("chainChanged", handleChainChanged);
            ethereum.removeListener("disconnect", disconnectWallet);
          }
        };
      }
    };

    setupWalletListeners();
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



//alternative code for multi wallet providers
// "use client";

// import { createContext, useContext, useEffect, useState } from "react";
// import { ethers } from "ethers";

// interface WalletContextType {
//   account: string | null;
//   isConnected: boolean;
//   connectWallet: () => Promise<void>;
//   disconnectWallet: () => void;
//   error: string | null;
// }

// const WalletContext = createContext<WalletContextType | null>(null);

// export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
//   const [account, setAccount] = useState<string | null>(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   // Get the best available provider
//   const getBestProvider = () => {
//     if (typeof window === "undefined") return null;
    
//     const ethereum = (window as any).ethereum;
//     if (!ethereum) return null;
    
//     // Check for multiple providers
//     const providers = ethereum.providers;
//     if (providers) {
//       // Prioritize providers in this order: MetaMask, Brave Wallet, others
//       const metaMaskProvider = providers.find((p: any) => p.isMetaMask && !p.isBraveWallet);
//       const braveProvider = providers.find((p: any) => p.isBraveWallet);
      
//       return metaMaskProvider || braveProvider || providers[0];
//     }
    
//     return ethereum;
//   };

//   // Connect to Wallet with retry and specific provider selection
//   const connectWallet = async () => {
//     if (typeof window === "undefined") return;
//     setError(null);
    
//     return new Promise<void>(async (resolve, reject) => {
//       try {
//         // Get best provider
//         const bestProvider = getBestProvider();
        
//         if (!bestProvider) {
//           const message = "No Ethereum wallet detected. Please install MetaMask or use Brave browser.";
//           setError(message);
//           alert(message);
//           reject(new Error(message));
//           return;
//         }
        
//         console.log("Using provider:", bestProvider.isMetaMask ? "MetaMask" : bestProvider.isBraveWallet ? "Brave Wallet" : "Unknown");
        
//         try {
//           // Try direct connection first
//           const web3Provider = new ethers.BrowserProvider(bestProvider);
//           const accounts = await bestProvider.request({ method: "eth_requestAccounts" });
          
//           if (accounts && accounts.length > 0) {
//             const address = accounts[0];
//             setProvider(web3Provider);
//             setAccount(address);
//             setIsConnected(true);
//             localStorage.setItem("walletConnected", "true");
//             resolve();
//             return;
//           }
//         } catch (primaryError: any) {
//           console.warn("Primary connection method failed:", primaryError.message);
          
//           // If we get the specific error from the extension, try an alternative approach
//           if (primaryError.message && primaryError.message.includes("Unexpected error")) {
//             try {
//               // Alternative approach: Try using window.ethereum directly
//               console.log("Trying alternative connection method...");
//               const ethereum = (window as any).ethereum;
              
//               // Disable any interfering extensions by temporarily removing them
//               const originalProviders = ethereum.providers;
//               if (originalProviders) {
//                 // Filter out the problematic provider
//                 ethereum.providers = originalProviders.filter((p: any) => 
//                   !p.request || !p.request.toString().includes("evmAsk.js")
//                 );
//               }
              
//               const web3Provider = new ethers.BrowserProvider(ethereum);
//               // Use a different method that might bypass the problematic extension
//               const accounts = await ethereum.enable();
              
//               // Restore original providers
//               if (originalProviders) {
//                 ethereum.providers = originalProviders;
//               }
              
//               if (accounts && accounts.length > 0) {
//                 const address = accounts[0];
//                 setProvider(web3Provider);
//                 setAccount(address);
//                 setIsConnected(true);
//                 localStorage.setItem("walletConnected", "true");
//                 resolve();
//                 return;
//               }
//             } catch (secondaryError: any) {
//               console.error("Alternative connection method also failed:", secondaryError);
//               throw secondaryError;
//             }
//           } else {
//             throw primaryError;
//           }
//         }
//       } catch (error: any) {
//         const errorMessage = `Wallet connection failed: ${error.message}`;
//         console.error(errorMessage);
//         setError(errorMessage);
//         alert("Failed to connect wallet. Please try disabling any other wallet extensions and try again.");
//         reject(error);
//       }
//     });
//   };

//   // Disconnect Wallet
//   const disconnectWallet = () => {
//     setAccount(null);
//     setIsConnected(false);
//     setError(null);
//     localStorage.removeItem("walletConnected");
//   };

//   // Handle account change
//   const handleAccountsChanged = (accounts: string[]) => {
//     if (accounts.length > 0) {
//       setAccount(accounts[0]);
//       setIsConnected(true);
//       localStorage.setItem("walletConnected", "true");
//     } else {
//       disconnectWallet();
//     }
//   };

//   // Handle chain change
//   const handleChainChanged = () => {
//     // Refresh the page on chain change as recommended by MetaMask
//     window.location.reload();
//   };

//   // Auto-connect and listen for wallet changes
//   useEffect(() => {
//     const setupWalletListeners = async () => {
//       if (typeof window !== "undefined" && (window as any).ethereum) {
//         const ethereum = (window as any).ethereum;
        
//         // Log available providers for debugging
//         if (ethereum.providers) {
//           console.log("Available providers:", ethereum.providers.length);
//           ethereum.providers.forEach((p: any, index: number) => {
//             console.log(`Provider ${index}:`, {
//               isMetaMask: p.isMetaMask,
//               isBraveWallet: p.isBraveWallet,
//               hasEvmAsk: p.request && p.request.toString().includes("evmAsk")
//             });
//           });
//         }

//         const autoConnect = async () => {
//           const wasConnected = localStorage.getItem("walletConnected") === "true";
//           if (wasConnected) {
//             try {
//               const bestProvider = getBestProvider();
//               if (!bestProvider) return;
              
//               const web3Provider = new ethers.BrowserProvider(bestProvider);
              
//               // Use eth_accounts which doesn't trigger UI
//               const accounts = await bestProvider.request({ method: "eth_accounts" });
              
//               if (accounts && accounts.length > 0) {
//                 setProvider(web3Provider);
//                 setAccount(accounts[0]);
//                 setIsConnected(true);
//               } else {
//                 localStorage.removeItem("walletConnected");
//               }
//             } catch (error) {
//               console.error("Auto-connect failed:", error);
//               localStorage.removeItem("walletConnected");
//             }
//           }
//         };

//         // Try to connect with a small delay
//         setTimeout(async () => {
//           await autoConnect();
          
//           // Set up event listeners on the best provider if possible
//           const bestProvider = getBestProvider();
//           if (bestProvider) {
//             if (bestProvider.on) {
//               bestProvider.on("accountsChanged", handleAccountsChanged);
//               bestProvider.on("chainChanged", handleChainChanged);
//               bestProvider.on("disconnect", disconnectWallet);
//             }
//           } else if (ethereum.on) {
//             // Fall back to window.ethereum
//             ethereum.on("accountsChanged", handleAccountsChanged);
//             ethereum.on("chainChanged", handleChainChanged);
//             ethereum.on("disconnect", disconnectWallet);
//           }
//         }, 500);

//         return () => {
//           // Clean up event listeners
//           const bestProvider = getBestProvider();
//           if (bestProvider && bestProvider.removeListener) {
//             bestProvider.removeListener("accountsChanged", handleAccountsChanged);
//             bestProvider.removeListener("chainChanged", handleChainChanged);
//             bestProvider.removeListener("disconnect", disconnectWallet);
//           } else if (ethereum.removeListener) {
//             ethereum.removeListener("accountsChanged", handleAccountsChanged);
//             ethereum.removeListener("chainChanged", handleChainChanged);
//             ethereum.removeListener("disconnect", disconnectWallet);
//           }
//         };
//       }
//     };

//     setupWalletListeners();
//   }, []);

//   return (
//     <WalletContext.Provider value={{ account, isConnected, connectWallet, disconnectWallet, error }}>
//       {children}
//     </WalletContext.Provider>
//   );
// };

// export const useWallet = () => {
//   const context = useContext(WalletContext);
//   if (!context) throw new Error("useWallet must be used within a WalletProvider");
//   return context;
// };