// Website yahan se start hoti hai: global CSS load hoti hai aur React app #root mein lagti hai.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// index.css Tailwind styles ko poori website mein load karta hai.
import './index.css'
import App from './App.jsx'

// React app yahin se browser ke #root area mein start hota hai.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
