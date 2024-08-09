import {AUTH_STATES} from '@timmons-group/shared-react-auth';
import Theme from '@timmons-group/shared-react-components/muiTheme'

import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import FormTester from './FormTester'
import { ContainerWithCard } from '@timmons-group/shared-react-components'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ConfigFormTester from './ConfigFormTester'
import ContextBooks from './ContextPerComponent/ContextBooks';

function App() {
  console.log('AUTH_STATES', AUTH_STATES)
  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ContextBooks />
        <ConfigFormTester />
        <ContainerWithCard>
          <FormTester />
        </ContainerWithCard>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
