/**
 * index.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

import 'react-app-polyfill/stable'

import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

// Use consistent styling
import 'sanitize.css/sanitize.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { HelmetProvider } from 'react-helmet-async'

import { configureAppStore } from 'store/configureStore'

import { ThemeProvider } from 'styles/theme/ThemeProvider'

// Initialize languages
import './locales/i18n'

// Fonts
import './styles/main.css'
import { routes } from './routes'

const store = configureAppStore({
  theme: {
    selected: 'light',
  },
  wallet: {
    wallets: {
      oasis1qz78ap0456g2rk7j6rmtvasc9v2kjhz2s58qgj90: {
        address: 'oasis1qz78ap0456g2rk7j6rmtvasc9v2kjhz2s58qgj90',
        publicKey: 'ad4bca4ab8759f2a6f71db08a913599df6f63a2bae5a7c48f637be325861a51c',
        privateKey: '<<redacted>>',
        type: 'private_key' as any,
        balance: {
          address: 'oasis1qz78ap0456g2rk7j6rmtvasc9v2kjhz2s58qgj90',
          allowances: [],
          available: '24454060789',
          delegations: '100945338678',
          debonding: '0',
          total: '125399399467',
        },
      },
    },
    selectedWallet: 'oasis1qz78ap0456g2rk7j6rmtvasc9v2kjhz2s58qgj90',
  },
  persist: {
    hasPersistedProfiles: false,
    hasV0StorageToMigrate: false,
    isPersistenceUnsupported: false,
    loading: false,
    stringifiedEncryptionKey: 'skipped',
    enteredWrongPassword: false,
  },
})
const container = document.getElementById('root') as HTMLElement
const root = createRoot(container!)
const router = createBrowserRouter(routes)

root.render(
  <Provider store={store}>
    <ThemeProvider>
      <HelmetProvider>
        <React.StrictMode>
          <RouterProvider router={router} />
        </React.StrictMode>
      </HelmetProvider>
    </ThemeProvider>
  </Provider>,
)
