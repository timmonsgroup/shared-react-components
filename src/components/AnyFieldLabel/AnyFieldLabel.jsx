/** @module AnyFieldLabel */
import React from 'react';
import PropTypes from 'prop-types';

import TooltipIcon from '../../stories/TooltipIcon';

import {
  InputLabel, Box, FormLabel, FormHelperText, useTheme
} from '@mui/material';
import RequiredIndicator from '../../stories/RequiredIndicator';

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
 * AnyField is a wrapper around the various field types that implements the react-hook-form Controller
 * @function
 * @param {object} props
 * @param {string} props.htmlFor - the id to use for htmlFor
 * @param {string} [props.error] - the error message to display
 * @param {boolean} [props.disabled] - is the field disabled
 * @param {boolean} [props.required] - is the field required
 * @param {string} [props.label] - the label to display
 * @param {string} [props.asFormInput] - whether to render the label using FormLabel or InputLabel
 * @param {string} [props.iconText] - the text to display in the info icon
 * @param {string} [props.helperText] - the text to display in the helper text
 * @param {FieldOptions} [props.fieldOptions] - the options to pass to the field
 * @returns {React.ReactElement} a label for a field with an optional info icon and required indicator
 */
const AnyFieldLabel = ({ htmlFor, error, disabled, required, label, iconText, helperText, asFormInput = false, fieldOptions = {}, className, sx }) => {
  const theme = useTheme();

  // Attempt to use the themeGroup from props, then the anyFieldLabel defined in the base theme
  const { anyFieldLabel } = theme;
  const { themeGroup } = fieldOptions || {};
  const gAFL = themeGroup?.anyFieldLabel || anyFieldLabel || null;
  let gHelper = gAFL?.helperText || anyFieldLabel?.helperText || { marginTop: 0 };

  const BoxSx = {
    display: 'flex',
    alignItems: 'center',
    gap: fieldOptions?.icon?.gap || '0.5rem',
    ...sx
  };

  if (iconText && fieldOptions?.icon?.beforeLabel) {
    sx.flexDirection = 'row-reverse';
    sx.justifyContent = 'flex-end';
  }

  const iconProps = fieldOptions?.icon || { color: 'primary' };

  const labelComponent = asFormInput ? (
    <FormLabel className={className} component="legend"><RequiredIndicator isRequired={!!required} />{label}</FormLabel>
  ) : (
    <InputLabel className={className} htmlFor={htmlFor} error={!!error}><RequiredIndicator disabled={disabled} isRequired={!!required} />
      {label}
    </InputLabel>
  );

  return (
    <Box sx={gAFL}>
      <Box sx={BoxSx}>
        {labelComponent}
        {iconText && <TooltipIcon infoText={iconText} {...iconProps} />}
      </Box>
      {helperText && <FormHelperText sx={gHelper}>{helperText}</FormHelperText>}
    </Box>
  );
};

AnyFieldLabel.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  className: PropTypes.string,
  sx: PropTypes.object,
  asFormInput: PropTypes.bool,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  label: PropTypes.string.isRequired,
  iconText: PropTypes.string,
  helperText: PropTypes.string,
  fieldOptions: PropTypes.object
};

export default AnyFieldLabel;
