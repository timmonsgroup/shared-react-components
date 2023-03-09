// Third party
import React from 'react';
import PropTypes from 'prop-types';
import { useFieldArray, useFormContext } from 'react-hook-form';

// MUI components
import { Divider, FormHelperText, Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

// SRC Components
import AnyField from './AnyField';
import Button from './Button';
import AnyFieldLabel from './AnyFieldLabel';

// Hooks, helpers, and constants
import { FIELD_TYPES } from '../constants';
import { getFieldValue } from '../hooks';

/**
 * A Helper component to check if a field is a cluster field and render the appropriate component
 * @param {object} props - props object
 * @param {object} props.control - react-hook-form control object
 * @param {object} props.field - field object
 * @returns {React.ReactElement}
 */
const DynamicField = ({ control, field, ...props }) => {
  const layout = field?.render || {};
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

/**
 * @typedef {object} RenderAddButtonProps
 * @property {object} layout - layout object
 * @property {string} layout.addLabel - label for the add button
 * @property {Function} append - append function from useFieldArray
 * @property {Function} trigger - trigger function from useFormContext
 * @property {object} initValues - initial values for the new batch of fields
 *
 */

/**
 * A component to render a cluster of fields
 * @param {RenderAddButtonProps} props - props object
 * @returns {React.ReactElement} - React element of the button and divider
 */
const renderDefaultAddButton = ({ layout, onClick }) => {
  const { addLabel } = layout || {};

  return (
    <Button onClick={onClick}>{addLabel || 'Add'}</Button>
  );
};


/**
 * @typedef {object} RenderRemoveButtonProps
 * @property {object} layout - layout object
 * @property {string} layout.removeLabel - label for the remove button
 * @property {Function} remove - remove function from useFieldArray
 * @property {Function} trigger - trigger function from useFormContext
 * @property {number} index - index of the field
 * @property {Function} onClick - onClick function for the button
 */

/**
 * The default remove button for the ClusterField component
 * @param {RenderRemoveButtonProps} props
 * @returns {React.ReactElement} - React element of the button
 */
const renderDefaultRemoveButton = ({ layout, onClick }) => {
  const { removeLabel } = layout || {};
  return (
    <>
      <Divider />
      <Button onClick={onClick}>{removeLabel || 'Remove'}</Button>
    </>
  );
};


/**
 * ClusterField component will render a field that contains a list of subfields
 * @param {object} props - props object
 * @param {object} props.control - react-hook-form control object
 * @param {object} props.field - field object
 * @param {object} props.props - props object
 * @param {Function} props.renderAddButton - render function for the add button
 * @param {Function} props.renderRemoveButton - render function for the remove button
 * @returns {React.ReactElement}
 */
export const ClusterField = ({ control, field, renderAddButton, renderRemoveButton, ...props }) => {
  const columns = props?.twoColumnCluster === true ? 2 : 1;
  // Get all errors from react-hook-form formState and the trigger function from useFormContext
  const { useFormObject } = useFormContext();
  const { formState: { errors }, trigger } = useFormObject;

  // Find any errors for the cluster field
  const error = errors[field?.render?.name];
  const layout = field?.render || {};
  const subFields = field?.subFields || [];

  // Create an object with the default values set for each field in the cluster
  const initValues = {};
  subFields.forEach((subField) => {
    initValues[subField.render?.name] = getFieldValue(subField, {}).value;
  });
  /**
    * It is important this is NOT an empty object.
    * If an empty object is used in conjuction with defaultValues (i.e. editing) as fields are added and removed
    * the defaultValues will be added to newly appended fields in their respective indexes.
    * Example (with defaultValues):
    * 1. Existing fields: [{name: 'test1'}, {name: 'test2'}]
    * 2. Delete a cluster
    * 3. Current fields: [{name: 'test1'}]
    * 4. Add a cluster
    * 5. The current are now fields: [{name: 'test1'}, {name: 'test2'}]
    * Instead of the expected: [{name: 'test1'}, {name: ''}]
  */

  // Get the fields and append / remove functions from useFieldArray
  // "fields" from useFieldArray is an array of objects that contain the values of the fields
  // Not to be confused with the "field" prop that is passed into this component
  const { fields, append, remove } = useFieldArray({
    control,
    name: layout.name,
    shouldUnregister: true,
  });

  // If the renderAddButton / renderRemoveButton props exist and are functions, use them, otherwise use the default render functions
  const addButtonRender = renderAddButton && renderAddButton instanceof Function ? renderAddButton : renderDefaultAddButton;

  // A default click handler for the add button
  // If a custom renderAddButton is passed in it will still be passed this method as a prop 'onClick'
  const addClick = (layout, initValues) => {
    // append should NOT be called with an empty object
    // If it is, there is a chance for zombie data.
    append(initValues);

    if (layout?.name) {
      trigger(layout?.name);
    }
  };

  const removeButtonRender = renderRemoveButton && renderRemoveButton instanceof Function ? renderRemoveButton : renderDefaultRemoveButton;

  // A default click handler for the remove button
  // If a custom renderRemoveButton is passed in it will still be passed this method as a prop 'onClick'
  const removeClick = (layout, index) => {
    remove(index);

    if (layout?.name) {
      trigger(layout.name);
    }
  };

  return (
    <>
      <Box {...props}>
        <AnyFieldLabel htmlFor={layout.name} label={layout.label} required={!!layout.required} disabled={layout.disabled} iconText={layout.iconHelperText} error={!!error} />
        {error && <FormHelperText error={true}>{error?.message}</FormHelperText>}
        {layout?.helperText && <FormHelperText error={false}>{layout?.helperText}</FormHelperText>}
        {fields.map((cluster, index) => {
          return (<Grid container spacing={2} xs={12} sx={{ padding: '0px' }} key={cluster.id}>
            {subFields.map((subField) => {
              return (
                <Grid xs={6} key={`${cluster.id}-${subField.render?.name}`}>
                  <AnyField isNested={true} nestedName={`${layout?.name}.${index}.${subField.render?.name}`} control={control} layout={subField.render} {...props} />
                </Grid>
              );
            })}
            <Grid xs={12}>
              {removeButtonRender({ layout, remove, trigger, index, onClick: () => removeClick(layout, index) })}
            </Grid>
          </Grid>);
        })}
      </Box>
      {addButtonRender({ layout, append, trigger, initValues, onClick: () => addClick(layout, initValues) })}
    </>
  );
};

ClusterField.propTypes = {
  control: PropTypes.object,
  field: PropTypes.shape({
    type: PropTypes.number,
    render: PropTypes.object,
    subFields: PropTypes.array,
  }),
  renderAddButton: PropTypes.func,
  renderRemoveButton: PropTypes.func,
};
