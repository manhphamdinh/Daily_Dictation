import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import GlobalStyles from './components/GlobalStyles/index.jsx'
import AuthProvider from './store/AuthContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
        <GlobalStyles>
          <App />
        </GlobalStyles>
    </AuthProvider>
  </StrictMode>,
)
