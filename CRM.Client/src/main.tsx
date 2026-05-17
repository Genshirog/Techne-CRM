import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import "./index.css";
import { AuthProvider } from './context/AuthContext'; // ← add

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>  {/* ← wrap */}
      <App />
    </AuthProvider>
  </StrictMode>,
)