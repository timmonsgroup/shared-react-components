/** @module ClusterField */
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
import { getFieldValue } from '../hooks';
import { createRowFields } from '../helpers';

/**
 * ClusterField component will render a field that contains a list of subfields
 * @function
 * @param {object} props - props object
 * @param {object} props.control - react-hook-form control object
 * @param {object} props.field - field object
 * @param {object} props.props - props object
 * @param {object} props.options - options object
 * @param {Function} props.renderAddButton - render function for the add button
 * @param {Function} props.renderRemoveButton - render function for the remove button
 * @returns {React.ReactElement}
 */
const ClusterField = ({ control, field, options, ...props }) => {
  const { renderAddButton, renderRemoveButton } = options || {};
  // const columns = options?.clusterColumnCount || 1;
  // let colSize = 12 / fields.length;
  // Get all errors from react-hook-form formState and the trigger function from useFormContext
  const { useFormObject } = useFormContext();

  const layout = field?.render || {};

  const { formState, trigger, clearErrors } = useFormObject;
  const { errors } = formState;

  // Find any errors for the cluster field
  const error = errors[layout?.name];
  const subFields = field?.subFields || [];
  let { clusterColumnCount, inline } = layout;
  if (clusterColumnCount === undefined) {
    clusterColumnCount = options.clusterColumnCount || 1;
  }

  const rows = createRowFields(subFields, clusterColumnCount, inline);

  const buttonCol = inline ? 2 : 12;
  const RenderBit = inline ? Grid : React.Fragment;
  const renderArgs = inline ? { xs: 10 } : {};

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

  // This should happen in the parent component, but this is a fallback
  // Note this return MUST happen after all the hook calls or lil React will lose its mind
  if (layout.hidden) {
    return null;
  }

  // If the renderAddButton / renderRemoveButton props exist and are functions, use them, otherwise use the default render functions
  const addButtonRender = renderAddButton && renderAddButton instanceof Function ? renderAddButton : renderDefaultAddButton;

  // A default click handler for the add button
  // If a custom renderAddButton is passed in it will still be passed this method as a prop 'onClick'
  const addClick = (layout, initValues, fields) => {
    // append should NOT be called with an empty object
    // If it is, there is a chance for zombie data.
    append(initValues);

    if (layout?.name) {
      if (fields?.length === 0) {
        clearErrors(layout?.name);
      }
    }
  };

  const removeButtonRender = renderRemoveButton && renderRemoveButton instanceof Function ? renderRemoveButton : renderDefaultRemoveButton;

  // A default click handler for the remove button
  // If a custom renderRemoveButton is passed in it will still be passed this method as a prop 'onClick'
  const removeClick = (layout, index, fields) => {
    remove(index);

    if (layout?.name && fields?.length === 1) {
      trigger(layout.name);
    }
  };

  return (
    <>
      <Grid xs={12} {...props}>
        <AnyFieldLabel
          htmlFor={layout.name}
          label={layout.label}
          required={!!layout.required}
          disabled={layout.disabled}
          iconText={layout.iconHelperText}
          error={!!error}
          helperText={layout.helperText}
        />
        {error && <FormHelperText error={true}>{error?.message}</FormHelperText>}
      </Grid>
      {fields.length > 0 && (
        <Grid
          data-what="all the clusters"
          spacing={2}
          xs={12}
        >
          {fields.map((cluster, index) => {
            return (
              <Grid container spacing={2} xs={12} sx={{ padding: '0px' }} key={cluster.id}>
                {rows.map((rowItem, rIndex) => {
                  return (
                    <ClusterRow
                      id={cluster.id}
                      index={index}
                      row={rowItem}
                      control={control}
                      options={options}
                      layout={layout}
                      key={`${cluster.id}-row-${rIndex}`}
                      otherProps={props}
                    />
                  );
                })}
                <Grid xs={buttonCol}>
                  {removeButtonRender({ layout, remove, trigger, index, onClick: () => removeClick(layout, index, fields) })}
                </Grid>
                {/* </Grid> */}
              </Grid>
            );
          })}
        </Grid>
      )}
      <Grid xs={12} sx={{paddingTop: '0px'}}>
        {addButtonRender({ layout, append, trigger, initValues, onClick: () => addClick(layout, initValues, fields) })}
        {layout?.altHelperText && <FormHelperText error={false}>{layout?.altHelperText}</FormHelperText>}
      </Grid>
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
  options: PropTypes.shape({
    clusterColumnCount: PropTypes.number,
    renderAddButton: PropTypes.func,
    renderRemoveButton: PropTypes.func,
  }),
  renderAddButton: PropTypes.func,
  renderRemoveButton: PropTypes.func,
};


/**
 * ClusterRow component will render a row of fields
 * @param {object} props - props object
 * @param {string} props.id - id of the cluster
 * @param {number} props.index - index of the cluster
 * @param {object} props.row - row object
 * @param {object} props.row.fields - array of fields
 * @param {boolean} props.row.solitary - solitary boolean
 * @param {number} props.row.size - size number
 * @param {number} props.row.maxColumns - maxColumns number
 * @param {object} props.control - control object
 * @param {object} props.options - options object
 * @param {object} props.layout - layout object
 * @param {object} props.otherProps - otherProps object
 * @returns {React.ReactElement} - React element
 */
const ClusterRow = ({ id, layout, row, control, index, options, otherProps }) => {
  const { fields, solitary, size, maxColumns } = row;
  const colsAllowed = maxColumns || 1;
  let colSize = 12 / fields.length;
  if (solitary && !isNaN(size)) {
    colSize = parseInt(size);
  }

  const spacing = colsAllowed === 1 ? 0 : { xs: 1, sm: 2, md: 4 };
  return (
    <>
      {fields.map((field, fIndex) => {
        return (
          // <Grid xs={colSize} key={`${id}-${field.render?.name}`}>
          <Grid xs={colSize} key={`${id}.${field.render?.name}`}>
            <AnyField
              isNested={true}
              nestedName={`${layout?.name}.${index}.${field.render?.name}`}
              // key={`${layout?.name}.${index}.${field.render?.name}`}
              control={control}
              layout={field.render}
              options={options} {...otherProps}
            />
          </Grid>
        );
      })}
      {/* </Grid> */}
    </>
  );
};

ClusterRow.propTypes = {
  id: PropTypes.string,
  index: PropTypes.number,
  row: PropTypes.shape({
    fields: PropTypes.array,
    solitary: PropTypes.bool,
    size: PropTypes.number,
    maxColumns: PropTypes.number,
  }),
  control: PropTypes.object,
  options: PropTypes.shape({
    clusterColumnCount: PropTypes.number,
    renderAddButton: PropTypes.func,
    renderRemoveButton: PropTypes.func,
  }),
  layout: PropTypes.object,
  otherProps: PropTypes.object,
};

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
 * @function
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
 * @function
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

export default ClusterField;