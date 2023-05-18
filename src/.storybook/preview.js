import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { addDecorator } from '@storybook/react';
import theme from '../src/muiTheme';
import { SnackbarProvider } from 'notistack';


const ThemeProviderFn = (storyFn) => {
  // Creating a fake auth context so useAuth will work in certain stories

  // Wrap our component with a theme and auth provider so we can pass them to our components
  // LocalizationProvider is needed for the date picker

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>
      </SnackbarProvider>
    </LocalizationProvider>);
};

// addDecorator(ThemeProviderFn);
// Migration to Storybook 7
export const decorators = [ThemeProviderFn];