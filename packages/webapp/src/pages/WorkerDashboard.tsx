import { useState, useEffect, useRef } from 'react'

interface WorkerDashboardProps {
  payment: { amount: number; company: string } | null
  offerIntent?: 'none' | 'autopilot' | 'copilot'
  onBack: () => void
}

function formatSats(amount: number): string {
  const sats = Math.round((amount * 0.4 / 84000) * 100_000_000)
  return sats.toLocaleString()
}

function formatUSD(amount: number): string {
  return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function useCountUp(target: number, duration: number = 1200, enabled: boolean = true) {
  const [value, setValue] = useState(target)
  const startRef = useRef<number | null>(null)
  const startValueRef = useRef(target)

  useEffect(() => {
    if (!enabled) {
      setValue(target)
      return
    }
    startValueRef.current = value
    startRef.current = null
    const from = startValueRef.current
    const diff = target - from

    let frame: number
    function tick(now: number) {
      if (startRef.current === null) startRef.current = now
      const elapsed = now - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(from + diff * eased)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, enabled])

  return value
}

export default function WorkerDashboard({ payment, offerIntent = 'none', onBack }: WorkerDashboardProps) {
  const BASE_BALANCE = 2450.00
  const targetBalance = payment ? BASE_BALANCE + payment.amount : BASE_BALANCE

  const [showPaymentCard, setShowPaymentCard] = useState(false)
  const [showDistribution, setShowDistribution] = useState(false)
  const [showLine1, setShowLine1] = useState(false)
  const [showLine2, setShowLine2] = useState(false)
  const [showLine3, setShowLine3] = useState(false)
  const [showMarketAlert, setShowMarketAlert] = useState(false)
  const [balanceAnimEnabled, setBalanceAnimEnabled] = useState(false)

  // Offer handling modes
  type OfferMode = 'initial' | 'autopilot' | 'copilot' | 'done'
  const [offerMode, setOfferMode] = useState<OfferMode>(
    offerIntent === 'autopilot' ? 'autopilot' : offerIntent === 'copilot' ? 'copilot' : 'initial'
  )
  const [customCounter, setCustomCounter] = useState('500')
  const [agentNegotiating, setAgentNegotiating] = useState(offerIntent === 'autopilot')
  const [agentDone, setAgentDone] = useState(false)

  // Auto-start autopilot if intent was set
  useEffect(() => {
    if (offerIntent === 'autopilot') {
      setShowMarketAlert(true)
      const t = setTimeout(() => {
        setAgentNegotiating(false)
        setAgentDone(true)
      }, 3000)
      return () => clearTimeout(t)
    }
    if (offerIntent === 'copilot') {
      setShowMarketAlert(true)
    }
  }, [offerIntent])

  function handleAutopilot() {
    setOfferMode('autopilot')
    setAgentNegotiating(true)
    setTimeout(() => {
      setAgentNegotiating(false)
      setAgentDone(true)
    }, 3000)
  }

  function handleCopilotSend() {
    setOfferMode('done')
    setCounterSent(true)
  }

  const displayBalance = useCountUp(targetBalance, 1400, balanceAnimEnabled)

  useEffect(() => {
    if (payment) {
      // Payment card slides in immediately
      const t0 = setTimeout(() => setShowPaymentCard(true), 100)
      // Balance starts counting
      const tb = setTimeout(() => setBalanceAnimEnabled(true), 200)
      // Distribution lines staggered
      const t1 = setTimeout(() => setShowDistribution(true), 1500)
      const t2 = setTimeout(() => setShowLine1(true), 2000)
      const t3 = setTimeout(() => setShowLine2(true), 2500)
      const t4 = setTimeout(() => setShowLine3(true), 3000)
      return () => { clearTimeout(t0); clearTimeout(tb); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
    }
  }, [payment])

  useEffect(() => {
    const t = setTimeout(() => setShowMarketAlert(true), 3000)
    return () => clearTimeout(t)
  }, [])

  const expenseAmt = payment ? payment.amount * 0.5 : 0
  const savingsAmt = payment ? payment.amount * 0.4 : 0
  const investAmt = payment ? payment.amount * 0.1 : 0
  const sats = payment ? formatSats(payment.amount) : '0'

  return (
    <div className="min-h-screen bg-bg pb-12">
      {/* Header */}
      <div className="px-5 pt-8 pb-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-subtle text-sm mb-6 hover:text-text transition-colors duration-150"
        >
          <span className="text-base leading-none">←</span>
          <span>Back</span>
        </button>

        <p className="text-subtle text-xs font-semibold uppercase tracking-widest mb-1">
          Good morning, Daniela
        </p>

        {/* Big balance with coral→gold gradient */}
        <div
          className="text-5xl font-bold tracking-tight mb-1"
          style={{
            background: 'linear-gradient(90deg, #FF6B55 0%, #FFCD38 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          ${formatUSD(displayBalance)}
        </div>
        <p className="text-subtle text-xs">Total balance · USDC + BTC</p>
      </div>

      {/* Distribution Mini Bar */}
      <div className="px-5 mt-5">
        <div className="flex rounded-full overflow-hidden h-2 w-full">
          <div className="bg-coral transition-all duration-700" style={{ width: '50%' }} />
          <div className="bg-gold transition-all duration-700" style={{ width: '40%' }} />
          <div className="bg-green transition-all duration-700" style={{ width: '10%' }} />
        </div>
        <div className="flex gap-4 mt-2 text-xs font-medium flex-wrap">
          <span style={{ color: '#C04A1A' }}>● Expenses $1,225</span>
          <span style={{ color: '#8A6A00' }}>● Savings $980</span>
          <span style={{ color: '#0A7A54' }}>● Invest $245</span>
        </div>
      </div>

      <div className="px-5 mt-6 flex flex-col gap-4">

        {/* Market Alert Card — TOP PRIORITY */}
        <div
          className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm transition-all duration-600"
          style={{
            borderLeft: '3px solid #FFCD38',
            transform: showMarketAlert ? 'translateX(0)' : 'translateX(32px)',
            opacity: showMarketAlert ? 1 : 0,
            transitionDuration: '500ms',
          }}
        >
          <div className="p-4">
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#8A6A00' }}>
              ⚡ New offer — below market
            </p>
            <p className="text-text text-sm font-medium mb-1">
              Startup XYZ offers $300 for a UX redesign project.
            </p>
            <p className="text-text text-xs mb-1">
              Market rate for UX Design (4 yrs exp): <span className="font-semibold">$450–650</span>
            </p>
            <p className="text-xs font-bold mb-4" style={{ color: '#B5005A' }}>
              This offer is 33% below market
            </p>

            {/* ── INITIAL: Choose mode ── */}
            {offerMode === 'initial' && (
              <div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={handleAutopilot}
                    className="px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all duration-150 active:scale-95 shadow-sm"
                    style={{ background: '#FF6B55', boxShadow: '0 4px 12px rgba(255,107,85,0.3)' }}
                  >
                    Let agent handle ✦
                  </button>
                  <button
                    onClick={() => setOfferMode('copilot')}
                    className="px-4 py-2 rounded-lg border border-border bg-card text-text text-sm font-medium transition-all duration-150 hover:bg-track"
                  >
                    Review myself
                  </button>
                </div>
              </div>
            )}

            {/* ── AUTOPILOT: Agent working ── */}
            {offerMode === 'autopilot' && (
              <div style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
                {agentNegotiating && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-coral animate-pulse"></span>
                      <p className="text-sm font-semibold" style={{ color: '#C04A1A' }}>Agent negotiating...</p>
                    </div>
                    <div className="bg-track rounded-xl p-3 space-y-2">
                      <p className="text-xs text-subtle">Analyzing market data for UX Design...</p>
                      <p className="text-xs text-subtle">Checking your minimum rate ($450/hr)...</p>
                      <p className="text-xs text-subtle">Preparing counter-offer...</p>
                    </div>
                  </div>
                )}
                {agentDone && (
                  <div style={{ animation: 'fadeSlideIn 0.4s ease-out' }}>
                    <p className="text-sm font-semibold mb-2" style={{ color: '#0A7A54' }}>
                      ✓ Done! Agent secured $500
                    </p>
                    <div className="bg-track rounded-xl p-3 mb-3">
                      <p className="text-xs text-subtle italic leading-relaxed">
                        Daima sent: "Based on market data for UX Design with 4 years of experience, we propose $500 for this project. This reflects fair compensation for the scope. Our client is available to start immediately."
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: '#2DD4A0', color: '#0A0A0A' }}>Within market ✓</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: '#2DD4A0', color: '#0A0A0A' }}>Above your minimum ✓</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── COPILOT: Human reviews with AI suggestions ── */}
            {offerMode === 'copilot' && (
              <div style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
                {/* Agent suggestion */}
                <div className="bg-track rounded-xl p-3 mb-4" style={{ borderLeft: '3px solid #FF6B55' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: '#C04A1A' }}>✦ Daima suggests</p>
                  <p className="text-xs text-text leading-relaxed mb-2">
                    Based on market data, I recommend countering at <strong>$500</strong>. This is the median rate for your experience level and keeps you competitive without undervaluing your work.
                  </p>
                  <div className="flex gap-3 text-xs text-subtle">
                    <span>Market range: $450–650</span>
                    <span>•</span>
                    <span>Your minimum: $450</span>
                  </div>
                </div>

                {/* Editable counter */}
                <div className="mb-4">
                  <label className="text-xs font-semibold text-subtle uppercase tracking-wider mb-2 block">Your counter-offer</label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle font-semibold text-lg">$</span>
                      <input
                        type="number"
                        value={customCounter}
                        onChange={(e) => setCustomCounter(e.target.value)}
                        className="w-full bg-card border border-border rounded-xl pl-8 pr-4 py-3 text-text text-lg font-bold outline-none focus:border-coral transition-all"
                      />
                    </div>
                    <button
                      onClick={() => setCustomCounter('500')}
                      className="px-3 py-3 rounded-xl text-xs font-semibold border border-border hover:bg-track transition-colors"
                      style={{ color: '#C04A1A' }}
                    >
                      Use AI suggestion
                    </button>
                  </div>
                  {parseInt(customCounter) < 450 && (
                    <p className="text-xs mt-2" style={{ color: '#B5005A' }}>⚠ Below your minimum rate ($450)</p>
                  )}
                  {parseInt(customCounter) >= 450 && parseInt(customCounter) <= 650 && (
                    <p className="text-xs mt-2" style={{ color: '#0A7A54' }}>✓ Within market range</p>
                  )}
                  {parseInt(customCounter) > 650 && (
                    <p className="text-xs mt-2" style={{ color: '#8A6A00' }}>⚠ Above market range — may reduce acceptance</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={handleCopilotSend}
                    className="flex-1 py-3 rounded-xl text-white text-sm font-bold transition-all active:scale-95"
                    style={{ background: '#FF6B55' }}
                  >
                    Send ${customCounter} →
                  </button>
                  <button
                    onClick={() => setOfferMode('initial')}
                    className="px-4 py-3 rounded-xl border border-border text-subtle text-sm font-medium hover:bg-track transition-colors"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {/* ── DONE: Copilot sent ── */}
            {offerMode === 'done' && (
              <div style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
                <p className="text-sm font-semibold mb-2" style={{ color: '#0A7A54' }}>
                  ✓ Counter-offer sent: ${customCounter}
                </p>
                <div className="bg-track rounded-xl p-3">
                  <p className="text-xs text-subtle italic leading-relaxed">
                    You sent: "I'd like to propose ${customCounter} for this project based on my experience and the current market rate for UX Design."
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Received Card */}
        {payment && (
          <div
            className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm transition-all duration-500"
            style={{
              borderLeft: '3px solid #2DD4A0',
              transform: showPaymentCard ? 'translateY(0)' : 'translateY(-20px)',
              opacity: showPaymentCard ? 1 : 0,
            }}
          >
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#0A7A54' }}>
                Payment received
              </p>
              <p className="text-text text-sm mb-3">
                You received <span className="font-semibold">${formatUSD(payment.amount)}</span> from <span className="font-semibold">{payment.company}</span>.
              </p>

              {/* Distribution lines */}
              {showDistribution && (
                <div className="flex flex-col gap-1.5 border-t border-track pt-3 mt-1">
                  <div
                    className="flex items-start gap-2 text-xs text-text transition-all duration-400"
                    style={{
                      transform: showLine1 ? 'translateY(0)' : 'translateY(6px)',
                      opacity: showLine1 ? 1 : 0,
                      transitionDuration: '350ms',
                    }}
                  >
                    <span>✅</span>
                    <span>
                      <span className="font-medium">Expenses (50%):</span>{' '}
                      <span style={{ color: '#C04A1A' }}>${formatUSD(expenseAmt)}</span>{' '}
                      <span className="text-subtle">→ available now</span>
                    </span>
                  </div>
                  <div
                    className="flex items-start gap-2 text-xs text-text transition-all duration-400"
                    style={{
                      transform: showLine2 ? 'translateY(0)' : 'translateY(6px)',
                      opacity: showLine2 ? 1 : 0,
                      transitionDuration: '350ms',
                    }}
                  >
                    <span>✅</span>
                    <span>
                      <span className="font-medium">Savings (40%):</span>{' '}
                      <span style={{ color: '#8A6A00' }}>${formatUSD(savingsAmt)}</span>{' '}
                      <span className="text-subtle">→ BTC via Lightning ({sats} sats)</span>
                    </span>
                  </div>
                  <div
                    className="flex items-start gap-2 text-xs text-text transition-all duration-400"
                    style={{
                      transform: showLine3 ? 'translateY(0)' : 'translateY(6px)',
                      opacity: showLine3 ? 1 : 0,
                      transitionDuration: '350ms',
                    }}
                  >
                    <span>✅</span>
                    <span>
                      <span className="font-medium">Investment (10%):</span>{' '}
                      <span style={{ color: '#0A7A54' }}>${formatUSD(investAmt)}</span>{' '}
                      <span className="text-subtle">→ BTC allocation</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Savings Goal */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-text">Monthly savings goal</span>
            <span className="text-sm font-bold" style={{ color: '#0A7A54' }}>$200 / $200</span>
          </div>
          <div className="h-2 rounded-full bg-track overflow-hidden mb-2">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: '100%',
                background: 'linear-gradient(90deg, #2DD4A0 0%, #0A7A54 100%)',
              }}
            />
          </div>
          <p className="text-xs font-medium" style={{ color: '#0A7A54' }}>✓ Goal complete this month!</p>
        </div>

        {/* Recent Activity */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-subtle mb-3">Recent activity</p>
          <div className="flex flex-col gap-2">

            {/* Row 1 */}
            <div className="bg-card border border-border rounded-xl px-4 py-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-track flex items-center justify-center text-sm">🏢</div>
                <div>
                  <p className="text-sm font-medium text-text leading-tight">Acme Corp</p>
                  <p className="text-xs text-subtle">Received · auto-distributed</p>
                </div>
              </div>
              <span className="text-sm font-bold" style={{ color: '#0A7A54' }}>+$500</span>
            </div>

            {/* Row 2 */}
            <div className="bg-card border border-border rounded-xl px-4 py-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-track flex items-center justify-center text-sm">⚡</div>
                <div>
                  <p className="text-sm font-medium text-text leading-tight">BTC Savings</p>
                  <p className="text-xs text-subtle">Lightning · 237,530 sats</p>
                </div>
              </div>
              <span className="text-sm font-bold" style={{ color: '#8A6A00' }}>$200</span>
            </div>

            {/* Row 3 */}
            <div className="bg-card border border-border rounded-xl px-4 py-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-track flex items-center justify-center text-sm">📺</div>
                <div>
                  <p className="text-sm font-medium text-text leading-tight">Netflix</p>
                  <p className="text-xs text-subtle">Subscription · USDC</p>
                </div>
              </div>
              <span className="text-sm font-bold" style={{ color: '#C0000A' }}>-$15.99</span>
            </div>

          </div>
        </div>

        {/* Agent Feed */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-subtle mb-3">Daima says</p>
          <div
            className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
            style={{ borderLeft: '3px solid #FF6B55' }}
          >
            <div className="p-4">
              <p className="text-sm italic text-subtle leading-relaxed">
                You saved $19.24 in fees compared to PayPal this month. Your savings are growing — you're on track to reach your emergency fund goal by August.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
