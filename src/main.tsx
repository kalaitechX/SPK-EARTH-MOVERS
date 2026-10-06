import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Register PWA Service Worker
if ('serviceWorker' in navigator) {
  registerSW({ immediate: true })
}

import LocationTracker from './components/LocationTracker'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <LocationTracker />
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>,
)
