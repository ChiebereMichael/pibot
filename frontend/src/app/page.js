'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authenticateUser, isPiBrowser } from "../utils/pi";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleConnect = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      if (!isPiBrowser()) {
        throw new Error("Please open in Pi Browser");
      }
      
      const auth = await authenticateUser();
      if (auth) {
        localStorage.setItem('piAuth', JSON.stringify(auth));
        router.push('/dashboard');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-black to-zinc-900 text-white">
      <main className="flex flex-col gap-8 items-center backdrop-blur-lg bg-zinc-900/50 p-12 rounded-2xl shadow-2xl border border-zinc-800 relative w-full max-w-2xl">
        <h1 className="text-5xl font-bold text-white tracking-tight">
          Pi Wallet Connect
        </h1>
        
        {error && (
          <p className="text-sm text-red-500 mt-2">
            {error}
          </p>
        )}

        <button
          onClick={handleConnect}
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
              Connecting...
            </span>
          ) : (
            'Connect Pi Wallet'
          )}
        </button>
      </main>
    </div>
  );
}
