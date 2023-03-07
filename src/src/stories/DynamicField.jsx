import React from 'react';
import PropTypes from 'prop-types';
import { useFieldArray, useFormContext } from 'react-hook-form';
import AnyField from './AnyField';
import { FIELD_TYPES } from '../constants';
import Button from './Button';
import AnyFieldLabel from './AnyFieldLabel';
import { Box, Divider, FormHelperText } from '@mui/material';

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
 * ClusterField component will render a field that contains a list of subfields
 * @param {object} props - props object
 * @param {object} props.control - react-hook-form control object
 * @param {object} props.field - field object
 * @param {object} props.props - props object
 * @returns {React.ReactElement}
 */
export const ClusterField = ({ control, field, ...props }) => {
  const { formState: { errors }, trigger } = useFormContext();
  const error = errors[field?.render?.name];
  const layout = field?.render || {};
  const subFields = field?.subFields || [];
  const { fields, append, remove } = useFieldArray({
    control,
    name: layout.name,
    shouldUnregister: true,
  });

  console.log('errors', errors)
  console.log('MY ERROR', error)

  return (
    <Box {...props}>
      <AnyFieldLabel htmlFor={layout.name} label={layout.label} required={!!layout.required} disabled={layout.disabled} iconText={layout.iconHelperText} error={!!error} />
      {error && <FormHelperText error={true}>{error?.message}</FormHelperText>}
      {layout?.helperText && <FormHelperText error={false}>{layout?.helperText}</FormHelperText>}
      {fields.map((aField, index) => {
        return (<React.Fragment key={aField.id}>
          {subFields.map((subField) => {
            return (<AnyField key={subField.render?.name} isNested={true} nestedName={`${layout?.name}.${index}.${subField.render?.name}`} control={control} layout={subField.render} {...props} />);
          })}
          <Button onClick={() => {
            remove(index);
            trigger(layout.name);
          }}>{layout.removeLabel || 'Remove'}</Button>
        </React.Fragment>);
      })}
      <Divider />
      <Button onClick={() => {
        append({});
        trigger(layout.name);
      }}>{layout.addLabel || 'Add'}</Button>
    </Box>
  );
};

ClusterField.propTypes = {
  control: PropTypes.object,
  field: PropTypes.shape({
    render: PropTypes.object,
    subFields: PropTypes.array,
  }),
};
