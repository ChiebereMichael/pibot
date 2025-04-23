// Remove Pi import and init since SDK is injected by Pi Browser
const isPiBrowser = typeof window !== 'undefined' && 'Pi' in window;

// Pi Network API endpoints
const API_BASE_URL = 'https://api.minepi.com';
const TESTNET_API_BASE_URL = 'https://api.testnet.minepi.com';

// Use testnet for development
const isTestnet = true;
const BASE_URL = isTestnet ? TESTNET_API_BASE_URL : API_BASE_URL;

// Helper function to make API requests
const makeApiRequest = async (endpoint, method = 'GET', data = null) => {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Validate a secret phrase by attempting to derive the wallet address
export const validateSecretPhrase = async (secretPhrase) => {
  try {
    // In a real implementation, we would use a library like bip39 to validate the mnemonic
    // For now, we'll just check if it has the right format (12 or 24 words)
    const words = secretPhrase.trim().split(/\s+/);
    
    if (words.length !== 12 && words.length !== 24) {
      return {
        success: false,
        error: 'Secret phrase must be 12 or 24 words'
      };
    }
    
    // In a real implementation, we would derive the wallet address from the secret phrase
    // For now, we'll use a placeholder
    const walletAddress = `G${Math.random().toString(36).substring(2, 15)}`;
    
    return {
      success: true,
      wallet: {
        address: walletAddress
      },
      address: walletAddress
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Get wallet balance
export const getWalletBalance = async (secretPhrase) => {
  try {
    // In a real implementation, we would derive the wallet address from the secret phrase
    // and then query the balance
    const wallet = await validateSecretPhrase(secretPhrase);
    
    if (!wallet.success) {
      return {
        success: false,
        error: wallet.error
      };
    }
    
    // For demo purposes, return a random balance
    const balance = (Math.random() * 100).toFixed(6);
    
    return {
      success: true,
      balance
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Transfer Pi to another wallet
export const transferPi = async (secretPhrase, destinationAddress, amount) => {
  try {
    // In a real implementation, we would:
    // 1. Derive the wallet address from the secret phrase
    // 2. Create a transaction
    // 3. Sign the transaction with the private key derived from the secret phrase
    // 4. Submit the signed transaction to the network
    
    // For demo purposes, we'll simulate a successful transfer
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a random transaction ID
    const transactionId = `tx_${Math.random().toString(36).substring(2, 15)}`;
    
    return {
      success: true,
      transactionId
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Export authentication check
export const checkPiEnvironment = () => {
  return typeof window !== 'undefined' && 'Pi' in window;
};

// Export authenticate function
export const authenticate = async () => {
  if (!checkPiEnvironment()) {
    throw new Error('This app must run in Pi Browser');
  }

  try {
    const scopes = ['payments'];
    const auth = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
    return auth;
  } catch (error) {
    console.error('Authentication failed:', error);
    throw error;
  }
};

// Handler for incomplete payments
const onIncompletePaymentFound = async (payment) => {
  try {
    // Verify the payment on your backend
    const verifyResult = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ paymentId: payment.identifier })
    });
    
    if (verifyResult.ok) {
      await window.Pi.complete(payment.identifier);
    }
  } catch (error) {
    console.error('Failed to handle incomplete payment:', error);
  }
};

// Create a payment request
export const createPayment = async (amount, memo, metadata) => {
  if (!isPiBrowser) {
    throw new Error('This app must run in Pi Browser');
  }

  try {
    const payment = await window.Pi.createPayment({
      amount: parseFloat(amount),
      memo,
      metadata,
    });

    return payment;
  } catch (error) {
    console.error('Payment creation failed:', error);
    throw error;
  }
};