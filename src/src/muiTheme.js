import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';

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
const orange = '#D16400';

const theTheme = createTheme({
  appBar: {
    logo: {
      height: '100%',
      width: 'auto',
      maxHeight: '44px',
      top: '3px',
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
    }
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
  communityChip: {
    backgroundColor: '#CCE0FF',
  },
  communityShapeBox: {
    border: '1px solid #C4C4C4',
    borderRadius: '4px',
    padding: '8px',
    margin: '5px 0px',
  },
  communityMap: {
    position: 'relative',
    marginTop: '16px',
    paddingLeft: {
      xs: '16px',
      lg: '7.8%',
    },
    paddingRight: {
      xs: '16px',
      lg: '7.8%',
    },
  },
  inspector: {
    icon: {
      color: orange,
      fontSize: '16px',
      marginRight: '2px'
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
      lineHeight: '1.75',
      marginRight: '10px',
      marginLeft: '5px',
      fontSize: '12px',
      fontWeight: 'bold',
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
  filterableCard: {
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: '4px',
      borderBottom: '2px solid #C8C8C8'
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
      default: '#F0F0F0',
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
      text: '#ffffff',
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
      lightest: '#C8C8C8',
    },
    toggleBackground: {
      main: '#A5FF98',
    },
  },
  typography: {
    fontFamily: ['"PT Sans"', 'Helvetica', 'Arial', 'sans-serif'].join(','),
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
      fontSize: '0.875rem',
      fontWeight: 'bold',
      color: darkBlue,
      marginTop: 2,
      marginBottom: 2,
    },
    inspector: {
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
      fontSize: '1rem',
      fontWeight: 'bold',
      color: darkBlue,
      marginTop: 2,
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
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          sectionHeader: 'h1',
          subHeader: 'h2',
          modalTitle: 'h2',
          panelHeader: 'h2',
          inspector: 'p',
          navLink: 'a'
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
  },
});

export default theTheme;
