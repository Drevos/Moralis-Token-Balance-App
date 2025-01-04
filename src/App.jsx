import React, { useState, useEffect } from 'react';
    import Moralis from 'moralis';
    import useMoralisInit from './hooks/useMoralisInit';
    import { db, auth } from './firebase';
    import { ref, set } from "firebase/database";
    import Login from './Login';
    import { onAuthStateChanged, signOut } from "firebase/auth";
    import 'bootstrap/dist/css/bootstrap.min.css';

    const App = () => {
      const [tokens, setTokens] = useState([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
      const [walletAddress, setWalletAddress] = useState("0xf3a6958aB4EB88B392076A1c027Ee6459aafCAF1");
      const [chain, setChain] = useState("0xa4b1");
      const isMoralisInitialized = useMoralisInit();
      const [saveStatus, setSaveStatus] = useState(null);
      const [user, setUser] = useState(null);
      const [isLoggedIn, setIsLoggedIn] = useState(false);

      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setUser(user);
            setIsLoggedIn(true);
          } else {
            setUser(null);
            setIsLoggedIn(false);
          }
        });
        return () => unsubscribe();
      }, []);

      const chainOptions = [
        { label: "Arbitrum", value: "0xa4b1" },
        { label: "Ethereum", value: "0x1" },
        { label: "Polygon", value: "0x89" },
        { label: "Binance Smart Chain", value: "0x38" },
        { label: "Base", value: "0x2105" },
        { label: "Optimism", value: "0xa" },
        { label: "Linea", value: "0xe708" },
        { label: "Avalanche", value: "0xa86a" },
        { label: "Fantom", value: "0xfa" },
        { label: "Cronos", value: "0x19" },
        { label: "Gnosis", value: "0x64" },
        { label: "Chiliz", value: "0x15b38" },
        { label: "Pulsechain", value: "0x171" },
        { label: "Moonbeam", value: "0x504" },
        { label: "Flow", value: "0x2eb" },
        { label: "Ronin", value: "0x7e4" },
        { label: "Lisk", value: "0x46f" },
        { label: "Solana", value: "solana" },
      ];

      const fetchTokens = async () => {
        if (!isMoralisInitialized) {
          return;
        }
        setLoading(true);
        try {
          let response;
          if (chain === "solana") {
            response = await fetch(
              `https://solana-gateway.moralis.io/account/mainnet/${walletAddress}/balance`,
              {
                headers: {
                  "X-API-Key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6Ijg2YmIxNWQ4LTA5YzktNDU1NS1iOTY4LTMzOWIxMjM5MWU3ZiIsIm9yZ0lkIjoiNDIyODQ2IiwidXNlcklkIjoiNDM0ODg0IiwidHlwZUlkIjoiYjg2NmExOGYtZjNiYi00MjI3LWE0YmUtZDcxZTMxYWM5MTk0IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MzUzMTEzNzksImV4cCI6NDg5MTA3MTM3OX0.-CaqimOZy-0YVspa6sKHJLALgaEovfXGXOaboUD8aTc",
                  "accept": "application/json"
                },
              }
            );
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Solana API Response:", data);
             setTokens([{
              name: "Solana",
              symbol: "SOL",
              balance: data.solana,
              usdValue: null,
            }]);
          } else {
            response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
              "chain": chain,
              "address": walletAddress,
            });

            if (response?.result) {
              console.log("EVM API Response:", response.result);
              setTokens(response.result);
            } else {
              setError("No tokens found for this wallet.");
            }
          }
        } catch (err) {
          setError(err.message || "Failed to fetch token balances.");
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        console.log("Tokens state:", tokens);
      }, [tokens]);

      const handleAddressChange = (event) => {
        setWalletAddress(event.target.value);
      };

      const handleChainChange = (event) => {
        setChain(event.target.value);
      };

      const saveWalletAddress = async () => {
        if (!user) {
          console.error("No user logged in.");
          return;
        }
        setSaveStatus('saving');
        try {
          const walletData = {
            address: walletAddress,
            chain: chain,
            tokens: {}
          };

          if (tokens && tokens.length > 0) {
            tokens.forEach((token, index) => {
              const tokenKey = `token_${index}`;
              walletData.tokens[tokenKey] = {
                name: token.name || token.tokenName || 'N/A',
                symbol: token.symbol || token.tokenSymbol || 'N/A',
                quantity: token.balanceFormatted || token.balance || 'N/A',
                value: typeof (token.usdValue || token.priceUsd) === 'number' ? (token.usdValue || token.priceUsd).toFixed(2) : 'N/A'
              };
            });
          }

          await set(ref(db, `users/${user.uid}/wallets/${walletAddress}`), walletData);
          console.log("Wallet address and tokens saved successfully.");
          setSaveStatus('success');
        } catch (err) {
          console.error("Error saving wallet address:", err);
          setSaveStatus('error');
        }
      };

      const handleLogout = async () => {
        try {
          await signOut(auth);
          setIsLoggedIn(false);
          setUser(null);
          localStorage.clear();
          sessionStorage.clear();
          console.log("User logged out successfully.");
        } catch (error) {
          console.error("Error logging out:", error);
        }
      };

      const handleLogin = () => {
        setIsLoggedIn(true);
      };

      if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
      }

      return (
        <div>
          <h1>Token Balances</h1>
          <button onClick={handleLogout}>Logout</button>
          <input
            type="text"
            placeholder="Enter wallet address"
            value={walletAddress}
            onChange={handleAddressChange}
          />
          <select value={chain} onChange={handleChainChange}>
            {chainOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button onClick={fetchTokens} disabled={loading}>
            {loading ? "Loading..." : "Fetch Tokens"}
          </button>
          <button onClick={saveWalletAddress} disabled={saveStatus === 'saving'}>
            {saveStatus === 'saving' ? 'Saving...' : 'Save Wallet Address'}
          </button>
          {saveStatus === 'success' && <p>Wallet address saved successfully!</p>}
          {saveStatus === 'error' && <p>Error saving wallet address.</p>}
          {error && <p>Error: {error}</p>}
          {tokens.length > 0 ? (
            <ul className="token-list">
              {tokens.map((token, index) => {
                console.log("Rendering token:", token);
                return (
                  <li key={index} className="token-item">
                    <h3>{token.name || token.tokenName} ({token.symbol || token.tokenSymbol})</h3>
                     <p>Balance: {token.balanceFormatted || token.balance || 'N/A'}</p>
                    <p>
                      USD Value: {typeof (token.usdValue || token.priceUsd) === 'number' ? `$${(token.usdValue || token.priceUsd).toFixed(2)}` : 'N/A'}
                    </p>
                  </li>
                );
              })}
            </ul>
          ) : (
            !loading && <p>No tokens found.</p>
          )}
        </div>
      );
    };

    export default App;
