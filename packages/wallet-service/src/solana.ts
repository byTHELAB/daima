// ─── Daima Wallet Service — Solana Module ────────────────────────────────────
// Uses @solana/web3.js patterns.
// In demo mode (no real keypair infra) transactions are simulated locally.

import { SolanaWallet, SolanaTransferResult } from './types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Generate a realistic-looking base58 Solana public key (32 bytes → 44 chars) */
function randomBase58(len = 44): string {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = '';
  const array = new Uint8Array(len);
  // Crypto is available in Node 18+ natively
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    globalThis.crypto.getRandomValues(array);
    for (const byte of array) result += chars[byte % chars.length];
  } else {
    // Fallback: Math.random (demo only)
    for (let i = 0; i < len; i++) result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result.slice(0, len);
}

/** Generate a realistic Solana transaction signature (88 chars) */
function randomTxHash(): string {
  return randomBase58(88);
}

/** Simulated in-memory USDC ledger: address → balance */
const usdcLedger = new Map<string, number>();

/** Simulated SOL ledger: address → balance */
const solLedger = new Map<string, number>();

/** Payment watch callbacks: address → list of callbacks */
type WatchCallback = (tx: SolanaTransferResult) => void;
const watchMap = new Map<string, WatchCallback[]>();

// ─── SolanaService ────────────────────────────────────────────────────────────

export class SolanaService {
  private readonly rpcUrl: string;
  private readonly isDemo: boolean;

  constructor() {
    this.rpcUrl =
      process.env.SOLANA_RPC_URL ?? 'https://api.devnet.solana.com';
    // We treat it as demo whenever no real private-key infrastructure is wired up.
    // In production you'd inject a Keypair and sign real transactions.
    this.isDemo = !process.env.SOLANA_PRIVATE_KEY;

    if (this.isDemo) {
      console.log('[SolanaService] Running in DEMO mode — transactions are simulated');
    } else {
      console.log(`[SolanaService] Connected to ${this.rpcUrl}`);
    }
  }

  // ─── createWallet ───────────────────────────────────────────────────────────

  /**
   * Create a new Solana wallet.
   * Demo: generates realistic-looking keys and seeds with mock balances.
   */
  createWallet(): SolanaWallet {
    const publicKey = randomBase58(44);
    const secretKey = randomBase58(88); // base58 of a 64-byte secret key

    // Seed with demo balances
    usdcLedger.set(publicKey, 500 + Math.random() * 1000); // $500–$1500 USDC
    solLedger.set(publicKey, 0.5 + Math.random() * 2);     // 0.5–2.5 SOL

    console.log(`[SolanaService] Created wallet: ${publicKey}`);
    return { publicKey, secretKey };
  }

  // ─── getBalance ─────────────────────────────────────────────────────────────

  /**
   * Returns USDC balance for a given address.
   * Demo: reads from in-memory ledger (or returns a default if address is unknown).
   * Production: would call getTokenAccountsByOwner on the USDC mint.
   */
  async getBalance(address: string): Promise<{ usdc: number; sol: number }> {
    if (this.isDemo) {
      const usdc = usdcLedger.get(address) ?? 250;
      const sol = solLedger.get(address) ?? 0.1;
      return { usdc: parseFloat(usdc.toFixed(2)), sol: parseFloat(sol.toFixed(6)) };
    }

    // Production stub — replace with real @solana/web3.js call
    throw new Error('Production Solana balance fetch not implemented yet');
  }

  // ─── sendUSDC ───────────────────────────────────────────────────────────────

  /**
   * Send USDC from one address to another.
   * Demo: updates in-memory ledger and simulates confirmation delay.
   * Production: would build + sign + send a SPL token transfer transaction.
   */
  async sendUSDC(
    from: string,
    to: string,
    amount: number,
  ): Promise<SolanaTransferResult> {
    if (amount <= 0) throw new Error('Amount must be positive');

    const fromBalance = usdcLedger.get(from) ?? 0;
    if (this.isDemo && fromBalance < amount) {
      throw new Error(`Insufficient USDC balance: have ${fromBalance.toFixed(2)}, need ${amount}`);
    }

    const txHash = randomTxHash();

    if (this.isDemo) {
      // Debit sender
      usdcLedger.set(from, fromBalance - amount);
      // Credit recipient
      const toBalance = usdcLedger.get(to) ?? 0;
      usdcLedger.set(to, toBalance + amount);

      // Simulate network confirmation delay (1–3 seconds on devnet)
      const confirmDelay = 1000 + Math.random() * 2000;

      return new Promise((resolve) => {
        setTimeout(() => {
          const result: SolanaTransferResult = {
            txHash,
            from,
            to,
            amount,
            status: 'confirmed',
            confirmedAt: new Date(),
          };

          // Trigger any active payment watchers on the recipient
          this._notifyWatchers(to, result);

          console.log(
            `[SolanaService] USDC transfer confirmed: ${amount} USDC ${from.slice(0, 8)}…→${to.slice(0, 8)}… tx=${txHash.slice(0, 12)}…`,
          );
          resolve(result);
        }, confirmDelay);
      });
    }

    throw new Error('Production Solana transfer not implemented yet');
  }

  // ─── watchForPayments ───────────────────────────────────────────────────────

  /**
   * Register a callback that fires whenever a USDC payment arrives at `address`.
   * Demo: callbacks are stored and triggered by sendUSDC().
   * Production: would subscribe to the address via websocket (onAccountChange).
   *
   * Returns an unsubscribe function.
   */
  watchForPayments(address: string, callback: WatchCallback): () => void {
    const existing = watchMap.get(address) ?? [];
    existing.push(callback);
    watchMap.set(address, existing);

    console.log(`[SolanaService] Watching ${address.slice(0, 8)}… for incoming USDC`);

    return () => {
      const cbs = watchMap.get(address) ?? [];
      watchMap.set(
        address,
        cbs.filter((cb) => cb !== callback),
      );
    };
  }

  // ─── Private helpers ─────────────────────────────────────────────────────────

  private _notifyWatchers(address: string, result: SolanaTransferResult): void {
    const cbs = watchMap.get(address) ?? [];
    for (const cb of cbs) {
      try {
        cb(result);
      } catch (err) {
        console.error('[SolanaService] Watcher callback error:', err);
      }
    }
  }
}
