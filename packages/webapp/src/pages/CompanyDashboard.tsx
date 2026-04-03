import { useState, useEffect } from 'react'

interface CompanyDashboardProps {
  onPaymentSent: (data: { amount: number; company: string }) => void
  onBack: () => void
}

type SendState = 'idle' | 'processing' | 'sent'
type View = 'agent' | 'payment'

const PRESETS = [
  { value: 250, label: 'Project' },
  { value: 500, label: 'Monthly' },
  { value: 1000, label: 'Retainer' },
  { value: null, label: 'Custom' },
] as const

export default function CompanyDashboard({ onPaymentSent, onBack }: CompanyDashboardProps) {
  const [view, setView] = useState<View>('agent')
  const [companyName, setCompanyName] = useState('Acme Corp')
  const [selectedPreset, setSelectedPreset] = useState<number | null>(500)
  const [customAmount, setCustomAmount] = useState('')
  const [sendState, setSendState] = useState<SendState>('idle')

  // Agent negotiation states
  const [negotiationStep, setNegotiationStep] = useState(0)
  const [agreedRate, setAgreedRate] = useState(false)

  useEffect(() => {
    if (view !== 'agent') return
    const timers = [
      setTimeout(() => setNegotiationStep(1), 800),
      setTimeout(() => setNegotiationStep(2), 2200),
      setTimeout(() => setNegotiationStep(3), 3800),
      setTimeout(() => setNegotiationStep(4), 5200),
      setTimeout(() => { setNegotiationStep(5); setAgreedRate(true) }, 6500),
    ]
    return () => timers.forEach(clearTimeout)
  }, [view])

  const isCustom = selectedPreset === null
  const selectedAmount = isCustom ? (parseFloat(customAmount) || 0) : (selectedPreset ?? 0)
  const displayAmount = selectedAmount > 0 ? selectedAmount : 0

  function handlePresetClick(value: number | null) {
    setSelectedPreset(value)
    if (value !== null) setCustomAmount('')
  }

  function handleSend() {
    if (sendState !== 'idle' || displayAmount === 0) return

    setSendState('processing')

    setTimeout(() => {
      setSendState('sent')
      setTimeout(() => {
        onPaymentSent({ amount: displayAmount, company: companyName })
      }, 1000)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col gap-5">

        {/* Header */}
        <div className="flex flex-col gap-1">
          <button
            onClick={view === 'payment' ? () => setView('agent') : onBack}
            className="flex items-center gap-1.5 text-subtle text-sm hover:text-text transition-colors w-fit mb-1"
          >
            <span className="text-base leading-none">←</span>
            <span>{view === 'payment' ? 'Back to negotiation' : 'Back'}</span>
          </button>
          <h1 className="text-2xl font-bold text-text tracking-tight">
            {view === 'agent' ? 'Company Agent' : 'Send Payment'}
          </h1>
          <p className="text-subtle text-sm">
            {view === 'agent' ? 'Your AI agent negotiates the fair rate' : 'Pay your team fairly, instantly, for less'}
          </p>
        </div>

        {/* ═══ AGENT NEGOTIATION VIEW ═══ */}
        {view === 'agent' && (
          <div className="flex flex-col gap-4">

            {/* Company agent config */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: '#3B5BDB', color: '#F5F0EB' }}>🏢</div>
                <div>
                  <p className="font-bold text-text">Your Company Agent</p>
                  <p className="text-subtle text-xs">Representing Acme Corp</p>
                </div>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-subtle">Budget range</span>
                  <span className="text-text font-semibold">$300 – $600</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-subtle">Target rate</span>
                  <span className="text-text font-semibold">$400/hr</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-subtle">Scope</span>
                  <span className="text-text font-semibold">UX Redesign, 3 weeks</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-subtle">Goal</span>
                  <span className="font-semibold" style={{ color: '#0A7A54' }}>Fair Pay Badge ✓</span>
                </div>
              </div>
            </div>

            {/* VS divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border"></div>
              <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#FF6B55', color: '#FFF5F0' }}>
                negotiating...
              </div>
              <div className="h-px flex-1 bg-border"></div>
            </div>

            {/* Worker agent (the other side) */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: '#FF6B55', color: '#FFF5F0' }}>👩‍💻</div>
                <div>
                  <p className="font-bold text-text">Worker Agent</p>
                  <p className="text-subtle text-xs">Representing Daniela Reyes</p>
                </div>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-subtle">Minimum rate</span>
                  <span className="text-text font-semibold">$450/hr</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-subtle">Ideal rate</span>
                  <span className="text-text font-semibold">$550/hr</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-subtle">Experience</span>
                  <span className="text-text font-semibold">UX Design, 4 years</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-subtle">Rule</span>
                  <span className="text-text font-semibold italic">"Never below market"</span>
                </div>
              </div>
            </div>

            {/* Negotiation log — appears step by step */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <p className="text-xs font-semibold text-subtle uppercase tracking-wider mb-3">Negotiation log</p>
              <div className="space-y-2.5">
                {negotiationStep >= 1 && (
                  <div className="flex items-start gap-2 text-sm animate-fade-in" style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5" style={{ background: '#3B5BDB', color: '#F5F0EB' }}>C</span>
                    <span className="text-subtle">Company proposes <strong className="text-text">$400/hr</strong></span>
                  </div>
                )}
                {negotiationStep >= 2 && (
                  <div className="flex items-start gap-2 text-sm" style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5" style={{ background: '#FF6B55', color: '#FFF5F0' }}>W</span>
                    <span className="text-subtle">Worker counters <strong className="text-text">$550/hr</strong> — cites market data ($450-650 range)</span>
                  </div>
                )}
                {negotiationStep >= 3 && (
                  <div className="flex items-start gap-2 text-sm" style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5" style={{ background: '#3B5BDB', color: '#F5F0EB' }}>C</span>
                    <span className="text-subtle">Company adjusts to <strong className="text-text">$480/hr</strong> — within budget, seeking Badge</span>
                  </div>
                )}
                {negotiationStep >= 4 && (
                  <div className="flex items-start gap-2 text-sm" style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5" style={{ background: '#FF6B55', color: '#FFF5F0' }}>W</span>
                    <span className="text-subtle">Worker accepts <strong className="text-text">$500/hr</strong> — median market, above minimum</span>
                  </div>
                )}
                {negotiationStep >= 5 && (
                  <div className="flex items-start gap-2 text-sm" style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5" style={{ background: '#0A7A54', color: '#FFF' }}>✓</span>
                    <span style={{ color: '#0A7A54' }} className="font-semibold">Agreement: $500/hr — Fair Pay Badge verified</span>
                  </div>
                )}
                {negotiationStep < 5 && (
                  <div className="flex items-center gap-2 text-sm text-subtle">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-coral animate-pulse"></span>
                    Agents negotiating...
                  </div>
                )}
              </div>
            </div>

            {/* Agreement result + proceed button */}
            {agreedRate && (
              <div style={{ animation: 'fadeSlideIn 0.4s ease-out' }}>
                <div className="bg-card border-2 rounded-2xl p-5 text-center mb-4" style={{ borderColor: '#2DD4A0' }}>
                  <p className="text-xs text-subtle uppercase tracking-widest mb-1">Agreed rate</p>
                  <p className="text-4xl font-black" style={{ color: '#0A7A54' }}>$500/hr</p>
                  <p className="text-sm text-subtle mt-2">3 weeks × 40hrs = <strong className="text-text">$1,500 total</strong></p>
                  <div className="mt-3 flex flex-wrap gap-2 justify-center">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: '#2DD4A0', color: '#0A0A0A' }}>Within market ✓</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: '#2DD4A0', color: '#0A0A0A' }}>Within budget ✓</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: '#2DD4A0', color: '#0A0A0A' }}>Fair Pay Badge ✓</span>
                  </div>
                </div>
                <button
                  onClick={() => setView('payment')}
                  className="w-full py-4 rounded-2xl bg-coral text-white font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
                  style={{ boxShadow: '0 8px 32px rgba(255,107,85,0.35)' }}
                >
                  Proceed to Payment →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ═══ PAYMENT VIEW ═══ */}
        {view === 'payment' && (<div className="flex flex-col gap-5">

        {/* Company Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-subtle uppercase tracking-wider">From</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="bg-card border border-border rounded-xl px-4 py-3 text-text text-sm font-medium outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral transition-all"
            placeholder="Company name"
          />
        </div>

        {/* Worker Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-subtle uppercase tracking-wider">To</label>
          <div className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-coral flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            {/* Worker Info */}
            <div className="flex-1 min-w-0">
              <p className="text-text text-sm font-semibold leading-tight">Daniela Reyes</p>
              <p className="text-subtle text-xs mt-0.5">UX Designer • Mexico City</p>
            </div>
            {/* Fair Pay Badge */}
            <span className="shrink-0 bg-green/10 text-green-text text-xs font-semibold px-2.5 py-1 rounded-full">
              Fair Pay Verified ✓
            </span>
          </div>
        </div>

        {/* Amount Selection */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-semibold text-subtle uppercase tracking-wider">Amount (USD)</label>

          {/* Preset Pills */}
          <div className="grid grid-cols-4 gap-2">
            {PRESETS.map((preset) => {
              const active = preset.value === selectedPreset
              return (
                <button
                  key={preset.label}
                  onClick={() => handlePresetClick(preset.value)}
                  className={`
                    flex flex-col items-center py-3 px-1 rounded-xl border text-center transition-all duration-150
                    ${active
                      ? 'bg-coral border-coral text-white shadow-sm'
                      : 'bg-card border-border text-text hover:border-coral/50 hover:bg-track'
                    }
                  `}
                >
                  <span className={`text-sm font-bold leading-tight ${active ? 'text-white' : 'text-text'}`}>
                    {preset.value !== null ? `$${preset.value.toLocaleString()}` : 'Custom'}
                  </span>
                  <span className={`text-xs mt-0.5 ${active ? 'text-white/80' : 'text-subtle'}`}>
                    {preset.label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Custom Input — smooth reveal */}
          <div
            className={`overflow-hidden transition-all duration-200 ${isCustom ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="relative mt-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle font-semibold">$</span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-card border border-border rounded-xl pl-8 pr-4 py-3 text-text text-sm font-medium outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral transition-all"
                autoFocus={isCustom}
              />
            </div>
          </div>

          {/* Large Amount Display */}
          <div className="flex flex-col items-center py-4">
            <span
              className="text-5xl font-bold tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #FF6B55 0%, #FFCD38 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ${displayAmount.toLocaleString()}
            </span>
            <p className="text-green-text text-xs font-medium mt-2">
              Fee: $0.007 • Arrives in &lt; 30 seconds
            </p>
          </div>
        </div>

        {/* Payment Summary Card */}
        <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-2.5 shadow-sm">
          <h3 className="text-xs font-semibold text-subtle uppercase tracking-wider mb-0.5">Payment Summary</h3>

          {[
            { label: 'From', value: companyName || '—' },
            { label: 'To', value: 'Daniela Reyes' },
            { label: 'Amount', value: `$${displayAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
            { label: 'Network', value: 'Solana (USDC)' },
            { label: 'Estimated fee', value: '$0.007' },
            { label: 'Time', value: '< 30 seconds' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-subtle text-sm">{label}</span>
              <span className="text-text text-sm font-medium">{value}</span>
            </div>
          ))}

          <div className="border-t border-border my-0.5" />

          <div className="flex items-start gap-2">
            <span className="text-green-text text-xs font-semibold mt-0.5">✓</span>
            <p className="text-green-text text-xs font-medium leading-relaxed">
              Fair Pay Badge: Within market range ($450–650/project)
            </p>
          </div>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={sendState !== 'idle' || displayAmount === 0}
          className={`
            w-full py-4 rounded-2xl font-bold text-base transition-all duration-200
            ${sendState === 'sent'
              ? 'bg-green/20 text-green-text'
              : sendState === 'processing'
              ? 'bg-coral/80 text-white cursor-not-allowed'
              : displayAmount === 0
              ? 'bg-track text-subtle cursor-not-allowed'
              : 'bg-coral text-white hover:opacity-90 active:scale-[0.98] shadow-sm'
            }
          `}
        >
          {sendState === 'sent' && (
            <span className="flex items-center justify-center gap-2">
              <span>✓ Sent!</span>
            </span>
          )}
          {sendState === 'processing' && (
            <span className="flex items-center justify-center gap-2">
              <Spinner />
              <span>Processing...</span>
            </span>
          )}
          {sendState === 'idle' && (
            <span>Send ${displayAmount.toLocaleString()} →</span>
          )}
        </button>

        {/* Footer */}
        <p className="text-center text-subtle text-xs pb-4">
          Powered by Solana • &lt;$0.01 fees • Settlement in seconds
        </p>

        </div>)}

      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}
