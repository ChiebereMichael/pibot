'use client'
import { useRouter } from "next/navigation";

export default function AutoWithdrawal() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-black text-white">
      <main className="flex flex-col gap-8 items-center backdrop-blur-lg bg-zinc-900/50 p-12 rounded-2xl shadow-2xl border border-zinc-800 relative">
        <h1 className="text-5xl font-bold text-white tracking-tight">
          Auto Withdrawal Settings
        </h1>
        
        <div className="flex flex-col gap-6 w-full max-w-md">
          <p className="text-center text-zinc-400">Configure your auto withdrawal settings</p>
          
          <button
            onClick={() => router.push('/')}
            className="bg-white text-black px-8 py-4 rounded-xl hover:bg-zinc-100 transition-all duration-300 shadow-lg hover:shadow-white/10"
          >
            ← Back to Home
          </button>
        </div>
      </main>
    </div>
  );
}
