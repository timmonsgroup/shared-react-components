import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { LineLoader } from '@timmons-group/shared-react-components/components'
import { LoadingSpinner } from '@timmons-group/shared-react-components/components'
import Theme from '@timmons-group/shared-react-components/muiTheme'

import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import FormTester from './FormTester'

function App() {
  console.log('Theme', Theme)
  const [count, setCount] = useState(0)

  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
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
        <LineLoader />
        <FormTester />
        {/* <LoadingSpinner isActive={true} /> */}
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </ThemeProvider>
  )
}

export default App
