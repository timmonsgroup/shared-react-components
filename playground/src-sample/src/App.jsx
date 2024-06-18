import './App.css'

import ConfigFormTester from './ConfigFormTester'
import ConfigGridTester from './ConfigGridTester'
import Theme from '@timmons-group/shared-react-components/muiTheme'

import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
// import FormTester from './FormTester'

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
       <ConfigFormTester />
       <ConfigGridTester />
    </ThemeProvider>
  )
}

export default App
