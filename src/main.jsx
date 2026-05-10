import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import ToastContainer from './components/ui/ToastContainer.jsx'
import { initMonitoring } from './utils/monitoring.js'

initMonitoring()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-[#16a34a] focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <App />
        <ToastContainer />
      </ToastProvider>
    </AuthProvider>
  </StrictMode>,
)
