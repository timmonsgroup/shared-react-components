// export const parameters = {
//   actions: { argTypesRegex: "^on[A-Z].*" },
//   controls: {
//     matchers: {
//       color: /(background|color)$/i,
//       date: /Date$/,
//     },
//   },
// }

import { ThemeProvider } from '@mui/material/styles';
import { addDecorator } from '@storybook/react';
import theme from '../src/muiTheme';
// import { authContext } from '../src/hooks/useAuth';

const ThemeProviderFn = (storyFn) => {
  // Creating a fake auth context so useAuth will work in certain stories
  const auth = {authState: {
    user: {
      acl: null
    }}
  };

  // Wrap our component with a theme and auth provider so we can pass them to our components
  return <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>
};

addDecorator(ThemeProviderFn);