/** @module DynamicField */
// Third party
import React from 'react';
import PropTypes from 'prop-types';

// SRC Components
import AnyField from './AnyField';

// Hooks, helpers, and constants
import { FIELD_TYPES } from '../constants';
import ClusterField from './ClusterField';

/**
 * A Helper component to check if a field is a cluster field and render the appropriate component
 * @function
 * @param {object} props - props object
 * @param {object} props.control - react-hook-form control object
 * @param {object} props.field - field object
 * @returns {React.ReactElement}
 */
const DynamicField = ({ control, field, ...props }) => {
  const layout = field?.render || {};
  if (layout.hidden) {
    return null;
  }
  const { type } = layout;

  if (type === FIELD_TYPES.CLUSTER) {
    return <ClusterField control={control} field={field} {...props} />;
  }

  return (
    <AnyField layout={layout} control={control} {...props} />
  );
};

DynamicField.propTypes = {
  control: PropTypes.object,
  field: PropTypes.shape({
    render: PropTypes.object,
  }),
};
export default DynamicField;