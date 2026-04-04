interface Props {
  onNavigate: (page: 'landing' | 'company' | 'worker') => void
}

export default function Landing({ onNavigate }: Props) {
  return (
    <div className="min-h-screen bg-bg font-sans text-text overflow-x-hidden">

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 py-20 text-center">

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(255,107,85,0.10) 0%, transparent 70%)',
          }}
        />

        {/* Wordmark */}
        <h1
          className="relative text-[clamp(5rem,18vw,11rem)] font-black leading-none tracking-tight mb-6"
          style={{
            background: 'linear-gradient(135deg, #FF6B55 0%, #FFCD38 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          DAIMA
        </h1>

        {/* Tagline */}
        <p className="relative text-[clamp(1rem,2.5vw,1.4rem)] font-semibold text-text mb-3 tracking-tight max-w-lg">
          AI agents that negotiate fair pay for workers and companies.
        </p>

        {/* One-liner */}
        <p className="relative max-w-lg text-[clamp(1rem,2vw,1.15rem)] text-subtle leading-relaxed mb-10">
          Negotiate fair. Get paid faster. Keep more.
        </p>

        {/* CTAs */}
        <div className="relative flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => onNavigate('company')}
            className="px-8 py-4 rounded-2xl bg-coral text-white font-bold text-lg shadow-lg
                       hover:scale-105 hover:shadow-xl active:scale-95
                       transition-all duration-200"
            style={{ boxShadow: '0 8px 32px rgba(255,107,85,0.35)' }}
          >
            For Companies
          </button>
          <button
            onClick={() => onNavigate('worker')}
            className="px-8 py-4 rounded-2xl border-2 border-coral text-coral-text font-bold text-lg bg-transparent
                       hover:scale-105 hover:bg-coral hover:text-white active:scale-95
                       transition-all duration-200"
          >
            For Workers
          </button>
        </div>

        {/* Sticky notes — fun, tilted, floating */}
        <div className="relative flex gap-4 flex-wrap justify-center">
          <div
            className="px-4 py-2 rounded-lg text-sm font-semibold shadow-md"
            style={{ background: '#FFCD38', color: '#1A1815', transform: 'rotate(-2deg)' }}
          >
            🌎 LATAM
          </div>
          <div
            className="px-4 py-2 rounded-lg text-sm font-semibold shadow-md"
            style={{ background: '#FF6B55', color: '#FFF5F0', transform: 'rotate(1.5deg)' }}
          >
            🌍 Africa
          </div>
          <div
            className="px-4 py-2 rounded-lg text-sm font-semibold shadow-md"
            style={{ background: '#3B5BDB', color: '#F5F0EB', transform: 'rotate(-1deg)' }}
          >
            🌏 South Asia
          </div>
          <div
            className="px-4 py-2 rounded-lg text-sm font-semibold shadow-md border border-border"
            style={{ background: '#FFFFFF', color: '#8A7A6A', transform: 'rotate(2deg)' }}
          >
            for remote workers & companies
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-subtle text-xs animate-bounce">
          <span>scroll</span>
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16" className="opacity-60">
            <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>

      {/* ─── Two Sides ────────────────────────────────────────────────────── */}
      <section className="px-6 py-24 bg-track">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-subtle uppercase tracking-widest text-sm font-semibold mb-3">
            Two sides, one fair deal
          </p>
          <h2 className="text-center text-[clamp(1.75rem,4vw,2.5rem)] font-black text-text mb-4 leading-tight">
            Your AI agent negotiates for you.
          </h2>
          <p className="text-center text-subtle max-w-2xl mx-auto mb-14 text-[clamp(0.9rem,1.5vw,1.05rem)] leading-relaxed">
            Salary negotiations fail because of emotions. Daima turns them into data-driven conversations between agents that find fair agreements for both sides.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Worker side */}
            <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: '#FF6B55', color: '#FFF5F0' }}>👩‍💻</div>
                <div>
                  <p className="font-bold text-text text-lg">Worker Agent</p>
                  <p className="text-subtle text-sm">Represents Daniela</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: '#2DD4A0', color: '#0A0A0A' }}>✓</span>
                  <span className="text-text">Minimum rate: <strong>$450/hr</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: '#2DD4A0', color: '#0A0A0A' }}>✓</span>
                  <span className="text-text">Ideal rate: <strong>$550/hr</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: '#2DD4A0', color: '#0A0A0A' }}>✓</span>
                  <span className="text-text">Rule: <em>"Never below market rate"</em></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: '#2DD4A0', color: '#0A0A0A' }}>✓</span>
                  <span className="text-text">Auto-distribute: savings, expenses, BTC</span>
                </div>
              </div>
            </div>

            {/* Company side */}
            <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: '#3B5BDB', color: '#F5F0EB' }}>🏢</div>
                <div>
                  <p className="font-bold text-text text-lg">Company Agent</p>
                  <p className="text-subtle text-sm">Represents Acme Corp</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: '#3B5BDB', color: '#F5F0EB' }}>✓</span>
                  <span className="text-text">Budget range: <strong>$300–600/hr</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: '#3B5BDB', color: '#F5F0EB' }}>✓</span>
                  <span className="text-text">Target rate: <strong>$400/hr</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: '#3B5BDB', color: '#F5F0EB' }}>✓</span>
                  <span className="text-text">Goal: <em>"Fair Pay Badge for employer branding"</em></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: '#3B5BDB', color: '#F5F0EB' }}>✓</span>
                  <span className="text-text">Scope: UX redesign, 3 weeks</span>
                </div>
              </div>
            </div>
          </div>

          {/* Negotiation result */}
          <div className="max-w-lg mx-auto">
            <div className="flex items-center gap-3 mb-4 justify-center">
              <div className="h-px flex-1 bg-border"></div>
              <div className="px-4 py-2 rounded-full text-sm font-bold" style={{ background: '#FF6B55', color: '#FFF5F0' }}>
                Agent ←→ Agent
              </div>
              <div className="h-px flex-1 bg-border"></div>
            </div>

            <div className="bg-card rounded-2xl p-6 border-2 shadow-lg text-center" style={{ borderColor: '#2DD4A0' }}>
              <p className="text-sm text-subtle uppercase tracking-widest mb-2">Agreement reached</p>
              <p className="text-4xl font-black mb-3" style={{ color: '#0A7A54' }}>$500/hr</p>
              <div className="space-y-1 text-sm text-subtle">
                <p>✅ Within market range for UX Design (4 yrs exp)</p>
                <p>✅ Within company budget ($300–600)</p>
                <p>✅ Above worker minimum ($450)</p>
                <p className="font-bold" style={{ color: '#0A7A54' }}>✅ Fair Pay Badge: Verified</p>
              </div>
              <p className="mt-4 text-xs text-subtle italic">No awkward conversations. No lowballing. Just data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Problem ──────────────────────────────────────────────────────── */}
      <section className="px-6 py-24 bg-bg">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-subtle uppercase tracking-widest text-sm font-semibold mb-3">
            The problem today
          </p>
          <h2 className="text-center text-[clamp(1.75rem,4vw,2.5rem)] font-black text-text mb-12 leading-tight">
            The system is broken for everyone.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <p className="text-5xl font-black mb-3" style={{ color: '#FF6B55' }}>5–8%</p>
              <p className="text-text font-semibold mb-2 text-lg leading-snug">lost on every payment.</p>
              <p className="text-subtle text-sm leading-relaxed">Workers lose $7,200/year in fees. Companies waste hours on compliance. Both sides pay for a broken system.</p>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <p className="text-5xl font-black mb-3" style={{ color: '#FF6B55' }}>20–40%</p>
              <p className="text-text font-semibold mb-2 text-lg leading-snug">below market rate.</p>
              <p className="text-subtle text-sm leading-relaxed">Workers don't know their worth. Companies can't prove they pay fairly. Information asymmetry hurts both.</p>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <p className="text-5xl font-black mb-3" style={{ color: '#FF6B55' }}>63%</p>
              <p className="text-text font-semibold mb-2 text-lg leading-snug">wait 30+ days to get paid.</p>
              <p className="text-subtle text-sm leading-relaxed">Late payments hurt retention. Instant settlement means happier talent that stays longer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────────────────────────── */}
      <section className="px-6 py-24 bg-track">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-subtle uppercase tracking-widest text-sm font-semibold mb-3">
            How it works
          </p>
          <h2 className="text-center text-[clamp(1.75rem,4vw,2.5rem)] font-black text-text mb-16 leading-tight">
            Three steps. Zero friction.
          </h2>

          <div className="relative flex flex-col md:flex-row items-start gap-10 md:gap-0">
            <div
              className="hidden md:block absolute top-10 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-0.5"
              style={{ background: 'linear-gradient(90deg, #FF6B55, #FFCD38, #FF6B55)' }}
            />

            <div className="flex-1 flex flex-col items-center text-center px-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-black mb-6 shadow-lg flex-shrink-0 z-10"
                style={{ background: 'linear-gradient(135deg, #FF6B55, #ff8f7a)', boxShadow: '0 8px 24px rgba(255,107,85,0.35)' }}
              >1</div>
              <h3 className="text-xl font-bold text-text mb-2">Agents negotiate</h3>
              <p className="text-subtle text-sm leading-relaxed max-w-xs">
                Worker and company set their rules. AI agents find the fair rate — no awkward conversations.
              </p>
            </div>

            <div className="flex-1 flex flex-col items-center text-center px-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-black mb-6 shadow-lg flex-shrink-0 z-10"
                style={{ background: 'linear-gradient(135deg, #e06040, #FF6B55)', boxShadow: '0 8px 24px rgba(255,107,85,0.35)' }}
              >2</div>
              <h3 className="text-xl font-bold text-text mb-2">Payment arrives instantly</h3>
              <p className="text-subtle text-sm leading-relaxed max-w-xs">
                Digital dollars via Solana. Savings move to Bitcoin via Lightning. Fee: &lt; $0.01.
              </p>
            </div>

            <div className="flex-1 flex flex-col items-center text-center px-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-black mb-6 shadow-lg flex-shrink-0 z-10"
                style={{ background: 'linear-gradient(135deg, #c04a1a, #e06040)', boxShadow: '0 8px 24px rgba(255,107,85,0.35)' }}
              >3</div>
              <h3 className="text-xl font-bold text-text mb-2">Money works for you</h3>
              <p className="text-subtle text-sm leading-relaxed max-w-xs">
                Auto-distribute to savings, expenses, investments. Your AI ally manages it all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Waitlist ────────────────────────────────────────────────────── */}
      <section className="px-6 py-24 bg-track">
        <div className="max-w-xl mx-auto text-center">
          <h2
            className="text-[clamp(1.75rem,4vw,2.5rem)] font-black leading-tight mb-3"
            style={{
              background: 'linear-gradient(135deg, #FF6B55 0%, #FFCD38 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Get early access
          </h2>
          <p className="text-subtle text-sm leading-relaxed mb-8">
            Join the waitlist — be the first to try Daima when we launch.
          </p>

          <form name="waitlist" method="POST" data-netlify="true" className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4">
            <input type="hidden" name="form-name" value="waitlist" />
            <input
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              className="flex-1 px-5 py-4 rounded-2xl bg-card border border-border text-text text-sm font-medium outline-none focus:border-coral transition-all"
            />
            <button
              type="submit"
              className="px-8 py-4 rounded-2xl text-white font-bold text-sm whitespace-nowrap transition-all hover:scale-105 active:scale-95"
              style={{ background: '#FF6B55', boxShadow: '0 8px 24px rgba(255,107,85,0.35)' }}
            >
              Join Waitlist →
            </button>
          </form>
          <p className="text-subtle text-xs">No spam. We'll notify you when Daima is ready.</p>
        </div>
      </section>

      {/* ─── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="px-6 py-28 bg-bg text-center">
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-tight mb-6"
            style={{
              background: 'linear-gradient(135deg, #FF6B55 0%, #FFCD38 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Fair pay, everywhere.
          </h2>

          <p className="text-subtle text-lg leading-relaxed mb-10">
            For the 1.5 billion remote workers the financial system forgot.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <button
              onClick={() => onNavigate('company')}
              className="px-10 py-5 rounded-2xl bg-coral text-white font-black text-xl
                         hover:scale-105 hover:shadow-2xl active:scale-95
                         transition-all duration-200"
              style={{ boxShadow: '0 12px 40px rgba(255,107,85,0.40)' }}
            >
              Try the demo →
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="px-3 py-1 rounded-full bg-card border border-border text-subtle text-xs">Solana + USDC</span>
            <span className="px-3 py-1 rounded-full bg-card border border-border text-subtle text-xs">Bitcoin + Lightning</span>
            <span className="px-3 py-1 rounded-full bg-card border border-border text-subtle text-xs">Open Wallet Standard</span>
            <span className="px-3 py-1 rounded-full bg-card border border-border text-subtle text-xs">OWS Hackathon 2026</span>
          </div>

          <p className="text-subtle text-sm italic leading-relaxed max-w-md mx-auto">
            "Daima — from the Quimbaya, master goldsmiths of Colombia who understood the true value of what they crafted."
          </p>
        </div>
      </section>

    </div>
  )
}
