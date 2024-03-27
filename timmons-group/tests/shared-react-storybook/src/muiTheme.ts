import { createMergedTheme } from '@timmons-group/shared-react-components';
import React from 'react';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    contained: React.CSSProperties;
    clusterAdd: React.CSSProperties;
    textLink: React.CSSProperties;
    iconButton: React.CSSProperties;
    inlineClusterRemove: React.CSSProperties;
    gridActionEdit: React.CSSProperties;
    gridActionView: React.CSSProperties;
    gridActionDelete: React.CSSProperties;
    user: React.CSSProperties;
    panel: React.CSSProperties;
    appbar: React.CSSProperties;
    dashed: React.CSSProperties;
    sectionHeader: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    contained: React.CSSProperties;
    clusterAdd: React.CSSProperties;
    textLink: React.CSSProperties;
    iconButton: React.CSSProperties;
    inlineClusterRemove: React.CSSProperties;
    gridActionEdit: React.CSSProperties;
    gridActionView: React.CSSProperties;
    gridActionDelete: React.CSSProperties;
    user: React.CSSProperties;
    panel: React.CSSProperties;
    appbar: React.CSSProperties;
    dashed: React.CSSProperties;
    sectionHeader: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    contained: true;
    clusterAdd: true;
    textLink: true;
    iconButton: true;
    inlineClusterRemove: true;
    gridActionEdit: true;
    gridActionView: true;
    gridActionDelete: true;
    user: true;
    panel: true;
    appbar: true;
    dashed: true;
    sectionHeader: true;
  }
}

const stormBlue = '#2E5770';

const teal = '#B0D4BF';
const primary = stormBlue;
const tertiary = '#445979';
const darkBlue = '#2E5770';
const veryDarkBlue = '#172E3B';
const textLinkStyle = {
  padding: '0px',
  color: `${stormBlue}`,
  fontWeight: 'bold',
  textTransform: 'none',
  background: 'none',
  '&:hover': { textDecoration: 'underline', background: 'none', },
};

const themeOverrides = {
  pamGrid: {
    '& .pam-grid-header': {
      backgroundColor: darkBlue,
      color: 'white',
    },
    '& .MuiDataGrid-iconButtonContainer > .MuiButtonBase-root': {
      color: 'white',
    },
    '& .MuiDataGrid-menuIcon > .MuiButtonBase-root': {
      color: 'white',
    },
    '& .row-odd': {
      backgroundColor: '#e6ecf2',
    },
    '.MuiDataGrid-toolbarContainer': {
      paddingBottom: '8px',
      // This is the container for the toolbar.
      button: {
        marginRight: '8px',
      },
      'button:last-of-type': {
        marginRight: '0px',
      },
    }
  },
  configView: {
    clusterField: {
      alternateRowColor: '#F6F6F6',
      headerColor: stormBlue,
      headerTextColor: '#FFFFFF',
    },
  },
  checklist: {
    alternateRowColor: '#F6F6F6',
    headerColor: stormBlue,
    headerTextColor: '#FFFFFF',
  },
  palette: {
    text: {
      header: stormBlue,
      special: '#FFDE58',
    },
    background: {
      default: '#B3B3B3',
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
      main: '#234357',
      light: '#F68802',
      dark: stormBlue,
      text: '#ffffff',
      contrastText: '#ffffff',
    },
    progressive: {
      main: veryDarkBlue,
      light: 'purple',
      dark: stormBlue,
      text: '#ffffff',
      contrastText: '#ffffff',
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
    fontFamily: ['"PT Sans"', 'Helvetica', 'Arial', 'sans-serif'].join(','),
    navLink: {
      fontSize: '0.875rem',
      fontWeight: 'bold',
      color: `${primary} !important`,
      textDecorationColor: `${primary} !important`,
      marginTop: 2,
      marginBottom: 2,
    },
    homeBlurb: {
      paddingTop: '16px',
      paddingBottom: '16px',
      color: 'white',
      textAlign: 'center',
    },
    subHeader: {
      color: stormBlue,
    },
    lineItem: {
      fontSize: '0.875rem',
      marginTop: '8px',
      marginBottom: '8px',
    },
    detailItem: {
      fontSize: '0.875rem',
      marginTop: '8px',
      marginBottom: '8px',
      '&.label': {
        fontWeight: 'bold'
      }
    },
    sectionHeader: {
      color: stormBlue,
    },
    sectionHeaderSpaceAbove: {
      fontFamily: 'inherit',
      fontSize: '1rem',
      fontWeight: 'bold',
      color: stormBlue,
      marginTop: '20px',
      marginBottom: 2,
    },
    panelHeader: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: stormBlue,
      marginTop: 2,
      marginBottom: 2,
    },
    modalTitle: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: stormBlue,
      marginTop: '20px',
      marginBottom: '0',
      textAlign: 'center',
    },
    checklistItem: {
      fontSize: '0.875rem',
    },
    strikeThrough: {
      fontSize: '0.875rem',
      textDecoration: 'line-through',
      color: '#434343',
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          // add custom variants here
          homeBlurb: 'p',
          sectionHeaderSpaceAbove: 'h1',
        },
      },
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          color: '#434343',
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
    },
    MuiButton: {
      // Because of how the theme is merged any array values must be fully duplicated
      variants: [
        {
          props: {
            variant: 'contained',
          },
          style: {
            borderRadius: 28,
          },
        },
        {
          props: {
            variant: 'clusterAdd',
          },
          style: textLinkStyle
        },
        {
          props: {
            variant: 'textLink',
          },
          style: textLinkStyle
        },
        {
          props: {
            variant: 'iconButton',
          },
          style: {
            color: stormBlue,
            background: 'none',
            justifyContent: 'flex-start',
            '&:hover': { color: veryDarkBlue, },
            paddingLeft: '9px',
            paddingRight: '9px',
          },
        },
        {
          props: {
            variant: 'inlineClusterRemove',
          },
          style: {
            marginTop: '9px',
            borderRadius: 28,
            color: '#DA0000',
            background: 'none',
            '&:hover': { background: '#DA0000', color: '#FFFFFF', },
          },
        },
        {
          props: {
            variant: 'gridActionEdit',
          },
          style: {
            color: `${stormBlue} !important`,
            textTransform: 'none'
          },
        },
        {
          props: {
            variant: 'gridActionView',
          },
          style: {
            color: `${stormBlue} !important`,
            textTransform: 'none'
          },
        },
        {
          props: {
            variant: 'gridActionDelete',
          },
          style: {
            color: `${stormBlue} !important`,
            textTransform: 'none'
          },
        },
        {
          props: {
            variant: 'user',
          },
          style: {
            background: 'none',
          },
        },
        {
          props: {
            variant: 'panel',
          },
          style: {
            display: 'block',
            borderRadius: '0px',
            textTransform: 'none',
            marginRight: '0px !important',
            marginLeft: '0px !important',
            color: `${stormBlue} !important`,
            '&.active': {
              background: '#EBEEF1',
              cursor: 'not-allowed',
            },
          },
        },
        {
          props: {
            variant: 'appbar',
          },
          style: {
            color: 'white',
            borderRadius: '0px',
            background: 'none',
            '&.active': {
              borderBottom: '2px solid',
              borderColor: teal,
            },
          },
        },
        {
          props: {
            variant: 'dashed',
          },
          style: {
            textTransform: 'none',
            border: '2px dashed grey',
          },
        },
      ],
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: primary,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '14px',
        },
      },
    },
  },
};

const theTheme = createMergedTheme(themeOverrides);

export default theTheme;
