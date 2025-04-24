'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { transferPi, getWalletBalance } from "../piNetwork";

export default function Dashboard() {
  const [secretPhrase, setSecretPhrase] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [destinationWallet, setDestinationWallet] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedDestinations, setSavedDestinations] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Check if secret phrase exists
    const savedPhrase = localStorage.getItem('piSecretPhrase');
    const savedAddress = localStorage.getItem('piWalletAddress');
    
    if (!savedPhrase || !savedAddress) {
      router.push('/');
      return;
    }
    
    setSecretPhrase(savedPhrase);
    setWalletAddress(savedAddress);

    // Load saved destinations
    const saved = localStorage.getItem('piDestinations');
    if (saved) {
      setSavedDestinations(JSON.parse(saved));
    }

    // Load wallet balance
    loadBalance();
  }, [router]);

  const loadBalance = async () => {
    try {
      const result = await getWalletBalance(secretPhrase);
      if (result.success) {
        setBalance(result.balance);
      } else {
        setError("Failed to load balance: " + result.error);
      }
    } catch (error) {
      setError("Failed to load balance: " + error.message);
    }
  };

  const handleAddDestination = () => {
    if (!destinationWallet) {
      setError("Please enter a destination wallet address");
      return;
    }

    const newDestinations = [...savedDestinations, destinationWallet];
    setSavedDestinations(newDestinations);
    localStorage.setItem('piDestinations', JSON.stringify(newDestinations));
    setDestinationWallet("");
    setError("");
  };

  const handleTransfer = async (destWallet) => {
    if (!amount) {
      setError("Please enter an amount to transfer");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const result = await transferPi(secretPhrase, destWallet, parseFloat(amount));
      
      if (!result.success) {
        setError(result.error || "Transfer failed");
        return;
      }
      
      alert(`Transfer of ${amount} Pi to ${destWallet} successful! Transaction ID: ${result.transactionId}`);
      setAmount("");
      
      // Reload balance after transfer
      await loadBalance();
    } catch (error) {
      setError("Transfer failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDestination = (walletToRemove) => {
    const newDestinations = savedDestinations.filter(wallet => wallet !== walletToRemove);
    setSavedDestinations(newDestinations);
    localStorage.setItem('piDestinations', JSON.stringify(newDestinations));
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-8 bg-gradient-to-br from-black to-zinc-900 text-white">
      <main className="flex flex-col gap-8 w-full max-w-4xl">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Pi Transfer Dashboard</h1>
          <button
            onClick={() => {
              localStorage.removeItem('piSecretPhrase');
              localStorage.removeItem('piWalletAddress');
              router.push('/');
            }}
            className="bg-zinc-800 text-white px-4 py-2 rounded-lg hover:bg-zinc-700 transition-all"
          >
            Change Secret Phrase
          </button>
        </div>

        <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
          <h2 className="text-xl font-semibold mb-4">Wallet Info</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-zinc-400">Address</p>
              <p className="font-mono bg-zinc-800 p-3 rounded-lg">{walletAddress}</p>
            </div>
            <div>
              <p className="text-sm text-zinc-400">Balance</p>
              <p className="font-mono bg-zinc-800 p-3 rounded-lg">
                {balance !== null ? `${balance} Pi` : 'Loading...'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
          <h2 className="text-xl font-semibold mb-4">Add New Destination</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={destinationWallet}
              onChange={(e) => setDestinationWallet(e.target.value)}
              placeholder="Enter destination Pi wallet address"
              className="flex-1 p-3 border bg-zinc-800 border-zinc-700 rounded-lg focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none"
            />
            <button
              onClick={handleAddDestination}
              className="bg-white text-black px-6 py-3 rounded-lg hover:bg-zinc-100 transition-all"
            >
              Add
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-500 mt-2">
              {error}
            </p>
          )}
        </div>

        <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
          <h2 className="text-xl font-semibold mb-4">Saved Destinations</h2>
          <div className="space-y-4">
            {savedDestinations.map((wallet, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-zinc-800 rounded-lg">
                <div className="flex-1">
                  <p className="font-mono text-sm">{wallet}</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount"
                    className="w-32 p-2 border bg-zinc-900 border-zinc-700 rounded-lg focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none"
                    min="0"
                    step="0.000001"
                  />
                  <button
                    onClick={() => handleTransfer(wallet)}
                    disabled={isLoading}
                    className={`bg-white text-black px-4 py-2 rounded-lg transition-all ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-100'
                    }`}
                  >
                    {isLoading ? 'Sending...' : 'Send'}
                  </button>
                  <button
                    onClick={() => handleRemoveDestination(wallet)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {savedDestinations.length === 0 && (
              <p className="text-zinc-400 text-center py-4">No destination wallets added yet</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 