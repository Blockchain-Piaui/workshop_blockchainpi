"use client";

import { ConnectButton } from "@/components/ConnectButton";
import { GachaBox } from "@/components/GachaBox";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2a] to-[#0a0a1a]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎰</span>
          <h1 className="text-lg font-bold text-white">Gacha Stellar</h1>
        </div>
        <ConnectButton />
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <GachaBox />
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-600 py-4 border-t border-white/5">
        Workshop Blockchain PI · Stellar Testnet
      </footer>
    </div>
  );
}
