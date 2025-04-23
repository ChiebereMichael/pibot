export const isPiBrowser = () => {
  return typeof window !== 'undefined' && 'Pi' in window;
};

export const authenticateUser = async () => {
  if (!isPiBrowser()) {
    throw new Error('Please open in Pi Browser');
  }

  try {
    const scopes = ['payments'];
    return await window.Pi.authenticate(scopes);
  } catch (error) {
    console.error('Pi auth error:', error);
    throw error;
  }
};

export const createPayment = async (amount, memo = '') => {
  if (!isPiBrowser()) {
    throw new Error('Please open in Pi Browser');
  }

  try {
    const payment = await window.Pi.createPayment({
      amount: parseFloat(amount),
      memo,
      metadata: { timestamp: Date.now() }
    });
    return payment;
  } catch (error) {
    console.error('Payment creation error:', error);
    throw error;
  }
};

export const completePayment = async (paymentId) => {
  if (!isPiBrowser()) {
    throw new Error('Please open in Pi Browser');
  }

  try {
    await window.Pi.complete(paymentId);
    return true;
  } catch (error) {
    console.error('Payment completion error:', error);
    throw error;
  }
};
