import PropTypes from 'prop-types';

import { FormControl, FormControlLabel, RadioGroup, Radio, FormHelperText } from '@mui/material';
import FormErrorMessage from '../FormErrorMessage';
import AnyFieldLabel from '../AnyFieldLabel/AnyFieldLabel';

const RadioOptions = ({ row, id, label, items, error, isRequired, disabled, altHelperText, helperText, iconHelperText, fieldOptions, ...props }) => {
  const renderRadios = () => {
    return (
      <>
        {items.map((item, index) => (
          <FormControlLabel value={item.id} control={<Radio />} label={item.label} key={`${id}_${index}`} />
        ))}
      </>
    );
  };

  return (
    <FormControl disabled={disabled} error={!!error}>
      <AnyFieldLabel
        asFormInput={true}
        htmlFor={id}
        error={!!error}
        label={label}
        required={!!isRequired}
        disabled={disabled}
        iconText={iconHelperText}
        fieldOptions={fieldOptions}
        helperText={helperText}
      />
      <RadioGroup
        row={row}
        aria-labelledby={`${id}-radio-buttons-group-label`}
        name={`${id}-radio-buttons-group`}
        {...props}
      >
        {renderRadios()}
      </RadioGroup>
      {altHelperText && <FormHelperText error={false}>{altHelperText}</FormHelperText>}
      <FormErrorMessage error={error} />
    </FormControl>
  );
};

RadioOptions.propTypes = {
  id: PropTypes.string.isRequired,
  items: PropTypes.array,
  label: PropTypes.string,
  row: PropTypes.bool,
  error: PropTypes.object,
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
  altHelperText: PropTypes.string,
  iconHelperText: PropTypes.string,
  fieldOptions: PropTypes.object,
  isRequired: PropTypes.bool,
};

export default RadioOptions;
