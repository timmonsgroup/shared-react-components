

import PropTypes from 'prop-types';

//import { Navigate } from 'react-router-dom';
import { hasAllPermissions, hasPermission, hasAnyPermissions } from '../../helpers';
import { useAuth } from '@timmons-group/shared-react-auth';

// TODO: Remove this dependency, maybe allow the end user to pass in a component to render instead of this
import CircularProgress from '@mui/material/CircularProgress';
import { AUTH_STATES } from '../../constants.js';

/**
 * @description Component that checks if the user has the required permissions
 * Should set ONE of the following properties permission, any, OR all
 * @param {object} props
 * @param {string} [props.permission] A single required permission
 * @param {array<string>} [props.any] Passes if ANY of the permissions are met
 * @param {array<string>} [props.all] Passes if ALL of the permissions are met
 * @param {boolean} [props.isRoute] If true, the component will render a Navigate component instead of null if the user does not have the required permissions
 * @param {Route401Props} [props.noAuthOptions] If isRoute is true, this component will be rendered instead of the Navigate component if the user does not have the required permissions
 * @param {boolean} [props.showLoggingIn] - If true, the component will render a CircularProgress component if the user is in the LOGGING_IN state
 * @param {boolean} [props.showIfLoggedIn] - If true, the component will render the children if the user is in the LOGGED_IN state
 * @param {React.ReactNode} [props.children] - The children to render if the user has the required permissions
 * @returns {React.ReactElement} - The children to render if the user has the required permissions OR null if the user does not have the required permissions
 *
 * @example
    SampleUsage:
    // Show the children if the user has the admin permission
    <PermissionFilter permission="admin">
        <div>Admin</div>
    </PermissionFilter>
    // Show the children if the user has the admin OR user permission
    <PermissionFilter any={["admin", "user"]}>
        <div>Admin or User</div>
    </PermissionFilter>
    // Show the children if the user has the admin AND user permission
    <PermissionFilter all={["admin", "user"]}>
        <div>Admin and User</div>
    </PermissionFilter>

    // Route example. If the user does not have the required permissions, they will be redirected to the root
    <Route path="applications/addfd" element={
        <PermissionFilter isRoute={true} permission={ACLS.CAN_ADD_APPLICATION}>
          <ApplicationForm type={GRANT_APP_TYPES.FD} />
        </PermissionFilter>
      }
    />;
 */
const PermissionFilter = ({ permission, any, all, isRoute, showLoggingIn, showIfLoggedIn, children, ...props }) => {
  // Get the user acls from the auth hook authState
  const { authState } = useAuth();

  // As this is under the authProvider context it will render on every authState change

  // props.acl is a backdoor to allow storybook stories to pass in acls
  const acl = authState?.user?.acl || props.acl;

  // If the permissionFilter is a route, return a Navigate component to the root.
  //const returned = isRoute === true ? (<Navigate to="/" />) : null;
  const returned = null;

  // There is not component to render OR there are no acls to check
  if ((!children || !acl || !acl.length) && !showLoggingIn && !showIfLoggedIn) {
    return returned;
  }

  if (authState?.state === AUTH_STATES.LOGGING_IN && showLoggingIn) {
    return <CircularProgress color="accent" />;
  }

  // Check if the user has the singular permission
  if (permission) {
    if (hasPermission(permission, acl)) {
      return children;
    }
  } else if (any) {
    // Check if the user has any of the permissions
    if (hasAnyPermissions(any, acl)) {
      return children;
    }
  } else if (all) {
    // Check if the user has all of the permissions
    return hasAllPermissions(all, acl) ? children : returned;
  } else if (showIfLoggedIn) {
    if (authState?.state === AUTH_STATES.LOGGED_IN) {
      return children;
    } else {
      return "Not logged in not rendering"
    }
  }
  // User has failed all the checks, return a null component (nothing rendered) or a Navigate component to the root.
  return returned;
};

PermissionFilter.propTypes = {
  // ACL is a list of strings
  acl: PropTypes.array,
  permission: PropTypes.string,
  any: PropTypes.array,
  all: PropTypes.array,
  isRoute: PropTypes.bool,
  showLoggingIn: PropTypes.bool,
  children: PropTypes.node,
};

PermissionFilter.defaultProps = {
  acl: [],
  permission: null,
  any: null,
  all: null,
  isRoute: false,
};

export default PermissionFilter;
