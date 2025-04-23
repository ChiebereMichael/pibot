'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isPiBrowser, createPayment } from "../../utils/pi";

export default function Dashboard() {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [auth, setAuth] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('piAuth');
    if (!auth) {
      router.push('/');
      return;
    }
    setAuth(JSON.parse(auth));
  }, [router]);

  const handlePayment = async () => {
    if (!amount) {
      setError("Please enter an amount");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const payment = await createPayment(amount);
      if (payment.cancelled) {
        setError("Payment was cancelled");
        return;
      }
      
      // Verify payment with backend
      const verification = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: payment.identifier })
      });

      if (!verification.ok) {
        throw new Error("Payment verification failed");
      }

      setAmount("");
      alert("Payment successful!");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-8 bg-gradient-to-br from-black to-zinc-900 text-white">
      <main className="flex flex-col gap-8 w-full max-w-2xl">
        <h1 className="text-4xl font-bold">Pi Dashboard</h1>
        
        {auth && (
          <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
            <p className="text-sm text-zinc-400">Authenticated as:</p>
            <p className="font-mono">{auth.username}</p>
          </div>
        )}

        <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
          <h2 className="text-xl font-semibold mb-4">Make Payment</h2>
          <div className="space-y-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount in Pi"
              className="w-full p-3 bg-zinc-800 rounded-lg"
              min="0"
              step="0.000001"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full bg-white text-black p-3 rounded-lg"
            >
              {isLoading ? "Processing..." : "Pay"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}