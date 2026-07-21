import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@uivolve/core/styles.css'
import '../app.css'
import './mdx.css'
import { MdxApp } from './MdxApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MdxApp />
  </StrictMode>,
)
