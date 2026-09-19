"use client";

import { useState, useEffect, useRef } from "react";
import {
  isConnected,
  getAddress,
  requestAccess,
  signTransaction,
  getNetwork,
} from "@stellar/freighter-api";

export function useFreighter() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const { isConnected: installed } = await isConnected();
        if (!installed || cancelled) return;

        const { address: addr } = await getAddress();
        if (!addr || cancelled) return;

        const { network: net } = await getNetwork();
        if (!cancelled) {
          setConnected(true);
          setAddress(addr);
          setNetwork(net);
        }
      } catch {
        // wallet not available
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  const connect = async () => {
    const { isConnected: installed } = await isConnected();
    if (!installed) {
      throw new Error("Freighter não está instalado");
    }

    const { address: addr, error: accessError } = await requestAccess();
    if (accessError) throw new Error(accessError.message);

    const { network: net, error: networkError } = await getNetwork();
    if (networkError) throw new Error(networkError.message);

    setConnected(true);
    setAddress(addr);
    setNetwork(net);
    return addr;
  };

  const disconnect = () => {
    setConnected(false);
    setAddress(null);
    setNetwork(null);
  };

  const sign = async (xdr: string, networkPassphrase: string) => {
    if (!connected) throw new Error("Carteira não conectada");
    const { signedTxXdr, error } = await signTransaction(xdr, {
      networkPassphrase,
    });
    if (error) throw new Error(error.message);
    return signedTxXdr;
  };

  return { connected, address, network, loading, connect, disconnect, sign };
}
