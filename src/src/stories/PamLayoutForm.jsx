import React from 'react';

import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';

import { InputLabel, TextField, Box, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


import RequiredIndicator from './RequiredIndicator';
import RadioOptions from './RadioOptions';
import Typeahead from './Typeahead';
import FormErrorMessage from './FormErrorMessage';

import { FIELD_TYPES } from '@timmons-group/shared-react-components/constants';


export const AnyField = ({ control, rules, layout, disabled, ...props }) => {
  const renderState = renderType(layout, disabled);

  return (
    <Box {...props}>
      <Controller
        control={control}
        rules={rules}
        name={layout.name}
        render={renderState}
      />
    </Box>
  );
};

const renderType = (layout, disabled) => {
  const { id, type, name, label, options } = layout;
  switch (type) {
    case FIELD_TYPES.DATE: {
      const renderDate = ({ field: { value, onChange }, fieldState: { error } }) => (
        <>
          <DatePicker
            name={name}
            disabled={disabled}
            id={id}
            value={value}
            onChange={onChange}
            renderInput={(params) => (
              <>
                <InputLabel disabled={disabled} htmlFor={id || name} error={!!error}><RequiredIndicator isRequired={!!layout.required} />{label}</InputLabel>
                <TextField sx={{ width: '100%' }} {...params} />
              </>
            )}
          />
          <FormErrorMessage error={error} />
        </>
      );
      return renderDate;
    }
    case FIELD_TYPES.TEXT:
    case FIELD_TYPES.LONG_TEXT:
    case FIELD_TYPES.INT:
    case FIELD_TYPES.LINK:
    case FIELD_TYPES.FLOAT: {
      const isMultiple = type === FIELD_TYPES.LONG_TEXT;
      const renderTextField = ({ field: { value, onChange }, fieldState: { error } }) => (
        <>
          <InputLabel htmlFor={id || name} error={!!error}><RequiredIndicator isRequired={!!layout.required} />{label}</InputLabel>
          <TextField sx={{ width: '100%' }}
            id={id || name}
            error={!!error}
            onChange={onChange}
            value={value}
            multiline={isMultiple}
            minRows={isMultiple ? 3 : 1}
            placeholder={layout.placeholder || `Enter ${label}`}
            variant="outlined"
          />
          <FormErrorMessage error={error} />
        </>
      );
      return renderTextField;
    }
    case FIELD_TYPES.CHOICE:
    case FIELD_TYPES.OBJECT: {
      const renderTypeahead = ({ field, field: { onChange }, fieldState: { error } }) => {
        // value is passed in via the react hook form inside of field
        // Ref is needed by the typeahead / autoComplete component and is passed in via props spreading
        return (
          // We need to manually connect a few props here for react hook form
          <Typeahead
            {...field}
            sx={{ width: '100%' }}
            disabled={layout.disabled}
            items={layout.choices || []}
            label={label}
            isRequired={!!layout.required}
            // These are props that are passed to the MUI TextField rendered by Typeahead
            textFieldProps={{
              placeholder: layout.placeholder || `Select ${label}`,
              error: !!error,
              helperText: error?.message,
            }}
            // hooks-form appears to only want value and not the native onChange
            onChange={(_, newValue) => {
              onChange(newValue?.id || null);
            }}
            error={error}
          />
        );
      };
      return renderTypeahead;
    }
    case 'radio': {
      const renderRadio = ({ field: { value, onChange }, fieldState: { error } }) => {
        // so we need to manually connect a few props here for react hook form
        return (
          <RadioOptions
            items={options}
            isRequired={true}
            id={id}
            label={label}
            value={value}
            onChange={onChange}
            error={error}
          />);
      };
      return renderRadio;
    }
    default:
      return <TextField />;
  }
};

AnyField.propTypes = {
  control: PropTypes.object.isRequired,
  rules: PropTypes.object,
  layout: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
};

const renderFormContent = (sections, control) => {
  return (
    <form>
      {sections.map((field, index) => {
        return createFormSection(field, control, index);
      })}
    </form>
  );
};

const createFormSection = (section, control, index) => {
  const nextCol = Math.ceil(section.fields.length / 2);
  const left = section.fields.slice(0, nextCol);
  const right = section.fields.slice(nextCol);

  return (
    <div key={index}>
      <Grid
        container
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
        <Grid item xs={6}>
          {left.map((field, index) => renderField(field, control, index))}
        </Grid>
        <Grid item xs={6}>
          {right.map((field, index) => renderField(field, control, index))}
        </Grid>
      </Grid>
    </div>
  );
};

const renderField = (field, control, index) => {
  return (
    <AnyField sx={{ marginTop: index ? '16px' : null }} key={index} layout={field.render} control={control} />
  );
};

const PamLayoutForm = ({ layout, control }) => {
  return <>
    {renderFormContent(layout.sections, control)}
  </>;
};

PamLayoutForm.propTypes = {
  layout: PropTypes.object,
  control: PropTypes.object.isRequired,
};

export default PamLayoutForm;