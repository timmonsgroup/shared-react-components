import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


import { ProvideAuth, useAuth } from '../../../build/shared-react-auth'

import { getConfigBuilder } from '../../../build/shared-auth-config'


const Main = () => {
  const [count, setCount] = useState(0)

  const { login } = useAuth()

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={login}>Login</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

function App() {

  // Auth config will cause the auth provider to re-render when it changes

  const [authConfig, setAuthConfig] = useState(null)

  const fetchAuthConfig = async () => {
    // This is just a fake config for testing
    let builder = getConfigBuilder()
    .withOAuth({
      clientId: '8blul8b4i95t5c5bva97ehvbv',
      redirectUri: 'http://localhost:5173',
      scopes: ['openid', 'profile', 'email'],
      host: 'https://national-wildfiresuite-dev-auth.auth.us-east-1.amazoncognito.com',
      endpoints: {
        "refresh": "http://localhost:5173/refresh",
        "logout": "http://localhost:5173/logout"
      }
    })
    .withLocalStorage()
    .build()
  }


  if (!authConfig) {
    return (
      <div>
        <button onClick={() => fetchAuthConfig()}>Load Auth Config</button>
      </div>
    )
  }

  return (
    <>
      <ProvideAuth config={fakeConf} >
        <Main />
      </ProvideAuth>
    </>
  )
}

export default App
