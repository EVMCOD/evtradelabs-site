"use client";

import { useState } from "react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mt-6 flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/10 border border-white/20">
        <span className="text-green-400 text-xl">✓</span>
        <p className="text-[0.9rem] text-[#c6d0e2] m-0">
          Solicitud recibida. Te contactaremos pronto.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 flex gap-2.5 flex-wrap"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Tu email"
        className="flex-1 min-w-[200px] px-4 py-3 rounded-full border border-white/15 bg-white/8 text-white placeholder-[#8da0c2] text-[0.9rem] outline-none focus:border-white/30 transition-colors"
      />
      <button
        type="submit"
        className="px-5 py-3 rounded-full bg-white text-[#131313] font-bold text-[0.9rem] hover:bg-[#f0f0f0] transition-colors cursor-pointer whitespace-nowrap"
      >
        Solicitar acceso
      </button>
    </form>
  );
}
