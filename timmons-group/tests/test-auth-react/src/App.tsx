import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


import { ProvideAuth, useAuth } from '../../../build/shared-react-auth'

import { getConfigBuilder } from '../../../build/shared-auth-config'

import PermissionFilter from '../../../build/shared-react-permission-filter'

import AppBar from '../../../build/shared-react-app-bar'

let cfg = getConfigBuilder()
    .withOAuth({
      clientId: '8blul8b4i95t5c5bva97ehvbv',
      clientSecret: '1qenk89g8bj7h2u1ndbi469fvr9grq0f3b35gej9cpi3gsnf1bi5',
      redirectUri: 'https://localhost:5173',
      scopes: ['openid', 'profile', 'email'],
      host: 'national-wildfiresuite-dev-auth.auth.us-east-1.amazoncognito.com',
      endpoints: {
        "refresh": "https://localhost:5173/refresh",
        "logout": "https://localhost:5173/logout"
      }
    })
    .withLocalStorage()
    .withNoAuthorization()
    .build()



// The following is typically handled by the oAuth helper but for this example we are doing it manually
// Check to see if we have the code in the URL
const urlParams = new URLSearchParams(window.location.search)
const code = urlParams.get('code')
const state = urlParams.get('state')

if (code) {
  // We have a code and state, so we need to exchange the code for a token
  // and then store it in local storage
  console.log('We have a code and state, so we need to exchange the code for a token')
  console.log('code: ', code)
  console.log('state: ', state)

  // Exchange the code for a token

  const fetchToken = async (code:string) => {
    const response = await fetch(`https://${cfg.authentication.oAuth.host}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=authorization_code&client_id=${cfg.authentication.oAuth.clientId}&client_secret=${cfg.authentication.oAuth.clientSecret}&code=${code}&redirect_uri=${cfg.authentication.oAuth.redirectUri}`
    })

    const data = await response.json()

    console.log('token: ', data)

    const dataBase64 = btoa(JSON.stringify(data))

    console.log('data: ', dataBase64)

    // Store the token in local storage
    localStorage.setItem('combinedToken', dataBase64)

    // remove the code from the URL
    window.history.replaceState({}, document.title, "/")

    // And reload the page
    window.location.reload()

  }

  fetchToken(code)
}

const RenderUser = ({ user }) => {
  return (
    <div>
      <p>Logged in as {user.name}</p>
      <p>email: {user.email}</p>
      <p>username: {user.username}</p>
      <p>id: {user.id}</p>
    </div>
  )
}

const navLinks = [
  { title: 'Home', href: '/' }
];

const GARP_LOGO_URL = 'https://s3.amazonaws.com/garp-website-images/garp-logo.png'
const logout = () => {
}

const Main = () => {
  const [count, setCount] = useState(0)

  const { login, authState } = useAuth()

  return (
    <>
      <div>
        AB B4
      <AppBar
        navLinks={navLinks}
        user={authState?.user}
        onLogin={() => login()}
        onLogout={logout}
        logoUrl={GARP_LOGO_URL}
      />
      AB AF
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
        { authState && <p> {authState.state}</p> }
        { authState && authState.state == 'LOGGED_IN' && <RenderUser user={authState.user} /> }
        { ( !authState || authState.state != 'LOGGED_IN' ) && <button onClick={() => { login() }}>Login</button> }
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        Pre Permission Filter
        <PermissionFilter showIfLoggedIn>
          <p>Permission Filter</p>
        </PermissionFilter>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

function App() {

  // Auth config will cause the auth provider to re-render when it changes

  const [authConfig, setAuthConfig] = useState(cfg)

  const fetchAuthConfig = async () => {
    // This is just a fake config for testing
    
    setAuthConfig(cfg)
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
      <ProvideAuth config={authConfig} >
        <Main />
      </ProvideAuth>
    </>
  )
}

export default App
