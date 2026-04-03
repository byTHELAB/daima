# Daima — System Architecture

## Overview

Daima is a two-sided platform connecting **companies** (who want to pay fairly and easily) with **remote workers** (who deserve to get paid fairly and automatically).

## System Diagram

```
┌─────────────────────────────────────────────────────┐
│                    COMPANY SIDE                       │
│                                                       │
│  ┌─────────────────┐    ┌──────────────────────┐    │
│  │ Company Dashboard│───▶│ Payment Intent API    │    │
│  │ (React)          │    │ amount + worker_id    │    │
│  └─────────────────┘    └──────────┬───────────┘    │
│                                      │                │
│                          ┌───────────▼──────────┐    │
│                          │ MoonPay Onramp       │    │
│                          │ USD fiat → USDC      │    │
│                          │ (sandbox for demo)    │    │
│                          └───────────┬──────────┘    │
└──────────────────────────────────────┼───────────────┘
                                       │
                            ┌──────────▼──────────┐
                            │  WALLET SERVICE      │
                            │                      │
                            │  • OWS SDK           │
                            │  • Solana (USDC)     │
                            │  • Lightning (LNbits)│
                            │  • BTC on-chain      │
                            └──────────┬──────────┘
                                       │
┌──────────────────────────────────────┼───────────────┐
│                    WORKER SIDE        │               │
│                                       │               │
│  ┌────────────────────────────────────▼────────┐     │
│  │           WORKER AGENT (Daima Core)          │     │
│  │                                              │     │
│  │  ┌──────────┐ ┌───────────┐ ┌────────────┐ │     │
│  │  │ Receive  │ │ Distribute│ │ Market     │ │     │
│  │  │ Module   │ │ Module    │ │ Intel      │ │     │
│  │  │          │ │           │ │ Module     │ │     │
│  │  │ Listen   │ │ savings % │ │ salary     │ │     │
│  │  │ for tx   │ │ expense % │ │ ranges    │ │     │
│  │  │ notify   │ │ invest %  │ │ negotiate  │ │     │
│  │  └──────────┘ └───────────┘ └────────────┘ │     │
│  │                                              │     │
│  │  ┌──────────────────────────────────────┐   │     │
│  │  │ AI Engine (MiniMax M2.5)             │   │     │
│  │  │ • Natural language notifications     │   │     │
│  │  │ • Financial advice                   │   │     │
│  │  │ • Negotiation responses              │   │     │
│  │  └──────────────────────────────────────┘   │     │
│  └─────────────────────────────────────────────┘     │
│                                                       │
│  ┌─────────────────┐                                 │
│  │ Worker Dashboard │  ← balance, goals, agent feed  │
│  │ (React)          │                                 │
│  └─────────────────┘                                 │
└──────────────────────────────────────────────────────┘
```

## Payment Flow (Moment 1 + 2)

```
1. Company → Dashboard → "Pay $500 to Daniela"
2. MoonPay converts USD → USDC (sandbox: simulated)
3. USDC sent via Solana to worker's OWS wallet
4. Worker Agent detects incoming transaction
5. Agent applies distribution rules:
   - 50% → expenses (stays as USDC)
   - 40% → savings (converts to BTC via Lightning)
   - 10% → investment (BTC on-chain)
6. Agent notifies worker with summary
```

## Negotiation Flow (Moment 3)

```
1. New offer arrives: $300 for UX project
2. Worker Agent checks market_intel database
3. Market rate for role + experience: $450-650
4. Offer is 33% below → agent flags it
5. Agent generates response options via AI
6. Worker selects action → agent executes
```

## Data Models

### Worker Profile
```typescript
interface WorkerProfile {
  id: string;
  name: string;
  role: string;
  experienceYears: number;
  region: string;
  walletAddress: string;           // OWS wallet
  lightningAddress?: string;       // LNbits
  distributionRules: DistributionRule[];
  savingsGoal: number;             // monthly target
}
```

### Distribution Rule
```typescript
interface DistributionRule {
  category: 'expenses' | 'savings' | 'investment';
  percentage: number;
  destination: 'usdc' | 'btc_lightning' | 'btc_onchain';
}
```

### Payment
```typescript
interface Payment {
  id: string;
  fromCompany: string;
  toWorker: string;
  amountUSD: number;
  status: 'pending' | 'received' | 'distributed';
  distributions: Distribution[];
  timestamp: Date;
}
```

## Tech Decisions

| Decision | Rationale |
|----------|-----------|
| MiniMax M2.5 over Claude | Cost-effective for demo, already integrated in our stack |
| Solana devnet | OWS native support, hackathon requirement, fast for demo |
| Lightning via LNbits | Open source, testnet friendly, real Bitcoin savings |
| Monorepo with npm workspaces | Simple, no extra tooling needed |
| TypeScript | Type safety for financial logic, hackathon standard |
