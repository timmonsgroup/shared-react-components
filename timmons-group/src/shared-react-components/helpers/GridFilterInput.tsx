import { TextField } from '@mui/material';
const GridFilterInput = ({ item, applyValue, ...rest }) => {
  return (
    <TextField
      label="Value"
      inputRef={input => input && input.focus()}
      variant="standard"
      value={item.value}
      placeholder="Filter value"
      onChange={(e) => applyValue({ ...item, value: e.target.value })}
      {...rest}
    />
  )
}

export default GridFilterInput;