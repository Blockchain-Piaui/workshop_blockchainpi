"use client";

import { useFreighter } from "@/hooks/useFreighter";

export function ConnectButton() {
  const { connected, address, loading, connect, disconnect } = useFreighter();

  if (loading) {
    return (
      <button
        disabled
        className="px-4 py-2 bg-gray-600 text-gray-400 rounded-lg text-sm font-medium"
      >
        Carregando...
      </button>
    );
  }

  if (connected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-gray-300 font-mono">
            {address.slice(0, 4)}...{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={disconnect}
          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium transition-colors"
        >
          Desconectar
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/25"
    >
      Conectar Carteira
    </button>
  );
}
