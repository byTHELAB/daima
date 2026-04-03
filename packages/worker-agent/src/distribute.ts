// ─────────────────────────────────────────────────────────────────────────────
// Daima Worker Agent — Distribute Module
//
// Applies DistributionRule[] to an incoming Payment and produces a set of
// Distribution records. In production each distribution would trigger a real
// on-chain transfer (USDC → wallet for expenses, USDC → BTC via bridge for
// savings/investment). For the hackathon demo we simulate the split.
// ─────────────────────────────────────────────────────────────────────────────

import { Distribution, DistributionRule, Payment, WorkerProfile } from './types';

export interface DistributionResult {
  payment: Payment;
  distributions: Distribution[];
  summary: DistributionSummary;
}

export interface DistributionSummary {
  totalUSD: number;
  expensesUSD: number;
  savingsUSD: number;
  investmentUSD: number;
  btcEquivalent: number;   // rough estimate at $65 000/BTC for demo
  satoshis: number;
}

const DEMO_BTC_PRICE_USD = 65_000;

export class FundDistributor {
  private profile: WorkerProfile;

  constructor(profile: WorkerProfile) {
    this.profile = profile;
  }

  /**
   * Split an incoming payment according to the worker's distribution rules.
   * Returns the updated Payment and a detailed summary.
   */
  distribute(payment: Payment): DistributionResult {
    validateRules(this.profile.distributionRules);

    const distributions: Distribution[] = this.profile.distributionRules.map((rule) => {
      const amount = round2(payment.amountUSD * (rule.percentage / 100));
      const dist: Distribution = {
        category: rule.category,
        amount,
        destination: rule.destination,
        txId: simulateTx(rule.destination),
      };
      logDistribution(dist, rule, payment.amountUSD);
      return dist;
    });

    const updatedPayment: Payment = {
      ...payment,
      status: 'distributed',
      distributions,
    };

    const summary = buildSummary(payment.amountUSD, distributions);
    logSummary(summary);

    return { payment: updatedPayment, distributions, summary };
  }

  /** Update the worker profile (e.g., after user changes rules in-app) */
  updateProfile(profile: WorkerProfile): void {
    this.profile = profile;
  }
}

// ── Validation ────────────────────────────────────────────────────────────────

function validateRules(rules: DistributionRule[]): void {
  if (!rules.length) throw new Error('[Distributor] No distribution rules defined.');

  const total = rules.reduce((sum, r) => sum + r.percentage, 0);
  if (Math.abs(total - 100) > 0.01) {
    throw new Error(
      `[Distributor] Rules must sum to 100%. Current total: ${total.toFixed(2)}%`
    );
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function buildSummary(totalUSD: number, distributions: Distribution[]): DistributionSummary {
  const expenses = distributions.filter((d) => d.category === 'expenses');
  const savings   = distributions.filter((d) => d.category === 'savings');
  const investment = distributions.filter((d) => d.category === 'investment');

  const expensesUSD  = expenses.reduce((s, d) => s + d.amount, 0);
  const savingsUSD   = savings.reduce((s, d) => s + d.amount, 0);
  const investmentUSD = investment.reduce((s, d) => s + d.amount, 0);
  const btcUSD = savingsUSD + investmentUSD;
  const btcEquivalent = round2(btcUSD / DEMO_BTC_PRICE_USD);
  const satoshis = Math.round(btcEquivalent * 100_000_000);

  return {
    totalUSD,
    expensesUSD,
    savingsUSD,
    investmentUSD,
    btcEquivalent,
    satoshis,
  };
}

function simulateTx(destination: string): string {
  // Returns a short fake transaction ID for demo purposes
  const prefix: Record<string, string> = {
    usdc: 'sol',
    btc_lightning: 'ln',
    btc_onchain: 'btc',
  };
  const tag = prefix[destination] ?? 'tx';
  return `${tag}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

function logDistribution(dist: Distribution, rule: DistributionRule, total: number): void {
  console.log(
    `[Distributor] ${rule.category.toUpperCase()} → $${dist.amount.toFixed(2)} ` +
      `(${rule.percentage}% of $${total}) via ${rule.destination} [${dist.txId}]`
  );
}

function logSummary(s: DistributionSummary): void {
  console.log(
    `[Distributor] Summary — Total: $${s.totalUSD} | ` +
      `Expenses: $${s.expensesUSD} | ` +
      `Savings: $${s.savingsUSD} | ` +
      `Investment: $${s.investmentUSD} | ` +
      `BTC: ${s.satoshis.toLocaleString()} sats`
  );
}
