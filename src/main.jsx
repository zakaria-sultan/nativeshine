import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CompanyFavicon } from './components/branding/CompanyBranding'
import { SiteContentProvider } from './context/SiteContentContext'
import { QuoteProvider } from './context/QuoteContext'
import { ConfirmProvider } from './context/ConfirmContext'
import { ToastProvider } from './context/ToastContext'
import { ServicesProvider } from './context/ServicesContext'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SiteContentProvider>
    <CompanyFavicon />
    <ServicesProvider>
      <AuthProvider>
        <QuoteProvider>
          <ToastProvider>
            <ConfirmProvider><App /></ConfirmProvider>
          </ToastProvider>
        </QuoteProvider>
      </AuthProvider>
    </ServicesProvider>
    </SiteContentProvider>
  </StrictMode>,
)
