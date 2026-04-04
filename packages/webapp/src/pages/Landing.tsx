import { useState } from 'react'

interface Props {
  onNavigate: (page: 'landing' | 'company' | 'worker') => void
}

export default function Landing({ onNavigate }: Props) {
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [waitlistSent, setWaitlistSent] = useState(false)
  const [lang, setLang] = useState<'en' | 'es'>('en')

  const t = {
    en: {
      badge: 'Agent ←→ Agent',
      tagline: 'AI agents that negotiate fair pay for workers and companies.',
      oneliner: 'Negotiate fair. Get paid faster. Keep more.',
      forCompanies: 'For Companies',
      forWorkers: 'For Workers',
      latam: '🌎 LATAM',
      africa: '🌍 Africa',
      southAsia: '🌏 South Asia',
      forBoth: 'for remote workers & companies',
      twoSidesLabel: 'Two sides, one fair deal',
      twoSidesTitle: 'Your AI agent negotiates for you.',
      twoSidesDesc: 'Salary negotiations fail because of emotions. Daima turns them into data-driven conversations between agents that find fair agreements for both sides.',
      workerAgent: 'Worker Agent',
      represents: 'Represents',
      companyAgent: 'Company Agent',
      minRate: 'Minimum rate',
      idealRate: 'Ideal rate',
      rule: 'Rule',
      autoDistribute: 'Auto-distribute: savings, expenses, BTC',
      budgetRange: 'Budget range',
      targetRate: 'Target rate',
      goal: 'Goal',
      scope: 'Scope',
      neverBelowMarket: '"Never below market rate"',
      fairPayBadge: '"Fair Pay Badge for employer branding"',
      uxRedesign: 'UX Redesign, 3 weeks',
      negotiating: 'negotiating...',
      agreementReached: 'Agreement reached',
      withinMarket: 'Within market range for UX Design (4 yrs exp)',
      withinBudget: 'Within company budget ($300-600)',
      aboveMinimum: 'Above worker minimum ($450)',
      fairPayVerified: 'Fair Pay Badge: Verified',
      noAwkward: 'No awkward conversations. No lowballing. Just data.',
      problemLabel: 'The problem today',
      problemTitle: 'The system is broken for everyone.',
      stat1: '5-8%',
      stat1desc: 'lost on every payment.',
      stat1detail: 'Workers lose $7,200/year in fees. Companies waste hours on compliance. Both sides pay for a broken system.',
      stat2: '20-40%',
      stat2desc: 'below market rate.',
      stat2detail: "Workers don't know their worth. Companies can't prove they pay fairly. Information asymmetry hurts both.",
      stat3: '63%',
      stat3desc: 'wait 30+ days to get paid.',
      stat3detail: 'Late payments hurt retention. Instant settlement means happier talent that stays longer.',
      howLabel: 'How it works',
      howTitle: 'Three steps. Zero friction.',
      step1title: 'Agents negotiate',
      step1desc: 'Worker and company set their rules. AI agents find the fair rate. No awkward conversations.',
      step2title: 'Payment arrives instantly',
      step2desc: 'Digital dollars via Solana. Savings move to Bitcoin via Lightning. Fee: < $0.01.',
      step3title: 'Money works for you',
      step3desc: 'Auto-distribute to savings, expenses, investments. Your AI ally manages it all.',
      waitlistTitle: 'Get early access',
      waitlistDesc: 'Join the waitlist. Be the first to try Daima when we launch.',
      waitlistPlaceholder: 'your@email.com',
      waitlistBtn: 'Join Waitlist →',
      waitlistNote: "No spam. We'll notify you when Daima is ready.",
      waitlistPopupTitle: "Be part of what's next",
      waitlistPopupDesc: 'Whether you hire or get hired. Daima is building for you.',
      waitlistPopupBtn: 'Count me in →',
      waitlistPopupNote: 'No spam, ever.',
      waitlistSuccess: "You're on the list!",
      waitlistSuccessDesc: "We'll reach out when Daima is ready for you.",
      waitlistSuccessBtn: 'Back to the demo →',
      bottomTitle: 'Fair pay, everywhere.',
      bottomDesc: 'For the 1.5 billion remote workers the financial system forgot.',
      tryDemo: 'Try the demo →',
      quimbaya: '"Daima. From the Quimbaya, master goldsmiths of Colombia who understood the true value of what they crafted."',
      getEarlyAccess: 'Get Early Access',
    },
    es: {
      badge: 'Agente ←→ Agente',
      tagline: 'Agentes de IA que negocian pago justo para trabajadores y empresas.',
      oneliner: 'Negocia justo. Cobra más rápido. Conserva más.',
      forCompanies: 'Para Empresas',
      forWorkers: 'Para Trabajadores',
      latam: '🌎 LATAM',
      africa: '🌍 África',
      southAsia: '🌏 Sur de Asia',
      forBoth: 'para trabajadores remotos y empresas',
      twoSidesLabel: 'Dos lados, un acuerdo justo',
      twoSidesTitle: 'Tu agente de IA negocia por ti.',
      twoSidesDesc: 'Las negociaciones de salario fallan por las emociones. Daima las convierte en conversaciones entre agentes basadas en datos que encuentran acuerdos justos para ambos.',
      workerAgent: 'Agente del Trabajador',
      represents: 'Representa a',
      companyAgent: 'Agente de la Empresa',
      minRate: 'Tarifa mínima',
      idealRate: 'Tarifa ideal',
      rule: 'Regla',
      autoDistribute: 'Auto-distribuir: ahorro, gastos, BTC',
      budgetRange: 'Rango de presupuesto',
      targetRate: 'Tarifa objetivo',
      goal: 'Meta',
      scope: 'Alcance',
      neverBelowMarket: '"Nunca por debajo del mercado"',
      fairPayBadge: '"Fair Pay Badge para employer branding"',
      uxRedesign: 'Rediseño UX, 3 semanas',
      negotiating: 'negociando...',
      agreementReached: 'Acuerdo alcanzado',
      withinMarket: 'Dentro del rango de mercado para Diseño UX (4 años exp)',
      withinBudget: 'Dentro del presupuesto ($300-600)',
      aboveMinimum: 'Arriba del mínimo del trabajador ($450)',
      fairPayVerified: 'Fair Pay Badge: Verificado',
      noAwkward: 'Sin conversaciones incómodas. Sin abusos. Solo datos.',
      problemLabel: 'El problema hoy',
      problemTitle: 'El sistema está roto para todos.',
      stat1: '5-8%',
      stat1desc: 'perdido en cada pago.',
      stat1detail: 'Los trabajadores pierden $7,200/año en comisiones. Las empresas gastan horas en compliance. Ambos pagan por un sistema roto.',
      stat2: '20-40%',
      stat2desc: 'por debajo del mercado.',
      stat2detail: 'Los trabajadores no saben cuánto valen. Las empresas no pueden probar que pagan justo. La asimetría de información daña a ambos.',
      stat3: '63%',
      stat3desc: 'esperan 30+ días por su pago.',
      stat3detail: 'Los pagos tardíos afectan la retención. El pago instantáneo significa talento más feliz que se queda más tiempo.',
      howLabel: 'Cómo funciona',
      howTitle: 'Tres pasos. Cero fricción.',
      step1title: 'Los agentes negocian',
      step1desc: 'Trabajador y empresa ponen sus reglas. Los agentes encuentran la tarifa justa. Sin conversaciones incómodas.',
      step2title: 'El pago llega al instante',
      step2desc: 'Dólares digitales vía Solana. Ahorros se mueven a Bitcoin vía Lightning. Comisión: < $0.01.',
      step3title: 'Tu dinero trabaja para ti',
      step3desc: 'Auto-distribuye a ahorro, gastos e inversiones. Tu aliado de IA lo maneja todo.',
      waitlistTitle: 'Acceso anticipado',
      waitlistDesc: 'Únete a la lista de espera. Sé el primero en probar Daima.',
      waitlistPlaceholder: 'tu@email.com',
      waitlistBtn: 'Unirme →',
      waitlistNote: 'Sin spam. Te avisamos cuando Daima esté listo.',
      waitlistPopupTitle: 'Sé parte de lo que viene',
      waitlistPopupDesc: 'Ya sea que contrates o te contraten, Daima se construye para ti.',
      waitlistPopupBtn: 'Quiero ser parte →',
      waitlistPopupNote: 'Sin spam, nunca.',
      waitlistSuccess: '¡Estás en la lista!',
      waitlistSuccessDesc: 'Te contactaremos cuando Daima esté listo.',
      waitlistSuccessBtn: 'Volver al demo →',
      bottomTitle: 'Pago justo, en todas partes.',
      bottomDesc: 'Para los 1,500 millones de trabajadores remotos que el sistema financiero olvidó.',
      tryDemo: 'Probar el demo →',
      quimbaya: '"Daima. De los Quimbaya, maestros orfebres de Colombia que entendían el verdadero valor de lo que creaban."',
      getEarlyAccess: 'Acceso Anticipado',
    },
  }[lang]

  function handleWaitlistSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!waitlistEmail) return
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ 'form-name': 'waitlist', email: waitlistEmail }).toString(),
    }).then(() => setWaitlistSent(true)).catch(() => setWaitlistSent(true))
  }
  return (
    <div className="min-h-screen bg-bg font-sans text-text overflow-x-hidden">

      {/* ─── Top Bar ──────────────────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4">
        <span className="text-lg font-bold text-text tracking-tight">DAIMA</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
            className="text-xs text-subtle hover:text-text transition-colors flex items-center gap-1"
          >
            🌐 {lang === 'en' ? 'ES' : 'EN'}
          </button>
          <button
            onClick={() => setShowWaitlist(true)}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95 border"
            style={{ borderColor: '#E0D8CC', color: '#1A1815', background: '#FFFFFF' }}
          >
            {t.getEarlyAccess}
          </button>
        </div>
      </div>

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 py-20 text-center">

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(255,107,85,0.10) 0%, transparent 70%)',
          }}
        />

        {/* Agent badge — tight to wordmark */}
        <div
          className="relative mb-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase border"
          style={{ borderColor: '#E0D8CC', color: '#8A7A6A', background: 'transparent' }}
        >
          {t.badge}
        </div>

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
          {t.tagline}
        </p>

        {/* One-liner */}
        <p className="relative max-w-lg text-[clamp(1rem,2vw,1.15rem)] text-subtle leading-relaxed mb-10">
          {t.oneliner}
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
            {t.forCompanies}
          </button>
          <button
            onClick={() => onNavigate('worker')}
            className="px-8 py-4 rounded-2xl border-2 border-coral text-coral-text font-bold text-lg bg-transparent
                       hover:scale-105 hover:bg-coral hover:text-white active:scale-95
                       transition-all duration-200"
          >
            {t.forWorkers}
          </button>
        </div>

        {/* Sticky notes — fun, tilted, floating */}
        <div className="relative flex gap-4 flex-wrap justify-center">
          <div
            className="px-4 py-2 rounded-lg text-sm font-semibold shadow-md"
            style={{ background: '#FFCD38', color: '#1A1815', transform: 'rotate(-2deg)' }}
          >
            {t.latam}
          </div>
          <div
            className="px-4 py-2 rounded-lg text-sm font-semibold shadow-md"
            style={{ background: '#FF6B55', color: '#FFF5F0', transform: 'rotate(1.5deg)' }}
          >
            {t.africa}
          </div>
          <div
            className="px-4 py-2 rounded-lg text-sm font-semibold shadow-md"
            style={{ background: '#3B5BDB', color: '#F5F0EB', transform: 'rotate(-1deg)' }}
          >
            {t.southAsia}
          </div>
          <div
            className="px-4 py-2 rounded-lg text-sm font-semibold shadow-md border border-border"
            style={{ background: '#FFFFFF', color: '#8A7A6A', transform: 'rotate(2deg)' }}
          >
            {t.forBoth}
          </div>
        </div>

        {/* Waitlist popup — sticker style */}
        {showWaitlist && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setShowWaitlist(false)}>
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            <div
              className="relative bg-card rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-border"
              style={{ animation: 'fadeSlideIn 0.3s ease-out', transform: 'rotate(-1deg)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {!waitlistSent ? (
                <>
                  <div className="text-4xl mb-3 text-center">✦</div>
                  <h3 className="text-xl font-bold text-text text-center mb-1">{t.waitlistPopupTitle}</h3>
                  <p className="text-sm text-subtle text-center mb-6">{t.waitlistPopupDesc}</p>
                  <form onSubmit={handleWaitlistSubmit} className="flex flex-col gap-3">
                    <input type="hidden" name="form-name" value="waitlist" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      placeholder={t.waitlistPlaceholder}
                      className="px-5 py-4 rounded-2xl bg-bg border border-border text-text text-sm font-medium outline-none focus:border-coral transition-all"
                    />
                    <button
                      type="submit"
                      className="px-8 py-4 rounded-2xl text-white font-bold text-sm transition-all hover:scale-105 active:scale-95"
                      style={{ background: '#FF6B55', boxShadow: '0 8px 24px rgba(255,107,85,0.35)' }}
                    >
                      {t.waitlistPopupBtn}
                    </button>
                  </form>
                  <p className="text-xs text-subtle text-center mt-3">{t.waitlistPopupNote}</p>
                </>
              ) : (
                <div className="text-center py-4" style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
                  <div className="text-5xl mb-3">🎉</div>
                  <h3 className="text-xl font-bold text-text mb-2">{t.waitlistSuccess}</h3>
                  <p className="text-sm text-subtle mb-4">{t.waitlistSuccessDesc}</p>
                  <button
                    onClick={() => setShowWaitlist(false)}
                    className="text-sm font-medium"
                    style={{ color: '#C04A1A' }}
                  >
                    {t.waitlistSuccessBtn}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

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
            {t.twoSidesLabel}
          </p>
          <h2 className="text-center text-[clamp(1.75rem,4vw,2.5rem)] font-black text-text mb-4 leading-tight">
            {t.twoSidesTitle}
          </h2>
          <p className="text-center text-subtle max-w-2xl mx-auto mb-14 text-[clamp(0.9rem,1.5vw,1.05rem)] leading-relaxed">
            {t.twoSidesDesc}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Worker side */}
            <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: '#FF6B55', color: '#FFF5F0' }}>👩‍💻</div>
                <div>
                  <p className="font-bold text-text text-lg">{t.workerAgent}</p>
                  <p className="text-subtle text-sm">{t.represents} Daniela</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: '#2DD4A0', color: '#0A0A0A' }}>✓</span>
                  <span className="text-text">{t.minRate}: <strong>$450/hr</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: '#2DD4A0', color: '#0A0A0A' }}>✓</span>
                  <span className="text-text">{t.idealRate}: <strong>$550/hr</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: '#2DD4A0', color: '#0A0A0A' }}>✓</span>
                  <span className="text-text">{t.rule}: <em>{t.neverBelowMarket}</em></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: '#2DD4A0', color: '#0A0A0A' }}>✓</span>
                  <span className="text-text">{t.autoDistribute}</span>
                </div>
              </div>
            </div>

            {/* Company side */}
            <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: '#3B5BDB', color: '#F5F0EB' }}>🏢</div>
                <div>
                  <p className="font-bold text-text text-lg">{t.companyAgent}</p>
                  <p className="text-subtle text-sm">{t.represents} Acme Corp</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: '#3B5BDB', color: '#F5F0EB' }}>✓</span>
                  <span className="text-text">{t.budgetRange}: <strong>$300–600/hr</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: '#3B5BDB', color: '#F5F0EB' }}>✓</span>
                  <span className="text-text">{t.targetRate}: <strong>$400/hr</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: '#3B5BDB', color: '#F5F0EB' }}>✓</span>
                  <span className="text-text">{t.goal}: <em>{t.fairPayBadge}</em></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: '#3B5BDB', color: '#F5F0EB' }}>✓</span>
                  <span className="text-text">{t.scope}: {t.uxRedesign}</span>
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
              <p className="text-sm text-subtle uppercase tracking-widest mb-2">{t.agreementReached}</p>
              <p className="text-4xl font-black mb-3" style={{ color: '#0A7A54' }}>$500/hr</p>
              <div className="space-y-1 text-sm text-subtle">
                <p>✅ {t.withinMarket}</p>
                <p>✅ {t.withinBudget}</p>
                <p>✅ {t.aboveMinimum}</p>
                <p className="font-bold" style={{ color: '#0A7A54' }}>✅ {t.fairPayVerified}</p>
              </div>
              <p className="mt-4 text-xs text-subtle italic">{t.noAwkward}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Problem ──────────────────────────────────────────────────────── */}
      <section className="px-6 py-24 bg-bg">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-subtle uppercase tracking-widest text-sm font-semibold mb-3">
            {t.problemLabel}
          </p>
          <h2 className="text-center text-[clamp(1.75rem,4vw,2.5rem)] font-black text-text mb-12 leading-tight">
            {t.problemTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <p className="text-5xl font-black mb-3" style={{ color: '#FF6B55' }}>{t.stat1}</p>
              <p className="text-text font-semibold mb-2 text-lg leading-snug">{t.stat1desc}</p>
              <p className="text-subtle text-sm leading-relaxed">{t.stat1detail}</p>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <p className="text-5xl font-black mb-3" style={{ color: '#FF6B55' }}>{t.stat2}</p>
              <p className="text-text font-semibold mb-2 text-lg leading-snug">{t.stat2desc}</p>
              <p className="text-subtle text-sm leading-relaxed">{t.stat2detail}</p>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <p className="text-5xl font-black mb-3" style={{ color: '#FF6B55' }}>{t.stat3}</p>
              <p className="text-text font-semibold mb-2 text-lg leading-snug">{t.stat3desc}</p>
              <p className="text-subtle text-sm leading-relaxed">{t.stat3detail}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────────────────────────── */}
      <section className="px-6 py-24 bg-track">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-subtle uppercase tracking-widest text-sm font-semibold mb-3">
            {t.howLabel}
          </p>
          <h2 className="text-center text-[clamp(1.75rem,4vw,2.5rem)] font-black text-text mb-16 leading-tight">
            {t.howTitle}
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
              <h3 className="text-xl font-bold text-text mb-2">{t.step1title}</h3>
              <p className="text-subtle text-sm leading-relaxed max-w-xs">
                {t.step1desc}
              </p>
            </div>

            <div className="flex-1 flex flex-col items-center text-center px-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-black mb-6 shadow-lg flex-shrink-0 z-10"
                style={{ background: 'linear-gradient(135deg, #e06040, #FF6B55)', boxShadow: '0 8px 24px rgba(255,107,85,0.35)' }}
              >2</div>
              <h3 className="text-xl font-bold text-text mb-2">{t.step2title}</h3>
              <p className="text-subtle text-sm leading-relaxed max-w-xs">
                {t.step2desc}
              </p>
            </div>

            <div className="flex-1 flex flex-col items-center text-center px-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-black mb-6 shadow-lg flex-shrink-0 z-10"
                style={{ background: 'linear-gradient(135deg, #c04a1a, #e06040)', boxShadow: '0 8px 24px rgba(255,107,85,0.35)' }}
              >3</div>
              <h3 className="text-xl font-bold text-text mb-2">{t.step3title}</h3>
              <p className="text-subtle text-sm leading-relaxed max-w-xs">
                {t.step3desc}
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
            {t.waitlistTitle}
          </h2>
          <p className="text-subtle text-sm leading-relaxed mb-8">
            {t.waitlistDesc}
          </p>

          <form name="waitlist" method="POST" data-netlify="true" className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4">
            <input type="hidden" name="form-name" value="waitlist" />
            <input
              type="email"
              name="email"
              required
              placeholder={t.waitlistPlaceholder}
              className="flex-1 px-5 py-4 rounded-2xl bg-card border border-border text-text text-sm font-medium outline-none focus:border-coral transition-all"
            />
            <button
              type="submit"
              className="px-8 py-4 rounded-2xl text-white font-bold text-sm whitespace-nowrap transition-all hover:scale-105 active:scale-95"
              style={{ background: '#FF6B55', boxShadow: '0 8px 24px rgba(255,107,85,0.35)' }}
            >
              {t.waitlistBtn}
            </button>
          </form>
          <p className="text-subtle text-xs">{t.waitlistNote}</p>
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
            {t.bottomTitle}
          </h2>

          <p className="text-subtle text-lg leading-relaxed mb-10">
            {t.bottomDesc}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <button
              onClick={() => onNavigate('company')}
              className="px-10 py-5 rounded-2xl bg-coral text-white font-black text-xl
                         hover:scale-105 hover:shadow-2xl active:scale-95
                         transition-all duration-200"
              style={{ boxShadow: '0 12px 40px rgba(255,107,85,0.40)' }}
            >
              {t.tryDemo}
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="px-3 py-1 rounded-full bg-card border border-border text-subtle text-xs">Solana + USDC</span>
            <span className="px-3 py-1 rounded-full bg-card border border-border text-subtle text-xs">Bitcoin + Lightning</span>
            <span className="px-3 py-1 rounded-full bg-card border border-border text-subtle text-xs">Open Wallet Standard</span>
            <span className="px-3 py-1 rounded-full bg-card border border-border text-subtle text-xs">OWS Hackathon 2026</span>
          </div>

          <p className="text-subtle text-sm italic leading-relaxed max-w-md mx-auto mb-8">
            {t.quimbaya}
          </p>

          <a
            href="https://x.com/daimapays"
            target="_blank"
            rel="noopener noreferrer"
            className="text-subtle text-sm font-medium hover:text-text transition-colors"
          >
            @daimapays
          </a>
        </div>
      </section>

    </div>
  )
}
