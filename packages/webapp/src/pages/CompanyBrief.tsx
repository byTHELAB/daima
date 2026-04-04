import { useState, useEffect } from 'react'

interface Props {
  onStartNegotiation: () => void
  onBack: () => void
}

const ROLES = ['UX Designer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Product Designer', 'Data Scientist', 'Content Writer', 'Marketing Manager']
const TIMELINES = ['1 week', '2-3 weeks', '1 month', '2-3 months', 'Ongoing']

export default function CompanyBrief({ onStartNegotiation, onBack }: Props) {
  const [role, setRole] = useState('UX Designer')
  const [scope, setScope] = useState('Complete redesign of our mobile app onboarding flow')
  const [timeline, setTimeline] = useState('2-3 weeks')
  const [budgetMin, setBudgetMin] = useState('300')
  const [budgetMax, setBudgetMax] = useState('600')
  const [searching, setSearching] = useState(false)
  const [found, setFound] = useState(false)
  const [searchStep, setSearchStep] = useState(0)

  function handleSearch() {
    setSearching(true)
    setSearchStep(0)
  }

  useEffect(() => {
    if (!searching || found) return
    const timers = [
      setTimeout(() => setSearchStep(1), 600),
      setTimeout(() => setSearchStep(2), 1800),
      setTimeout(() => setSearchStep(3), 3000),
      setTimeout(() => { setSearchStep(4); setFound(true); }, 4200),
    ]
    return () => timers.forEach(clearTimeout)
  }, [searching, found])

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col gap-5">

        {/* Header */}
        <div className="flex flex-col gap-1">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-subtle text-sm hover:text-text transition-colors w-fit mb-1"
          >
            <span className="text-base leading-none">←</span>
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-text tracking-tight">New Project</h1>
          <p className="text-subtle text-sm">Tell us what you need. Your agent handles the rest.</p>
        </div>

        {/* Brief Form */}
        {!searching && (
          <div className="flex flex-col gap-4" style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>

            {/* Role */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-subtle uppercase tracking-wider">What role do you need?</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-card border border-border rounded-xl px-4 py-3 text-text text-sm font-medium outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral transition-all appearance-none"
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Scope */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-subtle uppercase tracking-wider">Project scope</label>
              <textarea
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                rows={2}
                className="bg-card border border-border rounded-xl px-4 py-3 text-text text-sm font-medium outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral transition-all resize-none"
                placeholder="Describe the project in one or two lines..."
              />
            </div>

            {/* Timeline */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-subtle uppercase tracking-wider">Timeline</label>
              <div className="flex gap-2 flex-wrap">
                {TIMELINES.map(t => (
                  <button
                    key={t}
                    onClick={() => setTimeline(t)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: timeline === t ? '#FF6B55' : '#FFFFFF',
                      color: timeline === t ? '#FFF5F0' : '#1A1815',
                      border: timeline === t ? '1px solid #FF6B55' : '1px solid #E0D8CC',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Range */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-subtle uppercase tracking-wider">Budget range (USD/hr)</label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle text-sm">$</span>
                  <input
                    type="number"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl pl-7 pr-3 py-3 text-text text-sm font-medium outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral transition-all"
                  />
                </div>
                <span className="text-subtle text-sm">to</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle text-sm">$</span>
                  <input
                    type="number"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl pl-7 pr-3 py-3 text-text text-sm font-medium outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral transition-all"
                  />
                </div>
              </div>
              {/* Market context */}
              <p className="text-xs mt-1" style={{ color: '#0A7A54' }}>
                ✓ Market rate for {role}: $42–65/hr. Your budget is within range.
              </p>
            </div>

            {/* AI suggestion */}
            <div className="bg-card rounded-xl p-4 border border-border" style={{ borderLeft: '3px solid #FF6B55' }}>
              <p className="text-xs font-semibold mb-1" style={{ color: '#C04A1A' }}>✦ Agent tip</p>
              <p className="text-xs text-subtle leading-relaxed">
                For a {role.toLowerCase()} with {timeline.toLowerCase()} timeline, I recommend budgeting ${budgetMin}–${budgetMax}/hr. This range qualifies you for the <strong className="text-text">Fair Pay Badge</strong>, which increases acceptance rate by 3x.
              </p>
            </div>

            {/* Search button */}
            <button
              onClick={handleSearch}
              className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-[0.98]"
              style={{ background: '#FF6B55', boxShadow: '0 8px 32px rgba(255,107,85,0.35)' }}
            >
              Find Talent →
            </button>
          </div>
        )}

        {/* Search Results */}
        {searching && (
          <div className="flex flex-col gap-4" style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>

            {/* Brief summary */}
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs font-semibold text-subtle uppercase tracking-wider mb-2">Your brief</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ background: '#FF6B55', color: '#FFF5F0' }}>{role}</span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-card border border-border text-text">{timeline}</span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-card border border-border text-text">${budgetMin}–${budgetMax}/hr</span>
              </div>
              <p className="text-xs text-subtle mt-2">{scope}</p>
            </div>

            {/* Search log */}
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs font-semibold text-subtle uppercase tracking-wider mb-3">Agent searching...</p>
              <div className="space-y-2.5">
                {searchStep >= 1 && (
                  <div className="flex items-center gap-2 text-sm" style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
                    <span style={{ color: '#0A7A54' }}>✓</span>
                    <span className="text-subtle">Scanning talent pool for <strong className="text-text">{role}</strong></span>
                  </div>
                )}
                {searchStep >= 2 && (
                  <div className="flex items-center gap-2 text-sm" style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
                    <span style={{ color: '#0A7A54' }}>✓</span>
                    <span className="text-subtle">Matching skills + availability + rate range</span>
                  </div>
                )}
                {searchStep >= 3 && (
                  <div className="flex items-center gap-2 text-sm" style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
                    <span style={{ color: '#0A7A54' }}>✓</span>
                    <span className="text-subtle">Found <strong className="text-text">3 candidates</strong> in your budget</span>
                  </div>
                )}
                {searchStep < 4 && (
                  <div className="flex items-center gap-2 text-sm text-subtle">
                    <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#FF6B55' }}></span>
                    Searching...
                  </div>
                )}
              </div>
            </div>

            {/* Results */}
            {found && (
              <div style={{ animation: 'fadeSlideIn 0.4s ease-out' }}>
                <p className="text-xs font-semibold text-subtle uppercase tracking-wider mb-3">Top matches</p>

                {/* Match 1 — Best */}
                <div className="bg-card border-2 rounded-2xl p-4 mb-3 shadow-sm" style={{ borderColor: '#2DD4A0' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: '#FF6B55' }}>D</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-bold text-text">Daniela Reyes</p>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: '#2DD4A0', color: '#0A0A0A' }}>94% match</span>
                      </div>
                      <p className="text-xs text-subtle">UX Designer • Mexico City • 4 yrs exp</p>
                      <div className="flex gap-3 mt-2 text-xs">
                        <span className="text-text font-semibold">$42–55/hr</span>
                        <span className="text-subtle">•</span>
                        <span style={{ color: '#0A7A54' }}>Available now</span>
                        <span className="text-subtle">•</span>
                        <span className="text-subtle">⭐ 4.9 (23 projects)</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onStartNegotiation}
                    className="w-full mt-4 py-3 rounded-xl text-white font-bold text-sm transition-all active:scale-[0.98]"
                    style={{ background: '#FF6B55', boxShadow: '0 4px 16px rgba(255,107,85,0.3)' }}
                  >
                    Start Negotiation →
                  </button>
                </div>

                {/* Match 2 */}
                <div className="bg-card border border-border rounded-2xl p-4 mb-3 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: '#3B5BDB' }}>S</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-bold text-text">Sofia Chen</p>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: '#EDE8E0', color: '#8A7A6A' }}>87% match</span>
                      </div>
                      <p className="text-xs text-subtle">UX/UI Designer • Buenos Aires • 6 yrs exp</p>
                      <div className="flex gap-3 mt-2 text-xs">
                        <span className="text-text font-semibold">$50–65/hr</span>
                        <span className="text-subtle">•</span>
                        <span style={{ color: '#8A6A00' }}>Available in 1 week</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Match 3 */}
                <div className="bg-card border border-border rounded-2xl p-4 mb-3 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: '#FFCD38', color: '#1A1815' }}>K</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-bold text-text">Kofi Mensah</p>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: '#EDE8E0', color: '#8A7A6A' }}>82% match</span>
                      </div>
                      <p className="text-xs text-subtle">Product Designer • Accra • 3 yrs exp</p>
                      <div className="flex gap-3 mt-2 text-xs">
                        <span className="text-text font-semibold">$35–48/hr</span>
                        <span className="text-subtle">•</span>
                        <span style={{ color: '#0A7A54' }}>Available now</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-center text-xs text-subtle mt-2">
                  Agent recommended Daniela based on skill match, availability, and rate fit
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
