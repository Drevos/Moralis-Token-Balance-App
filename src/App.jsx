import React, { useState, useEffect } from 'react';
    import Moralis from 'moralis';
    import useMoralisInit from './hooks/useMoralisInit';

    const App = () => {
      const [tokens, setTokens] = useState([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
      const [walletAddress, setWalletAddress] = useState("0xf3a6958aB4EB88B392076A1c027Ee6459aafCAF1");
      const [chain, setChain] = useState("0xa4b1");
      const isMoralisInitialized = useMoralisInit();

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
      ];

      const fetchTokens = async () => {
        if (!isMoralisInitialized) {
          return;
        }
        setLoading(true);
        try {
          const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
            "chain": chain,
            "address": walletAddress,
          });

          if (response?.result) {
            console.log("API Response:", response.result);
            setTokens(response.result);
          } else {
            setError("No tokens found for this wallet.");
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

      return (
        <div>
          <h1>Token Balances</h1>
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
          {error && <p>Error: {error}</p>}
          {tokens.length > 0 ? (
            <ul className="token-list">
              {tokens.map((token, index) => {
                console.log("Rendering token:", token);
                return (
                  <li key={index} className="token-item">
                    <h3>{token.name} ({token.symbol})</h3>
                    <p>Balance: {token.balanceFormatted || 'N/A'}</p>
                    <p>
                      USD Value: {typeof token.usdValue === 'number' ? `$${token.usdValue.toFixed(2)}` : 'N/A'}
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
