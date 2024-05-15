/** @module Typeahead */
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { Box, TextField, Autocomplete, FormHelperText } from '@mui/material';
import AnyFieldLabel from '../AnyFieldLabel';
import FormErrorMessage from '../FormErrorMessage';
import { isEmpty } from '../../../shared-react-components/helpers';

/**
 * Wrapper of the Mui Autocomplete component
 * Prevent closing by clicking outside of the dialog by NOT passing in a handleClose prop
 * We need to forward the ref to the Autocomplete component for use with react-hook-form
 * https://reactjs.org/docs/forwarding-refs.html
 * renderSX is styling for the surrounding box
 * sx is styling for the Autocomplete component
 * labelSX is styling for the label
 * textFieldSX is styling for the text field this is another MUI wrapper contains an input and the dropdown icon
 * inputLabelSX is styling for the input inside the textField
 * @function Typeahead
 * @param {object} props
 * @param {string} [props.label] - the label to display
 * @param {boolean} [props.isRequired] - is the field required
 * @param {object} [props.items] - the items to display in the dropdown
 * @param {object} [props.error] - the error message to display
 * @param {boolean} [props.disabled] - is the field disabled
 * @param {object} [props.renderSX] - the sx styling for the surrounding box
 * @param {object} [props.sx] - the sx styling for the Autocomplete component
 * @param {object} [props.labelSX] - the sx styling for the label
 * @param {object} [props.textFieldSX] - the sx styling for the text field
 * @param {object} [props.iconHelperText] - the text to display in the info icon
 * @param {object} [props.altHelperText] - helper text to display above the field
 * @param {object} [props.helperText] - the helper text to display (below the field)
 * @param {boolean} [props.multiple] - is the field a multi-select
 * @param {object} [props.fieldOptions] - the options to pass to the field
 * @param {object} [props.textFieldProps] - props to pass to the text field
 * @param {object} [props.textFieldProps.inputLabelProps] - props to pass to the input label
 * @param {object} [props.textFieldProps.inputProps] - props to pass to the input
 * @returns {React.ReactElement}
 */
const Typeahead = forwardRef(({ label, items, isRequired, textFieldProps, sx, error,
  disabled, renderSX, labelSX, inputSX, textFieldSX, iconHelperText, helperText, multiple,
  fieldOptions, altHelperText, ...props
}, ref) => {
  // Override the default Autocomplete getOptionLabel / getOptionSelected methods
  // We can override the override methods by passing in the same method name as a prop

  // See: https://material-ui.com/api/autocomplete/#getoptionlabel-item
  const getOptionLabel = (option) => {
    const foundOpt = getOpObj(option);
    // We need to return an empty string for the label for the place holder to correctly show
    return foundOpt?.label || foundOpt?.name || '';
  };

  // See: https://material-ui.com/api/autocomplete/#isOptionEqualToValue-item
  const isOptionEqualToValue = (option, value) => {
    /*
      There always must be a found option. In the event nothing matches one of our options
      we have to return true. This will "select" the placeholder / null option
      We use isEmpty because value of 0 is a valid value
    */
    if (isEmpty(value)) {
      return true;
    }

    const foundOpt = getOpObj(value);

    // Things will get strange if we don't have a found option at this point and you dun goofed A A Ron
    const noId = isEmpty(foundOpt?.id);
    const noValue = isEmpty(foundOpt?.value);
    const sameId = !noId && (foundOpt.id === option?.id);
    const sameValue = !noValue && (foundOpt.value === option?.value);
    const isEqual = foundOpt ? (sameId || sameValue) : true;
    return isEqual;
  };

  /**
   * Helper method to get the option object can either be an object or just the value of the id
   * @function getOpObj
   * @param {object} option
   * @returns {object} the option object
   */
  const getOpObj = (option) => {
    // Allow a value of 0 to be passed in
    if (isEmpty(option.id) && isEmpty(option.value)) {
      option = items.find(op => {
        const optValue = op?.id?.toString() || option?.value?.toString();
        return optValue === option?.toString();
      });
    }

    return option;
  };

  return (
    <Autocomplete
      ref={ref}
      sx={sx || { width: 300 }}
      options={items}
      multiple={multiple}
      autoHighlight
      disabled={disabled}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      getOptionDisabled={(option) => {
        if (option.disabled) {
          return true;
        }
      }}
      renderOption={
        (optProps, option) => (
        // We're generating a more verbose key here in the event of bad data
          <Box component="li" {...optProps} key={`${option.id ?? option.value}-${option.label || option.name}`}>
            {option.label ?? option.name}
          </Box>
        )
      }
      renderInput={(params) => {
        return (
          <Box sx={renderSX || {}}>
            <AnyFieldLabel
              htmlFor={textFieldProps?.id || textFieldProps?.name || 'typeahead'}
              error={textFieldProps?.error}
              sx={labelSX || {}}
              label={label || 'Search'}
              required={!!isRequired}
              disabled={disabled}
              iconText={iconHelperText}
              fieldOptions={fieldOptions}
              helperText={altHelperText}
            />
            <TextField
              {...params}
              {...textFieldProps}
              sx={textFieldSX || {}}
              inputProps={{
                ...params.inputProps,
                id: textFieldProps?.id || textFieldProps?.name || 'typeaheadInput',
                sx: inputSX || {},
                autoComplete: 'new-password', // disable autocomplete and autofill
                'aria-autocomplete': 'none',
              }}
            />
            {helperText && <FormHelperText error={false}>{helperText}</FormHelperText>}
            <FormErrorMessage error={error} />
          </Box>
        );
      }}
      // Forward the rest of the props to the Autocomplete component
      // https://material-ui.com/api/autocomplete/#props
      {...props}
    />
  );
});

// Set the displayName to make it easier to identify in the React DevTools
// This needs to be set explicity because the forwardRef is used
// https://reactjs.org/docs/react-component.html#displayname
Typeahead.displayName = 'Typeahead';

Typeahead.propTypes = {
  disabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  items: PropTypes.array,
  label: PropTypes.string,
  sx: PropTypes.object,
  helperText: PropTypes.string,
  multiple: PropTypes.bool,
  iconHelperText: PropTypes.string,
  altHelperText: PropTypes.string,
  error: PropTypes.object,
  fieldOptions: PropTypes.object,
  renderSX: PropTypes.object,
  labelSX: PropTypes.object,
  textFieldSX: PropTypes.object,
  inputSX: PropTypes.object,
  textFieldProps: PropTypes.object,
};

export default Typeahead;