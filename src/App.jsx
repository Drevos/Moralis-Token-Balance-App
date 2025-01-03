import React, { useState, useEffect } from 'react';
    import Moralis from 'moralis';
    import useMoralisInit from './hooks/useMoralisInit';

    const App = () => {
      const [tokens, setTokens] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const isMoralisInitialized = useMoralisInit();

      useEffect(() => {
        const fetchTokens = async () => {
          if (!isMoralisInitialized) {
            return;
          }
          try {
            const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
              "chain": "0xa4b1",
              "address": "0xf3a6958aB4EB88B392076A1c027Ee6459aafCAF1"
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

        fetchTokens();
      }, [isMoralisInitialized]);

      useEffect(() => {
        console.log("Tokens state:", tokens);
      }, [tokens]);

      if (loading) {
        return <p>Loading token balances...</p>;
      }

      if (error) {
        return <p>Error: {error}</p>;
      }

      return (
        <div>
          <h1>Token Balances</h1>
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
            <p>No tokens found.</p>
          )}
        </div>
      );
    };

    export default App;
