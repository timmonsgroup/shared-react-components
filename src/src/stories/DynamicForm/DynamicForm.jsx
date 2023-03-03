//Third party bits
import React, { useEffect, useMemo, useState, useRef } from 'react';
import PropTypes from 'prop-types';

import { FormProvider, useFormContext } from 'react-hook-form';

// Third party components
import { Card, CardContent, Container, Grid, Stack, Typography } from '@mui/material';

// Internal bits
import { getFieldValue, parseFormLayout } from '../../hooks/useFormLayout';
import AnyField from '../AnyField';
import { useConfigForm } from '../../hooks/useConfigForm';
import Button from '../Button';

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

export const NestedThing = ({ children }) => {
  const allThings = useFormContext();
  const { register, watch, setValue, getValues, reset, sections, control, formProcessing, forceReset } = allThings;
  // const watchFields = watch();

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
  // useEffect(() => {
  //   console.log('watchFields', watchFields);
  //   console.log('getValues', getValues());
  // }, [watchFields]);

  return (
    <form data-src-form="genericForm">
      <Button onClick={() => forceReset()}>Reset</Button>
      {sections.map((section, index) => {
        const sx = { position: 'relative' };
        if (index) {
          sx.marginTop = '16px';
        }
        // const hasTopText = formTitle || helpText;
        return (
          <Card key={index} sx={sx}>
            {renderFormSection(section, control, index, {})}
          </Card>
        );
      })}
    </form>
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
        <AnyField
          sx={{ marginTop: fIndex ? '16px' : null }}
          layout={field.render}
          control={control}
          key={field?.render?.name}
          options={{ icon: options?.iconOptions }}
        />
      ))}
    </CardContent>
  );
};