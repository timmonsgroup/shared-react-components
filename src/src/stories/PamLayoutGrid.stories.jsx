import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Grid from './PamLayoutGrid';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'CCP/PamLayoutGrid',
  component: Grid,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    data: { control: 'array' },
    layout: { control: 'array' },
    showToolbar: { control: 'boolean' },
  },
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => (<Router><Grid {...args} /></Router>);

/**
 * This is sample data for the grid. It is not a real API response.
 */
const data = [
  {
    id: '1',
    name: 'Name 1',
    type: { id: 1, name: 'Type1' },
    status: { id: 1, name: 'Status1'},
    initiatedOn: '2021-01-01',
    initiatedBy: { id: 1, name: 'Initiated By 1' },
    lastUpdatedOn: '2021-01-01',
    lastUpdatedBy: { id: 1, name: 'Last Updated By 1' },
    activeOn: '2021-01-01',
    sampleLink: { label: 'Sample Link', url: 'https://www.google.com' },
  },
  {
    id: '2',
    name: 'Name 2',
    type: { id: 1, name: 'Type1' },
    status: { id: 2, name: 'Status2' },
    sampleLink: 'https://www.google.com',
  },
  {
    id: '3',
    name: 'Name 3',
    type: { id: 2, name: 'Type2' },
    status: { id: 3, name: 'Status3' },
  },
  {
    id: '4',
    name: 'Name 4',
    sampleLink: { label: 'Sample Link', link: 'doop' },
  },
  {
    id: '5',
    name: 'Name 5',
    type: { id: 2, name: 'Type2' },
    status: { id: 1, name: 'Status1' },
  },
  {
    id: '6',
    name: 'Name 6',
    type: { id: 1, name: 'Type1' },
    status: { id: 2, name: 'Status2' },
    sampleLink: { label: 'Sample Link', url: 'https://www.google.com' },
  },
  {
    id: '7',
    name: 'Name 7',
    type: { id: 2, name: 'Type2' },
    status: { id: 3, name: 'Status3' },
  },
  {
    id: '8',
    name: 'Name 8',
    type: { id: 2, name: 'Type2' },
    sampleLink: { label: 'Sample Link', link: 'doop' },
  },
  {
    id: '9',
    name: 'Name 9',
    type: { id: 2, name: 'Type2' },
    status: { id: 1, name: 'Status1' },
  },
  {
    id: '10',
    name: 'Name 10',
    type: { id: 1, name: 'Type1' },
    status: { id: 2, name: 'Status2' },
    sampleLink: { label: 'Sample Link', url: 'https://www.google.com' },
  },
  {
    id: '11',
    name: 'Name 11',
    type: { id: 1, name: 'Type1' },
    status: { id: 3, name: 'Status3' },
  },
  {
    id: '12',
    name: 'Name 12',
    sampleLink: { label: 'Sample Link', link: 'doop' },
  },
  {
    id: '13',
    name: 'Name 13',
    type: { id: 1, name: 'Type1' },
    status: { id: 1, name: 'Status1' },
  },
  {
    id: '14',
    name: 'Name 14',
    type: { id: 2, name: 'Type2' },
    status: { id: 2, name: 'Status2' },
    sampleLink: { label: 'Sample Link', url: 'https://www.google.com' },
  },
  {
    id: '15',
    name: 'Name 15',
    type: { id: 1, name: 'Type1' },
    status: { id: 3, name: 'Status3' },
  },
  {
    id: '16',
    name: 'Name 16',
    type: { id: 1, name: 'Type1' },
    sampleLink: { label: 'Sample Link', link: 'doop' },
  },
  {
    id: '17',
    name: 'Name 17',
    status: { id: 1, name: 'Status1' },
  },
  {
    id: '18',
    name: 'Name 18',
    type: { id: 1, name: 'Type1' },
    status: { id: 2, name: 'Status2' },
    sampleLink: { label: 'Sample Link', url: 'https://www.google.com' },
  },
  {
    id: '19',
    name: 'Name 19',
    type: { id: 2, name: 'Type2' },
    status: { id: 3, name: 'Status3' },
  },
  {
    id: '20',
    name: 'Name 20',
    type: { id: 2, name: 'Type2' },
    sampleLink: { label: 'Sample Link', link: 'doop' },
  }
];

/**
 * This is copied from the response for a layout.
 */
const layout = [{ name: 'test', fields: [
  {
    'hidden': false,
    'required': false,
    'disabled': false,
    'type': 1,
    'path': 'fields.name',
    'isArrayData': false,
    'isStringId': false,
    'width': 200,
    'render': {
      'type': 1,
      'label': 'Name',
      'name': 'name',
      'hidden': false,
      'required': false,
      'disabled': false,
      'readOnly': false
    }
  },
  {
    'hidden': false,
    'required': true,
    'disabled': false,
    'type': 7,
    'path': 'fields.type',
    'isArrayData': false,
    'isStringId': false,
    'width': 250,
    'render': {
      'type': 7,
      'label': 'Type',
      'name': 'type',
      'hidden': false,
      'required': true,
      'disabled': false,
      'readOnly': false,
      'choices': [
        {
          'label': 'Type1',
          'id': 1
        },
        {
          'label': 'Type2',
          'id': 2
        }
      ]
    }
  },
  {
    'hidden': false,
    'required': true,
    'disabled': false,
    'type': 7,
    'path': 'fields.status',
    'isArrayData': false,
    'isStringId': false,
    'width': 175,
    'render': {
      'type': 7,
      'label': 'Status',
      'name': 'status',
      'hidden': false,
      'required': true,
      'disabled': false,
      'readOnly': false,
      'choices': [
        {
          'label': 'Status1',
          'id': 1
        },
        {
          'label': 'Status2',
          'id': 2
        },
        {
          'label': 'Status3',
          'id': 3
        }
      ]
    }
  },
  {
    'hidden': false,
    'required': true,
    'disabled': false,
    'type': 5,
    'path': 'fields.initiatedOn',
    'isArrayData': false,
    'isStringId': false,
    'width': 150,
    'render': {
      'type': 5,
      'label': 'Planning Initiated On',
      'name': 'initiatedOn',
      'hidden': false,
      'required': true,
      'disabled': false,
      'readOnly': false
    }
  },
  {
    'hidden': false,
    'required': false,
    'disabled': false,
    'type': 5,
    'path': 'fields.activeOn',
    'isArrayData': false,
    'isStringId': false,
    'width': 150,
    'render': {
      'type': 5,
      'label': 'Active as of',
      'name': 'activeOn',
      'hidden': false,
      'required': false,
      'disabled': false,
      'readOnly': false
    }
  },
  {
    'hidden': false,
    'required': false,
    'disabled': false,
    'type': 100,
    'path': 'fields.sampleLink',
    'isArrayData': false,
    'isStringId': false,
    'width': 300,
    'render': {
      'type': 100,
      'label': 'Published Plan Reference URL',
      'name': 'sampleLink',
      'hidden': false,
      'required': false,
      'disabled': false,
      'readOnly': false
    }
  }
]
}];

/**
 * This example shows how to use the layout to render a table with a layout and data.
 */
export const WithData = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
WithData.args = {
  data: data,
  layout: layout,
};

export const WithDataAndActions = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
WithDataAndActions.args = {
  data: data,
  layout: layout,
  actions: [
    {
      label: '',
      order: 0,
      actionList: [
        {
          label: 'Delete',
          order: 0,
          clickHandler: (row) => {
            console.log('Delete', row);
          }
        },
        {
          label: 'Edit',
          order: 1,
          clickHandler: (row) => {
            console.log('Edit', row);
          }
        },
      ],
    },
    {
      label: 'Actions 02',
      order: 1,
      actionList: [
        {
          label: 'View',
          order: 0,
          clickHandler: (row) => {
            console.log('View', row);
          }
        },
      ],
    }
  ]
};

export const WithDataAndToolbar = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
WithDataAndToolbar.args = {
  data: data,
  layout: layout,
  showToolbar: true,
};

/**
 * This example shows how to use the layout to render a table with a layout and no data.
 */
export const NoData = Template.bind({});
NoData.args = {
  data: [],
  layout: layout,
};

/**
 * This example shows how to use the table with autoHeight and data.
 */
export const AutoHeight = Template.bind({});
AutoHeight.args = {
  data: data,
  layout: layout,
  autoHeight: true, // This is just a flag and the implementation of the component just needs to say autoHeight
};

