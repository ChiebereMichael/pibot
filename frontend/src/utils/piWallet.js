import { PiWallet } from '@pi-browser-sdk/wallet';

export const getWalletInfo = async (secretPhrase) => {
  try {
    const wallet = new PiWallet();
    const address = await wallet.getAddress(secretPhrase);
    const balance = await wallet.getBalance(address);
    
    return {
      address,
      balance,
      success: true
    };
  } catch (error) {
    console.error('Error getting wallet info:', error);
    return {
      success: false,
      error: error.message || 'Failed to get wallet information'
    };
  }
};

export const validateSecretPhrase = (phrase) => {
  if (!phrase) return false;
  
  // Split the phrase into words and check if it's 12 or 24 words
  const words = phrase.trim().split(/\s+/);
  return words.length === 12 || words.length === 24;
};

export const getStoredWalletInfo = () => {
  try {
    const storedInfo = localStorage.getItem('walletInfo');
    return storedInfo ? JSON.parse(storedInfo) : null;
  } catch (error) {
    console.error('Error getting stored wallet info:', error);
    return null;
  }
};

export const storeWalletInfo = (address, balance) => {
  try {
    localStorage.setItem('walletInfo', JSON.stringify({
      address,
      balance,
      timestamp: Date.now()
    }));
    return true;
  } catch (error) {
    console.error('Error storing wallet info:', error);
    return false;
  }
}; 