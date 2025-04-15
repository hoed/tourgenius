
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Helper function to check if current path is a dashboard path
const isDashboardPath = () => {
  return window.location.pathname.startsWith('/dashboard');
};

// Apply dark mode only on dashboard pages
const darkModeEnabled = 
  (localStorage.getItem('theme') === 'dark' || 
  (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) && 
  isDashboardPath();

// Apply dark mode class to html element only on dashboard
if (darkModeEnabled) {
  document.documentElement.classList.add('dark');
} else if (!isDashboardPath()) {
  // Ensure dark mode is removed for non-dashboard pages
  document.documentElement.classList.remove('dark');
}

// Apply high contrast if enabled, but only on dashboard
if (localStorage.getItem('highContrast') === 'true' && isDashboardPath()) {
  document.documentElement.classList.add('high-contrast');
} else if (!isDashboardPath()) {
  // Ensure high-contrast is removed for non-dashboard pages
  document.documentElement.classList.remove('high-contrast');
}

// Listen for route changes to update theme when moving between dashboard and frontend
const handleRouteChange = () => {
  const onDashboard = isDashboardPath();
  const prefersDark = localStorage.getItem('theme') === 'dark';
  const prefersHighContrast = localStorage.getItem('highContrast') === 'true';
  
  if (onDashboard && prefersDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  if (onDashboard && prefersHighContrast) {
    document.documentElement.classList.add('high-contrast');
  } else {
    document.documentElement.classList.remove('high-contrast');
  }
};

// Listen for history changes to detect navigation
window.addEventListener('popstate', handleRouteChange);

createRoot(document.getElementById("root")!).render(<App />);
