"use client";

import { useState, useCallback } from "react";
import { getGachaClient, getGachaReadOnlyClient } from "@/lib/stellar";

export type PrizeName = "Bucket" | "Botton" | "Chaveiro" | "Nada";

export type GachaStatus = "idle" | "signing" | "submitting" | "success" | "error";

export function useGacha() {
  const [status, setStatus] = useState<GachaStatus>("idle");
  const [lastPrize, setLastPrize] = useState<PrizeName | null>(null);
  const [userResult, setUserResult] = useState<PrizeName | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const openBox = useCallback(
    async (
      publicKey: string,
      signFn: (xdr: string, passphrase: string) => Promise<string>,
    ) => {
      setStatus("signing");
      setError(null);
      setTxHash(null);
      setLastPrize(null);

      try {
        const signTransaction = async (
          xdr: string,
          opts?: { networkPassphrase?: string },
        ) => {
          const passphrase = opts?.networkPassphrase || "";
          const signed = await signFn(xdr, passphrase);
          return { signedTxXdr: signed };
        };

        const client = await getGachaClient(publicKey, signTransaction);

        const tx = await client.abrir_bau({ usuario: publicKey });

        setStatus("submitting");
        const sent = await tx.signAndSend();

        const result = sent.result;
        const prize = (result && typeof result === "object" && "unwrap" in result
          ? String(result.unwrap())
          : String(result)) as PrizeName;

        setLastPrize(prize);
        setTxHash(sent.sendTransactionResponse?.hash || null);
        setStatus("success");
        setUserResult(prize);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro desconhecido";

        if (message.includes("ResultadoJaExiste") || message.includes("#3")) {
          setError("Você já abriu um baú anteriormente!");
        } else if (message.includes("Auth")) {
          setError("Transação rejeitada na carteira");
        } else {
          setError(message);
        }
        setStatus("error");
      }
    },
    [],
  );

  const fetchResult = useCallback(async (publicKey: string) => {
    try {
      const client = await getGachaReadOnlyClient();
      const tx = await client.ler_resultado({ usuario: publicKey });
      const result = tx.result;
      if (result) {
        const value = (typeof result === "object" && "value" in result
          ? String(result.value)
          : String(result));
        if (value && value !== "undefined" && value !== "null") {
          setUserResult(value as PrizeName);
        }
      }
    } catch {
      // user hasn't opened a box yet
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setLastPrize(null);
    setError(null);
    setTxHash(null);
  }, []);

  return {
    status,
    lastPrize,
    userResult,
    error,
    txHash,
    openBox,
    fetchResult,
    reset,
  };
}
