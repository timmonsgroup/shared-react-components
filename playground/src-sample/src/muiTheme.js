import { darken } from '@mui/material';
import { createMergedTheme } from '@timmons-group/shared-react-components';

export const fontFamily = '"OpenSans-Regular", "Helvetica", "Arial", "sans-serif"';
// const fontSemibold = '"OpenSans-SemiBold", "Helvetica", "Arial", "sans-serif"';
export const sansFontBold = '"OpenSans-Bold", "Helvetica", "Arial", "sans-serif"';
export const appBarHeight = 64;

const stormBlue = '#005672';
const baseBlue = '#0054D2';
const baseText = '#383838';

const teal = '#B0D4BF';
const primary = baseBlue;
const tertiary = '#445979';
const darkBlue = '#003C83';
const veryDarkBlue = '#172E3B';
const golden = '#FF9922';
const gross = '#90DD44';

export const colors = {
  stormBlue,
  baseBlue,
  baseText,
  teal,
  primary,
  tertiary,
  darkBlue,
  veryDarkBlue,
  golden,
};

const textLinkStyle = {
  padding: '0px',
  color: `${darkBlue}`,
  fontFamily: `${sansFontBold} !important`,
  textTransform: 'none',
  background: 'none',
  cursor: 'pointer',
  textDecoration: 'none !important',
  '&:hover': { textDecoration: 'underline !important', background: 'none', },
};

const themeOverrides = {
  layoutPanelHeaderContainer: {
    backgroundColor: 'white',
    padding: '8px 16px',
  },
  layoutPanelDescriptionContainer: {
    padding: '8px 16px',
  },
  iconButton: {
    backgroundColor: golden,
    color: stormBlue,
    padding: '4px',
    fontSize: '8px !important',
    '&:hover': {
      backgroundColor: darken(golden, 0.25),
    }
  },
  cancelIconButton: {
    backgroundColor: (theme) => theme.palette.regressive.main,
    color: '#FFFFFF',
    padding: '4px',
    fontSize: '8px !important',
    '&:hover': {
      // backgroundColor: darken('#DA0000', 0.25),
      backgroundColor: (theme) => darken(theme.palette.regressive.main, 0.25),
    }
  },
  resetIconButton: {
    backgroundColor: stormBlue,
    color: '#FFFFFF !important',
    padding: '4px',
    fontSize: '8px !important',
    '&:hover': {
      backgroundColor: darken(stormBlue, 0.25),
    }
  },
  palette: {
    text: {
      header: stormBlue,
      special: '#FFDE58',
    },
    background: {
      default: '#EDEDED',
    },
    hover: {
      dark: '#001F35',
    },
    primary: {
      main: primary,
      light: '#027AC8',
      text: '#ffffff',
    },
    secondary: {
      main: teal,
      light: '#F68802',
      text: '#ffffff',
    },
    regressive: {
      main: '#C10000',
      dark: darken('#C10000', 0.25),
      contrastText: '#ffffff',
    },
    ancillary: {
      main: gross,
      dark: darken(gross, 0.25),
      text: '#003C83',
      contrastText: '#003C83',
    },
    progressive: {
      main: golden,
      dark: darken(golden, 0.15),
      // light: 'purple',
      // dark: golden,
      text: '#003C83',
      contrastText: '#003C83',
    },
    tertiary: {
      main: tertiary,
      contrastText: '#FFFFFF',
      text: '#FFFFFF',
      light: '#c5c871',
      dark: stormBlue,
      lightBlue: '#2B5C92',
    },
    accent: {
      main: '#FFFFFF',
      contrastText: '#1F4765',
    },
    toggleBackground: {
      main: '#A5FF98',
    },
  },
  typography: {
    fontFamily: `${fontFamily} !important`,
    textLink: textLinkStyle,
    altTextLink: {
      ...textLinkStyle,
      color: `${golden} !important`,
    },
    allVariants: {
      fontFamily: `${fontFamily} !important`,
    },
    navLink: {
      fontFamily: `${sansFontBold} !important`,
      fontSize: '0.875rem',
      color: `${primary} !important`,
      textDecorationColor: `${primary} !important`,
      marginTop: 2,
      marginBottom: 2,
    },
    subHeader: {
      fontFamily: `${fontFamily} !important`,
      color: stormBlue,
      fontSize: '18px',
    },
    subHeaderText: {
      fontFamily: `${fontFamily} !important`,
      fontSize: '18px',
      color: baseText,
      fontWeight: 'normal',
      fontStyle: 'italic',
    },
    lineItem: {
      fontSize: '0.875rem',
      marginTop: '8px',
      marginBottom: '8px',
    },
    mobileUserName: {
      fontFamily: `${sansFontBold} !important`,
      padding: '8px',
      textAlign: 'center',
      fontSize: '1rem'
    },
    mobileUserEmail: {
      padding: '8px',
      textAlign: 'center',
      fontStyle: 'italic',
      fontSize: '0.85rem'
    },
    summaryValue: {
      fontFamily: `${sansFontBold} !important`,
      fontSize: '2rem',
      color: stormBlue,
      fontWeight: '700',
      marginBottom: '8px',
    },
    modalTitle: {
      fontFamily: `${sansFontBold} !important`,
      fontSize: '1.2rem',
      color: stormBlue,
      marginTop: '20px',
      marginBottom: '0',
      textAlign: 'center',
    },
    strikeThrough: {
      fontSize: '0.875rem',
      textDecoration: 'line-through',
      color: baseText,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained',
        color: 'primary',
      },
      variants: [
        {
          props: {
            variant: 'contained',
          },
          style: {
            borderRadius: 57,
          },
        },
      ]
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          // add custom variants here
          sectionHeaderSpaceAbove: 'h1',
          subHeader: 'h1',
          sidebarTitle: 'h2',
          panelHeader: 'h2',
          summaryTitle: 'h3',
          summaryValue: 'h3',
        },
      },
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          color: baseText,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        h1: {
          fontSize: '16px',
          color: stormBlue,
        },
      },
    }
  },
};

const theTheme = createMergedTheme(themeOverrides);

export default theTheme;
