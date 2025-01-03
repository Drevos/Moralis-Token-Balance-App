import { useState, useEffect } from 'react';
    import Moralis from 'moralis';

    let moralisInitialized = false;
    let isInitializing = false;

    const useMoralisInit = () => {
      const [isInitialized, setIsInitialized] = useState(moralisInitialized);

      useEffect(() => {
        const initializeMoralis = async () => {
          if (!moralisInitialized && !isInitializing) {
            isInitializing = true;
            console.log("Initializing Moralis...");
            try {
              await Moralis.start({
                apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6Ijg2YmIxNWQ4LTA5YzktNDU1NS1iOTY4LTMzOWIxMjM5MWU3ZiIsIm9yZ0lkIjoiNDIyODQ2IiwidXNlcklkIjoiNDM0ODg0IiwidHlwZUlkIjoiYjg2NmExOGYtZjNiYi00MjI3LWE0YmUtZDcxZTMxYWM5MTk0IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MzUzMTEzNzksImV4cCI6NDg5MTA3MTM3OX0.-CaqimOZy-0YVspa6sKHJLALgaEovfXGXOaboUD8aTc"
              });
              moralisInitialized = true;
              console.log("Moralis initialized successfully.");
              setIsInitialized(true);
            } catch (error) {
              console.error("Failed to initialize Moralis:", error);
            } finally {
              isInitializing = false;
            }
          } else if (moralisInitialized) {
            console.log("Moralis already initialized.");
            setIsInitialized(true);
          }
        };

        initializeMoralis();
      }, []);

      return isInitialized;
    };

    export default useMoralisInit;
