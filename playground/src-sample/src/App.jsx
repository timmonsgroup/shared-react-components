import { useState } from 'react'

import Theme from '@timmons-group/shared-react-components/muiTheme'

import { ThemeProvider } from '@mui/material/styles'
import { Button, CssBaseline } from '@mui/material'
import FormTester from './FormTester'
import { ContainerWithCard } from '@timmons-group/shared-react-components'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ConfigFormTester from './ConfigFormTester'

function App() {
  const [count, setCount] = useState(0)

  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ConfigFormTester />
        <ContainerWithCard>
          <FormTester />
        </ContainerWithCard>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
