import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@mui/material/Typography';

const LineItem = ({label, value, units, ...props}) => {
  return (<Typography {...props}>
    <b>{label}:</b> {value}{units ? ` ${units}` :''}
  </Typography>);
};

LineItem.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any.isRequired,
  units: PropTypes.string
};

LineItem.defaultProps = {
  variant: 'lineItem',
};

export default LineItem;
