# Daima — AI CFO for the Global South

> *Daima: from the Quimbaya people of Colombia — master goldsmiths who understood the true value of what they crafted. Now, your AI agent knows the true value of your work.*

**We make paying fair easy and getting paid fair automatic.**

CFOs used to cost $150K/year. We gave one to every remote worker in emerging economies.

---

## The Problem

Remote workers in LATAM, Africa, and Asia face a broken system:

- **5-8% lost on every payment** — PayPal, Wise, and traditional rails eat $7,200/year from the average freelancer
- **Charging 20-40% below market** — they don't know their global rate, and nobody tells them
- **No financial strategy** — no CFO, no accountant, no one managing their money
- **63% wait 30+ days to get paid** — and it's getting worse, not better
- **Financially invisible** — they earn in USD but can't get credit, mortgages, or build financial history

Every platform today (Deel, Remote, Papaya Global) built tools for the **employer**. Nobody built for the **worker**.

## The Solution

**Daima** is your AI financial agent. It:

1. **Receives your payments** in digital dollars — instant, near-zero fees
2. **Distributes automatically** based on your goals — savings, expenses, investments
3. **Knows your market value** and defends it when companies lowball you
4. **Allocates savings to Bitcoin** via Lightning — your money holds its value

For ethical companies: **Fair Pay Badge** — automated verification that you pay within market range. Employer branding that actually means something.

## Demo — 3 Magic Moments

### Moment 1: Company Pays
```
Company sends $500 to Daniela (UX Designer in CDMX)
→ Fiat converts to USDC via Solana
→ Arrives in Daniela's wallet in < 30 seconds
→ Fee: < $0.01
```

### Moment 2: Agent Distributes
```
Daima notifies Daniela:

"You received $500 from Acme Corp.

Based on your plan:
  ✅ Monthly savings: $200 → BTC via Lightning
  ✅ Investment (10%): $50 → allocated
  ✅ Monthly expenses: $250 → available now

Your savings goal this month: $200/$200 ✅"
```

### Moment 3: Agent Defends Your Value
```
New offer: $300 for a UX project

Daima responds:
"Market rate for UX Design (4 yrs exp): $450-650.
This offer is 33% below market.

Options:
  A) Counter-offer: $500 (auto-send)
  B) Request more project details first
  C) Decline with a polite note"
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Wallets** | Open Wallet Standard (OWS) | Multi-chain wallet management |
| **Payments** | Solana + USDC | Fast, cheap payment rails |
| **Savings** | Bitcoin + Lightning (LNbits) | Store of value + instant transfers |
| **AI Agent** | MiniMax M2.5 | Financial intelligence + negotiation |
| **Onramp** | MoonPay (sandbox) | Fiat → digital dollars |

## Architecture

```
┌─────────────────┐         ┌──────────────────┐
│  Company Dashboard │ ──────▶│   Wallet Service  │
│  (pay workers)     │        │   (OWS + Solana)  │
└─────────────────┘         └────────┬─────────┘
                                      │
                                      ▼
                            ┌──────────────────┐
                            │   Worker Agent    │
                            │   (Daima Core)    │
                            │                   │
                            │  • Receive funds  │
                            │  • Distribute     │
                            │  • Market intel   │
                            │  • Negotiate      │
                            └────────┬─────────┘
                                      │
                         ┌────────────┼────────────┐
                         ▼            ▼            ▼
                    ┌─────────┐ ┌─────────┐ ┌──────────┐
                    │ Expenses│ │ Savings │ │Investment│
                    │ (USDC)  │ │ (BTC/LN)│ │ (BTC)    │
                    └─────────┘ └─────────┘ └──────────┘
                                      │
                                      ▼
                            ┌──────────────────┐
                            │ Worker Dashboard  │
                            │ (view & control)  │
                            └──────────────────┘
```

## Project Structure

```
daima/
├── README.md
├── packages/
│   ├── worker-agent/       → AI financial agent (core)
│   ├── company-dashboard/  → UI for companies to pay
│   ├── worker-dashboard/   → UI for workers to manage
│   └── wallet-service/     → OWS + Solana + Lightning
├── scripts/
│   └── demo.ts             → End-to-end demo script
└── docs/
    ├── architecture.md     → System design
    └── pitch.md            → Narrative for judges
```

## Quick Start

```bash
# Clone
git clone https://github.com/[YOUR_ORG]/daima.git
cd daima

# Install
npm install

# Configure
cp .env.example .env
# Fill in your API keys

# Run demo
npm run demo
```

## Hackathon Tracks

- ✅ **Track 01: Agentic Commerce & x402** — agent charges and pays for financial services
- ✅ **Track 03: Multi-Agent Systems & Autonomous Economies** — worker agent and company agent negotiate autonomously

## The Bigger Vision

Daima starts with payments. But the real play is **financial infrastructure for the global south**:

- Credit scoring based on international income history
- Tax optimization by jurisdiction
- Multi-currency treasury management
- Agent-to-agent salary negotiation at scale

> *Every platform built tools for employers. We built the CFO that workers deserve.*

---

Built with 🧡 from CDMX by [byTHELAB*](https://bythelab.xyz) — Growth Studio for Bitcoin, Web3 & Fintech in LATAM.

Submitted to [Open Wallet Standard Hackathon 2026](https://hackathon.openwallet.sh/).
