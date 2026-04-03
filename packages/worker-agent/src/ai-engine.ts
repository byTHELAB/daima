// ─────────────────────────────────────────────────────────────────────────────
// Daima Worker Agent — AI Engine
//
// Wraps MiniMax M2.5 API to generate natural-language notifications and advice.
// Falls back to polished hardcoded responses when the API key is missing,
// so the demo always runs even without credentials.
// ─────────────────────────────────────────────────────────────────────────────

import { Payment, Distribution, WorkerProfile, OfferAnalysis, AINotification } from './types';

const MINIMAX_ENDPOINT = 'https://api.minimaxi.chat/v1/text/chatcompletion_v2';
const MINIMAX_MODEL = 'MiniMax-M1';

export class AIEngine {
  private apiKey: string | undefined;
  private enabled: boolean;

  constructor() {
    this.apiKey = process.env.MINIMAX_API_KEY;
    this.enabled = Boolean(this.apiKey);

    if (!this.enabled) {
      console.warn(
        '[AIEngine] MINIMAX_API_KEY not set — running in demo mode with hardcoded responses.'
      );
    } else {
      console.log('[AIEngine] MiniMax M2.5 ready.');
    }
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /** Generate a natural-language notification after a payment is received & distributed */
  async generatePaymentNotification(
    payment: Payment,
    distributions: Distribution[]
  ): Promise<AINotification> {
    const expDist = distributions.find((d) => d.category === 'expenses');
    const savDist = distributions.find((d) => d.category === 'savings');
    const invDist = distributions.find((d) => d.category === 'investment');

    const prompt = buildPaymentPrompt(payment, expDist, savDist, invDist);

    const message = this.enabled
      ? await this.callMiniMax(prompt)
      : fallbackPaymentNotification(payment, distributions);

    return {
      type: 'payment_received',
      message,
      timestamp: new Date(),
      metadata: { paymentId: payment.id, amountUSD: payment.amountUSD },
    };
  }

  /** Generate negotiation coaching based on an offer analysis */
  async generateNegotiationResponse(
    offeredRate: number,
    analysis: OfferAnalysis
  ): Promise<AINotification> {
    const prompt = buildNegotiationPrompt(offeredRate, analysis);

    const message = this.enabled
      ? await this.callMiniMax(prompt)
      : fallbackNegotiationResponse(offeredRate, analysis);

    return {
      type: 'negotiation_advice',
      message,
      timestamp: new Date(),
      metadata: { offeredRate, verdict: analysis.verdict },
    };
  }

  /** Generate personalised financial advice based on the worker's profile */
  async generateFinancialAdvice(profile: WorkerProfile): Promise<AINotification> {
    const prompt = buildFinancialAdvicePrompt(profile);

    const message = this.enabled
      ? await this.callMiniMax(prompt)
      : fallbackFinancialAdvice(profile);

    return {
      type: 'financial_advice',
      message,
      timestamp: new Date(),
      metadata: { workerId: profile.id, currentSavings: profile.currentSavings },
    };
  }

  // ── MiniMax API Call ───────────────────────────────────────────────────────

  private async callMiniMax(userPrompt: string): Promise<string> {
    const body = {
      model: MINIMAX_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are Daima, an AI CFO assistant for remote workers in emerging economies. ' +
            'You communicate in clear, warm, and empowering English. ' +
            'Be concise (max 3 sentences unless more detail is asked). ' +
            'Use numbers to be concrete. Never use jargon.',
        },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 300,
    };

    try {
      const response = await fetch(MINIMAX_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`MiniMax API error ${response.status}: ${errText}`);
      }

      const data = (await response.json()) as MinimaxResponse;
      const content = data?.choices?.[0]?.message?.content;

      if (!content) throw new Error('MiniMax returned empty content.');
      return content.trim();
    } catch (err) {
      console.error('[AIEngine] API call failed, using fallback.', err);
      // Fallback so we don't break the demo if the call fails at runtime
      return 'Your payment has been processed and distributed according to your rules. Check your Daima dashboard for details.';
    }
  }
}

// ── Prompt Builders ───────────────────────────────────────────────────────────

function buildPaymentPrompt(
  payment: Payment,
  expenses?: Distribution,
  savings?: Distribution,
  investment?: Distribution
): string {
  const parts: string[] = [
    `A remote worker just received a payment of $${payment.amountUSD} USD from ${payment.fromCompany}.`,
  ];
  if (expenses) parts.push(`$${expenses.amount} went to their USDC expenses wallet.`);
  if (savings) parts.push(`$${savings.amount} was auto-converted to Bitcoin savings (Lightning).`);
  if (investment) parts.push(`$${investment.amount} was routed to their BTC investment stack.`);
  parts.push(
    'Write a friendly, 2-sentence notification to send to the worker confirming the split and encouraging them.'
  );
  return parts.join(' ');
}

function buildNegotiationPrompt(offeredRate: number, analysis: OfferAnalysis): string {
  const { marketRate, verdict, negotiationOptions } = analysis;
  const topOption = negotiationOptions[0];
  return (
    `A remote ${marketRate.role} was offered $${offeredRate}/hr. ` +
    `Market data shows the median is $${marketRate.medianRate}/hr (range $${marketRate.minRate}–$${marketRate.maxRate}/hr). ` +
    `Verdict: ${verdict.replace(/_/g, ' ')}. ` +
    (topOption
      ? `The recommended action is: "${topOption.action}" `
      : '') +
    'Write a 2–3 sentence coaching message that empowers the worker to negotiate confidently, using specific numbers.'
  );
}

function buildFinancialAdvicePrompt(profile: WorkerProfile): string {
  const savingsProgress = profile.savingsGoalMonthly > 0
    ? Math.round((profile.currentSavings / profile.savingsGoalMonthly) * 100)
    : 0;
  const btcAlloc = profile.distributionRules
    .filter((r) => r.category === 'savings' || r.category === 'investment')
    .reduce((s, r) => s + r.percentage, 0);

  return (
    `A remote worker named ${profile.name} works as a ${profile.role} with ${profile.experienceYears} years of experience in ${profile.region}. ` +
    `Their savings goal is $${profile.savingsGoalMonthly}/month and they currently have $${profile.currentSavings} saved (${savingsProgress}% of goal). ` +
    `They allocate ${btcAlloc}% of income to Bitcoin. ` +
    'Give them one concrete, actionable financial tip to improve their financial resilience as a remote worker.'
  );
}

// ── Fallback Responses (demo mode) ───────────────────────────────────────────

function fallbackPaymentNotification(payment: Payment, distributions: Distribution[]): string {
  const savings = distributions.find((d) => d.category === 'savings');
  const expenses = distributions.find((d) => d.category === 'expenses');
  return (
    `Payment of $${payment.amountUSD} from ${payment.fromCompany} landed — your money is already working for you. ` +
    `$${expenses?.amount ?? 0} is ready in USDC for expenses` +
    (savings ? ` and $${savings.amount} has been auto-stacked into Bitcoin savings.` : '.')
  );
}

function fallbackNegotiationResponse(offeredRate: number, analysis: OfferAnalysis): string {
  const { marketRate, verdict } = analysis;
  if (verdict === 'below_market') {
    return (
      `This offer of $${offeredRate}/hr is below the market median of $${marketRate.medianRate}/hr for a ${marketRate.role}. ` +
      `You have solid leverage — counter confidently at $${marketRate.medianRate}/hr and explain that it reflects current market rates. ` +
      `Remember: negotiating is expected and professional.`
    );
  }
  if (verdict === 'at_market') {
    return (
      `At $${offeredRate}/hr this offer is right at market rate for a ${marketRate.role} — solid, but there's room to ask for perks. ` +
      `Consider requesting a performance bonus, async schedule, or equipment stipend to add value beyond the rate itself.`
    );
  }
  return (
    `$${offeredRate}/hr is an above-market offer for a ${marketRate.role} (median: $${marketRate.medianRate}/hr) — accept it with confidence. ` +
    `You're being valued at the top of your field.`
  );
}

function fallbackFinancialAdvice(profile: WorkerProfile): string {
  const btcAlloc = profile.distributionRules
    .filter((r) => r.category === 'savings' || r.category === 'investment')
    .reduce((s, r) => s + r.percentage, 0);

  if (btcAlloc < 10) {
    return (
      `${profile.name}, consider increasing your Bitcoin allocation to at least 10% of income — ` +
      `even $50/month auto-stacked over 3 years builds meaningful wealth against currency devaluation.`
    );
  }
  if (profile.currentSavings < profile.savingsGoalMonthly) {
    return (
      `You're ${Math.round((profile.currentSavings / profile.savingsGoalMonthly) * 100)}% toward your monthly savings goal, ${profile.name}. ` +
      `One invoice away from target — keep your distribution rules locked in and let Daima handle the rest.`
    );
  }
  return (
    `Great discipline, ${profile.name} — you're on track. ` +
    `As your income grows, consider keeping your expense percentage fixed and letting all raises flow into savings and investment.`
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface MinimaxResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}
