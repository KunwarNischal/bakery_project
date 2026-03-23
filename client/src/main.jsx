/**
 * Main entry point for the Hatemalo Bakery React application.
 *
 * This file initializes the React application by:
 * - Importing React DOM utilities to render the app
 * - Importing global styles and the main App component
 * - Mounting the app to the HTML element with id 'root'
 * - Wrapping the app in StrictMode for development checks
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
