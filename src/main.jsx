import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { QuoteProvider } from './context/QuoteContext'
import { ToastProvider } from './context/ToastContext'
import { ServicesProvider } from './context/ServicesContext'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ServicesProvider>
      <AuthProvider>
        <QuoteProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </QuoteProvider>
      </AuthProvider>
    </ServicesProvider>
  </StrictMode>,
)
