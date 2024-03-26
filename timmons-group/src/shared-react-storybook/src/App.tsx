import '@styles/app.scss';
import { SnackbarProvider } from 'notistack';
import { HashRouter as Router } from 'react-router-dom';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AppRoutes from './AppRoutes';
import theme from './muiTheme';

function App() {
  return (
    // MUI Theme Provider
    <ThemeProvider theme={theme}>
      {/* CssBaseline global cssReset or css normalize functionality */}
      <CssBaseline />
      {/* MUI Localization Provider needed for any MUI date picker fields */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {/* React DOM Router */}
        <Router>
          {/* Notistack Snackbar Provider this allows for easy application wide toast messages*/}
          <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            {/* Our actual application */}
            <AppRoutes />
          </SnackbarProvider>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
