// ─────────────────────────────────────────────────────────────────────────────
// Daima Worker Agent — Receive Module
//
// In production this would listen for on-chain USDC SPL token transfers on
// Solana using the @solana/web3.js WebSocket subscription API.
// For the hackathon demo we simulate incoming payments via a local emitter.
// ─────────────────────────────────────────────────────────────────────────────

import { EventEmitter } from 'events';
import { Payment, WorkerProfile } from './types';

/** Events emitted by the PaymentReceiver */
export interface ReceiverEvents {
  payment_detected: (payment: Payment) => void;
  error: (err: Error) => void;
}

export class PaymentReceiver extends EventEmitter {
  private profile: WorkerProfile;
  private listening: boolean = false;
  private simulationTimer: NodeJS.Timeout | null = null;

  constructor(profile: WorkerProfile) {
    super();
    this.profile = profile;
  }

  /** Start listening for payments (real: subscribe to Solana account; demo: timer) */
  startListening(): void {
    if (this.listening) return;
    this.listening = true;
    console.log(
      `[PaymentReceiver] Listening for USDC payments to wallet ${this.profile.walletAddress}`
    );
  }

  /** Stop listening */
  stopListening(): void {
    this.listening = false;
    if (this.simulationTimer) {
      clearTimeout(this.simulationTimer);
      this.simulationTimer = null;
    }
    console.log('[PaymentReceiver] Stopped listening.');
  }

  /**
   * Simulate an incoming payment — used for demos and tests.
   * In production, replace this with a real Solana account subscription.
   */
  simulateIncomingPayment(fromCompany: string, amountUSD: number): Payment {
    const payment: Payment = {
      id: generateId('pay'),
      fromCompany,
      toWorker: this.profile.id,
      amountUSD,
      status: 'received',
      distributions: [],
      timestamp: new Date(),
      txSignature: generateSolanaSignature(),
    };

    console.log(
      `[PaymentReceiver] Payment detected: $${amountUSD} USD from ${fromCompany} ` +
        `(tx: ${payment.txSignature?.slice(0, 16)}...)`
    );

    // Emit asynchronously so listeners can be attached before the event fires
    setImmediate(() => {
      this.emit('payment_detected', payment);
    });

    return payment;
  }

  /** Schedule a simulated payment after a delay (ms) */
  scheduleSimulation(fromCompany: string, amountUSD: number, delayMs: number = 2000): void {
    this.simulationTimer = setTimeout(() => {
      this.simulateIncomingPayment(fromCompany, amountUSD);
    }, delayMs);
  }

  isListening(): boolean {
    return this.listening;
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Returns a plausible-looking base58 Solana signature for demo purposes */
function generateSolanaSignature(): string {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  return Array.from({ length: 88 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
