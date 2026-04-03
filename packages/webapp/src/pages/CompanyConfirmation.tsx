import { useState, useEffect } from 'react'

interface Props {
  payment: { amount: number; company: string } | null
  onBack: () => void
}

export default function CompanyConfirmation({ payment, onBack }: Props) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 500),
      setTimeout(() => setStep(2), 1200),
      setTimeout(() => setStep(3), 1900),
      setTimeout(() => setStep(4), 2600),
      setTimeout(() => setStep(5), 3400),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const amount = payment?.amount ?? 500
  const company = payment?.company ?? 'Acme Corp'

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col gap-5">

        {/* Header */}
        <div className="flex flex-col items-center text-center pt-8">
          {/* Animated check */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-4 transition-all duration-500"
            style={{
              background: step >= 1 ? '#2DD4A0' : '#EDE8E0',
              color: step >= 1 ? '#0A0A0A' : '#8A7A6A',
              transform: step >= 1 ? 'scale(1)' : 'scale(0.8)',
            }}
          >
            {step >= 1 ? '✓' : '...'}
          </div>
          <h1 className="text-2xl font-bold text-text tracking-tight mb-1">
            {step >= 1 ? 'Payment Confirmed' : 'Processing...'}
          </h1>
          <p className="text-subtle text-sm">
            ${amount.toLocaleString()} to Daniela Reyes
          </p>
        </div>

        {/* Status checklist */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-3 transition-all duration-300" style={{ opacity: step >= 1 ? 1 : 0.3 }}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: step >= 1 ? '#2DD4A0' : '#EDE8E0', color: step >= 1 ? '#0A0A0A' : '#8A7A6A' }}>✓</span>
              <span className="text-sm text-text font-medium">Payment sent via Solana (USDC)</span>
            </div>
            <div className="flex items-center gap-3 transition-all duration-300" style={{ opacity: step >= 2 ? 1 : 0.3 }}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: step >= 2 ? '#2DD4A0' : '#EDE8E0', color: step >= 2 ? '#0A0A0A' : '#8A7A6A' }}>✓</span>
              <span className="text-sm text-text font-medium">Daniela has been notified</span>
            </div>
            <div className="flex items-center gap-3 transition-all duration-300" style={{ opacity: step >= 3 ? 1 : 0.3 }}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: step >= 3 ? '#2DD4A0' : '#EDE8E0', color: step >= 3 ? '#0A0A0A' : '#8A7A6A' }}>✓</span>
              <span className="text-sm text-text font-medium">Fair Pay Badge — verified & active</span>
            </div>
            <div className="flex items-center gap-3 transition-all duration-300" style={{ opacity: step >= 4 ? 1 : 0.3 }}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: step >= 4 ? '#2DD4A0' : '#EDE8E0', color: step >= 4 ? '#0A0A0A' : '#8A7A6A' }}>✓</span>
              <span className="text-sm text-text font-medium">Monthly payments — auto-scheduled</span>
            </div>
          </div>
        </div>

        {/* Agent handling details */}
        {step >= 5 && (
          <div className="flex flex-col gap-4" style={{ animation: 'fadeSlideIn 0.4s ease-out' }}>

            {/* What agent handles */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm" style={{ borderLeft: '3px solid #3B5BDB' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: '#3B5BDB', color: '#F5F0EB' }}>🤖</div>
                <p className="text-sm font-bold text-text">Your agent takes it from here</p>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2 text-sm">
                  <span style={{ color: '#3B5BDB' }}>→</span>
                  <span className="text-subtle">Onboarding docs sent to Daniela</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span style={{ color: '#3B5BDB' }}>→</span>
                  <span className="text-subtle">Recurring payments on the 1st of each month</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span style={{ color: '#3B5BDB' }}>→</span>
                  <span className="text-subtle">Milestone tracking for the UX redesign project</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span style={{ color: '#3B5BDB' }}>→</span>
                  <span className="text-subtle">You'll be notified 24hrs before each payment</span>
                </div>
              </div>
            </div>

            {/* Payment summary */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-semibold text-subtle uppercase tracking-wider mb-3">Payment details</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-subtle">From</span>
                  <span className="text-text font-medium">{company}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-subtle">To</span>
                  <span className="text-text font-medium">Daniela Reyes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-subtle">Amount</span>
                  <span className="text-text font-medium">${amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-subtle">Fee</span>
                  <span style={{ color: '#0A7A54' }} className="font-medium">$0.007</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-subtle">Settlement</span>
                  <span style={{ color: '#0A7A54' }} className="font-medium">&lt; 30 seconds</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-subtle">Network</span>
                  <span className="text-text font-medium">Solana (USDC)</span>
                </div>
              </div>
              <div className="border-t border-border mt-3 pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-subtle">PayPal would charge</span>
                  <span className="text-subtle line-through">${(amount * 0.039 + 0.30).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="font-semibold" style={{ color: '#0A7A54' }}>You saved</span>
                  <span className="font-bold" style={{ color: '#0A7A54' }}>${(amount * 0.039 + 0.30 - 0.007).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Back button */}
            <button
              onClick={onBack}
              className="w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-[0.98]"
              style={{ background: '#FFFFFF', color: '#1A1815', border: '1px solid #E0D8CC' }}
            >
              Back to Dashboard
            </button>

            <p className="text-center text-xs text-subtle">
              Daima — your AI financial ally
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
