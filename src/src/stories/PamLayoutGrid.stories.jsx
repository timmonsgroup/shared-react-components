import React from 'react';
import { HashRouter as Router } from 'react-router-dom';

import Grid from './PamLayoutGrid';
import { GRID_ACTION_TYPE } from '../constants';


// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/PamLayoutGrid',
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
    status: { id: 1, name: 'Status1' },
    initiatedOn: '2021-01-01',
    initiatedBy: { id: 1, name: 'Initiated By 1' },
    lastUpdatedOn: '2021-01-01',
    lastUpdatedBy: { id: 1, name: 'Last Updated By 1' },
    activeOn: '2021-01-01',
    sampleLink: { label: 'Sample Link', url: 'https://www.google.com' },
    moMoney: 1000
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
const layout = {
  'data': {
    'bulkList': '/api/joinRequest/all'
  },
  'grid': {
    'sort': {
      'field': 'createdOn',
      'order': 'asc'
    },
    'idColumn': 'streamID'
  },
  'id': 12,
  'modelId': 30,
  'enabled': true,
  'name': 'Test Layout',
  'editable': false,
  'layoutKey': 'list',
  'type': 2,
  'sections': [{
    'editable': true,
    'enabled': true,
    'name': 'Test Layout',
    'order': 20,
    'layout': [
      {
        'label': 'ID',
        'path': 'id',
        'type': 2,
        'model': {
          'id': 1,
          'modelid': 1,
          'type': 2,
          'name': 'id'
        },
        'required': false,
        'disabled': false,
        'flex': 1
      }, {
        'label': 'Name',
        'path': 'name',
        'type': 0,
        'model': {
          'id': 2,
          'modelid': 1,
          'type': 0,
          'name': 'name'
        },
        'required': false,
        'disabled': false,
        'flex': 1
      }, {
        'label': 'Type',
        'path': 'type',
        'type': 7,
        'possibleChoices': [
          {
            'id': 1,
            'name': 'Type1'
          },
          {
            'id': 2,
            'name': 'Type2'
          }
        ],
        'model': {
          'id': 3,
          'modelid': 1,
          'type': 7,
          'name': 'type'
        },
        'required': false,
        'disabled': false,
        'flex': 2
      }, {
        'label': 'Status',
        'path': 'status',
        'type': 7,
        'possibleChoices': [
          {
            'id': 1,
            'name': 'Active'
          },
          {
            'id': 2,
            'name': 'Inactive'
          }
        ],
        'model': {
          'id': 3,
          'modelid': 1,
          'type': 7,
          'name': 'type'
        },
        'required': false,
        'disabled': false,
        'hidden': true,
        'flex': 2
      },
      {
        'label': 'Link',
        'path': 'sampleLink',
        'type': 100,
        'model': {
          'id': 8,
          'modelid': 10,
          'type': 4,
          'name': 'sampleLink',
        }
      },
      {
        'label': 'More Money',
        'path': 'moMoney',
        'type': 4,
        'model': {
          'id': 8,
          'modelid': 10,
          'type': 4,
          'name': 'moMoney',
        }
      },
    ]
  }]
};

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
  useTypeVariant: true,
  layout: layout,
  actions: [
    {
      label: 'Actions 01',
      order: 0,
      actionList: [
        {
          label: 'Delete',
          type: GRID_ACTION_TYPE.DELETE,
          order: 0,
          clickHandler: (row) => {
            console.log('Delete', row);
          },
          actionProps: {
            variant: 'contained',
            color: 'tertiary',
            'data-testid': 'delete-button'
          }
        },
        {
          label: 'Edit',
          type: GRID_ACTION_TYPE.EDIT,
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
          type: GRID_ACTION_TYPE.VIEW,
          cssClass: 'i-are-view',
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
