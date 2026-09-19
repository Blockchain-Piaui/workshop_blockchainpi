# Gacha Stellar

Sistema de gacha (baú aleatório) na blockchain Stellar, construído com um smart contract Soroban e frontend React/Next.js.

## Como Funciona

O usuário paga **1 XLM** para abrir um baú e recebe um prêmio aleatório:

| Prêmio | Chance | Raridade |
|--------|--------|----------|
| 🪣 Bucket | 0.05% | Ultra raro |
| 🎖️ Botton | 0.50% | Raro |
| 🔑 Chaveiro | 3.00% | Incomum |
| 💨 Nada | 96.45% | Comum |

## Stack

- **Smart Contract**: Soroban (Rust) deployado no Stellar Testnet
- **Frontend**: Next.js 16 + React 18 + Tailwind CSS
- **Carteira**: Freighter (extensão do navegador)
- **SDK**: @stellar/stellar-sdk v16

## Pré-requisitos

- [Node.js](https://nodejs.org/) 22+
- [Stellar CLI](https://developers.stellar.org/docs/tools/cli) (para deploy do contrato)
- [Freighter](https://freighter.app) instalado no navegador
- Freighter configurado na **Testnet** com XLM de teste

## Setup

### 1. Clone e instale as dependências

```bash
git clone <repo-url>
cd workshop_blockchainpi
cd frontend
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com os IDs do contrato (deployado no testnet):

```
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_GACHA_CONTRACT_ID=<endereco_do_contrato>
NEXT_PUBLIC_SAC_TOKEN_ID=CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC
```

### 3. Rode o frontend

```bash
npm run dev
```

Acesse http://localhost:3000

## Deploy do Contrato

Se precisar redesployar:

```bash
# Compilar
cd ..
stellar contract build

# Deploy no testnet
stellar contract deploy \
  --wasm target/wasm32v1-none/release/gacha.wasm \
  --source deployer \
  --network testnet

# Inicializar (usar o Contract ID retornado)
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source deployer \
  --network testnet \
  -- init --sac_address CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC
```

## Estrutura

```
├── contracts/gacha/
│   └── src/lib.rs          # Smart contract Soroban
├── frontend/
│   ├── app/
│   │   ├── page.tsx        # Página principal
│   │   ├── layout.tsx      # Layout
│   │   └── globals.css     # Estilos
│   ├── components/
│   │   ├── ConnectButton   # Conectar carteira
│   │   ├── GachaBox        # Componente do baú
│   │   ├── ResultModal     # Modal de resultado
│   │   └── UserResult      # Resultado do usuário
│   ├── hooks/
│   │   ├── useFreighter    # Conexão Freighter
│   │   └── useGacha        # Lógica do contrato
│   └── lib/
│       └── stellar.ts      # Config SDK + client
└── .env.local              # Variáveis (não commitado)
```

## Contrato no Testnet

- **Contract ID**: `CBLUJ2E3ENM6O72INL2P5JNF3F3KRH2WFUWYNNRYPVNBKRQY44PD2TH5`
- **Explorer**: https://stellar.expert/explorer/testnet/contract/CBLUJ2E3ENM6O72INL2P5JNF3F3KRH2WFUWYNNRYPVNBKRQY44PD2TH5
