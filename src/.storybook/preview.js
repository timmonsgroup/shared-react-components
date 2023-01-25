import { ThemeProvider } from '@mui/material/styles';
import { addDecorator } from '@storybook/react';
import theme from '../src/muiTheme';
import { authContext } from '../src/hooks/useAuth';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const ThemeProviderFn = (storyFn) => {
  // Creating a fake auth context so useAuth will work in certain stories
  const auth = {
    authState: {
      user: {
        acl: null
      }
    }
  };

  // Wrap our component with a theme and auth provider so we can pass them to our components
  // LocalizationProvider is needed for the date picker
  return (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <authContext.Provider value={auth}>
      <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>
    </authContext.Provider>
  </LocalizationProvider>);
};

addDecorator(ThemeProviderFn);