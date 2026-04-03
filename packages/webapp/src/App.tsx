import { useState } from 'react'
import Landing from './pages/Landing'
import CompanyHome from './pages/CompanyHome'
import CompanyBrief from './pages/CompanyBrief'
import CompanyDashboard from './pages/CompanyDashboard'
import CompanyConfirmation from './pages/CompanyConfirmation'
import WorkerHome from './pages/WorkerHome'
import WorkerDashboard from './pages/WorkerDashboard'

type Page = 'landing' | 'companyHome' | 'companyBrief' | 'company' | 'companyConfirm' | 'workerHome' | 'worker'
export type OfferIntent = 'none' | 'autopilot' | 'copilot'

function App() {
  const [page, setPage] = useState<Page>('landing')
  const [paymentData, setPaymentData] = useState<{ amount: number; company: string } | null>(null)
  const [offerIntent, setOfferIntent] = useState<OfferIntent>('none')

  return (
    <div className="min-h-screen bg-bg font-sans text-text">
      {page === 'landing' && (
        <Landing onNavigate={(p) => {
          if (p === 'company') setPage('companyHome')
          else if (p === 'worker') setPage('workerHome')
          else setPage(p as Page)
        }} />
      )}
      {page === 'companyHome' && (
        <CompanyHome
          onNavigate={(p) => setPage(p === 'company' ? 'companyBrief' : p as Page)}
          onBack={() => setPage('landing')}
        />
      )}
      {page === 'companyBrief' && (
        <CompanyBrief
          onStartNegotiation={() => setPage('company')}
          onBack={() => setPage('companyHome')}
        />
      )}
      {page === 'company' && (
        <CompanyDashboard
          onPaymentSent={(data) => { setPaymentData(data); setPage('companyConfirm'); }}
          onBack={() => setPage('companyBrief')}
        />
      )}
      {page === 'companyConfirm' && (
        <CompanyConfirmation
          payment={paymentData}
          onBack={() => setPage('companyHome')}
        />
      )}
      {page === 'workerHome' && (
        <WorkerHome
          onNavigate={(p, intent) => {
            if (intent) setOfferIntent(intent as OfferIntent)
            else setOfferIntent('none')
            setPage(p as Page)
          }}
          onBack={() => setPage('landing')}
        />
      )}
      {page === 'worker' && (
        <WorkerDashboard
          payment={paymentData}
          offerIntent={offerIntent}
          onBack={() => { setOfferIntent('none'); setPage('workerHome'); }}
        />
      )}
    </div>
  )
}

export default App
