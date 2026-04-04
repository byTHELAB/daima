// ─────────────────────────────────────────────────────────────────────────────
// Daima Worker Agent — Main Orchestrator
//
// DaimaAgent wires together all modules:
//   PaymentReceiver → FundDistributor → AIEngine → notifications
//   MarketIntel → OfferAnalysis → AIEngine → negotiation coaching
//
// The agent is event-driven. External consumers subscribe to `agent.on(...)`.
// For the hackathon demo, call `agent.runDemo()` to see the full flow.
// ─────────────────────────────────────────────────────────────────────────────

import { EventEmitter } from 'events';
import { PaymentReceiver } from './receive';
import { FundDistributor, DistributionResult } from './distribute';
import { MarketIntel } from './market-intel';
import { AIEngine } from './ai-engine';
import {
  WorkerProfile,
  Payment,
  AINotification,
  OfferAnalysis,
  AgentEvent,
} from './types';

export { WorkerProfile, Payment, OfferAnalysis, AINotification, AgentEvent };
export { DistributionRule, Distribution, MarketRate, NegotiationOption } from './types';
export { MARKET_RATES } from './market-intel';

// ── DaimaAgent ────────────────────────────────────────────────────────────────

export class DaimaAgent extends EventEmitter {
  readonly profile: WorkerProfile;

  private receiver: PaymentReceiver;
  private distributor: FundDistributor;
  private intel: MarketIntel;
  private ai: AIEngine;

  constructor(profile: WorkerProfile) {
    super();
    this.profile = profile;
    this.receiver   = new PaymentReceiver(profile);
    this.distributor = new FundDistributor(profile);
    this.intel      = new MarketIntel();
    this.ai         = new AIEngine();

    this.wireEvents();
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  /** Start the agent (begins listening for payments) */
  start(): void {
    this.receiver.startListening();
    console.log(`[DaimaAgent] Started for ${this.profile.name} (${this.profile.role})`);
  }

  /** Stop the agent gracefully */
  stop(): void {
    this.receiver.stopListening();
    console.log('[DaimaAgent] Stopped.');
  }

  // ── Payment Flow ───────────────────────────────────────────────────────────

  /**
   * Simulate receiving a payment. In production this is triggered by the
   * Solana account subscription in PaymentReceiver.
   */
  simulatePayment(fromCompany: string, amountUSD: number): Payment {
    return this.receiver.simulateIncomingPayment(fromCompany, amountUSD);
  }

  /**
   * Manually trigger distribution for an already-received payment.
   * Normally called automatically when `payment_detected` fires.
   */
  async processPayment(payment: Payment): Promise<DistributionResult> {
    const result = this.distributor.distribute(payment);
    const notification = await this.ai.generatePaymentNotification(
      result.payment,
      result.distributions
    );

    this.emitAgentEvent('payment_distributed', { result, notification });
    this.emit('notification', notification);
    return result;
  }

  // ── Market Intel & Negotiation ─────────────────────────────────────────────

  /**
   * Analyse a job offer and get AI-powered negotiation coaching.
   * @param role  Role title (will be fuzzy-matched against the database)
   * @param offeredRate  Hourly rate offered by the company (USD)
   */
  async analyzeOffer(role: string, offeredRate: number): Promise<{
    analysis: OfferAnalysis;
    notification: AINotification;
  }> {
    const analysis = this.intel.analyzeOffer(role, offeredRate, this.profile.experienceYears);
    const notification = await this.ai.generateNegotiationResponse(offeredRate, analysis);

    this.emitAgentEvent('offer_analyzed', { analysis, notification });
    this.emit('notification', notification);

    return { analysis, notification };
  }

  /** Get personalised financial advice for this worker */
  async getFinancialAdvice(): Promise<AINotification> {
    const notification = await this.ai.generateFinancialAdvice(this.profile);
    this.emitAgentEvent('advice_generated', notification);
    this.emit('notification', notification);
    return notification;
  }

  // ── Market Data Access ─────────────────────────────────────────────────────

  /** Lookup market rate for any role */
  lookupMarketRate(role: string) {
    return this.intel.lookupRate(role);
  }

  /** List all roles in the market database */
  listAvailableRoles(): string[] {
    return this.intel.listRoles();
  }

  // ── Demo Runner ────────────────────────────────────────────────────────────

  /**
   * Full end-to-end demo — simulates a payment, distributes it, analyses a
   * job offer, and prints AI financial advice. Designed for hackathon judges.
   */
  async runDemo(): Promise<void> {
    console.log('\n════════════════════════════════════════════════');
    console.log('  DAIMA — AI CFO for Remote Workers  (DEMO)');
    console.log('════════════════════════════════════════════════\n');

    this.start();

    // 1. Simulate incoming payment
    console.log('── Step 1: Incoming payment ─────────────────────');
    const payment = this.simulatePayment('Acme Corp', 2400);

    // Wait a tick for the event to fire and auto-distribute
    await sleep(100);

    // 2. Analyse a job offer
    console.log('\n── Step 2: Offer analysis ───────────────────────');
    const { analysis, notification: negotiationNote } = await this.analyzeOffer(
      this.profile.role,
      55
    );
    console.log('\n[AI Negotiation Coaching]');
    console.log(negotiationNote.message);
    console.log('\nNegotiation options:');
    analysis.negotiationOptions.forEach((opt, i) => {
      console.log(`  ${i + 1}. ${opt.label}`);
    });

    // 3. Financial advice
    console.log('\n── Step 3: Financial advice ─────────────────────');
    const advice = await this.getFinancialAdvice();
    console.log('\n[AI Financial Advice]');
    console.log(advice.message);

    console.log('\n════════════════════════════════════════════════');
    console.log('  Demo complete. Daima is running.');
    console.log('════════════════════════════════════════════════\n');

    this.stop();
  }

  // ── Private ───────────────────────────────────────────────────────────────

  private wireEvents(): void {
    this.receiver.on('payment_detected', async (payment: Payment) => {
      console.log(`[DaimaAgent] Payment detected — auto-distributing...`);
      await this.processPayment(payment);
    });

    this.receiver.on('error', (err: Error) => {
      console.error('[DaimaAgent] Receiver error:', err.message);
      this.emit('error', err);
    });
  }

  private emitAgentEvent(type: AgentEvent['type'], payload: unknown): void {
    const event: AgentEvent = { type, payload, timestamp: new Date() };
    this.emit('agent_event', event);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Demo entry point (run directly with ts-node) ──────────────────────────────

if (require.main === module) {
  const demoProfile: WorkerProfile = {
    id: 'worker_demo_001',
    name: 'Sofia Ramírez',
    role: 'Frontend Developer',
    experienceYears: 4,
    region: 'LATAM',
    walletAddress: 'DmaAi7t7RKHK4fDkYa3bPHb6qoU4XmhRwVRz8suzPcE',
    lightningAddress: 'demo@getalby.com',
    savingsGoalMonthly: 500,
    currentSavings: 320,
    distributionRules: [
      { category: 'expenses',   percentage: 70, destination: 'usdc' },
      { category: 'savings',    percentage: 20, destination: 'btc_lightning' },
      { category: 'investment', percentage: 10, destination: 'btc_onchain' },
    ],
  };

  const agent = new DaimaAgent(demoProfile);

  // Log all notifications
  agent.on('notification', (n: AINotification) => {
    if (n.type !== 'payment_received') return; // others logged inline in runDemo
    console.log('\n[AI Payment Notification]');
    console.log(n.message);
  });

  agent.runDemo().catch((err) => {
    console.error('Demo failed:', err);
    process.exit(1);
  });
}
