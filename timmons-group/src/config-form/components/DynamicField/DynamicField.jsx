/** @module DynamicField */
// Third party
import React from 'react';
import PropTypes from 'prop-types';

// SRC Components
import AnyField from '../AnyField';
import ClusterField from '../ClusterField';

// Hooks, helpers, and constants
import { FIELD_TYPES } from '@timmons-group/shared-react-components';

/**
 * A Helper component to check if a field is a cluster field and render the appropriate component
 * @function
 * @param {object} props - props object
 * @param {object} props.control - react-hook-form control object
 * @param {object} props.field - field object
 * @param {object} [props.options] - options object
 * @param {object} [props.fieldComponentProps] - field component props
 * @returns {React.ReactElement}
 * @example
 * <DynamicField
    field={field}
    control={control}
    options={options.fieldOptions || {}}
  />
 */
const DynamicField = ({ control, field, options = {}, fieldComponentProps = {}, ...props }) => {
  const layout = field?.render || {};
  if (layout.hidden) {
    return null;
  }
  const { type } = layout;

  if (type === FIELD_TYPES.CLUSTER) {
    return <ClusterField control={control} field={field} options={options} {...props} />;
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
  options: PropTypes.object,
  fieldComponentProps: PropTypes.object,
};
export default DynamicField;