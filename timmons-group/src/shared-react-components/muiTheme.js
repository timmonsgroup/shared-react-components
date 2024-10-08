import { createTheme } from '@mui/material';
import { mergeDeep } from './helpers/helpers';
import { GRID_ACTION_TYPE } from './constants';
import LinkBehavior from './components/LinkBehavior';

const darkBlue = '#1F4765';
const lightBlue = '#2b5c92';
const lightGray = '#C8C8C8';
const orange = '#D16400';
const fontFamily = '"PT Sans", "Helvetica", "Arial", "sans-serif"';
const darkGrey = '#878787';

// This is the base theme that is used to create the theme for the app
// It is recommended to create your own theme and then merge it with the base theme
const baseThemeProperties = {
  appBar: {
    logo: {
      height: '100%',
      width: 'auto',
      maxHeight: '44px',
      position: 'relative'
    },
  },
  requiredIndicator: {
    color: 'red',
  },
  pamGrid: {
    width: '100%',
    height: '100%',
    minHeight: '500px',
    minWidth: '700px',
    flexGrow: 1,
    '& .pam-grid-header': { // This is the header to the grid. We set the background color to match the theme from invision
      backgroundColor: lightBlue,
      color: 'white'
    },
    '& .MuiDataGrid-iconButtonContainer > .MuiButtonBase-root': { // Since the header is dark the icons need to be light
      color: 'white'
    },
    '& .MuiDataGrid-menuIcon > .MuiButtonBase-root': { // Since the header is dark the icons need to be light
      color: 'white'
    },
    '& .row-odd': { // Odd rows are slightly darker
      backgroundColor: '#e6ecf2',
    },
    '.MuiDataGrid-toolbarContainer': {
      // This is the container for the toolbar.
      button: {
        marginRight: '10px',
      },
      'button:last-of-type': {
        marginRight: '0px',
      },
    }
  },
  anyFieldLabel: {
    marginBottom: '0.5rem',
    helperText: {
      marginTop: '0.5rem',
    }
  },
  inlineForm: {
    container: {
      position: 'relative',
      marginTop: '16px'
    },
    buttonContainer: {
      marginTop: '55px',
    },
    submitButton: {
      marginRight: '20px'
    },
    resetButton: {}
  },
  gridActionItem: {
    types: {
      [GRID_ACTION_TYPE.ADD]: {
        variant: 'gridActionAdd'
      },
      [GRID_ACTION_TYPE.EDIT]: {
        variant: 'gridActionEdit'
      },
      [GRID_ACTION_TYPE.DELETE]: {
        variant: 'gridActionDelete'
      },
      [GRID_ACTION_TYPE.VIEW]: {
        variant: 'gridActionView'
      },
    },
    color: '#231100',
    paddingX: '0.75rem'
  },
  singleFlexRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between'
  },
  actionLinkRow: {
    fontFamily: 'inherit',
    color: orange,
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'inline-block',
    lineHeight: '1.75',
    marginRight: '10px',
    marginLeft: '5px',
  },
  cardContent: {
    fontSize: '12px',
    marginLeft: '5px',
    marginRight: '5px',
  },
  configView: {
    clusterField: {
      alternateRowColor: '#F6F6F6',
      headerColor: darkBlue,
      headerTextColor: '#FFFFFF',
    },
  },
  clusterRow: {
    paddingTop:2,
    paddingBottom:2,
    paddingLeft:1,
    paddingRight:0
  },
  clusterRowRemove: {
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 2,
    paddingRight: 0
  },
  palette: {
    text: {
      header: darkBlue,
      special: '#FFDE58',
    },
    background: {
      default: '#B3B3B3',
    },
    hover: {
      dark: '#001F35',
    },
    primary: {
      maintwo: darkBlue,
      main: '#002D4C',
      light: '#027AC8',
      text: '#ffffff',
    },
    secondary: {
      main: orange,
      light: '#F68802',
      text: '#ffffff',
    },
    regressive: {
      main: orange,
      light: '#F68802',
      dark: '#683200',
      text: '#ffffff',
      contrastText: '#ffffff',
    },
    tertiary: {
      main: '#939743',
      text: '#44461F',
      light: '#c5c871',
      dark: '#636915',
      lightBlue: lightBlue
    },
    accent: {
      main: '#FFFFFF',
      contrastText: '#1F4765',
    },
    grayscale: {
      main: '#979797',
      light: '#D8D8D8',
      lighter: '#F1F1F1',
      lightest: lightGray,
    },
    toggleBackground: {
      main: '#A5FF98',
    },
  },
  typography: {
    allVariants: {
      fontFamily: '"PT Sans", "Helvetica", "Arial", "sans-serif"',
    },
    detailItem: {
      fontSize: '0.875rem',
      marginTop: '8px',
      marginBottom: '8px',
      '&.label': {
        fontWeight: 'bold'
      }
    },
    detailItemSeparator: {
      fontSize: '0.875rem',
      marginRight: '4px !important',
    },
    navLink: {
      fontFamily: 'inherit',
      fontSize: '0.875rem',
      fontWeight: 'bold',
      color: `${orange} !important`,
      textDecorationColor: `${orange} !important`,
      marginTop: 2,
      marginBottom: 2,
    },
    subHeader: {
      fontFamily: 'inherit',
      fontSize: '0.875rem',
      fontWeight: 'bold',
      color: darkBlue,
      marginTop: 2,
      marginBottom: 2,
    },
    inspector: {
      fontFamily: 'inherit',
      fontSize: '0.875rem',
      marginTop: '8px',
      marginBottom: '8px',
    },
    lineItem: {
      fontSize: '0.875rem',
      marginTop: '8px',
      marginBottom: '8px',
    },
    sectionHeader: {
      fontFamily: 'inherit',
      fontSize: '1rem',
      fontWeight: 'bold',
      color: darkBlue,
      marginTop: 2,
      marginBottom: 2,
    },
    sectionHeaderSpaceAbove: {
      fontFamily: 'inherit',
      fontSize: '1rem',
      fontWeight: 'bold',
      color: darkBlue,
      marginTop: 4,
      marginBottom: 2,
    },
    sectionDescription: {
      fontSize: '1rem',
      fontStyle: 'italic',
      color: darkGrey,
      marginTop: 0,
      marginBottom: 2,
    },
    panelHeader: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: darkBlue,
      marginTop: 2,
      marginBottom: 2,
    },
    modalTitle: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: darkBlue,
      marginTop: '20px',
      marginBottom: '0',
      textAlign: 'center',
    },
    clusterEmptyText: {
      marginBottom: '8px',
      fontSize: '1rem',
      fontStyle: 'italic',
      color: darkGrey,
    }
  },
  components: {
    MuiTypography: {
      defaultProps: {
        fontFamily,
        variantMapping: {
          sectionHeader: 'h1',
          sectionHeaderSpaceAbove: 'h1',
          subHeader: 'h2',
          modalTitle: 'h2',
          panelHeader: 'h2',
          inspector: 'p',
          sectionDescription: 'p',
          clusterEmptyText: 'p',
          navLink: 'a',
          detailItemSeparator: 'span'
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
          color: darkBlue,
        },
      },
    },
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
        underline: 'hover',
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained',
        color: 'primary',
      },
      variants: [
        {
          props: {
            variant: 'gridActionAdd',
          }
        },
        {
          props: {
            variant: 'gridActionEdit',
          },
          style: {
            // insert styles here
          }
        },
        {
          props: {
            variant: 'gridActionView',
          },
          style: {
            // insert styles here
          }
        },
        {
          props: {
            variant: 'gridActionDelete',
          },
          style: {
            // insert styles here
          }
        },
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
            variant: 'user',
          },
          style: {
            borderRadius: 28,
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
            width: '100%',
            textAlign: 'left',
            color: darkBlue,
            '&.active': {
              background: '#EBEEF1',
              cursor: 'not-allowed',
            },
          },
        },
        {
          props: {
            variant: 'inlineClusterRemove',
          },
          style: {
            borderRadius: 28,
            color: '#DA0000',
            background: 'none',
            '&:hover': {
              background: '#DA0000',
              color: '#FFFFFF',
            },
          },
        },
        {
          props: {
            variant: 'clusterAdd',
          },
          style: ({ theme }) => {
            const mainColor = theme.palette.primary.main;
            return {
              padding: '0px',
              color: mainColor,
              fontWeight: 'bold',
              textTransform: 'none',
              background: 'none',
              '&:hover': {
                textDecoration: 'underline',
              }
            };
          }
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
              borderColor: orange,
            },
          },
        },
      ],
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#002D4C',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '14px',
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#CBCBCB'
        }
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: ({ className, theme }) => {
          const clusterI = className?.toLowerCase().indexOf('cluster-field-label');
          const color = clusterI !== -1 ? theme.palette.primary.main : '#505050';
          return {
            color,
            fontSize: '16px',
            fontWeight: 'bold',
          };
        }
      }
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: darkGrey,
          fontSize: '16px',
        }
      }
    },
  },
};

// Export a default MUI theme
// This is used by the MUI ThemeProvider in our storybook
const theTheme = createTheme(baseThemeProperties);

// Use deep merge to merge the base theme with any custom theme properties
const mergeThemeProperties = (themeProperties) => {
  return mergeDeep(baseThemeProperties, themeProperties);
};

// One stop shop for creating a theme with custom properties
const createMergedTheme = (themeProperties) => {
  return createTheme(mergeThemeProperties(themeProperties));
};

export {
  theTheme as default,
  baseThemeProperties,
  mergeThemeProperties,
  createMergedTheme,
  LinkBehavior
};
