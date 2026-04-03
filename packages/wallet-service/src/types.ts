// ─── Daima Wallet Service — Types ────────────────────────────────────────────

export interface Wallet {
  id: string;
  owner: string;
  solanaAddress: string;
  lightningAddress?: string;
  balances: {
    usdc: number;
    btcSats: number;
  };
}

export interface Transaction {
  id: string;
  type: 'incoming' | 'outgoing';
  chain: 'solana' | 'lightning' | 'bitcoin';
  amount: number;
  currency: 'USDC' | 'BTC' | 'sats';
  from: string;
  to: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
  txHash?: string;
}

export interface PaymentRequest {
  to: string;
  amount: number;
  currency: 'USDC' | 'sats';
  memo?: string;
}

// ─── Solana-specific ──────────────────────────────────────────────────────────

export interface SolanaWallet {
  publicKey: string;
  /** base58-encoded private key — keep secret */
  secretKey: string;
}

export interface SolanaTransferResult {
  txHash: string;
  from: string;
  to: string;
  amount: number;
  status: 'confirmed' | 'failed';
  confirmedAt: Date;
}

// ─── Lightning-specific ───────────────────────────────────────────────────────

export interface LightningInvoice {
  bolt11: string;
  paymentHash: string;
  amountSats: number;
  memo: string;
  expiresAt: Date;
  paid: boolean;
}

export interface LightningPaymentResult {
  paymentHash: string;
  amountSats: number;
  feeSats: number;
  status: 'paid' | 'failed';
  paidAt: Date;
}

export interface LightningBalanceInfo {
  totalSats: number;
  pendingSats: number;
  availableSats: number;
}

// ─── WalletService-level ──────────────────────────────────────────────────────

export interface WalletBalances {
  walletId: string;
  solana: {
    address: string;
    usdc: number;
    sol: number;
  };
  lightning: LightningBalanceInfo;
  totalUsdEquivalent: number;
}

export interface ConversionRate {
  btcUsd: number;
  updatedAt: Date;
}

export type PaymentReceivedCallback = (tx: Transaction) => void;
