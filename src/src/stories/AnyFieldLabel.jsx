import React from 'react';
import PropTypes from 'prop-types';

import InfoIcon from './InfoIcon';

import {
  InputLabel, Box, FormLabel
} from '@mui/material';
import RequiredIndicator from './RequiredIndicator';

/**
 * AnyField is a wrapper around the various field types that implements the react-hook-form Controller
 *
 * @param {object} props
 * @param {string} props.htmlFor - the id to use for htmlFor
 * @param {string} props.error - the error message to display
 * @param {boolean} props.disabled - is the field disabled
 * @param {boolean} props.required - is the field required
 * @param {string} props.label - the label to display
 * @param {string} props.asFormInput - whether to render the label using FormLabel or InputLabel
 * @param {string} props.iconText - the text to display in the info icon
 * @param {object} props.fieldOptions - the options to pass to the field
 * @param {object} props.fieldOptions.icon - the options to pass to the info icon
 * @param {object} props.fieldOptions.icon.gap - the gap between the label and the icon
 * @param {object} props.fieldOptions.icon.color - the color of the icon
 * @param {object} props.fieldOptions.icon.beforeLabel - whether to display the icon before the label
 * @param {object} props.fieldOptions.icon.iconComponent - a component to use instead of the default InfoIcon
 * @returns {React.ReactElement} a label for a field with an optional info icon and required indicator
 */
const AnyFieldLabel = ({ htmlFor, error, disabled, required, label, iconText, asFormInput = false, fieldOptions = {} }) => {
  const sx = {
    display: 'flex',
    alignItems: 'center',
    gap: fieldOptions?.icon?.gap || '0.5rem',
  };

  if (iconText && fieldOptions?.icon?.beforeLabel) {
    sx.flexDirection = 'row-reverse';
    sx.justifyContent= 'flex-end';
  }

  const iconProps = fieldOptions?.icon || {color: 'primary'};

  const labelComponent = asFormInput ? (
    <FormLabel component="legend"><RequiredIndicator isRequired={!!required} />{label}</FormLabel>
  ) : (
    <InputLabel htmlFor={htmlFor} error={!!error}><RequiredIndicator disabled={disabled} isRequired={!!required} />
      {label}
    </InputLabel>
  );

  return (
    <Box sx={sx}>
      {labelComponent}
      {iconText && <InfoIcon infoText={iconText} {...iconProps} />}
    </Box>
  );
};

AnyFieldLabel.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  asFormInput: PropTypes.bool,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  label: PropTypes.string.isRequired,
  iconText: PropTypes.string,
  fieldOptions: PropTypes.object
};

export default AnyFieldLabel;
