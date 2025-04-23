'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [passphrase, setPassphrase] = useState("");
  const router = useRouter();

  const savePassphrase = () => {
    // Save passphrase logic here
    alert("Passphrase saved!");
  };

  const showPassphrase = () => {
    // Show passphrase logic here
    alert("Current passphrase: " + passphrase);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-black text-white">
      <main className="flex flex-col gap-8 items-center backdrop-blur-lg bg-zinc-900/50 p-12 rounded-2xl shadow-2xl border border-zinc-800 relative">
        <h1 className="text-5xl font-bold text-white tracking-tight">
          Passphrase Manager
        </h1>
        
        <div className="flex flex-col gap-6 w-full max-w-md">
          <input
            type="text"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="Enter your passphrase"
            className="p-4 border bg-zinc-900 border-zinc-800 rounded-xl w-full focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none transition-all placeholder:text-zinc-600"
          />
          
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={savePassphrase}
              className="bg-white text-black px-8 py-4 rounded-xl hover:bg-zinc-100 transition-all duration-300 shadow-lg hover:shadow-white/10"
            >
              Save Passphrase
            </button>
            <button
              onClick={showPassphrase}
              className="bg-zinc-900 text-white px-8 py-4 rounded-xl hover:bg-zinc-800 transition-all duration-300 shadow-lg border border-zinc-800"
            >
              Show Passphrase
            </button>
          </div>
          
          <button
            onClick={() => router.push('/auto-withdrawal')}
            className="bg-white text-black px-8 py-4 rounded-xl hover:bg-zinc-100 transition-all duration-300 shadow-lg hover:shadow-white/10 mt-4"
          >
            Auto Withdrawal →
          </button>
        </div>
      </main>
    </div>
  );
}
