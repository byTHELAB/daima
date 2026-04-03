// ─── Daima Wallet Service — Main Entry Point ─────────────────────────────────
// WalletService wraps SolanaService + LightningService and provides
// a unified API for Daima's AI CFO to manage multi-chain worker wallets.

import { SolanaService } from './solana';
import { LightningService } from './lightning';
import {
  Wallet,
  Transaction,
  PaymentRequest,
  WalletBalances,
  ConversionRate,
  PaymentReceivedCallback,
} from './types';

// ─── Re-exports (consumers can import types directly from this package) ────────
export * from './types';
export { SolanaService } from './solana';
export { LightningService } from './lightning';

// ─── Constants ────────────────────────────────────────────────────────────────

/** Hardcoded demo BTC/USD rate. Replace with a live oracle in production. */
const DEMO_BTC_USD_RATE = 84_000;

/** USDC is pegged 1:1 to USD. */
const USDC_USD_RATE = 1;

// ─── In-memory wallet store (demo) ───────────────────────────────────────────

const walletStore = new Map<string, Wallet & { _solanaSecretKey: string }>();

// ─── WalletService ───────────────────────────────────────────────────────────

export class WalletService {
  private readonly solana: SolanaService;
  private readonly lightning: LightningService;
  private readonly paymentCallbacks: PaymentReceivedCallback[] = [];
  private readonly conversionRate: ConversionRate;

  constructor() {
    this.solana = new SolanaService();
    this.lightning = new LightningService();
    this.conversionRate = {
      btcUsd: DEMO_BTC_USD_RATE,
      updatedAt: new Date(),
    };

    console.log('[WalletService] Initialized — Solana + Lightning ready');
  }

  // ─── createWorkerWallet ─────────────────────────────────────────────────────

  /**
   * Create a new multi-chain wallet for a remote worker.
   * @param name Worker name or identifier (used as owner label)
   */
  createWorkerWallet(name: string): Wallet {
    const solanaWallet = this.solana.createWallet();
    const walletId = `wallet_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const wallet: Wallet = {
      id: walletId,
      owner: name,
      solanaAddress: solanaWallet.publicKey,
      lightningAddress: undefined, // Set when a LNbits wallet is linked
      balances: {
        usdc: 0, // populated by getBalances()
        btcSats: 0,
      },
    };

    // Store with secret key for signing (never expose externally)
    walletStore.set(walletId, { ...wallet, _solanaSecretKey: solanaWallet.secretKey });

    console.log(`[WalletService] Created wallet for "${name}": ${walletId}`);
    return wallet;
  }

  // ─── getBalances ────────────────────────────────────────────────────────────

  /**
   * Fetch live balances across Solana and Lightning for a given wallet.
   */
  async getBalances(walletId: string): Promise<WalletBalances> {
    const stored = walletStore.get(walletId);
    if (!stored) throw new Error(`Wallet not found: ${walletId}`);

    const [solanaBalances, lightningBalance] = await Promise.all([
      this.solana.getBalance(stored.solanaAddress),
      this.lightning.getBalance(),
    ]);

    const solUsdValue = solanaBalances.sol * (DEMO_BTC_USD_RATE / 600); // rough SOL price
    const usdcUsdValue = solanaBalances.usdc * USDC_USD_RATE;
    const lightningUsdValue = (lightningBalance.availableSats / 100_000_000) * DEMO_BTC_USD_RATE;

    const totalUsdEquivalent = parseFloat(
      (solUsdValue + usdcUsdValue + lightningUsdValue).toFixed(2),
    );

    // Update stored balances
    stored.balances.usdc = solanaBalances.usdc;
    stored.balances.btcSats = lightningBalance.availableSats;

    return {
      walletId,
      solana: {
        address: stored.solanaAddress,
        usdc: solanaBalances.usdc,
        sol: solanaBalances.sol,
      },
      lightning: lightningBalance,
      totalUsdEquivalent,
    };
  }

  // ─── sendPayment ────────────────────────────────────────────────────────────

  /**
   * Send a payment via the appropriate chain based on currency.
   * - USDC → Solana devnet
   * - sats → Lightning (LNbits)
   */
  async sendPayment(request: PaymentRequest, fromWalletId: string): Promise<Transaction> {
    const stored = walletStore.get(fromWalletId);
    if (!stored) throw new Error(`Wallet not found: ${fromWalletId}`);

    if (request.currency === 'USDC') {
      const result = await this.solana.sendUSDC(
        stored.solanaAddress,
        request.to,
        request.amount,
      );

      const tx: Transaction = {
        id: result.txHash,
        type: 'outgoing',
        chain: 'solana',
        amount: request.amount,
        currency: 'USDC',
        from: stored.solanaAddress,
        to: request.to,
        status: result.status === 'confirmed' ? 'confirmed' : 'failed',
        timestamp: result.confirmedAt,
        txHash: result.txHash,
      };

      this._emitPaymentReceived(tx);
      return tx;
    }

    if (request.currency === 'sats') {
      // `to` is expected to be a BOLT11 invoice for Lightning payments
      const result = await this.lightning.payInvoice(request.to);

      const tx: Transaction = {
        id: result.paymentHash,
        type: 'outgoing',
        chain: 'lightning',
        amount: result.amountSats,
        currency: 'sats',
        from: fromWalletId,
        to: 'lightning:' + request.to.slice(0, 20) + '…',
        status: result.status === 'paid' ? 'confirmed' : 'failed',
        timestamp: result.paidAt,
        txHash: result.paymentHash,
      };

      this._emitPaymentReceived(tx);
      return tx;
    }

    throw new Error(`Unsupported currency: ${(request as PaymentRequest).currency}`);
  }

  // ─── convertUsdcToSats ──────────────────────────────────────────────────────

  /**
   * Convert a USDC amount to satoshis using the current BTC/USD rate.
   * @param usdcAmount Amount in USDC (= USD)
   * @returns Amount in satoshis
   */
  convertUsdcToSats(usdcAmount: number): number {
    if (usdcAmount <= 0) throw new Error('Amount must be positive');
    const btcAmount = usdcAmount / this.conversionRate.btcUsd;
    const sats = Math.floor(btcAmount * 100_000_000); // 1 BTC = 100M sats
    return sats;
  }

  /**
   * Convert satoshis to USDC equivalent.
   */
  convertSatsToUsdc(sats: number): number {
    const btcAmount = sats / 100_000_000;
    return parseFloat((btcAmount * this.conversionRate.btcUsd).toFixed(2));
  }

  // ─── createLightningInvoice ─────────────────────────────────────────────────

  /**
   * Create a Lightning invoice to receive payment into this service's wallet.
   */
  async createLightningInvoice(amountSats: number, memo: string) {
    return this.lightning.createInvoice(amountSats, memo);
  }

  // ─── onPaymentReceived ──────────────────────────────────────────────────────

  /**
   * Register a callback to be called whenever a payment is sent OR received.
   * Returns an unsubscribe function.
   */
  onPaymentReceived(callback: PaymentReceivedCallback): () => void {
    this.paymentCallbacks.push(callback);
    return () => {
      const idx = this.paymentCallbacks.indexOf(callback);
      if (idx !== -1) this.paymentCallbacks.splice(idx, 1);
    };
  }

  // ─── watchWalletForIncoming ─────────────────────────────────────────────────

  /**
   * Watch a wallet for incoming USDC payments on Solana.
   * Returns an unsubscribe function.
   */
  watchWalletForIncoming(walletId: string): () => void {
    const stored = walletStore.get(walletId);
    if (!stored) throw new Error(`Wallet not found: ${walletId}`);

    return this.solana.watchForPayments(stored.solanaAddress, (result) => {
      const tx: Transaction = {
        id: result.txHash,
        type: 'incoming',
        chain: 'solana',
        amount: result.amount,
        currency: 'USDC',
        from: result.from,
        to: result.to,
        status: result.status === 'confirmed' ? 'confirmed' : 'failed',
        timestamp: result.confirmedAt,
        txHash: result.txHash,
      };
      this._emitPaymentReceived(tx);
    });
  }

  // ─── getConversionRate ──────────────────────────────────────────────────────

  getConversionRate(): ConversionRate {
    return { ...this.conversionRate };
  }

  // ─── listWallets ────────────────────────────────────────────────────────────

  listWallets(): Wallet[] {
    return Array.from(walletStore.values()).map(({ _solanaSecretKey: _sk, ...wallet }) => wallet);
  }

  // ─── getWallet ──────────────────────────────────────────────────────────────

  getWallet(walletId: string): Wallet | undefined {
    const stored = walletStore.get(walletId);
    if (!stored) return undefined;
    const { _solanaSecretKey: _sk, ...wallet } = stored;
    return wallet;
  }

  // ─── Private helpers ─────────────────────────────────────────────────────────

  private _emitPaymentReceived(tx: Transaction): void {
    for (const cb of this.paymentCallbacks) {
      try {
        cb(tx);
      } catch (err) {
        console.error('[WalletService] Payment callback error:', err);
      }
    }
  }
}

// ─── Default export ───────────────────────────────────────────────────────────

export default WalletService;
