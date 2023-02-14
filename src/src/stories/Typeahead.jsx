import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { Box, TextField, Autocomplete, InputLabel, FormHelperText } from '@mui/material';
import RequiredIndicator from './RequiredIndicator';
import AnyFieldLabel from './AnyFieldLabel';
import FormErrorMessage from './FormErrorMessage';

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
 * @param {object} props
 * @param {string} props.label - the label to display
 * @param {boolean} props.isRequired - is the field required
 * @param {object} props.items - the items to display in the dropdown
 * @param {object} props.error - the error message to display
 * @param {boolean} props.disabled - is the field disabled
 * @param {object} props.renderSX - the sx styling for the surrounding box
 * @param {object} props.sx - the sx styling for the Autocomplete component
 * @param {object} props.labelSX - the sx styling for the label
 * @param {object} props.textFieldSX - the sx styling for the text field
 * @param {object} props.iconHelperText - the text to display in the info icon
 * @param {object} props.helperText - the helper text to display
 * @param {object} props.textFieldProps - props to pass to the text field
 * @param {object} props.textFieldProps.inputLabelProps - props to pass to the input label
 * @param {object} props.textFieldProps.inputProps - props to pass to the input
 * @returns {JSX.Element}
 */
const Typeahead = forwardRef(({ label, items, isRequired, textFieldProps, sx, error,
  disabled, renderSX, labelSX, inputSX, textFieldSX, iconHelperText, helperText, fieldOptions, ...props
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
    */
    if (value === '' || value === null || value === undefined) {
      return true;
    }

    const foundOpt = getOpObj(value);

    // Things will get strange if we don't have a found option at this point and you dun goofed A A Ron
    const isEqual = foundOpt ? option?.id === foundOpt?.id || option?.value === foundOpt?.value : true;
    return isEqual;
  }

  /**
   * Helper method to get the option object can either be an object or just the value of the id
   * @param {*} option
   * @returns
   */
  const getOpObj = (option) => {
    if (!option.id && !option.value) {
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
      autoHighlight
      disabled={disabled}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      renderOption={(optProps, option) => (
        <Box component="li" {...optProps}>
          {option.label}
        </Box>
      )}
      renderInput={(params) => {
        return (
          <Box sx={renderSX || {}}>
            <AnyFieldLabel
              htmlFor={textFieldProps.id || textFieldProps.name}
              error={textFieldProps?.error}
              sx={labelSX || {}}
              label={label || 'Search'}
              required={!!isRequired}
              disabled={disabled}
              iconText={iconHelperText}
              fieldOptions={fieldOptions}
            />
            <TextField
              {...params}
              {...textFieldProps}
              sx={textFieldSX || {}}
              inputProps={{

                ...params.inputProps,
                sx: inputSX || {},
                autoComplete: 'new-password', // disable autocomplete and autofill
              }}
            />
            {helperText && <FormHelperText error={false}>{helperText}</FormHelperText>}
            <FormErrorMessage error={props.error} />
          </Box>
        )
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
  iconHelperText: PropTypes.string,
  error: PropTypes.object,
  renderSX: PropTypes.object,
  labelSX: PropTypes.object,
  textFieldSX: PropTypes.object,
  inputSX: PropTypes.object,
  textFieldProps: PropTypes.object,
}

export default Typeahead;