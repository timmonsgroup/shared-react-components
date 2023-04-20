import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDecorator } from '@storybook/react';
import theme from '../src/muiTheme';
import { authContext } from '../src/hooks/useAuth';
import { SnackbarProvider } from 'notistack';

import { authMock } from '../src/mocks/authMock';

import { useAuth } from '../src/hooks/useAuth';


const ThemeProviderFn = (storyFn) => {
  // Creating a fake auth context so useAuth will work in certain stories

  // Wrap our component with a theme and auth provider so we can pass them to our components
  // LocalizationProvider is needed for the date picker

  return (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <authContext.Provider value={authMock}>
        <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>
        </SnackbarProvider>
    </authContext.Provider>
  </LocalizationProvider>);
};

addDecorator(ThemeProviderFn);