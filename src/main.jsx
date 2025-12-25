import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { checkConfig } from './utils/configCheck'
import './styles.css'

// 检查配置
checkConfig()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)