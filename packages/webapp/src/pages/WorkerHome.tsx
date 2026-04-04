import { useState } from 'react'

interface Props {
  onNavigate: (page: string, intent?: string) => void
  onBack: () => void
}

export default function WorkerHome({ onNavigate, onBack }: Props) {
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [withdrawOption, setWithdrawOption] = useState<string | null>(null)
  const [withdrawSent, setWithdrawSent] = useState(false)

  return (
    <div className="min-h-screen bg-bg font-sans">
      <div className="max-w-md mx-auto px-4 pb-10">

        {/* ── Header ────────────────────────────────────────── */}
        <div className="pt-6 pb-4">
          {/* Back */}
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-subtle text-sm mb-4 hover:text-text transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>

          {/* Greeting */}
          <p className="text-subtle text-sm mb-1">Good morning</p>
          <h1 className="text-2xl font-bold text-text">Hi Daniela 👋</h1>

          {/* Balance */}
          <div className="mt-4">
            <p className="text-xs text-subtle uppercase tracking-widest mb-1">Total balance</p>
            <p
              className="text-5xl font-bold"
              style={{
                background: "linear-gradient(90deg, #FF6B55 0%, #FFCD38 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              $2,450.00
            </p>
          </div>

          {/* Distribution mini bar */}
          <div className="mt-4">
            <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
              <div className="h-full rounded-l-full" style={{ width: "50%", background: "#FF6B55" }} />
              <div className="h-full" style={{ width: "40%", background: "#FFCD38" }} />
              <div className="h-full rounded-r-full" style={{ width: "10%", background: "#2DD4A0" }} />
            </div>
            <div className="flex gap-4 mt-2">
              <span className="flex items-center gap-1 text-xs text-subtle">
                <span className="inline-block w-2 h-2 rounded-full" style={{ background: "#FF6B55" }} />
                Spend 50%
              </span>
              <span className="flex items-center gap-1 text-xs text-subtle">
                <span className="inline-block w-2 h-2 rounded-full" style={{ background: "#FFCD38" }} />
                Save 40%
              </span>
              <span className="flex items-center gap-1 text-xs text-subtle">
                <span className="inline-block w-2 h-2 rounded-full" style={{ background: "#2DD4A0" }} />
                Invest 10%
              </span>
            </div>
          </div>

          {/* Withdraw button */}
          <div className="mt-5">
            <button
              onClick={() => { setShowWithdraw(!showWithdraw); setWithdrawSent(false); setWithdrawOption(null); }}
              className="w-full py-3.5 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: '#FF6B55' }}
            >
              {showWithdraw ? 'Close' : 'Withdraw'}
            </button>
          </div>
        </div>

        {/* Withdraw Panel */}
        {showWithdraw && (
          <div className="bg-card border border-border rounded-2xl p-5 mb-4 shadow-sm" style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
            {!withdrawSent ? (
              <>
                <p className="text-xs font-semibold text-subtle uppercase tracking-wider mb-3">Withdraw to</p>
                <div className="flex flex-col gap-2.5 mb-4">
                  <button
                    onClick={() => setWithdrawOption('bank')}
                    className="flex items-center gap-3 p-3 rounded-xl border transition-all text-left"
                    style={{ borderColor: withdrawOption === 'bank' ? '#FF6B55' : '#E0D8CC', background: withdrawOption === 'bank' ? '#FFF5F0' : '#FFFFFF' }}
                  >
                    <span className="text-xl">🏦</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-text">Bank account</p>
                      <p className="text-xs text-subtle">USDC → MXN pesos • 1-2 business days</p>
                    </div>
                    <span className="text-xs text-subtle">Fee: 0.5%</span>
                  </button>
                  <button
                    onClick={() => setWithdrawOption('crypto')}
                    className="flex items-center gap-3 p-3 rounded-xl border transition-all text-left"
                    style={{ borderColor: withdrawOption === 'crypto' ? '#FF6B55' : '#E0D8CC', background: withdrawOption === 'crypto' ? '#FFF5F0' : '#FFFFFF' }}
                  >
                    <span className="text-xl">💼</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-text">Crypto wallet</p>
                      <p className="text-xs text-subtle">USDC or BTC → your external wallet</p>
                    </div>
                    <span className="text-xs text-subtle">Fee: 0.3%</span>
                  </button>
                  <button
                    onClick={() => setWithdrawOption('lightning')}
                    className="flex items-center gap-3 p-3 rounded-xl border transition-all text-left"
                    style={{ borderColor: withdrawOption === 'lightning' ? '#FF6B55' : '#E0D8CC', background: withdrawOption === 'lightning' ? '#FFF5F0' : '#FFFFFF' }}
                  >
                    <span className="text-xl">⚡</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-text">Lightning Network</p>
                      <p className="text-xs text-subtle">Instant BTC transfer • any LN wallet</p>
                    </div>
                    <span className="text-xs" style={{ color: '#0A7A54' }}>Free</span>
                  </button>
                </div>

                {withdrawOption && (
                  <div style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
                    <div className="bg-track rounded-xl p-3 mb-4" style={{ borderLeft: '3px solid #FF6B55' }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#C04A1A' }}>✦ Daima suggests</p>
                      <p className="text-xs text-text leading-relaxed">
                        {withdrawOption === 'bank' && "Keep at least $500 in USDC for upcoming expenses. You have $1,225 available. Suggested withdrawal: $700."}
                        {withdrawOption === 'crypto' && "Your external wallet address is saved. I'll send via Solana for the lowest fee."}
                        {withdrawOption === 'lightning' && "Lightning is instant and free. Perfect for moving to your personal BTC wallet."}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle font-semibold">$</span>
                        <input
                          type="number"
                          defaultValue="700"
                          className="w-full bg-white border rounded-xl pl-8 pr-4 py-3 text-text text-lg font-bold outline-none transition-all"
                          style={{ borderColor: '#E0D8CC' }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => setWithdrawSent(true)}
                      className="w-full py-3.5 rounded-2xl text-white font-bold text-sm transition-all active:scale-[0.98]"
                      style={{ background: '#FF6B55' }}
                    >
                      Withdraw $700 →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div style={{ animation: 'fadeSlideIn 0.4s ease-out' }} className="text-center py-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-3" style={{ background: '#2DD4A0', color: '#0A0A0A' }}>✓</div>
                <p className="text-lg font-bold text-text mb-1">Withdrawal sent!</p>
                <p className="text-sm text-subtle mb-3">
                  {withdrawOption === 'bank' && "$700 → your bank account (1-2 business days)"}
                  {withdrawOption === 'crypto' && "$700 in USDC → your external wallet"}
                  {withdrawOption === 'lightning' && "$700 in sats → your Lightning wallet (instant)"}
                </p>
                <p className="text-xs" style={{ color: '#0A7A54' }}>
                  Fee: {withdrawOption === 'lightning' ? '$0.00' : withdrawOption === 'crypto' ? '$2.10 (0.3%)' : '$3.50 (0.5%)'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── New Offer Notification (TOP PRIORITY) ─────────────── */}
        <div
          className="bg-card rounded-2xl p-4 mb-4 border border-border shadow-md flex items-start gap-3"
          style={{ borderLeft: "4px solid #FFCD38", animation: "fadeSlideIn 0.4s ease-out" }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
            style={{ background: "#3B5BDB", color: "#F5F0EB" }}
          >
            A
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-bold text-text">New offer from Acme Corp</p>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: "#FFCD38", color: "#1A1815" }}>New</span>
            </div>
            <p className="text-xs text-subtle mb-2">UX Redesign project • 3 weeks • $300 offered</p>
            <p className="text-xs mb-3" style={{ color: "#B5005A" }}>
              ⚠ 33% below market rate ($450-650)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => onNavigate('worker', 'autopilot')}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white shadow-sm"
                style={{ background: "#FF6B55", boxShadow: "0 4px 12px rgba(255,107,85,0.3)" }}
              >
                Let agent handle ✦
              </button>
              <button
                onClick={() => onNavigate('worker', 'copilot')}
                className="px-4 py-2 rounded-lg text-xs font-bold border"
                style={{ borderColor: "#E0D8CC", color: "#8A7A6A" }}
              >
                Review myself →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions — solid neutral */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => onNavigate('worker')}
            className="flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all hover:shadow-md active:scale-[0.98]"
            style={{ background: "#FFFFFF", color: "#1A1815", border: "1px solid #E0D8CC" }}
          >
            View Payments
          </button>
          <button
            className="flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all hover:shadow-md active:scale-[0.98]"
            style={{ background: "#FFFFFF", color: "#1A1815", border: "1px solid #E0D8CC" }}
          >
            Adjust Goals
          </button>
        </div>

        {/* ── AI Agent Advice Card ───────────────────────────── */}
        <div className="bg-card rounded-2xl p-4 mb-6 border border-border shadow-sm flex gap-3" style={{ borderLeft: "4px solid #FF6B55" }}>
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg"
            style={{ background: "linear-gradient(135deg, #FF6B55 0%, #FFCD38 100%)" }}
          >
            ✦
          </div>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: "#C04A1A" }}>Daima says</p>
            <p className="text-sm text-text leading-relaxed">
              Your emergency fund is 65% complete. At your current savings rate, you'll reach your $3,000 goal by July. I moved $200 to BTC savings via Lightning — your purchasing power is growing. Keep it up! 🔥
            </p>
          </div>
        </div>

        {/* ── Financial Goals ────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-subtle mb-3">Your goals</p>

          {/* Goal 1 — Emergency Fund */}
          <div className="bg-card border border-border rounded-2xl p-4 mb-3 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛡️</span>
                <div>
                  <p className="text-sm font-semibold text-text">Emergency Fund</p>
                  <p className="text-xs text-subtle">$1,950 of $3,000</p>
                </div>
              </div>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: "#FFF3E0", color: "#C04A1A" }}
              >
                AI suggested ✨
              </span>
            </div>
            <div className="h-2 rounded-full mb-2" style={{ background: "#EDE8E0" }}>
              <div
                className="h-2 rounded-full"
                style={{
                  width: "65%",
                  background: "linear-gradient(90deg, #2DD4A0, #0A7A54)",
                }}
              />
            </div>
            <p className="text-xs text-subtle">Est. completion: July 2026</p>
          </div>

          {/* Goal 2 — New Laptop */}
          <div className="bg-card border border-border rounded-2xl p-4 mb-3 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">💻</span>
                <div>
                  <p className="text-sm font-semibold text-text">New MacBook Pro</p>
                  <p className="text-xs text-subtle">$800 of $2,000</p>
                </div>
              </div>
            </div>
            <div className="h-2 rounded-full mb-2" style={{ background: "#EDE8E0" }}>
              <div
                className="h-2 rounded-full"
                style={{
                  width: "40%",
                  background: "linear-gradient(90deg, #FFCD38, #8A6A00)",
                }}
              />
            </div>
            <p className="text-xs text-subtle">Est. completion: October 2026</p>
          </div>

          {/* Goal 3 — BTC Investment */}
          <div className="bg-card border border-border rounded-2xl p-4 mb-3 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">📈</span>
              <div>
                <p className="text-sm font-semibold text-text">BTC Investment</p>
                <p className="text-xs text-subtle">487,200 sats</p>
              </div>
            </div>
            <p className="text-xs text-subtle mb-3">≈ $410 at current rate</p>
            {/* Mini trend line SVG */}
            <svg width="100%" height="36" viewBox="0 0 200 36" fill="none" className="mb-2">
              <polyline
                points="0,30 30,24 60,20 90,16 120,12 150,8 180,5 200,3"
                stroke="#FF6B55"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <polyline
                points="0,30 30,24 60,20 90,16 120,12 150,8 180,5 200,3"
                stroke="url(#btcGrad)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <defs>
                <linearGradient id="btcGrad" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FF6B55" />
                  <stop offset="100%" stopColor="#FFCD38" />
                </linearGradient>
              </defs>
            </svg>
            <p className="text-xs text-subtle">Auto-allocating 10% of each payment</p>
          </div>

          {/* Add goal CTA */}
          <button className="text-sm font-medium mt-1" style={{ color: "#C04A1A" }}>
            + Add new goal
          </button>
        </div>

        {/* ── Smart Habits ───────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-subtle mb-3">
            Smart habits — powered by your agent
          </p>

          <div className="flex flex-col gap-3">
            {/* Habit 1 */}
            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">💰</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text mb-0.5">Save first, spend later</p>
                <p className="text-xs text-subtle leading-snug">40% of every payment goes to savings before you see it</p>
              </div>
              <span
                className="text-xs font-semibold flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full"
                style={{ background: "#E6FAF5", color: "#0A7A54" }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2 2 4-4" stroke="#0A7A54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Active
              </span>
            </div>

            {/* Habit 2 */}
            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">📊</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text mb-0.5">Know your worth</p>
                <p className="text-xs text-subtle leading-snug">Market rate alerts for UX Design: $42–65/hr</p>
              </div>
              <span
                className="text-xs font-semibold flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full"
                style={{ background: "#E6FAF5", color: "#0A7A54" }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2 2 4-4" stroke="#0A7A54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Active
              </span>
            </div>

            {/* Habit 3 */}
            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">₿</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text mb-0.5">Bitcoin savings</p>
                <p className="text-xs text-subtle leading-snug">Auto-convert savings to BTC via Lightning</p>
              </div>
              <span
                className="text-xs font-semibold flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full"
                style={{ background: "#E6FAF5", color: "#0A7A54" }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2 2 4-4" stroke="#0A7A54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Active
              </span>
            </div>
          </div>
        </div>

        {/* ── Monthly Summary ────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-subtle mb-3">April 2026</p>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-subtle">Income</span>
                <span className="text-sm font-semibold" style={{ color: "#0A7A54" }}>$1,500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-subtle">Saved</span>
                <span className="text-sm font-semibold" style={{ color: "#8A6A00" }}>$600 (40%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-subtle">Invested</span>
                <span className="text-sm font-semibold" style={{ color: "#3B5BDB" }}>$150 (10%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-subtle">Fees paid</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold" style={{ color: "#0A7A54" }}>$0.02</span>
                  <span className="text-xs text-subtle">
                    vs{" "}
                    <span style={{ textDecoration: "line-through" }}>$57 on PayPal</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-border my-4" />

            <div className="flex items-center justify-center gap-2">
              <span className="text-sm font-bold" style={{ color: "#C04A1A" }}>Savings streak: 4 months 🔥</span>
            </div>
          </div>
        </div>

        {/* ── Back to top ──────────────────────────────────── */}
        <p className="text-center text-xs text-subtle py-4">Daima — your AI financial ally</p>

      </div>
    </div>
  )
}
