import React from 'react';
import PropTypes from 'prop-types';

const Thingy = ({label, value, units, ...props}) => {
  return (<p {...props}>
    <b>{label}:</b> {value}{units ? ` ${units}` :''}
  </p>);
}

Thingy.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any.isRequired,
  units: PropTypes.string
};

export default Thingy;
