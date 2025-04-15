
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Check for dark mode preference in localStorage or system
const darkModeEnabled = localStorage.getItem('theme') === 'dark' || 
  (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

// Apply dark mode class to html element
if (darkModeEnabled) {
  document.documentElement.classList.add('dark');
}

// Apply high contrast if enabled
if (localStorage.getItem('highContrast') === 'true') {
  document.documentElement.classList.add('high-contrast');
}

createRoot(document.getElementById("root")!).render(<App />);
