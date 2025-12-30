"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/"); // redirige al dashboard
    } catch (err) {
      setError("Email o password incorrecto");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-zinc-50 dark:bg-black">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4 text-black dark:text-white">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 w-full mb-2 rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
}
