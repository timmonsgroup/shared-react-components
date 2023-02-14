import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';

import InfoIcon from './InfoIcon';

import {
  InputLabel, TextField, FormLabel, FormControl,
  FormGroup, FormControlLabel, FormHelperText,
  Checkbox
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import RadioOptions from './RadioOptions';
import Typeahead from './Typeahead';
import RequiredIndicator from './RequiredIndicator';
import FormErrorMessage from './FormErrorMessage';
import AnyFieldLabel from './AnyFieldLabel';

import { FIELD_TYPES } from '../constants';
import { Box } from '@mui/material';

/**
 * AnyField is a wrapper around the various field types that implements the react-hook-form Controller
 *
 * @param {object} props
 * @param {object} props.control - the react-hook-form control object
 * @param {object} props.rules - the react-hook-form rules object
 * @param {object} props.layout - the layout object
 * @param {boolean} props.disabled - whether the field is disabled
 * @param {object} props.options - various options for the fields
 * @param {object} props.options.icon - the options to pass to the info icon
 * @param {object} props.options.icon.gap - the gap between the label and the icon
 * @param {object} props.options.icon.color - the color of the icon
 * @param {object} props.options.icon.beforeLabel - whether to display the icon before the label
 * @param {object} props.options.icon.iconComponent - a component to use instead of the default InfoIcon
 * @returns
 */
const AnyField = ({ control, rules, layout, options, ...props }) => {
  const renderState = renderType(layout, options);

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

AnyField.propTypes = {
  control: PropTypes.object.isRequired,
  rules: PropTypes.object,
  layout: PropTypes.object.isRequired,
  options: PropTypes.object,
}

/**
 * Return the correct renderer for the given type
 * @param {object} layout - the layout object for the field
 * @param {object} fieldOptions - various options for the fields
 * @returns  {function} the renderer function
 */
const renderType = (layout, fieldOptions = {}) => {
  if (layout.hidden) {
    return () => null;
  }

  if (layout.iconHelperText) {
    fieldOptions.icon = fieldOptions.icon || {};
    fieldOptions.icon.color = fieldOptions.icon.color || 'primary';
    // fieldOptions.icon.beforeLabel = true;
  }

  const { id, type, label, options } = layout;
  switch (type) {
    case FIELD_TYPES.DATE: {
      return dateRenderer(layout, fieldOptions);
    }
    case FIELD_TYPES.TEXT:
    case FIELD_TYPES.LONG_TEXT:
    case FIELD_TYPES.INT:
    case FIELD_TYPES.LINK:
    case FIELD_TYPES.FLOAT: {
      return textRenderer(layout, fieldOptions);
    }
    case FIELD_TYPES.CHOICE:
    case FIELD_TYPES.OBJECT: {
      if (layout.multiple && layout.checkbox) {
        return checkboxRenderer(layout, fieldOptions);
      }
      return typeaheadRenderer(layout, fieldOptions);
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
 * @param {object} fieldOptions Various options for the field
 * @returns {function} A custom renderer for the MUI TextField component
 */
const textRenderer = ({ id, name, label, isMultiLine, placeholder, required, disabled, readOnly, iconHelperText, helperText }, fieldOptions) => {
  const inputAttrs = {
    'data-src-field': name,
    readOnly: readOnly,
  }

  const TextFieldWrapped = ({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
    <>
      {/* <Box sx={{display:'flex'}}>
        <InputLabel htmlFor={id || name} error={!!error}><RequiredIndicator disabled={disabled} isRequired={!!required} />
          {label}
        </InputLabel>
        {iconHelperText && <InfoIcon infoText={iconHelperText} {...fieldOptions} />}
      </Box> */}
      <AnyFieldLabel htmlFor={id || name} error={!!error} label={label} required={!!required} disabled={disabled} iconText={iconHelperText} fieldOptions={fieldOptions} />
      <TextField sx={{ width: '100%' }}
        inputProps={inputAttrs}
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
      {helperText && <FormHelperText error={false}>{helperText}</FormHelperText>}
      <FormErrorMessage error={error} />
    </>
  );

  TextFieldWrapped.propTypes = {
    field: PropTypes.shape({
      value: PropTypes.any,
      onChange: PropTypes.func,
      onBlur: PropTypes.func
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
const dateRenderer = ({ id, name, label, disabled, required, readOnly, helperText }) => {
  const DateField = ({ field: { value, onChange }, fieldState: { error } }) => (
    <>
      <DatePicker
        id={id}
        name={name}
        disabled={disabled}
        value={value}
        onChange={onChange}
        renderInput={(params) => {
          // MUI-X DatePicker injects a bunch of props into the input element. If we override the inputProps entirely functionality goes BOOM
          params.inputProps['data-src-field'] = name;
          params.inputProps.readOnly = readOnly;
          return (
            <>
              <InputLabel disabled={disabled} htmlFor={id || name} error={!!error}><RequiredIndicator isRequired={!!required} />{label}</InputLabel>
              <TextField sx={{ width: '100%' }} {...params} />
            </>
          )}}
      />
      {helperText && <FormHelperText error={false}>{helperText}</FormHelperText>}
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
const typeaheadRenderer = ({ label, id, name, disabled, choices, required, placeholder }) => {
  const WrappedTypeahead = ({ field, field: { onChange }, fieldState: { error } }) => {
    // value is passed in via the react hook form inside of field
    // Ref is needed by the typeahead / autoComplete component and is passed in via props spreading
    const dataAttrs = {
      'data-src-field': name
    };

    return (
      // We need to manually connect a few props here for react hook form
      <Typeahead
        id={id}
        name={name}
        {...dataAttrs}
        {...field}
        sx={{ width: '100%' }}
        disabled={disabled}
        items={choices || []}
        label={label}
        isRequired={!!required}
        // These are props that are passed to the MUI TextField rendered by Typeahead
        textFieldProps={{
          id,
          name,
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
      id: PropTypes.string,
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
  const { label, disabled, choices = [], required, helperText, iconHelperText } = layout;

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
          data-src-field={field.id}
          error={!!error}
          disabled={disabled}
          component="fieldset"
          variant="standard"
        >
          <FormLabel component="legend"><RequiredIndicator isRequired={!!required} />
            {label} {iconHelperText && <InfoIcon infoText={iconHelperText} />}
          </FormLabel>
          {helperText && <FormHelperText error={false}>{helperText}</FormHelperText>}
          <FormGroup>
            {choices.length === 0 && <FormHelperText>There are no options to select</FormHelperText>}
            {choices?.map((item, index) => (
              <FormControlLabel
                key={item.id}
                control={<Checkbox
                  data-src-checkbox={item.id}
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