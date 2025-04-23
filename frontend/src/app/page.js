'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [secretPhrase, setSecretPhrase] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const initPi = async () => {
      console.log("Window Pi object:", window.Pi);
      console.log("Is Pi Browser:", typeof window !== 'undefined' && 'Pi' in window);

      try {
        // Try to access Pi SDK
        if (typeof window !== 'undefined' && window.Pi) {
          console.log("Attempting Pi authentication...");
          const scopes = ['payments'];
          const auth = await window.Pi.authenticate(scopes);
          console.log("Auth result:", auth);
          
          if (auth) {
            localStorage.setItem('piAuth', JSON.stringify(auth));
            router.push('/dashboard');
          }
        } else {
          setError("Pi SDK not detected. Please ensure you're using Pi Browser.");
          console.error("Pi SDK not found in window object");
        }
      } catch (error) {
        console.error("Pi authentication error:", error);
        setError(`Authentication failed: ${error.message}`);
      }
    };

    initPi();
  }, [router]);

  const handleAuthClick = async () => {
    setIsLoading(true);
    setError("");
    try {
      await initPi();
    } catch (error) {
      setError(`Manual authentication failed: ${error.message}`);
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

          <button
            onClick={handleAuthClick}
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
                Validating...
              </span>
            ) : (
              'Connect Pi Wallet'
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
