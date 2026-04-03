// ─── Daima Wallet Service — Lightning (LNbits) Module ───────────────────────
// Integrates with LNbits REST API.
// Falls back to simulated responses when LNBITS_API_KEY is not set.

import {
  LightningInvoice,
  LightningPaymentResult,
  LightningBalanceInfo,
  Transaction,
} from './types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function randomHex(bytes: number): string {
  const hex = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < bytes * 2; i++) result += hex[Math.floor(Math.random() * 16)];
  return result;
}

function randomPaymentHash(): string {
  return randomHex(32); // 64-char hex string
}

/**
 * Generate a plausible-looking BOLT11 invoice string (demo only).
 * Real LNbits returns a proper BOLT11-encoded string.
 */
function mockBolt11(amountSats: number, memo: string): string {
  const tag = `lnbc${amountSats}n1`;
  const payload = randomHex(100);
  const sig = randomHex(64);
  return `${tag}p${payload}${memo.replace(/\s/g, '')}${sig}`;
}

// ─── LightningService ─────────────────────────────────────────────────────────

export class LightningService {
  private readonly baseUrl: string;
  private readonly apiKey: string | undefined;
  private readonly isDemo: boolean;

  /** Demo in-memory state */
  private demoBalanceSats = 50_000; // 50k sats ≈ $42 @$84k BTC
  private demoInvoices = new Map<string, LightningInvoice>();
  private demoTransactions: Transaction[] = [];

  constructor() {
    this.baseUrl = (process.env.LNBITS_URL ?? 'http://localhost:5000').replace(/\/$/, '');
    this.apiKey = process.env.LNBITS_API_KEY;
    this.isDemo = !this.apiKey;

    if (this.isDemo) {
      console.log('[LightningService] Running in DEMO mode — LNbits API calls are simulated');
    } else {
      console.log(`[LightningService] Connected to LNbits at ${this.baseUrl}`);
    }
  }

  // ─── Internal fetch wrapper ─────────────────────────────────────────────────

  private async _request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Api-Key': this.apiKey!,
    };

    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`LNbits API error ${res.status}: ${text}`);
    }

    return res.json() as Promise<T>;
  }

  // ─── createInvoice ──────────────────────────────────────────────────────────

  /**
   * Create a Lightning invoice (receive payment).
   * @param amountSats Amount in satoshis
   * @param memo Human-readable description
   */
  async createInvoice(amountSats: number, memo: string): Promise<LightningInvoice> {
    if (amountSats <= 0) throw new Error('Amount must be positive');

    if (this.isDemo) {
      const paymentHash = randomPaymentHash();
      const invoice: LightningInvoice = {
        bolt11: mockBolt11(amountSats, memo),
        paymentHash,
        amountSats,
        memo,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        paid: false,
      };
      this.demoInvoices.set(paymentHash, invoice);
      console.log(`[LightningService] Created demo invoice: ${amountSats} sats — ${memo}`);
      return invoice;
    }

    // Production: POST /api/v1/payments
    const data = await this._request<{
      payment_request: string;
      payment_hash: string;
    }>('POST', '/api/v1/payments', {
      out: false,
      amount: amountSats,
      memo,
    });

    return {
      bolt11: data.payment_request,
      paymentHash: data.payment_hash,
      amountSats,
      memo,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      paid: false,
    };
  }

  // ─── payInvoice ─────────────────────────────────────────────────────────────

  /**
   * Pay an outgoing Lightning invoice (BOLT11 string).
   */
  async payInvoice(bolt11: string): Promise<LightningPaymentResult> {
    if (!bolt11 || bolt11.length < 10) throw new Error('Invalid BOLT11 string');

    if (this.isDemo) {
      // Parse a rough amount from the bolt11 string (demo: random 1k–50k sats)
      const amountSats = Math.floor(1000 + Math.random() * 49_000);
      const feeSats = Math.ceil(amountSats * 0.001); // 0.1% fee

      if (this.demoBalanceSats < amountSats + feeSats) {
        throw new Error(
          `Insufficient Lightning balance: ${this.demoBalanceSats} sats, need ${amountSats + feeSats}`,
        );
      }

      this.demoBalanceSats -= amountSats + feeSats;

      const result: LightningPaymentResult = {
        paymentHash: randomPaymentHash(),
        amountSats,
        feeSats,
        status: 'paid',
        paidAt: new Date(),
      };

      // Record for transaction history
      this.demoTransactions.push({
        id: result.paymentHash,
        type: 'outgoing',
        chain: 'lightning',
        amount: amountSats,
        currency: 'sats',
        from: 'self',
        to: 'unknown',
        status: 'confirmed',
        timestamp: result.paidAt,
        txHash: result.paymentHash,
      });

      console.log(`[LightningService] Demo payment sent: ${amountSats} sats (fee: ${feeSats})`);
      return result;
    }

    // Production: POST /api/v1/payments (out=true)
    const data = await this._request<{
      payment_hash: string;
      checking_id: string;
    }>('POST', '/api/v1/payments', {
      out: true,
      bolt11,
    });

    return {
      paymentHash: data.payment_hash,
      amountSats: 0, // Would be decoded from bolt11 in production
      feeSats: 0,
      status: 'paid',
      paidAt: new Date(),
    };
  }

  // ─── getBalance ─────────────────────────────────────────────────────────────

  async getBalance(): Promise<LightningBalanceInfo> {
    if (this.isDemo) {
      return {
        totalSats: this.demoBalanceSats,
        pendingSats: Math.floor(this.demoBalanceSats * 0.05),
        availableSats: Math.floor(this.demoBalanceSats * 0.95),
      };
    }

    // Production: GET /api/v1/wallet
    const data = await this._request<{ balance: number }>('GET', '/api/v1/wallet');
    // LNbits returns balance in millisats
    const totalSats = Math.floor(data.balance / 1000);
    return {
      totalSats,
      pendingSats: 0,
      availableSats: totalSats,
    };
  }

  // ─── getTransactions ────────────────────────────────────────────────────────

  async getTransactions(): Promise<Transaction[]> {
    if (this.isDemo) {
      // Return demo transactions plus some seeded history
      if (this.demoTransactions.length === 0) {
        this._seedDemoTransactions();
      }
      return [...this.demoTransactions].reverse();
    }

    // Production: GET /api/v1/payments
    const data = await this._request<
      Array<{
        payment_hash: string;
        amount: number;
        memo: string;
        time: number;
        pending: boolean;
        out: boolean;
      }>
    >('GET', '/api/v1/payments');

    return data.map((p) => ({
      id: p.payment_hash,
      type: p.out ? 'outgoing' : 'incoming',
      chain: 'lightning',
      amount: Math.abs(Math.floor(p.amount / 1000)), // msats → sats
      currency: 'sats',
      from: p.out ? 'self' : 'external',
      to: p.out ? 'external' : 'self',
      status: p.pending ? 'pending' : 'confirmed',
      timestamp: new Date(p.time * 1000),
      txHash: p.payment_hash,
    }));
  }

  // ─── Simulate a received payment (demo helper) ───────────────────────────────

  /**
   * Simulate receiving a Lightning payment (for demo/testing only).
   * In production this would come via LNbits webhooks.
   */
  simulateIncomingPayment(amountSats: number): Transaction {
    this.demoBalanceSats += amountSats;
    const tx: Transaction = {
      id: randomPaymentHash(),
      type: 'incoming',
      chain: 'lightning',
      amount: amountSats,
      currency: 'sats',
      from: 'external',
      to: 'self',
      status: 'confirmed',
      timestamp: new Date(),
      txHash: randomPaymentHash(),
    };
    this.demoTransactions.push(tx);
    console.log(`[LightningService] Demo incoming payment: ${amountSats} sats`);
    return tx;
  }

  // ─── Private helpers ─────────────────────────────────────────────────────────

  private _seedDemoTransactions(): void {
    const now = Date.now();
    const seeded: Transaction[] = [
      {
        id: randomPaymentHash(),
        type: 'incoming',
        chain: 'lightning',
        amount: 10_000,
        currency: 'sats',
        from: 'client-abc',
        to: 'self',
        status: 'confirmed',
        timestamp: new Date(now - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        txHash: randomPaymentHash(),
      },
      {
        id: randomPaymentHash(),
        type: 'outgoing',
        chain: 'lightning',
        amount: 2_500,
        currency: 'sats',
        from: 'self',
        to: 'vendor-xyz',
        status: 'confirmed',
        timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000), // yesterday
        txHash: randomPaymentHash(),
      },
    ];
    this.demoTransactions.push(...seeded);
  }
}
