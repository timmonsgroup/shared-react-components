import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { ProvideAuth } from '../../../dist/shared-react-auth'

const fakeConf = {}

ReactDOM.createRoot(document.getElementById('root')!).render(
  
    <ProvideAuth config={fakeConf} >
      <App />
    </ProvideAuth>
  
)
