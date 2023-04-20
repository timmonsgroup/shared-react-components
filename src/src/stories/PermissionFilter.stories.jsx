import React from 'react';
import PermissionFilter from './PermissionFilter';
import {
  BrowserRouter as Router
} from 'react-router-dom';

import { authContext } from '../hooks/useAuth';
import { authMock } from '../mocks/authMock';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Util/PermissionFilter',
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
  // The router wrapper is needed if the PermissionFilter uses routing bits
  return (
    <authContext.Provider value={authMock}>
      <Router>
        <div style={{ width: '150px', border: '1px solid blue', padding: '5px' }}>
          If "content" shows below the filter has passed. If not the content has been filtered.
          <hr />
          <PermissionFilter {...args}>
            <div>content</div>
          </PermissionFilter>
        </div>
      </Router>
    </authContext.Provider>
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


// This needs to be called on load for the story
// authMock.setAuthState({
//   user: null,
//   state: 'LOGGING_IN',
// });

export const ShowLoggingIn = Template.bind({});
ShowLoggingIn.args = {
  acl: sampleACL,
  all: ['admin', 'user', 'This Does Not Exist'],
  showLoggingIn: true
};