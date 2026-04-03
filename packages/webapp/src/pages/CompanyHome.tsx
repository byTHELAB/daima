interface Props {
  onNavigate: (page: string) => void
  onBack: () => void
}

const TEAM = [
  {
    initial: 'D',
    color: '#FF6B55',
    textColor: '#FFF5F0',
    name: 'Daniela Reyes',
    role: 'UX Designer',
    location: 'Mexico City',
    rate: '$500/mo',
  },
  {
    initial: 'M',
    color: '#3B5BDB',
    textColor: '#EEF2FF',
    name: 'Miguel Santos',
    role: 'Backend Dev',
    location: 'São Paulo',
    rate: '$1,200/mo',
  },
  {
    initial: 'A',
    color: '#FFCD38',
    textColor: '#8A6A00',
    name: 'Amara Osei',
    role: 'Content Writer',
    location: 'Accra',
    rate: '$350/mo',
  },
]

const PAYMENTS = [
  { name: 'Daniela Reyes', date: 'Apr 1', amount: '$500' },
  { name: 'Miguel Santos', date: 'Apr 1', amount: '$1,200' },
  { name: 'Amara Osei', date: 'Mar 28', amount: '$350' },
]

const AI_ITEMS = [
  'Industry: SaaS / B2B Technology',
  'Team size: 15-50 remote',
  'Markets: US, LATAM, Europe',
  'Budget range: auto-adjusted to market',
]

export default function CompanyHome({ onNavigate, onBack }: Props) {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col gap-5">

        {/* ── Header ── */}
        <div className="flex flex-col gap-1">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-subtle text-sm hover:text-text transition-colors w-fit mb-1"
          >
            <span className="text-base leading-none">←</span>
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-text tracking-tight">
            Welcome back, Acme Corp
          </h1>
          <p className="text-subtle text-sm">Your hiring dashboard</p>
        </div>

        {/* ── Quick Stats Row ── */}
        <div className="grid grid-cols-3 gap-3">
          {/* Active workers */}
          <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-1 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#3B5BDB' }} />
              <span className="text-xs text-subtle font-medium">Workers</span>
            </div>
            <p className="text-2xl font-black text-text leading-none">4</p>
            <p className="text-xs text-subtle">Active</p>
          </div>

          {/* Paid this month */}
          <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-1 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#2DD4A0' }} />
              <span className="text-xs text-subtle font-medium">Paid</span>
            </div>
            <p className="text-2xl font-black text-text leading-none">$12.4k</p>
            <p className="text-xs text-subtle">This month</p>
          </div>

          {/* Fair Pay Score */}
          <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-1 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#FFCD38' }} />
              <span className="text-xs text-subtle font-medium">Fair Pay</span>
            </div>
            <p className="text-2xl font-black text-text leading-none">100%</p>
            <span
              className="inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full w-fit"
              style={{ background: '#FFF8E1', color: '#8A6A00' }}
            >
              ★ Badge Active
            </span>
          </div>
        </div>

        {/* ── AI Setup Card ── */}
        <div
          className="bg-card border border-border rounded-2xl p-5 hover:shadow-sm transition-shadow"
          style={{ borderLeft: '4px solid #3B5BDB' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
              style={{ background: '#EEF2FF' }}
            >
              🤖
            </div>
            <div>
              <p className="font-bold text-text text-sm">Company Agent — Auto-configured</p>
              <p className="text-subtle text-xs mt-0.5">
                We analyzed acmecorp.com and set up your company profile:
              </p>
            </div>
          </div>
          <ul className="flex flex-col gap-2 mb-3">
            {AI_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-text">
                <span style={{ color: '#3B5BDB' }} className="font-bold shrink-0 mt-px">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <button
            className="text-xs font-semibold transition-opacity hover:opacity-70"
            style={{ color: '#3B5BDB' }}
          >
            Edit settings →
          </button>
        </div>

        {/* ── Your Team ── */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-subtle uppercase tracking-wider px-0.5">
            Your team
          </p>
          <div className="flex flex-col gap-2">
            {TEAM.map((worker) => (
              <div
                key={worker.name}
                className="bg-card border border-border rounded-2xl px-4 py-3.5 flex items-center gap-3 hover:shadow-sm transition-shadow cursor-default"
              >
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm"
                  style={{ background: worker.color, color: worker.textColor }}
                >
                  {worker.initial}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-text font-semibold text-sm leading-tight">{worker.name}</p>
                  <p className="text-subtle text-xs mt-0.5">
                    {worker.role} • {worker.location}
                  </p>
                </div>

                {/* Rate + badge + arrow */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-text font-bold text-sm">{worker.rate}</span>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: '#D1FAF0', color: '#0A7A54' }}
                    >
                      Active
                    </span>
                  </div>
                  <span className="text-subtle text-base">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => onNavigate('company')}
            className="w-full py-4 rounded-2xl bg-coral text-white font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
            style={{ boxShadow: '0 8px 32px rgba(255,107,85,0.25)' }}
          >
            New Project →
          </button>
          <button
            className="w-full py-4 rounded-2xl border border-border bg-card text-text font-semibold text-base hover:bg-track transition-colors"
          >
            Add Team Member
          </button>
        </div>

        {/* ── Recent Payments ── */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-subtle uppercase tracking-wider px-0.5">
            Recent payments
          </p>
          <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-sm transition-shadow">
            {PAYMENTS.map((payment, i) => (
              <div
                key={payment.name}
                className={`flex items-center justify-between px-4 py-3.5 ${
                  i < PAYMENTS.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div>
                  <p className="text-text text-sm font-semibold">{payment.name}</p>
                  <p className="text-subtle text-xs mt-0.5">{payment.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-text font-bold text-sm">{payment.amount}</span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: '#D1FAF0', color: '#0A7A54' }}
                  >
                    ✓ Sent
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Fair Pay Badge Card ── */}
        <div
          className="bg-card border border-border rounded-2xl p-5 hover:shadow-sm transition-shadow"
          style={{ borderLeft: '4px solid #2DD4A0' }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
              style={{ background: '#D1FAF0' }}
            >
              ★
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-text text-sm">Fair Pay Badge — Verified</p>
              <p className="text-subtle text-xs mt-1 leading-relaxed">
                All payments within market range. Your badge is active and visible to talent.
              </p>
              <button
                className="text-xs font-semibold mt-2 transition-opacity hover:opacity-70"
                style={{ color: '#0A7A54' }}
              >
                Share your badge →
              </button>
            </div>
          </div>
        </div>

        {/* bottom breathing room */}
        <div className="h-4" />

      </div>
    </div>
  )
}
