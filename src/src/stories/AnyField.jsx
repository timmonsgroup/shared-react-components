import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';

import { InputLabel, TextField, FormLabel, FormControl, FormGroup, FormControlLabel, FormHelperText, Checkbox } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import RadioOptions from './RadioOptions';
import Typeahead from './Typeahead';
import RequiredIndicator from './RequiredIndicator';
import FormErrorMessage from './FormErrorMessage';

import { FIELD_TYPES } from '../constants';
import { Box } from '@mui/material';

const AnyField = ({ control, rules, layout, disabled, ...props }) => {
  const renderState = renderType(layout, disabled);

  return (
    <Box {...props}>
      <Controller
        control={control}
        rules={rules}
        name={layout.name}
        render={renderState}
      />
    </Box>
  );
}

/**
 * Return the correct renderer for the given type
 * @param {*} layout
 * @returns  {function} the renderer function
 */
const renderType = (layout) => {
  const { id, type, label, options } = layout;
  switch (type) {
    case FIELD_TYPES.DATE: {
      return dateRenderer(layout);
    }
    case FIELD_TYPES.TEXT:
    case FIELD_TYPES.LONG_TEXT:
    case FIELD_TYPES.INT:
    case FIELD_TYPES.LINK:
    case FIELD_TYPES.FLOAT: {
      return textRenderer(layout);
    }
    case FIELD_TYPES.CHOICE:
    case FIELD_TYPES.OBJECT: {
      if (layout.multiple && layout.checkbox) {
        return checkboxRenderer(layout);
      }
      return typeaheadRenderer(layout);
    }
    case 'radio': {
      const renderRadio = ({ field: { value, onChange }, fieldState: { error } }) => {
        // so we need to manually connect a few props here for react hook form
        return (
          <RadioOptions
            items={options}
            isRequired={true}
            id={id}
            label={label}
            value={value}
            onChange={onChange}
            error={error}
          />);
      };
      return renderRadio;
    }
    default:
      return <TextField />;
  }
}

AnyField.propTypes = {
  control: PropTypes.object.isRequired,
  rules: PropTypes.object,
  layout: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
}

/**
 * This is a custom renderer for the MUI TextField component to work with react-hook-form
 * @param {object} layout Object containing the layout of the field
 * @param {string} layout.id The id of the field
 * @param {string} layout.name The name of the field
 * @param {string} layout.label The label of the field
 * @param {boolean} layout.isMultiLine Whether or not the field is a multi-line text field
 * @param {string} layout.placeholder The placeholder text for the field
 * @param {boolean} layout.required Whether or not the field is required
 * @param {boolean} layout.disabled Whether or not the field is disabled
 * @returns {function} A custom renderer for the MUI TextField component
 */
const textRenderer = ({ id, name, label, isMultiLine, placeholder, required, disabled }) => {
  const TextFieldWrapped = ({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
    <>
      <InputLabel htmlFor={id || name} error={!!error}><RequiredIndicator disabled={disabled} isRequired={!!required} />{label}</InputLabel>
      <TextField sx={{ width: '100%' }}
        disabled={disabled}
        id={id || name}
        error={!!error}
        onChange={onChange} 
        onBlur = {onBlur}
        value={value}
        multiline={isMultiLine}
        minRows={isMultiLine ? 3 : 1}
        placeholder={placeholder || `Enter ${label}`}
        variant="outlined"
      />
      <FormErrorMessage error={error} />
    </>
  );

  TextFieldWrapped.propTypes = {
    field: PropTypes.shape({
      value: PropTypes.any,
      onChange: PropTypes.func
    }),
    fieldState: PropTypes.shape({
      error: PropTypes.any
    })
  };

  return TextFieldWrapped;
}

/**
 * This is a custom renderer for the MUI DatePicker component to work with react-hook-form
 * @param {object} layout Object containing the layout of the field
 * @param {string} layout.id The id of the field
 * @param {string} layout.name The name of the field
 * @param {string} layout.label The label of the field
 * @param {boolean} layout.disabled - whether or not the field is disabled
 * @param {boolean} layout.required - whether or not the field is required *
 * @returns {function} A custom renderer for the MUI DatePicker component
 */
const dateRenderer = ({ id, name, label, disabled, required }) => {
  const DateField = ({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
    <>
        <DatePicker
          name={name}
          disabled={disabled}
          id={id}
          value={value}
          onChange={onChange}
          renderInput={(params) => (
            <>
              <InputLabel disabled={disabled} htmlFor={id || name} error={!!error}><RequiredIndicator isRequired={!!required} />{label}</InputLabel>
              <TextField sx={{ width: '100%' }} {...params} />
            </>
          )}
        />
        <FormErrorMessage error={error} />
    </>
  );

  DateField.propTypes = {
    field: PropTypes.shape({
      value: PropTypes.any,
      onChange: PropTypes.func
    }),
    fieldState: PropTypes.shape({
      error: PropTypes.any
    })
  };

  return DateField;
}

/**
 * This is a custom renderer for our Typeahead component to work with react-hook-form
 * @param {*} layout - Object containing the layout of the field
 * @param {string} layout.label - The label of the field
 * @param {boolean} layout.disabled - whether or not the field is disabled
 * @param {array} layout.choices - The choices for the field
 * @param {boolean} layout.required - whether or not the field is required
 * @param {string} layout.placeholder - The placeholder text for the field
 *
 * @returns {function} A custom renderer for the Typeahead component
 */
const typeaheadRenderer = ({ label, disabled, choices, required, placeholder }) => {
  const WrappedTypeahead = ({ field, field: { onChange }, fieldState: { error } }) => {
    // value is passed in via the react hook form inside of field
    // Ref is needed by the typeahead / autoComplete component and is passed in via props spreading
    return (
      // We need to manually connect a few props here for react hook form
      <Typeahead
        {...field}
        sx={{ width: '100%' }}
        disabled={disabled}
        items={choices || []}
        label={label}
        isRequired={!!required}
        // These are props that are passed to the MUI TextField rendered by Typeahead
        textFieldProps={{
          placeholder: placeholder || `Select ${label}`,
          error: !!error,
          helperText: error?.message,
        }}
        // hooks-form appears to only want value and not the native onChange
        onChange={(_, newValue) => {
          onChange(newValue?.id || null);
        }}
        error={error}
      />
    )
  };

  WrappedTypeahead.propTypes = {
    field: PropTypes.shape({
      value: PropTypes.any,
      onChange: PropTypes.func
    }),
    fieldState: PropTypes.shape({
      error: PropTypes.any
    })
  };

  return WrappedTypeahead;
}

const checkboxRenderer = (layout) => {
  const { label, disabled, choices = [], required, helperText } = layout;

  const Checkboxes = ({ field, fieldState: { error } }) => {
    const handleCheck = (checkedId) => {
      const ids = field.value;
      // If the id is in the array, remove it, otherwise add it
      const newIds = ids?.includes(checkedId)
        ? ids?.filter((id) => id !== checkedId)
        : [...(ids ?? []), checkedId];
      return newIds;
    }


    // FormControl expects error to be a boolean. If it's an object, it will throw an error
    return (
      <>
        <FormControl
          error={!!error}
          disabled={disabled}
          component="fieldset"
          variant="standard"
        >
          <FormLabel component="legend"><RequiredIndicator isRequired={!!required} />{label}</FormLabel>
          {helperText && <FormHelperText error={false}>{helperText}</FormHelperText>}
          <FormGroup>
            {choices.length === 0 && <FormHelperText>There are no options to select</FormHelperText>}
            {choices?.map((item, index) => (
              <FormControlLabel
                key={item.id}
                control={<Checkbox
                  onBlur={field.onBlur}
                  checked={field?.value?.includes(item.id)}
                  onChange={(e) => {
                    field.onChange(handleCheck(item.id));
                  }}
                />}
                label={item.label}
              />
            ))}
            <FormErrorMessage error={error} />
          </FormGroup>
        </FormControl>
      </>
    )
  };

  Checkboxes.propTypes = {
    field: PropTypes.object,
    fieldState: PropTypes.object,
  };
  return Checkboxes;
}

export default AnyField;