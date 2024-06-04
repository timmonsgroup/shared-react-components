import './App.css'

import ConfigFormTester from './ConfigFormTester'
import Theme from '@timmons-group/shared-react-components/muiTheme'

import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
// import FormTester from './FormTester'

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
       <ConfigFormTester />
    </ThemeProvider>
  )
}

export default App
