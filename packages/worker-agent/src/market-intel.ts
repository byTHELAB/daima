// ─────────────────────────────────────────────────────────────────────────────
// Daima Worker Agent — Market Intel Module
//
// Hardcoded salary/rate database for emerging-market remote workers.
// Provides offer analysis and generates negotiation options.
// ─────────────────────────────────────────────────────────────────────────────

import { MarketRate, OfferAnalysis, NegotiationOption } from './types';

// ── Rate Database ─────────────────────────────────────────────────────────────

export const MARKET_RATES: MarketRate[] = [
  { role: 'UX Designer',          minRate: 42,  maxRate: 65,  medianRate: 52,  currency: 'USD', source: 'Daima Market Data 2026' },
  { role: 'Frontend Developer',   minRate: 45,  maxRate: 80,  medianRate: 60,  currency: 'USD', source: 'Daima Market Data 2026' },
  { role: 'Backend Developer',    minRate: 50,  maxRate: 90,  medianRate: 68,  currency: 'USD', source: 'Daima Market Data 2026' },
  { role: 'Full Stack Developer', minRate: 55,  maxRate: 95,  medianRate: 72,  currency: 'USD', source: 'Daima Market Data 2026' },
  { role: 'Product Designer',     minRate: 45,  maxRate: 70,  medianRate: 55,  currency: 'USD', source: 'Daima Market Data 2026' },
  { role: 'Data Scientist',       minRate: 55,  maxRate: 100, medianRate: 75,  currency: 'USD', source: 'Daima Market Data 2026' },
  { role: 'DevOps Engineer',      minRate: 50,  maxRate: 85,  medianRate: 65,  currency: 'USD', source: 'Daima Market Data 2026' },
  { role: 'Content Writer',       minRate: 25,  maxRate: 50,  medianRate: 35,  currency: 'USD', source: 'Daima Market Data 2026' },
  { role: 'Marketing Manager',    minRate: 35,  maxRate: 65,  medianRate: 48,  currency: 'USD', source: 'Daima Market Data 2026' },
  { role: 'Project Manager',      minRate: 40,  maxRate: 70,  medianRate: 52,  currency: 'USD', source: 'Daima Market Data 2026' },
];

// ── MarketIntel Engine ────────────────────────────────────────────────────────

export class MarketIntel {
  /**
   * Look up market rate data for a given role.
   * Does a case-insensitive partial match so "frontend dev" → "Frontend Developer".
   */
  lookupRate(role: string): MarketRate | null {
    const normalised = role.toLowerCase().trim();
    return (
      MARKET_RATES.find((r) => r.role.toLowerCase().includes(normalised)) ??
      MARKET_RATES.find((r) => normalised.includes(r.role.toLowerCase().split(' ')[0])) ??
      null
    );
  }

  /** Return all available roles */
  listRoles(): string[] {
    return MARKET_RATES.map((r) => r.role);
  }

  /**
   * Analyse an offer against market data and generate negotiation options.
   * @param role      Worker's role (used for market lookup)
   * @param offeredRate  The rate the company offered (USD/hr)
   * @param experienceYears  Worker's experience (boosts recommended counter)
   */
  analyzeOffer(role: string, offeredRate: number, experienceYears: number = 2): OfferAnalysis {
    const marketRate = this.lookupRate(role);
    if (!marketRate) {
      throw new Error(
        `[MarketIntel] No market data found for role "${role}". ` +
          `Available roles: ${this.listRoles().join(', ')}`
      );
    }

    const { minRate, maxRate, medianRate } = marketRate;
    const range = maxRate - minRate;
    const percentilePosition = range > 0
      ? Math.min(100, Math.max(0, Math.round(((offeredRate - minRate) / range) * 100)))
      : 50;

    const verdict =
      offeredRate < medianRate * 0.9
        ? 'below_market'
        : offeredRate > medianRate * 1.1
        ? 'above_market'
        : 'at_market';

    const gapAmount = round2(offeredRate - medianRate);

    const negotiationOptions = buildNegotiationOptions(
      offeredRate,
      marketRate,
      experienceYears
    );

    console.log(
      `[MarketIntel] ${role} offer: $${offeredRate}/hr | ` +
        `Market median: $${medianRate}/hr | ` +
        `Verdict: ${verdict} | ` +
        `Percentile: ${percentilePosition}th`
    );

    return {
      offeredRate,
      marketRate,
      percentilePosition,
      verdict,
      gapAmount,
      negotiationOptions,
    };
  }
}

// ── Negotiation Option Builder ────────────────────────────────────────────────

function buildNegotiationOptions(
  offeredRate: number,
  market: MarketRate,
  experienceYears: number
): NegotiationOption[] {
  const { medianRate, maxRate } = market;

  // Experience multiplier: +2% per year of experience above 2
  const expBonus = Math.max(0, (experienceYears - 2) * 0.02);
  const fairCounter = round2(medianRate * (1 + expBonus));
  const stretchCounter = round2(Math.min(maxRate, medianRate * 1.15 * (1 + expBonus)));

  const options: NegotiationOption[] = [];

  if (offeredRate < medianRate) {
    options.push({
      id: 'accept_and_renegotiate',
      label: 'Accept now, renegotiate in 90 days',
      action:
        'Accept the current offer to start building trust, then schedule a formal rate review after delivering your first milestone.',
    });

    options.push({
      id: 'counter_at_median',
      label: `Counter at $${fairCounter}/hr (market median)`,
      action:
        `Reply: "Based on current market rates for this role and my ${experienceYears} years of experience, ` +
        `I'd like to propose $${fairCounter}/hr as a fair baseline. ` +
        `I'm excited about the project and want to start on the right footing."`,
      counterAmount: fairCounter,
    });

    options.push({
      id: 'counter_stretch',
      label: `Counter at $${stretchCounter}/hr (upper-mid range)`,
      action:
        `Reply: "Given my track record and the scope involved, I believe $${stretchCounter}/hr ` +
        `reflects the value I'll deliver. Happy to discuss further."`,
      counterAmount: stretchCounter,
    });

    options.push({
      id: 'value_add_negotiation',
      label: 'Negotiate with a value-add offer',
      action:
        `Propose keeping $${offeredRate}/hr for the first 30 days as a trial rate, ` +
        `with an automatic step-up to $${fairCounter}/hr upon successful delivery of the first milestone.`,
      counterAmount: fairCounter,
    });
  } else if (offeredRate >= medianRate && offeredRate <= maxRate) {
    options.push({
      id: 'accept_strong',
      label: 'Accept — this is a strong offer',
      action:
        'This offer is at or above market median. Accepting is a solid move. ' +
        'Consider negotiating for async flexibility or bonus structures instead of rate.',
    });

    options.push({
      id: 'accept_and_negotiate_perks',
      label: 'Accept rate, negotiate perks',
      action:
        'Ask for: equipment stipend ($500–$1000), async-first schedule, or performance bonus tied to KPIs.',
    });
  } else {
    options.push({
      id: 'accept_immediately',
      label: 'Accept immediately — above-market offer',
      action:
        'This offer is in the top range for this role. Accept promptly and deliver excellence.',
    });
  }

  return options;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
