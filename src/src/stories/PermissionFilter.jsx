import React from 'react';
import PropTypes from 'prop-types';

import { Navigate } from 'react-router-dom';
import { hasAllPermissions, hasPermission, hasAnyPermissions } from '../helpers';
import { useAuth } from '../hooks/useAuth';

/**
 * Component that checks if the user has the required permissions
 * Should set ONE of the following properties permission, any, OR all
 * permission {array of strings} - A single required permission
 * any {array of strings} - Passes if ANY of the permissions are met
 * all {array of strings} - Passes if ALL of the permissions are met
 * isRoute {boolean} - If true, the component will render a Navigate component instead of null if the user does not have the required permissions
 * children {React.ReactNode} - The children to render if the user has the required permissions
 */
const PermissionFilter = ({ permission, any, all, isRoute, children, ...props }) => {
  // Get the user acls from the auth hook authState
  const { authState } = useAuth();
  // props.acl is a backdoor to allow storybook stories to pass in acls
  const acl = authState?.user?.acl || props.acl;

  // If the permissionFilter is a route, return a Navigate component to the root.
  const returned = isRoute === true ? (<Navigate to="/" />) : null;

  // There is not component to render OR there are no acls to check
  if (!children || !acl || !acl.length) {
    return returned;
  }

  // Check if the user has the singular permission
  if (hasPermission(permission, acl)) {
    return children;
  } else if (any) {
    // Check if the user has any of the permissions
    if (hasAnyPermissions(any, acl)) {
      return children;
    }
  } else if (all) {
    // Check if the user has all of the permissions
    return hasAllPermissions(all, acl) ? children : returned;
  }
  // User has failed all the checks, return a null component (nothing rendered) or a Navigate component to the root.
  return returned;
}

PermissionFilter.propTypes = {
  // ACL is a list of strings
  acl: PropTypes.array,
  permission: PropTypes.string,
  any: PropTypes.array,
  all: PropTypes.array,
  isRoute: PropTypes.bool,
}

PermissionFilter.defaultProps = {
  acl: [],
  permission: null,
  any: null,
  all: null,
  isRoute: false,
};


export default PermissionFilter;

/*
		SampleUsage:
		<PermissionFilter permission="admin">
				<div>Admin</div>
		</PermissionFilter>
		<PermissionFilter any={["admin", "user"]}>
				<div>Admin or User</div>
		</PermissionFilter>
		<PermissionFilter all={["admin", "user"]}>
				<div>Admin and User</div>
		</PermissionFilter>
*/
