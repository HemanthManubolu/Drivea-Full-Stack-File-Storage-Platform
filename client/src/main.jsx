import { createRoot } from 'react-dom/client'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { ClerkProvider } from '@clerk/react'
import './index.css'
import App from './App.jsx'
import {AppProvider} from "./context/AppContext.jsx"

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY. Add it to client/.env before starting Drivea.");
}

const ClerkRouterProvider = () => {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      signInUrl="/login"
      signUpUrl="/register"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <AppProvider>
        <App />
      </AppProvider>
    </ClerkProvider>
  );
};

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ClerkRouterProvider />
  </BrowserRouter>,
)
