import * as React from 'react';
import PropTypes from 'prop-types';

import { FormControl, FormControlLabel, FormLabel, RadioGroup, Radio } from '@mui/material';
import FormErrorMessage from '../FormErrorMessage';
import RequiredIndicator from '../RequiredIndicator';

const RadioOptions = ({ row, id, label, items, error, isRequired, ...props }) => {
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
    <FormControl error={!!error}>
      <FormLabel id={`${id}-radio-buttons-group-label`}><RequiredIndicator isRequired={isRequired} />{label}</FormLabel>
      <RadioGroup
        row={row}
        aria-labelledby={`${id}-radio-buttons-group-label`}
        name={`${id}-radio-buttons-group`}
        {...props}
      >
        {renderRadios()}
      </RadioGroup>
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
  isRequired: PropTypes.bool,
};

export default RadioOptions;
