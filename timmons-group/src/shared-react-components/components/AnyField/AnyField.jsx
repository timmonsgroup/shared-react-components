/** @module AnyField */
import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';

import {
  Box, TextField, FormControl,
  FormGroup, FormControlLabel, FormHelperText,
  Checkbox
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import RadioOptions from '../../components/RadioOptions';
import Typeahead from '../../components/Typeahead';
import FormErrorMessage from '../../components/FormErrorMessage';
import AnyFieldLabel from '../../components/AnyFieldLabel';

import { FIELD_TYPES } from '../../constants';
import { isObject } from '../../helpers';
import { dateStringNormalizer, isEmpty } from '../../helpers/helpers';

const makeFilter = (checkedId) => {
  const checkId = isObject(checkedId) ? checkedId.id : checkedId;
  return (option) => {
    const optId = isObject(option) ? option.id : option;
    return optId.toString() !== checkId.toString();
  };
};


const handleMultiSelectChange = (field, checkedId) => {
  const ids = field.value;
  const checkId = isObject(checkedId) ? checkedId.id : checkedId;
  // If the id is in the array, remove it, otherwise add it
  const filterFunc = makeFilter(checkId);
  const newIds = ids?.includes(checkId)
    ? ids?.filter(filterFunc)
    : [...(ids ?? []), checkId];
  return newIds;
};

/**
 * Icons for info icons
 * @typedef {Object} FieldIconOptions
 * @property {string} [color] - the color of the icon
 * @property {string} [gap] - the gap between the label and the icon
 * @property {boolean} [beforeLabel] - whether to display the icon before the label
 * @property {React.Component} [iconComponent] - a component to use instead of the default InfoIcon
 * @property {string} [iconText] - the text to display in the info icon
 */

/**
 * Theme group for the label
 * @typedef {Object} FieldLabelThemeGroup
 * @property {object} [anyFieldLabel] - any theme properties to use for the box containing the label
 * @property {object} [anyFieldLabel.helperText] - any theme properties to use for the helper text
 */

/**
 * Various options for the fields
 * @typedef {Object} FieldOptions
 * @property {FieldIconOptions} [icon] - the options to pass to the info icon
 * @property {FieldLabelThemeGroup} [labelThemeGroup] - the theme group to use for the label
 */

/**
 * Various options for the fields
 * @typedef {Object} FieldLayout
 * @property {string} id - the id of the field
 * @property {string} name - the name of the field
 * @property {string} type - the type of the field
 * @property {string} label - the label of the field
 * @property {string} [helperText] - the helper text of the field
 * @property {string} [placeholder] - the placeholder of the field
 * @property {string} [iconHelperText] - the helper text of the info icon
 * @property {string} [altHelperText] - helper text to display in an alternate location
 * @property {boolean} [required] - whether the field is required
 * @property {boolean} [disabled] - whether the field is disabled
 * @property {boolean} [hidden] - whether the field is hidden
 * @property {array} [choices] - The choices for the field
 * @property {boolean} [multiple] - whether the field is multi select
 * @property {boolean} [isMultiLine] - whether the field is multiline
 */

/**
 * AnyField is a wrapper around the various field types that implements the react-hook-form Controller
 * @function
 * @param {object} props
 * @param {object} props.control - the react-hook-form control object
 * @param {object} props.layout - the layout object
 * @param {object} [props.rules] - the react-hook-form rules object (this is not used if using form level validation)
 * @param {boolean} [props.disabled] - whether the field is disabled
 * @param {string} [props.nestedName] - the name of the field if it is nested
 * @param {boolean} [props.isNested] - whether the field is nested
 * @param {object} [props.fieldComponentProps] - any props you want to pass to the field component
 * @param {FieldOptions} [props.options] - various options for the fields
 * @returns {React.ReactElement | null} - the rendered AnyField
 */
const AnyField = ({ control, layout, rules, options, nestedName, isNested, fieldComponentProps, ...props }) => {
  // If this component ever uses hooks make sure to move this return BELOW those hooks
  if (layout.hidden) {
    return null;
  }

  const name = (isNested && nestedName) ? nestedName : layout.name;
  const renderState = renderType(layout, options, nestedName, fieldComponentProps);
  // Per react-hook-form docs, we should not unregister fields in a field Array at this level
  // It is done via the useFieldArray hook in ClusterField component
  const shouldUnregister = !isNested;

  return (
    <Box {...props}>
      <Controller
        shouldUnregister={shouldUnregister}
        control={control}
        rules={rules}
        name={name}
        render={renderState}
      />
    </Box>
  );
};

AnyField.propTypes = {
  control: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired,
  rules: PropTypes.object,
  options: PropTypes.object,
  isNested: PropTypes.bool,
  nestedName: PropTypes.string,
};

/**
 * Return the correct renderer for the given type
 * @function
 * @param {FieldLayout} layout - the layout object for the field
 * @param {FieldOptions} [fieldOptions] - various options for the fields
 * @param {string} [nestedName] - the name of the field if it is nested
 * @returns {React.ReactElement} - the rendered field
 */
const renderType = (layout, fieldOptions = {}, nestedName, fieldComponentProps) => {
  if (layout.iconHelperText) {
    fieldOptions.icon = fieldOptions.icon || {};
    fieldOptions.icon.color = fieldOptions.icon.color || 'primary';
  }

  const { id, type, label, options } = layout;
  const finalId = nestedName || id;
  switch (type) {
    case FIELD_TYPES.DATE: {
      return dateRenderer(layout, fieldOptions, finalId, fieldComponentProps);
    }
    case FIELD_TYPES.TEXT:
    case FIELD_TYPES.LONG_TEXT:
    case FIELD_TYPES.INT:
    case FIELD_TYPES.LINK:
    case FIELD_TYPES.CURRENCY:
    case FIELD_TYPES.FLOAT: {
      return textRenderer(layout, fieldOptions, finalId, fieldComponentProps);
    }
    case FIELD_TYPES.CHOICE:
    case FIELD_TYPES.OBJECT: {
      if (layout.multiple && layout.checkbox) {
        return checkboxRenderer(layout, fieldOptions, finalId, fieldComponentProps);
      }
      return typeaheadRenderer(layout, fieldOptions, finalId, fieldComponentProps);
    }
    case 'radio': {
      const renderRadio = ({ field: { value, onChange }, fieldState: { error } }) => {
        // so we need to manually connect a few props here for react hook form
        return (
          <RadioOptions
            items={options}
            isRequired={true}
            id={finalId}
            label={label}
            value={value}
            onChange={onChange}
            error={error}
            {...fieldComponentProps}
          />);
      };
      return renderRadio;
    }
    default:
      return textRenderer(layout, fieldOptions, fieldComponentProps);
  }
};

/**
 * This is a custom renderer for the MUI TextField component to work with react-hook-form
 * @function
 * @param {FieldLayout} layout Object containing the layout of the field
 * @param {FieldOptions} [fieldOptions] Various options for the field
 * @param {string} [finalId] the final id of the field
 * @param {object} [fieldComponentProps] - any props you want to pass to the field component
 * @returns {React.ReactElement} A custom renderer for the MUI TextField component
 */
const textRenderer = (
  { id, name, label, isMultiLine, placeholder, required, disabled, readOnly, altHelperText, iconHelperText, helperText, type },
  fieldOptions, finalId, fieldComponentProps
) => {
  const inputAttrs = {
    'data-src-field': finalId,
    readOnly: readOnly,
  };

  const isNumber = type === FIELD_TYPES.CURRENCY || type === FIELD_TYPES.INT || type === FIELD_TYPES.FLOAT;
  const prefix = readOnly ? '' : 'Enter';

  const TextFieldWrapped = ({ field: { ref, value, onChange, onBlur }, fieldState: { error } }) => {
    return (
      <>
        <AnyFieldLabel
          htmlFor={finalId || name}
          error={!!error}
          label={label}
          required={!!required}
          disabled={disabled}
          iconText={iconHelperText}
          fieldOptions={fieldOptions}
          helperText={altHelperText}
        />
        <TextField sx={{ width: '100%' }}
          name={finalId || name}
          inputProps={inputAttrs}
          inputRef={ref}
          disabled={disabled}
          type={isNumber ? 'number' : 'text'}
          id={finalId || name}
          error={!!error}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          multiline={isMultiLine}
          minRows={isMultiLine ? 3 : 1}
          placeholder={placeholder || `${prefix} ${label}`}
          variant="outlined"
          {...fieldComponentProps}
        />
        {helperText && <FormHelperText error={false}>{helperText}</FormHelperText>}
        <FormErrorMessage error={error} />
      </>
    );
  };

  TextFieldWrapped.propTypes = {
    field: PropTypes.shape({
      value: PropTypes.any,
      onChange: PropTypes.func,
      onBlur: PropTypes.func,
      ref: PropTypes.any
    }),
    fieldState: PropTypes.shape({
      error: PropTypes.any
    })
  };

  return TextFieldWrapped;
};

/**
 * This is a custom renderer for the MUI DatePicker component to work with react-hook-form
 * @function
 * @param {FieldLayout} layout Object containing the layout of the field
 * @param {FieldOptions} [fieldOptions] Various options for the field
 * @param {string} [finalId] - the final id of the field
 * @param {object} [fieldComponentProps] - any props you want to pass to the field component
 * @returns {React.ReactElement} A custom renderer for the MUI DatePicker component
 */
const dateRenderer = (
  { id, name, label, disabled, required, readOnly, helperText, iconHelperText, altHelperText, placeholder, disableFuture, ...layout },
  fieldOptions, finalId, fieldComponentProps
) => {
  const extraProps = {};
  // This will disable selecting dates before the minDate in the component. The user can still type in a date before this point
  if (!isEmpty(layout.minValue)) {
    extraProps.minDate = new Date(dateStringNormalizer(layout.minValue));
  }
  // This will disable selecting dates past the maxDate in the component. The user can still type in a date past this point
  if (!isEmpty(layout.maxValue)) {
    extraProps.maxDate = new Date(dateStringNormalizer(layout.maxValue));
  }
  // if (layout.minValue)
  const DateField = ({ field: { value, onChange, ref }, fieldState: { error } }) => (
    <>
      <DatePicker
        id={finalId}
        name={finalId || name}
        disabled={disabled}
        value={value}
        onChange={onChange}
        disableFuture={disableFuture}
        {...extraProps}
        {...fieldComponentProps}
        renderInput={(params) => {
          // MUI-X DatePicker injects a bunch of props into the input element. If we override the inputProps entirely functionality goes BOOM
          params.inputProps['data-src-field'] = finalId || name;
          params.inputProps.readOnly = readOnly;
          params.name = finalId || name;
          params.id = finalId || name;
          if (placeholder) {
            params.inputProps.placeholder = placeholder;
          }
          return (
            <>
              <AnyFieldLabel htmlFor={finalId || name} error={!!error} label={label} required={!!required} disabled={disabled} iconText={iconHelperText} helperText={altHelperText} fieldOptions={fieldOptions} />
              <TextField sx={{ width: '100%' }} {...params} />
            </>
          );
        }}
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
};

/**
 * This is a custom renderer for our Typeahead component to work with react-hook-form
 * @function
 * @param {FieldLayout} layout - Object containing the layout of the field
 * @param {FieldOptions} [fieldOptions] Various options for the field
 * @param {string} [finalId] - the final id of the field
 * @param {object} [fieldComponentProps] - any props you want to pass to the field component
 * @returns {React.ReactElement} A custom renderer for the MUI TextField component
 */
const typeaheadRenderer = (
  { label, id, name, disabled, choices, required, placeholder, helperText, altHelperText, iconHelperText, multiple },
  fieldOptions, finalId, fieldComponentProps
) => {
  const WrappedTypeahead = ({ field, field: { onChange }, fieldState: { error } }) => {
    // value is passed in via the react hook form inside of field
    // Ref is needed by the typeahead / autoComplete component and is passed in via props spreading
    const dataAttrs = {
      'data-src-field': name
    };

    return (
      // We need to manually connect a few props here for react hook form
      <Typeahead
        id={finalId}
        name={finalId || name}
        {...dataAttrs}
        {...field}
        multiple={multiple}
        sx={{ width: '100%' }}
        disabled={disabled}
        items={choices || []}
        label={label}
        isRequired={!!required}
        fieldOptions={fieldOptions}
        helperText={helperText}
        altHelperText={altHelperText}
        iconHelperText={iconHelperText}
        // These are props that are passed to the MUI TextField rendered by Typeahead
        textFieldProps={{
          id: finalId || name,
          name: finalId || name,
          placeholder: placeholder || `Select ${label}`,
          error: !!error,
          inputRef: field.ref,
        }}
        {...fieldComponentProps}
        // hooks-form appears to only want value and not the native onChange
        onChange={(_, newValue) => {
          // Need slightly different logic for multiple.
          if (multiple) {
            // The internal autocomplete component returns the ENTIRE object. So we map it consistently to just the id / value
            const nextValue = newValue.map((v) => {
              if (isObject(v)) {
                return v.id || v.value;
              }
              return v;
            });
            onChange(nextValue);
          } else {
            let nextValue = newValue?.id || newValue?.value || newValue;
            // We need to set the value to null if it is empty string or undefined to correctly set 'unselected' state
            // a value of 0 is valid
            if (nextValue === '' || nextValue === undefined) {
              nextValue = null;
            }
            onChange(nextValue);
          }
        }}
        error={error}
      />
    );
  };

  WrappedTypeahead.propTypes = {
    field: PropTypes.shape({
      id: PropTypes.string,
      value: PropTypes.any,
      onChange: PropTypes.func,
      ref: PropTypes.any
    }),
    fieldState: PropTypes.shape({
      error: PropTypes.any
    })
  };

  return WrappedTypeahead;
};

/**
 * This is a custom renderer for MUI Checkboxes to work with react-hook-form
 * @function
 * @param {FieldLayout} layout - Object containing the layout of the field
 * @param {FieldOptions} [fieldOptions] Various options for the field
 * @param {string} [finalId] - the final id of the field
 * @param {object} [fieldComponentProps] - any props you want to pass to the field component
 * @returns {React.ReactElement} A custom renderer for the MUI Checkbox component
 */
const checkboxRenderer = (layout, fieldOptions, finalId, fieldComponentProps) => {
  const { label, disabled, choices = [], required, helperText, iconHelperText, altHelperText } = layout;

  const Checkboxes = ({ field, fieldState: { error } }) => {

    // FormControl expects error to be a boolean. If it's an object, it will throw an error
    return (
      <>
        <FormControl
          data-src-field={finalId || field.id}
          error={!!error}
          disabled={disabled}
          component="fieldset"
          variant="standard"
        >
          <AnyFieldLabel
            asFormInput={true}
            htmlFor={finalId || field.name}
            error={!!error}
            label={label}
            required={!!required}
            disabled={disabled}
            iconText={iconHelperText}
            fieldOptions={fieldOptions}
            helperText={helperText}
          />
          <FormGroup>
            {choices.length === 0 && <FormHelperText>There are no options to select</FormHelperText>}
            {choices?.map((item) => (
              <FormControlLabel
                key={item.id}
                control={<Checkbox
                  data-src-checkbox={item.id}
                  onBlur={field.onBlur}
                  checked={field?.value?.includes(item.id)}
                  {...fieldComponentProps}
                  onChange={(e) => {
                    field.onChange(handleMultiSelectChange(field, item.id));
                  }}
                />}
                label={item.label}
              />
            ))}
            {altHelperText && <FormHelperText error={false}>{altHelperText}</FormHelperText>}
            <FormErrorMessage error={error} />
          </FormGroup>
        </FormControl>
      </>
    );
  };

  Checkboxes.propTypes = {
    field: PropTypes.object,
    fieldState: PropTypes.object,
  };
  return Checkboxes;
};

export default AnyField;