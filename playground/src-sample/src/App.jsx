import { useState } from 'react'

import Theme from '@timmons-group/shared-react-components/muiTheme'

import { ThemeProvider } from '@mui/material/styles'
import { Button, CssBaseline } from '@mui/material'
import FormTester from './FormTester'
import { ContainerWithCard } from '@timmons-group/shared-react-components'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

function App() {
  const [count, setCount] = useState(0)

  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ContainerWithCard>
          <FormTester />
          <Button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </Button>
          <p>
            Edit <code>src/App.jsx</code> and save to test HMR
          </p>
          <p className="read-the-docs">
            Click on the Vite and React logos to learn more
          </p>
        </ContainerWithCard>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
