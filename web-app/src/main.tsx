import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from './theme/theme'
import App from './App'
import './index.css'

// Error boundary for debugging
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error)
      setError(event.error)
      setHasError(true)
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason)
      setError(new Error(event.reason))
      setHasError(true)
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  if (hasError) {
    return (
      <div style={{ 
        padding: '20px', 
        color: 'red', 
        fontFamily: 'monospace',
        background: '#1a1a1a',
        minHeight: '100vh'
      }}>
        <h1>Error occurred:</h1>
        <pre>{error?.message || 'Unknown error'}</pre>
        <pre>{error?.stack}</pre>
        <button onClick={() => window.location.reload()}>Reload</button>
      </div>
    )
  }

  return <>{children}</>
}

try {
  console.log('🚀 EcoVerse Frontend starting...')
  console.log('Environment:', import.meta.env.MODE)
  console.log('Base URL:', import.meta.env.BASE_URL)
  
  const rootElement = document.getElementById('root')
  if (!rootElement) {
    throw new Error('Root element not found!')
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <ChakraProvider value={theme}>
          <App />
        </ChakraProvider>
      </ErrorBoundary>
    </React.StrictMode>,
  )
  
  console.log('✅ EcoVerse Frontend mounted successfully')
} catch (error) {
  console.error('❌ Failed to mount EcoVerse Frontend:', error)
  
  // Fallback error display
  document.body.innerHTML = `
    <div style="padding: 20px; color: red; font-family: monospace; background: #1a1a1a; min-height: 100vh;">
      <h1>EcoVerse Frontend Error</h1>
      <p>Failed to start application: ${error}</p>
      <button onclick="window.location.reload()">Reload Page</button>
    </div>
  `
}