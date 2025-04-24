const PI_API_BASE_URL = 'https://api.minepi.com/v2';

export const authenticateWithPi = async () => {
  try {
    // For direct API usage, we'll use a simple authentication
    // You may need to adjust this based on Pi Network's actual API requirements
    return { success: true };
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};

export const getWalletAddress = async (secretPhrase) => {
  try {
    // This is a placeholder for the actual API endpoint
    // You'll need to replace this with the correct Pi Network API endpoint
    const response = await fetch(`${PI_API_BASE_URL}/wallet/address`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secretPhrase,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get wallet address');
    }

    const data = await response.json();
    return data.address;
  } catch (error) {
    console.error('Get wallet address error:', error);
    throw error;
  }
};

export const getWalletBalance = async (address) => {
  try {
    // This is a placeholder for the actual API endpoint
    // You'll need to replace this with the correct Pi Network API endpoint
    const response = await fetch(`${PI_API_BASE_URL}/wallet/balance/${address}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get wallet balance');
    }

    const data = await response.json();
    return data.balance;
  } catch (error) {
    console.error('Get wallet balance error:', error);
    throw error;
  }
};

// Remove the Pi Browser check since it's no longer needed
export const checkPiEnvironment = () => {
  return true; // Always return true since we're not checking for Pi Browser anymore
}; 