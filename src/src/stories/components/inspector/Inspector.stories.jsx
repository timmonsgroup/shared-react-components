import React from 'react';
import Inspector from './Inspector';
import { MemoryRouter } from 'react-router-dom';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Common/components/Inspector',
  component: Inspector,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],

  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

// You should have a muiTheme file in your application that contains this block of code
const darkBlue = '#1F4765';
const orange = '#D16400';

const themeGroup = {
  singleFlexRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
  },
  actionLinkRow: {
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
  flexCard: {
    border: '2px solid #C8C8C8',
    boxShadow: 'none',
    borderRadius: '4px',
    marginBottom: '10px',
    marginTop: '15px',
  },

  inspector: {
    icon: {
      color: orange,
      fontSize: '16px',
      marginRight: '2px',
    },
    noData: {
      color: '#C8C8C8',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    heading: {
      fontFamily: 'Helvetica',
      fontSize: '22px',
      fontWeight: 'bold',
      color: darkBlue,
    },
    clearButton: {
      fontSize: '12px',
      marginBottom: '5px',
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
      heading: {
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        fontSize: '14px',
        color: darkBlue,
        marginTop: '10px',
      },
      legend: {
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        fontSize: '32px',
        color: '#434343',
        marginBottom: '20px',
      },
    },
  },
  filterableCard: {
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: '4px',
      borderBottom: '2px solid #C8C8C8',
    },
  },
};

export const Primary = {
  args: {
    theme: themeGroup,
    heading: 'Sample',
    featuredCard: {
      heading: 'Featured',
      legendLabel: 'Legend',
      legendColor: 'green',
    },
    cardData: [
      {
        heading: 'Heading',
        legendLabel: 'Legend',
        legendColor: 'red',
        toolTip: 'A Sample tooltip',
        footerLabel: 'Link To Somewhere',
        footerLink: '//www.google.com',
        lines: [
          { label: 'Label', value: 'Value', units: 'Units' },
          { label: 'Label', value: 'Value', units: 'Units' },
          { label: 'Label', value: 'Value', units: 'Units' },
          { label: 'Label', value: 'Value', units: 'Units' },
        ],
      },
      {
        heading: 'Heading2',
        legendLabel: 'Legend2',
        legendColor: 'blue',
        footerLabel: 'Link To Somewhere Different',
        footerLink: '//www.google.com',
        lines: [
          { label: 'Label', value: 'Value', units: 'Units' },
          { label: 'Label', value: 'Value', units: 'Units' },
          { label: 'Label', value: 'Value', units: 'Units' },
          { label: 'Label', value: 'Value', units: 'Units' },
        ],
      },
    ],
  },
};

export const NoHeading = {
  args: {
    theme: themeGroup,
    heading: null,
    featuredCard: {
      heading: 'Featured',
      legendLabel: 'Legend',
      legendColor: 'green',
    },
    cardData: [
      {
        heading: 'Heading',
        legendLabel: 'Legend',
        legendColor: 'red',
        toolTip: 'A Sample tooltip',
        footerLabel: 'Link To Somewhere',
        footerLink: '//www.google.com',
        lines: [
          { label: 'Label', value: 'Value', units: 'Units' },
          { label: 'Label', value: 'Value', units: 'Units' },
          { label: 'Label', value: 'Value', units: 'Units' },
          { label: 'Label', value: 'Value', units: 'Units' },
        ],
      },
      {
        heading: 'Heading2',
        legendLabel: 'Legend2',
        legendColor: 'blue',
        footerLabel: 'Link To Somewhere',
        footerLink: '//www.google.com',
        lines: [
          { label: 'Label', value: 'Value', units: 'Units' },
          { label: 'Label', value: 'Value', units: 'Units' },
          { label: 'Label', value: 'Value', units: 'Units' },
          { label: 'Label', value: 'Value', units: 'Units' },
        ],
      },
    ],
  },
};

export const NoFeaturedCard = {
  args: {
    theme: themeGroup,
    heading: 'Sample',
    featuredCard: null,
    cardData: [
      {
        heading: 'Heading',
        legendLabel: 'Legend',
        legendColor: 'red',
        toolTip: 'A Sample tooltip',
        footerLabel: 'Link To Somewhere',
        footerLink: '//www.google.com',
        lines: [
          { label: 'Label', value: 'Value', units: 'Units' },
          { label: 'Label', value: 'Value', units: 'Units' },
          { label: 'Label', value: 'Value', units: 'Units' },
          { label: 'Label', value: 'Value', units: 'Units' },
        ],
      },
      {
        heading: 'Heading2',
        legendLabel: 'Legend2',
        legendColor: 'blue',
        lines: [
          { label: 'Label', value: 'Value', units: 'Units' },
          { label: 'Label', value: 'Value', units: 'Units' },
          { label: 'Label', value: 'Value', units: 'Units' },
          { label: 'Label', value: 'Value', units: 'Units' },
        ],
      },
    ],
  },
};

export const NoData = {
  args: {
    theme: themeGroup,
    heading: null,
    featuredCard: null,
    cardData: [],
  },
};
