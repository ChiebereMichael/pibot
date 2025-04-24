'use client';

import { useState, useEffect } from 'react';
import { PiBrowser } from '@pi-browser-sdk/core';
import { PiAuth } from '@pi-browser-sdk/auth';
import { PiWallet } from '@pi-browser-sdk/wallet';

const PiWalletComponent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState(null);
  const [secretPhrase, setSecretPhrase] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Initialize Pi Network SDK
    const initializePi = async () => {
      try {
        await PiBrowser.init();
      } catch (err) {
        setError('Failed to initialize Pi Network SDK');
        console.error(err);
      }
    };
    initializePi();
  }, []);

  const handleAuthentication = async () => {
    try {
      const auth = new PiAuth();
      const result = await auth.authenticate();
      if (result) {
        setIsAuthenticated(true);
        setError('');
      }
    } catch (err) {
      setError('Authentication failed');
      console.error(err);
    }
  };

  const getWalletInfo = async () => {
    if (!secretPhrase) {
      setError('Please enter your secret phrase');
      return;
    }

    try {
      const wallet = new PiWallet();
      const address = await wallet.getAddress(secretPhrase);
      const walletBalance = await wallet.getBalance(address);
      
      setWalletAddress(address);
      setBalance(walletBalance);
      setError('');
    } catch (err) {
      setError('Failed to get wallet information');
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Pi Network Wallet</h2>
      
      {!isAuthenticated ? (
        <button
          onClick={handleAuthentication}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Authenticate with Pi Network
        </button>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Secret Phrase
            </label>
            <input
              type="password"
              value={secretPhrase}
              onChange={(e) => setSecretPhrase(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your secret phrase"
            />
          </div>
          
          <button
            onClick={getWalletInfo}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Get Wallet Info
          </button>

          {walletAddress && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700">Wallet Address:</p>
              <p className="text-sm text-gray-900 break-all">{walletAddress}</p>
            </div>
          )}

          {balance !== null && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700">Balance:</p>
              <p className="text-sm text-gray-900">{balance} π</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-4 text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default PiWalletComponent; 