"use client";

import { type PrizeName } from "@/hooks/useGacha";

interface ResultModalProps {
  prize: PrizeName;
  txHash: string | null;
  onClose: () => void;
}

const PRIZE_CONFIG: Record<
  PrizeName,
  { label: string; emoji: string; color: string; bg: string; border: string }
> = {
  Bucket: {
    label: "Bucket",
    emoji: "🪣",
    color: "text-yellow-300",
    bg: "bg-gradient-to-br from-yellow-500/20 to-amber-600/20",
    border: "border-yellow-400/50 shadow-yellow-400/20",
  },
  Botton: {
    label: "Botton",
    emoji: "🎖️",
    color: "text-blue-300",
    bg: "bg-gradient-to-br from-blue-500/20 to-indigo-600/20",
    border: "border-blue-400/50 shadow-blue-400/20",
  },
  Chaveiro: {
    label: "Chaveiro",
    emoji: "🔑",
    color: "text-green-300",
    bg: "bg-gradient-to-br from-green-500/20 to-emerald-600/20",
    border: "border-green-400/50 shadow-green-400/20",
  },
  Nada: {
    label: "Nada",
    emoji: "💨",
    color: "text-gray-400",
    bg: "bg-gradient-to-br from-gray-500/20 to-gray-600/20",
    border: "border-gray-500/50 shadow-gray-500/20",
  },
};

export function ResultModal({ prize, txHash, onClose }: ResultModalProps) {
  const normalized = prize as string;
  const config = PRIZE_CONFIG[prize] || {
    label: normalized,
    emoji: "❓",
    color: "text-gray-300",
    bg: "bg-gradient-to-br from-gray-500/20 to-gray-600/20",
    border: "border-gray-500/50 shadow-gray-500/20",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className={`relative mx-4 max-w-md w-full rounded-2xl border ${config.border} ${config.bg} p-8 shadow-2xl animate-in`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">{config.emoji}</div>

          <h2 className={`text-3xl font-bold ${config.color} mb-2`}>
            {prize === "Nada" ? "Não foi dessa vez..." : "Parabéns!"}
          </h2>

          <p className="text-gray-300 text-lg mb-1">
            Você ganhou:
          </p>
          <p className={`text-2xl font-bold ${config.color} mb-6`}>
            {config.label}
          </p>

          {txHash && (
            <a
              href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-purple-400 hover:text-purple-300 underline underline-offset-4 mb-4 transition-colors"
            >
              Ver transação na explorer
            </a>
          )}

          <div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
