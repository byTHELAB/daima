// ─────────────────────────────────────────────────────────────────────────────
// Daima Worker Agent — Core Types
// All interfaces shared across modules live here.
// ─────────────────────────────────────────────────────────────────────────────

export interface WorkerProfile {
  id: string;
  name: string;
  role: string;
  experienceYears: number;
  region: string;
  walletAddress: string;
  lightningAddress?: string;
  distributionRules: DistributionRule[];
  savingsGoalMonthly: number;   // USD
  currentSavings: number;       // USD equivalent
}

export interface DistributionRule {
  category: 'expenses' | 'savings' | 'investment';
  percentage: number;           // 0–100, must sum to 100 across all rules
  destination: 'usdc' | 'btc_lightning' | 'btc_onchain';
}

export interface Payment {
  id: string;
  fromCompany: string;
  toWorker: string;             // WorkerProfile.id
  amountUSD: number;
  status: 'pending' | 'received' | 'distributed';
  distributions: Distribution[];
  timestamp: Date;
  txSignature?: string;         // Simulated Solana tx signature
}

export interface Distribution {
  category: string;
  amount: number;               // USD
  destination: string;
  txId?: string;                // Simulated tx id for demo
}

export interface MarketRate {
  role: string;
  minRate: number;              // USD/hr
  maxRate: number;              // USD/hr
  medianRate: number;           // USD/hr
  currency: string;
  source: string;
}

export interface OfferAnalysis {
  offeredRate: number;          // USD/hr
  marketRate: MarketRate;
  percentilePosition: number;   // 0–100
  verdict: 'below_market' | 'at_market' | 'above_market';
  gapAmount: number;            // offeredRate - medianRate (can be negative)
  negotiationOptions: NegotiationOption[];
}

export interface NegotiationOption {
  id: string;
  label: string;
  action: string;
  counterAmount?: number;       // USD/hr to propose
}

export interface AINotification {
  type: 'payment_received' | 'distribution_complete' | 'negotiation_advice' | 'financial_advice';
  message: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface AgentEvent {
  type: 'payment_detected' | 'payment_distributed' | 'offer_analyzed' | 'advice_generated';
  payload: unknown;
  timestamp: Date;
}
