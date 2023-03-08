//Third party bits
import React, { useEffect, useMemo, useState, useRef } from 'react';
import PropTypes from 'prop-types';

import { FormProvider, useFormContext } from 'react-hook-form';

// Third party components
import { Card, CardContent, Container, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

// Internal bits
import { getFieldValue, parseFormLayout } from '../../hooks/useFormLayout';
import AnyField from '../AnyField';
import { useConfigForm } from '../../hooks/useConfigForm';
import Button from '../Button';
import DynamicField from '../DynamicField';

/**
 * Wrapper a configurable form waits for the form layout to be parsed and then renders the form
 * @param {object} props
 * @param {object} props.formLayout - the layout of the form
 * @param {object} props.data - the data to populate the form with
 * @param {object} props.parseOptions - options to pass to the parser
 * @param {string} props.urlDomain - the domain to use for the API calls
 * @param {object} props.children - the children to render
 * @returns {React.ReactElement}
 */
export const ConfigForm = ({ formLayout, data, urlDomain, parseOptions = {}, children }) => {
  const [parsed, setParsed] = useState(null);

  useEffect(() => {
    const parseIt = async () => {
      const parsed = await parseFormLayout(formLayout, urlDomain, parseOptions);
      setParsed(parsed);
    };
    parseIt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formLayout]);

  if (parsed) {
    return (
      <DynamicForm layout={parsed} data={data} options={parseOptions}>
        {children}
      </DynamicForm>
    );
  }

  return (
    <div>
      <h1>Processing</h1>
      <p>Still waiting</p>
    </div>
  );
};

ConfigForm.propTypes = {
  formLayout: PropTypes.object,
  data: PropTypes.object,
  urlDomain: PropTypes.string,
  parseOptions: PropTypes.object,
  children: PropTypes.node,
};

export const DynamicForm = ({ layout, data, urlDomain, children, options }) => {
  const { useFormObject, ...rest } = useConfigForm(layout, data, { urlDomain, ...options });

  return (
    <FormProvider {...useFormObject} {...rest}>
      {children}
    </FormProvider>
  );
};

DynamicForm.propTypes = {
  layout: PropTypes.object,
  data: PropTypes.object,
  urlDomain: PropTypes.string,
  children: PropTypes.node,
  options: PropTypes.object,
};

export const FormSections = ({ children, twoColumn, alternatingCols, fieldOptions, hideEmptySections }) => {
  console.log('FormSections', children, twoColumn, alternatingCols, fieldOptions, hideEmptySections);
  const allThings = useFormContext();
  const { getValues, sections, control, formProcessing, forceReset, handleSubmit } = allThings;
  // const watchFields = watch();

  // onSubmit is not called if the form is invalid
  // so we need to manually check for this
  const preSubmit = (evt) => {
    const themValues = getValues();
    console.log('preSubmit', themValues);
    handleSubmit(onSubmit)(evt);
  };

  const onSubmit = async (data) => {
    console.log('submitting', data);
    // const payload = formatPayload(data);

    // addOrUpdate(payload, isEdit, successUrl, cancelUrl);
  };

  if (formProcessing) {
    return (
      <div>
        <h1>Processing</h1>
        <p>useFormConfig is still doing a thing</p>
      </div>
    );
  }

  console.log('sections', sections)

  if (!sections) {
    return (
      <div>
        <h1>Error</h1>
        <p>Something is jacked with your sections</p>
      </div>
    );
  }

  const theSection = twoColumn ? renderTwoColumnSection : renderFormSection;
  const sectOpts = twoColumn ? { alternatingCols } : {};
  sectOpts.fieldOptions = fieldOptions;
  sectOpts.hideEmptySections = hideEmptySections;

  return (
    <form data-src-form="genericForm">
      <Button onClick={() => forceReset()}>Reset</Button>
      <Button data-src-form-button="submit" onClick={preSubmit}>Save</Button>
      {sections.map((section, index) => {
        const sx = { position: 'relative' };
        if (index) {
          sx.marginTop = '16px';
        }
        // const hasTopText = formTitle || helpText;
        return (
          <Card key={index} sx={sx}>
            {theSection(section, control, index, sectOpts)}
          </Card>
        );
      })}
    </form>
  );
};

const renderTwoColumnSection = (section, control, index, options) => {
  // create two columns of fields
  if (section.visible === false && options?.hideEmptySections) {
    return null;
  }

  let leftCol = [];
  let rightCol = [];
  if (options?.alternatingCols) {
    section.fields.forEach((field, fIndex) => {
      if (fIndex % 2 === 0) {
        leftCol.push(field);
      } else {
        rightCol.push(field);
      }
    });
  } else {
    const nextCol = Math.ceil(section.fields.length / 2);
    leftCol = section.fields.slice(0, nextCol);
    rightCol = section.fields.slice(nextCol);
  }

  const rows = [];
  const cols = 3;
  let col = 1;
  let row = 1;

  //Create the rows
  section.fields.forEach((field, fIndex) => {
    console.log('field', field.render);
    if (field.render.solitary) {
      rows.push([field]);
      row = rows.length;
      col = 1;
      return;
    }

    if (rows[row] === undefined) {
      rows[row] = [];
    }
    rows[row].push(field);
    col++;

    if (col > cols) {
      col = 1;
      row++;
    }
  });

  return (
    <CardContent key={index}>
      {section.name && <Typography variant="sectionHeader">{section.name}</Typography>}
      {rows.map((row, rIndex) => (
        <Grid container spacing={{ xs: 1, sm: 2, md: 4 }} key={`${index}-row-${rIndex}`}>
          {row.map((field, fIndex) => (
            <Grid xs={12/row.length} key={`${index}-field-${fIndex}`}>
              <DynamicField
                field={field}
                control={control}
                key={`${index}-left-${field?.render?.name}`}
                options={options.fieldOptions || {}}
              />
            </Grid>
          ))}
        </Grid>
      ))}
    </CardContent>
  );
};

const renderFormSection = (section, control, index, options) => {
  if (section.visible === false && options?.hideEmptySections) {
    return null;
  }

  return (
    <CardContent key={index}>
      {section.name && <Typography variant="sectionHeader">{section.name}</Typography>}
      {section.fields.map((field, fIndex) => (
        <DynamicField
          field={field}
          sx={{ marginTop: fIndex ? '16px' : null }}
          control={control}
          key={field?.render?.name}
          options={options.fieldOptions || {}}
        />
      ))}
    </CardContent>
  );
};

FormSections.propTypes = {
  children: PropTypes.node,
  twoColumn: PropTypes.bool,
  alternatingCols: PropTypes.bool,
  fieldOptions: PropTypes.object,
  hideEmptySections: PropTypes.bool,
};