import React from "react";
import type { Preview } from "@storybook/react";
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import theme from '../src/muiTheme';
import { SnackbarProvider } from 'notistack';

// Define a decorator that will wrap our components with a theme provider
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

const preview: Preview = {
  // decorators wrap every story in a component, so we can add global context
  decorators: [ThemeProviderFn],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;