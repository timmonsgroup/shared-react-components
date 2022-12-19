import React from 'react';
import FlexCard from './FlexCard';
import { MemoryRouter } from 'react-router-dom';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Common/components/blocks/Flex Card',
  component: FlexCard,
  decorators: [(Story) => <MemoryRouter><Story /></MemoryRouter>],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
  },
};

const darkBlue = '#1F4765';
const orange = '#D16400';

const tg = {
  singleFlexRow: {
    display: 'flex', 
    flexDirection: 'row', 
    flexWrap: 'nowrap', 
    justifyContent: 'space-between'    
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
      marginRight: '2px'
    },
    heading: {
      fontFamily: 'Helvetica',
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
      heading: { fontFamily: 'sans-serif', fontWeight:'bold', fontSize: '14px', color: darkBlue, marginTop: '10px' },
      legend: { fontFamily: 'sans-serif', fontWeight:'bold', fontSize: '32px', color: '#434343', marginBottom: '20px' },
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
  }
};
// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <FlexCard {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  themeGroup: tg,
  item: {
    heading: 'Sample',
    toolTip: 'Tooltip',
    legendLabel: 'Legend Label',
    legendColor: 'red',
    lines: [
      { label: 'Label', value: 10, units: 'Units', legend: 'Legend', legendColor: 'red' },
      { label: 'Label2', value: 20, units: 'Acres', legend: 'Legend', legendColor: 'white' },
      { label: 'Label3', value: 30, units: 'Miles', legend: 'Legend', legendColor: 'blue' },
    ],
    footerLinks: [
      { label: 'Link 1', url: '//www.google.com' },
      { label: 'Link 2', url: '//www.google.com'},
    ]
  }
};

export const UnitsOptional = Template.bind({});
UnitsOptional.args = {
  themeGroup: tg,
  item: {
    heading: 'Sample',
    toolTip: 'The sample tooltip text.',
    legendLabel: 'Legend',
    legendColor: 'red',
    lines: [
      { label: 'Label', value: 10, units: null, legend: 'Legend', legendColor: 'red' },
      { label: 'Label2', value: 20, units: 'Acres', legend: 'Legend', legendColor: 'white' },
      { label: 'Label3', value: 30, units: null, legend: 'Legend', legendColor: 'blue' },
    ],
    footerLinks: [
      { label: 'Link 1', url: '//www.google.com' },
      { label: 'Link 2', url: '//www.google.com'},
    ]
  }
};

export const FooterOptional = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
FooterOptional.args = {
  themeGroup: tg,
  item: {
    heading: 'Sample',
    toolTip: 'The sample tooltip text.',
    legendLabel: 'Legend',
    legendColor: 'red',
    lines: [
      { label: 'Label', value: 10, units: 'Units', legend: 'Legend', legendColor: 'red' },
      { label: 'Label2', value: 20, units: 'Acres', legend: 'Legend', legendColor: 'white' },
      { label: 'Label3', value: 30, units: 'Miles', legend: 'Legend', legendColor: 'blue' },
    ],
    footerLinks: null
  }
};

export const HeaderOptional = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
HeaderOptional.args = {
  themeGroup: tg,
  item: {
    heading: null,
    toolTip: 'The sample tooltip text.',
    legendLabel: 'Legend',
    legendColor: 'red',
    lines: [
      { label: 'Label', value: 10, units: 'Units', legend: 'Legend', legendColor: 'red' },
      { label: 'Label2', value: 20, units: 'Acres', legend: 'Legend', legendColor: 'white' },
      { label: 'Label3', value: 30, units: 'Miles', legend: 'Legend', legendColor: 'blue' },
    ],
    footerLinks: [
      { label: 'Link 1', url: '//www.google.com' },
      { label: 'Link 2', url: '//www.google.com'},
    ]
  }
};

export const NoHeaderOrFooter = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
NoHeaderOrFooter.args = {
  themeGroup: tg,
  item: {
    heading: null,
    toolTip: 'The sample tooltip text.',
    legendLabel: 'Legend',
    legendColor: 'red',
    lines: [
      { label: 'Label', value: 10, units: 'Units', legend: 'Legend', legendColor: 'red' },
      { label: 'Label2', value: 20, units: 'Acres', legend: 'Legend', legendColor: 'white' },
      { label: 'Label3', value: 30, units: 'Miles', legend: 'Legend', legendColor: 'blue' },
    ],
    footerLinks: null
  }
};
