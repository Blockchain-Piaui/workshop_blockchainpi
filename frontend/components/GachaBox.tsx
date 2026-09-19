"use client";

import { useState, useEffect, useRef } from "react";
import { useFreighter } from "@/hooks/useFreighter";
import { useGacha } from "@/hooks/useGacha";
import { ResultModal } from "./ResultModal";
import { UserResult } from "./UserResult";

export function GachaBox() {
  const { connected, address, sign } = useFreighter();
  const { status, lastPrize, userResult, error, txHash, openBox, fetchResult, reset } =
    useGacha();
  const [showModal, setShowModal] = useState(false);
  const prevStatusRef = useRef(status);

  useEffect(() => {
    if (connected && address) {
      fetchResult(address);
    }
  }, [connected, address, fetchResult]);

  useEffect(() => {
    if (prevStatusRef.current !== "success" && status === "success" && lastPrize) {
      setShowModal(true);
    }
    prevStatusRef.current = status;
  }, [status, lastPrize]);

  const handleOpen = async () => {
    if (!connected || !address) return;
    await openBox(address, sign);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    reset();
  };

  const isProcessing = status === "signing" || status === "submitting";

  return (
    <>
      <div className="flex flex-col items-center gap-8">
        {/* Gacha Box Visual */}
        <div className="relative group">
          <div
            className={`text-9xl transition-all duration-500 ${
              isProcessing
                ? "animate-spin-slow"
                : status === "success"
                  ? "scale-110"
                  : "group-hover:scale-105"
            }`}
          >
            🎰
          </div>

          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Status Text */}
        <div className="text-center h-6">
          {status === "signing" && (
            <p className="text-yellow-400 text-sm animate-pulse">
              Assine a transação na carteira...
            </p>
          )}
          {status === "submitting" && (
            <p className="text-blue-400 text-sm animate-pulse">
              Enviando para a blockchain...
            </p>
          )}
          {status === "error" && error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
        </div>

        {/* Open Button */}
        <button
          onClick={handleOpen}
          disabled={!connected || isProcessing}
          className="relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-lg font-bold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-600 hover:scale-105 active:scale-95 shadow-xl shadow-purple-500/30 disabled:shadow-none"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Processando...
            </span>
          ) : !connected ? (
            "Conecte sua carteira"
          ) : userResult ? (
            "Abrir Outro Baú (1 XLM)"
          ) : (
            "Abrir Baú (1 XLM)"
          )}
        </button>

        {/* User Result */}
        {connected && <UserResult result={userResult} />}

        {/* Info */}
        <div className="text-center text-xs text-gray-500 max-w-sm">
          <p>Cada baú custa 1 XLM. Cada usuário pode abrir um baú por vez.</p>
          <p className="mt-1">
            Prêmios: Bucket 🪣 (ultra raro) · Botton 🎖️ (raro) · Chaveiro 🔑
            (incomum)
          </p>
        </div>
      </div>

      {/* Result Modal */}
      {showModal && lastPrize && (
        <ResultModal prize={lastPrize} txHash={txHash} onClose={handleCloseModal} />
      )}
    </>
  );
}
