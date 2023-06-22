/** @module ClusterField */
// Third party
import React from 'react';
import PropTypes from 'prop-types';
import { useFieldArray, useFormContext } from 'react-hook-form';

// MUI components
import { Divider, FormHelperText, useTheme, useMediaQuery, Typography } from '@mui/material';
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
  const theme = useTheme();
  const inlineAllowed = useMediaQuery(theme.breakpoints.up('sm'));

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

  const WrapperType = inline && inlineAllowed ? InlineWrapper : Wrapper;

  return (
    <>
      <Grid xs={12} {...props}>
        <AnyFieldLabel
          className="cluster-field-label"
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
      <Grid
        data-what="all the clusters"
        spacing={2}
        xs={12}
        sx={{ paddingTop: '0px' }}
      >
        {fields.length > 0 && (
          <>
            {
              fields.map((cluster, index) => {
                const rowProps = {
                  index,
                  control, options, layout,
                  otherProps: props,
                };

                const removeButton = removeButtonRender({ layout, remove, trigger, index, inlineAllowed, onClick: () => removeClick(layout, index, fields) });

                return <WrapperType key={cluster.id} rows={rows} rowProps={rowProps} removeButton={removeButton} />;
              })
            }
          </>
        )}
        {fields.length === 0 && (
          <Typography variant="clusterEmptyText">{layout?.emptyText || 'You have not added any items.'}</Typography>
        )
        }
      </Grid>
      <Grid xs={12} sx={{ paddingTop: '0px' }}>
        <Divider sx={{ width: '100%', marginBottom: '8px' }} />
        {addButtonRender({ layout, append, trigger, initValues, onClick: () => addClick(layout, initValues, fields) })}
      </Grid>
      {layout?.altHelperText && <FormHelperText error={false}>{layout?.altHelperText}</FormHelperText>}
    </>
  );
};

/**
 * @typedef {Object} ClusterRowWrapperProps
 * @property {string} clusterId - The id of the cluster
 * @property {Array} rows - An array of row objects
 * @property {Object} rowProps - The props to pass to the ClusterRow component
 * @property {React.ReactElement} removeButton - The remove button to render
 */

/**
 * A wrapper for the ClusterRow component that renders the rows inline
 * @function InlineWrapper
 * @param {ClusterRowWrapperProps} props
 * @returns {React.ReactElement} - The rendered component
 */

const InlineWrapper = ({ clusterId, rows, rowProps, removeButton }) => {
  return (
    <>
      {
        rows.map((rowItem, rIndex) => {
          return (
            <Grid container key={`${rIndex}-${clusterId}`}>
              <Grid container rowSpacing={1} columnSpacing={2} xs sx={{ paddingLeft: '0px', paddingRight: '0px' }}>
                <ClusterRow
                  id={clusterId}
                  row={rowItem}
                  {...rowProps}
                />
              </Grid>
              <Grid container rowSpacing={1} columnSpacing={2} xs sx={{ paddingLeft: '0px', paddingRight: '0px' }} style={{ maxWidth: '100px' }}>
                <Grid>
                  {removeButton}
                </Grid>
              </Grid>
            </Grid>
          );
        })
      }
    </>
  );
};

const WRAPPER_PROPS = {
  clusterId: PropTypes.string,
  rows: PropTypes.array,
  rowProps: PropTypes.object,
  removeButton: PropTypes.node,
};

InlineWrapper.propTypes = WRAPPER_PROPS;

/**
 * A wrapper for the ClusterRow and remove button
 * @function Wrapper
 * @param {ClusterRowWrapperProps}
 * @returns {React.ReactElement} - The rendered component
 */
const Wrapper = ({ clusterId, rows, rowProps, removeButton }) => {
  return (
    <Grid container spacing={2} xs={12} sx={{ padding: '0px' }} key={clusterId}>
      {rows.map((rowItem, rIndex) => {
        return (
          <ClusterRow
            id={clusterId}
            row={rowItem}
            key={`${clusterId}-row-${rIndex}`}
            {...rowProps}
          />
        );
      })}
      <Grid xs={12}>
        {removeButton}
      </Grid>
    </Grid>
  );
};

Wrapper.propTypes = WRAPPER_PROPS;


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
 * @function ClusterRow
 * @param {object} props - props object
 * @param {string} props.id - id of the cluster
 * @param {number} props.index - index of the cluster
 * @param {object} props.row - row object
 * @param {object} props.row.fields - array of fields
 * @param {boolean} props.row.solitary - solitary boolean
 * @param {number} [props.row.size] - size number
 * @param {number} [props.row.maxColumns] - maxColumns number
 * @param {object} props.control - control object
 * @param {object} [props.options] - options object
 * @param {object} [props.layout] - layout object
 * @param {object} [props.otherProps] - otherProps object
 * @returns {React.ReactElement} - React element
 */
const ClusterRow = ({ id, layout, row, control, index, options, otherProps }) => {
  const { fields, solitary, size, maxColumns } = row;
  let colSize = 12 / fields.length;
  if (solitary && !isNaN(size)) {
    colSize = parseInt(size);
  }

  return (
    <>
      {fields.map((field) => {
        // At xs size, we force one column
        // At sm size, we do not allow more than 2 columns
        // At md size and up, we allow you to specify the number of columns
        return (
          <Grid xs={Math.max(colSize, 12)} sm={Math.max(colSize, 6)} md={colSize} key={`${id}.${field.render?.name}`}>
            <AnyField
              isNested={true}
              nestedName={`${layout?.name}.${index}.${field.render?.name}`}
              control={control}
              layout={field.render}
              options={options} {...otherProps}
            />
          </Grid>
        );
      })}
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
    <Button variant="clusterAdd" onClick={onClick}>{addLabel || '+ Add Row'}</Button>
  );
};

/**
 * Trash can icon via Heroicons
 * @function TrashCanIcon
 * @returns {React.ReactElement} - React element
 */
const TrashCanIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
    </svg>
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
 * @param {boolean} props.inlineAllowed - whether the button can be rendered inline
 * @param {boolean} props.inline - whether the button is rendered inline
 * @param {Function} props.onClick - onClick function for the button
 * @param {Function} props.remove - remove function from useFieldArray
 * @param {Function} props.trigger - trigger function from useFormContext
 * @param {number} props.index - index of the field
 * @returns {React.ReactElement} - React element of the button
 */
const renderDefaultRemoveButton = ({ layout, onClick, inlineAllowed }) => {
  const { removeLabel, inline } = layout || {};
  const canInline = inlineAllowed && inline;

  let renderLabel = removeLabel || 'Remove';
  const buttonProps = { onClick };
  if (canInline) {
    buttonProps.variant = 'inlineClusterRemove';
    renderLabel = <TrashCanIcon />;
  }

  return (
    <>
      {!canInline && <Divider />}
      {canInline && <AnyFieldLabel sx={{ opacity: 0 }} label="Remove" htmlFor="" />}
      <Button {...buttonProps}>{renderLabel}</Button>
    </>
  );
};

export default ClusterField;