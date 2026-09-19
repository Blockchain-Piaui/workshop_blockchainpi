import * as StellarSdk from "@stellar/stellar-sdk";

const NETWORK = process.env.NEXT_PUBLIC_STELLAR_NETWORK || "testnet";

function getConfig(network: string) {
  switch (network) {
    case "testnet":
      return {
        horizonUrl: "https://horizon-testnet.stellar.org",
        rpcUrl: "https://soroban-testnet.stellar.org",
        networkPassphrase: StellarSdk.Networks.TESTNET,
        friendbotUrl: "https://friendbot.stellar.org",
      };
    case "mainnet":
      return {
        horizonUrl: "https://horizon.stellar.org",
        rpcUrl: "https://soroban-mainnet.stellar.org",
        networkPassphrase: StellarSdk.Networks.PUBLIC,
        friendbotUrl: null,
      };
    default:
      throw new Error(`Unknown network: ${network}`);
  }
}

export const config = getConfig(NETWORK);
export const horizon = new StellarSdk.Horizon.Server(config.horizonUrl);
export const rpc = new StellarSdk.rpc.Server(config.rpcUrl);

export const GACHA_CONTRACT_ID =
  process.env.NEXT_PUBLIC_GACHA_CONTRACT_ID || "";

export interface GachaContract {
  init: (
    args: { sac_address: string },
  ) => Promise<StellarSdk.contract.AssembledTransaction<void>>;
  abrir_bau: (
    args: { usuario: string },
  ) => Promise<StellarSdk.contract.AssembledTransaction<string>>;
  ler_resultado: (
    args: { usuario: string },
  ) => Promise<StellarSdk.contract.AssembledTransaction<string | undefined>>;
}

export async function getGachaClient(
  publicKey: string,
  signTransaction: StellarSdk.contract.ClientOptions["signTransaction"],
): Promise<StellarSdk.contract.Client & GachaContract> {
  return StellarSdk.contract.Client.from<GachaContract>({
    contractId: GACHA_CONTRACT_ID,
    rpcUrl: config.rpcUrl,
    networkPassphrase: config.networkPassphrase,
    publicKey,
    signTransaction,
  });
}

export async function getGachaReadOnlyClient() {
  return StellarSdk.contract.Client.from<GachaContract>({
    contractId: GACHA_CONTRACT_ID,
    rpcUrl: config.rpcUrl,
    networkPassphrase: config.networkPassphrase,
  });
}
