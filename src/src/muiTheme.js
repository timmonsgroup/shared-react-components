import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';
import { mergeDeep } from './helpers/helpers';
import { GRID_ACTION_TYPE } from './constants';

// function LinkBehaviour avoids having to do LinkBehavior.displayName = 'LinkBehavior';
const LinkBehavior = forwardRef(function LinkBehavior(props, ref) {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  //If href starts with http or https, then it is an external link
  if (href.startsWith('http')) {
    return <a href={href} ref={ref} {...other} />;
  }
  return <NavLink end ref={ref} to={href} {...other} />;
});

LinkBehavior.propTypes = {
  href: PropTypes.oneOfType([
    PropTypes.shape({
      hash: PropTypes.string,
      pathname: PropTypes.string,
      search: PropTypes.string,
    }),
    PropTypes.string,
  ]).isRequired,
};

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
  inspector: {
    icon: {
      color: orange,
      fontSize: '16px',
      marginRight: '3px'
    },
    noData: {
      color: lightGray,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '70vh',
    },
    heading: {
      fontFamily: 'sans-serif',
      fontSize: '22px',
      fontWeight: 'bold',
      color: darkBlue,
    },
    clearButton: {
      fontSize: '12px',
      marginBottom: '5px'
    },
    cardHeader: {
      lineHeight: '1.5',
      marginRight: '10px',
      marginLeft: '5px',
      fontSize: '16px',
      fontWeight: '600',
    },
    cardFooter: {
      lineHeight: '1.75',
      marginRight: '10px',
      marginLeft: '5px',
    },
    cardFooterLinks: {
      color: orange,
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'inline-block',
    },
    featuredCard: {
      heading: { fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '14px', color: darkBlue, marginTop: '10px' },
      legend: { fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '32px', color: '#434343', marginBottom: '20px' },
    }
  },
  configView: {
    clusterField: {
      alternateRowColor: '#F6F6F6',
      headerColor: darkBlue,
      headerTextColor: '#FFFFFF',
    },
  },
  filterableCard: {
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: '4px',
      borderBottom: `2px solid ${lightGray}`,
    }
  },
  palette: {
    text: {
      header: darkBlue,
      special: '#FFDE58',
    },
    inspectorItem: {
      outer: {
        border: '1px solid black',
        borderRadius: '5px',
        marginBottom: '10px',
        marginTop: '15px',
      },
      inner: {
        padding: '0.5em',
      },
      divider: {
        backgroundColor: 'black',
      }
    },
    mapSidebar: {
      background: lightBlue,
      selectedBackground: '#002D4C',
      text: '#ffffff',
      selectedText: '#ffffff',
    },
    slider: {
      default: '#33CF4D',
      border: '6px solid #fff'
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
