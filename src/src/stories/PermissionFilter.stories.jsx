import React from 'react';
import PermissionFilter from './PermissionFilter';
import {
  BrowserRouter as Router
} from 'react-router-dom';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'CCP/PermissionFilter',
  component: PermissionFilter,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    acl: {
      name: 'ACL',
      control: {
        type: 'array',
      }
    },
    permission: {
      name: 'Permission',
      control: {
        type: 'string',
      }
    },
    any: {
      name: 'Any',
      control: {
        type: 'array',
      }
    },
    all: {
      name: 'All',
      control: {
        type: 'array',
      }
    }
  },
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => {
  // The router wrapper is needed because the AppBar uses routing bits
  return (
    <Router>
      <div style={{ width: '150px', border: '1px solid blue', padding: '5px' }}>
        If "content" shows below the filter has passed. If not the content has been filtered.
        <hr />
        <PermissionFilter {...args}>
          <div>content</div>
        </PermissionFilter>
      </div>
    </Router>
  );
};

const sampleACL = ['user', 'admin'];

export const LoggedOut = Template.bind({});
LoggedOut.args = {};

export const PermissionWhereMatches = Template.bind({});
PermissionWhereMatches.args = {
  acl: sampleACL,
  permission: 'admin'
};

export const AnyWhereMatches = Template.bind({});
AnyWhereMatches.args = {
  acl: sampleACL,
  any: ['admin']
};

export const AllWhereMatches = Template.bind({});
AllWhereMatches.args = {
  acl: sampleACL,
  all: ['admin', 'user']
};

export const PermissionWhereNoMatch = Template.bind({});
PermissionWhereNoMatch.args = {
  acl: sampleACL,
  permission: 'This Does Not Exist'
};

export const AnyWhereNoMatch = Template.bind({});
AnyWhereNoMatch.args = {
  acl: sampleACL,
  any: ['This Does Not Exist']
};

export const AllWhereOneDoesNotMatch = Template.bind({});
AllWhereOneDoesNotMatch.args = {
  acl: sampleACL,
  all: ['admin', 'user', 'This Does Not Exist']
};