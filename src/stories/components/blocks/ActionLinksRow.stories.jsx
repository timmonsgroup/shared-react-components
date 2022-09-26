import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import ActionLinksRow from './ActionLinksRow';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'CPP/components/blocks/Action Links Row',
  component: ActionLinksRow,
  decorators: [(Story) => <MemoryRouter><Story /></MemoryRouter>],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
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

  inspector: {
    icon: {
      color: orange,
      fontSize: '16px',
      marginRight: '2px'
    },
    cardContent: {
      fontSize: '12px',
      marginLeft: '5px',
      marginRight: '5px',
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
  }
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <ActionLinksRow {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  links: [
    {
      label: 'Link 1',
      url: '//www.google.com',
      target: '_blank',
    },
    {
      label: 'Link 2',
      url: '//www.google.com',
      target: '_blank',
    },
  ],
  themeGroup: tg,
};

export const NoLinks = Template.bind({});
NoLinks.args = {
  links: null,
  themeGroup: tg
};

export const OneLink = Template.bind({});
OneLink.args = {
  links: [
    {
      label: 'Link 1',
      url: '//www.google.com',
      target: '_blank',
    }
  ],
  themeGroup: tg,
};

export const TwoLinks = Template.bind({});
TwoLinks.args = {
  links: [
    {
      label: 'Link 1',
      url: '//www.google.com',
      target: '_blank',
    },
    {
      label: 'Link 2',
      url: '//www.timmons.com',
      target: '_blank',
    },
  ],
  themeGroup: tg,
};

export const ThreeLinks = Template.bind({});
ThreeLinks.args = {
  links: [
    {
      label: 'Link 1',
      url: '//www.google.com',
      target: '_blank',
    },
    {
      label: 'Link 2',
      url: '//www.timmons.com',
      target: '_blank',
    },
    {
      label: 'Link 3',
      url: '//www.yahoo.com',
      target: '_self',
    },
  ],
  themeGroup: tg,
};

export const WithoutDivider = Template.bind({});
WithoutDivider.args = {
  links: [
    {
      label: 'Link 1',
      url: '//www.google.com',
      target: '_blank',
    },
    {
      label: 'Link 2',
      url: '//www.timmons.com',
      target: '_blank',
    },
    {
      label: 'Link 3',
      url: '//www.yahoo.com',
      target: '_self',
    },
  ],
  includeDivider: false,
  themeGroup: tg,
};
