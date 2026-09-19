"use client";

import { type PrizeName } from "@/hooks/useGacha";

interface UserResultProps {
  result: PrizeName | null;
}

const PRIZE_DISPLAY: Record<
  PrizeName,
  { emoji: string; label: string; color: string }
> = {
  Bucket: { emoji: "🪣", label: "Bucket", color: "text-yellow-300" },
  Botton: { emoji: "🎖️", label: "Botton", color: "text-blue-300" },
  Chaveiro: { emoji: "🔑", label: "Chaveiro", color: "text-green-300" },
  Nada: { emoji: "💨", label: "Nada", color: "text-gray-400" },
};

export function UserResult({ result }: UserResultProps) {
  if (!result) {
    return (
      <div className="text-center text-gray-500 text-sm">
        Você ainda não abriu um baú
      </div>
    );
  }

  const normalized = result as string;
  const display = PRIZE_DISPLAY[result] || {
    emoji: "❓",
    label: normalized,
    color: "text-gray-300",
  };

  return (
    <div className="flex items-center justify-center gap-2 text-sm">
      <span className="text-gray-400">Seu resultado:</span>
      <span className={`${display.color} font-semibold`}>
        {display.emoji} {display.label}
      </span>
    </div>
  );
}
