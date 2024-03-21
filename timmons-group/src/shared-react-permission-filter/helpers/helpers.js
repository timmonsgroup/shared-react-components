/** @module helpers */

export const hasPermission = (permission, acl) => {
  return acl?.includes(permission) || false;
};

export const hasAllPermissions = (permissions, acl) => {
  for (let perm of permissions) {
    if (!acl?.includes(perm)) {
      return false;
    }
  }

  return true;
};

export const hasAnyPermissions = (permissions, acl) => {
  for (let perm of permissions)
    if (acl.includes(perm))
      return true;

  return false;
};