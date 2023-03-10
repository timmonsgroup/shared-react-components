/** @module DynamicForm */
//Third party bits
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { FormProvider, useFormContext } from 'react-hook-form';

// Third party components
import { Card, CardContent, Container, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

// Internal bits
import { parseFormLayout } from '../../hooks/useFormLayout';
import { useConfigForm } from '../../hooks/useConfigForm';
import Button from '../Button';
import DynamicField from '../DynamicField';
import SubHeader from '../SubHeader';
import LoadingSpinner from '../LoadingSpinner';
import { functionOrDefault } from '../../helpers';

/**
 * Wrapper a configurable form waits for the form layout to be parsed and then renders the form
 * @function ConfigForm
 * @param {object} props
 * @param {object} props.formLayout - the layout of the form
 * @param {object} props.data - the data to populate the form with
 * @param {object} props.parseOptions - options to pass to the parser
 * @param {string} props.urlDomain - the domain to use for the API calls
 * @param {object} props.children - the children to render
 * @param {function} props.renderLoading - the function to render while the form is loading
 * @returns {React.ReactElement}
 */
export const ConfigForm = ({ formLayout, data, urlDomain, parseOptions = {}, children, renderLoading }) => {
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

  return functionOrDefault(renderLoading, () => (<LoadingSpinner />))();
};

ConfigForm.propTypes = {
  formLayout: PropTypes.object,
  data: PropTypes.object,
  urlDomain: PropTypes.string,
  parseOptions: PropTypes.object,
  renderLoading: PropTypes.func,
  children: PropTypes.node,
};

/**
 * Wraps any children in a FormProvider and sets up the useFormContext values
 * @function DynamicForm
 * @param {object} props - props object
 * @param {object} props.layout - the layout object
 * @param {object} props.data - the data to populate the form with
 * @param {string} props.urlDomain - the domain to use for the API calls
 * @param {object} props.children - the children to render
 * @returns {React.ReactElement} - the wrapped children
 */
export const DynamicForm = ({ layout, data, urlDomain, children, options }) => {
  const { useFormObject, ...rest } = useConfigForm(layout, data, { urlDomain, ...options });

  return (
    <FormProvider useFormObject={useFormObject} {...rest}>
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

/**
 * A Generic Form with a header and buttons to submit and cancel
 * @function GenericConfigForm
 * @param {object} props
 * @param {string} props.headerTitle - the title to display in the header
 * @param {string} props.resetColor - the color to use for the edit button
 * @param {string} props.cancelColor - the color to use for the cancel button
 * @param {string} props.cancelUrl - the url to redirect to when the cancel button is clicked
 * @param {boolean} props.isEdit - whether or not the form is in edit mode
 * @param {string} props.submitColor - the color to use for the submit button
 * @param {object} props.sectionProps - the props to pass to the section
 * @param {string} props.cancelLabel - the label to use for the cancel button
 * @param {string} props.resetLabel - the label to use for the reset button
 * @param {string} props.submitLabel - the label to use for the submit button
 * @param {function} props.onSubmit - the function to call when the form is submitted
 * @param {boolean} props.modifying - whether or not the form is currently being modified
 * @param {object} props.children - the children to render
 * @returns {React.ReactElement} - the rendered form
 */
export const GenericConfigForm = ({
  headerTitle, resetColor, cancelColor, cancelUrl, isEdit, submitColor, sectionProps, onSubmit, modifying,
  cancelLabel, resetLabel, submitLabel, children,
}) => {
  const { formProcessing, forceReset, useFormObject } = useFormContext();
  const { handleSubmit } = useFormObject;

  const submitForm = functionOrDefault(onSubmit, (data) => {
    console.warn('no onSubmit provided. Data to submit: ', data);
  });

  // onSubmit is not called if the form is invalid
  // so we need to manually check for this
  const preSubmit = (evt) => {
    // const themValues = getValues();
    handleSubmit(submitForm)(evt);
  };

  return (
    <>
      <SubHeader data-src-form-subheader="genericForm"
        title={headerTitle}
        rightRender={
          () =>
            <Stack spacing={2} direction="row" justifyContent="flex-end">
              <Button data-src-form-button="cancel" color={cancelColor} href={cancelUrl} label={cancelLabel || 'Cancel'} />
              {isEdit &&
                <Button data-src-form-button="reset" color={resetColor} onClick={forceReset} label={resetLabel || 'Reset'} />
              }
              <Button data-src-form-button="submit" color={submitColor} onClick={preSubmit} label={submitLabel || 'Save'} />
            </Stack>
        }
      />
      <LoadingSpinner isActive={formProcessing || modifying} />
      <Container sx={{ position: 'relative', marginTop: '16px' }} maxWidth={false}>
        <FormSections {...sectionProps}>
          {children}
        </FormSections>
      </Container>
    </>
  );
};

GenericConfigForm.propTypes = {
  headerTitle: PropTypes.string,
  resetColor: PropTypes.string,
  cancelColor: PropTypes.string,
  cancelUrl: PropTypes.string,
  cancelLabel: PropTypes.string,
  resetLabel: PropTypes.string,
  isEdit: PropTypes.bool,
  submitLabel: PropTypes.string,
  submitColor: PropTypes.string,
  sectionProps: PropTypes.object,
  children: PropTypes.node,
  onSubmit: PropTypes.func,
  modifying: PropTypes.bool
};

export const FormSections = ({ children, formTitle, formDescription, renderFormDescription, columnCount = 1, fieldOptions, hideEmptySections = true }) => {
  const { sections, formProcessing, useFormObject } = useFormContext();
  const { control } = useFormObject;

  if (formProcessing) {
    return (
      <div>
        <h1>Processing</h1>
        <p>useFormConfig is still doing a thing</p>
      </div>
    );
  }

  if (!sections) {
    return (
      <div>
        <h1>Error</h1>
        <p>Something is jacked with your sections</p>
      </div>
    );
  }

  // const theSection = twoColumn ? renderTwoColumnSection : renderFormSection;
  const theSection = renderTwoColumnSection;
  const sectOpts = {
    columnCount,
    fieldOptions,
    hideEmptySections,
  };

  return (
    <form data-src-form="genericForm">
      {sections.map((section, index) => {
        const sx = { position: 'relative' };
        if (index) {
          sx.marginTop = '16px';
        }
        const hasTopText = formTitle || formDescription;
        return (
          <Card key={index} sx={sx}>
            {index === 0 && hasTopText &&
              <FirstSectionTop formTitle={formTitle} formDescription={formDescription} renderFormDescription={renderFormDescription} />
            }
            {theSection(section, control, index, sectOpts)}
          </Card>
        );
      })}
    </form>
  );
};

FormSections.propTypes = {
  children: PropTypes.node,
  formTitle: PropTypes.string,
  formDescription: PropTypes.string,
  alternatingCols: PropTypes.bool,
  renderFormDescription: PropTypes.func,
  fieldOptions: PropTypes.object,
  hideEmptySections: PropTypes.bool,
  columnCount: PropTypes.number,
};

const defaultFormDescription = (description) => {
  return (
    <Typography>
      {description}
    </Typography>
  );
};

export const FirstSectionTop = ({ formTitle, formDescription, renderFormDescription }) => {
  let theDescription = null;
  if (formDescription) {
    theDescription = (renderFormDescription && renderFormDescription instanceof Function) ? renderFormDescription : defaultFormDescription;
  }

  return (
    <>
      <CardContent sx={{ paddingBottom: '0px' }}>
        {formTitle && <Typography variant="sectionHeader">{formTitle}</Typography>}
        {theDescription && theDescription(formDescription)}
      </CardContent>
      <hr />
    </>
  );
};

FirstSectionTop.propTypes = {
  formTitle: PropTypes.string,
  formDescription: PropTypes.string,
  renderFormDescription: PropTypes.func,
};


const renderTwoColumnSection = (section, control, index, options) => {
  // create two columns of fields
  console.log()
  if (section.visible === false && options?.hideEmptySections) {
    return null;
  }

  const rows = [];
  const cols = options?.columnCount || 1;
  let col = 1;
  let row = 1;

  //Create the rows
  section.fields.forEach((field, fIndex) => {
    if (field.render.solitary) {
      const rowObject = {
        fields: [field],
        solitary: true,
        size: field.render.singleColumnSize || 12,
        maxColumns: cols,
      };
      rows.push(rowObject);
      row = rows.length;
      col = 1;
      return;
    }

    if (rows[row] === undefined) {
      rows[row] = { fields: [], maxColumns: cols };
    }
    rows[row].fields.push(field);
    col++;

    if (col > cols) {
      col = 1;
      row++;
    }
  });

  return (
    <CardContent key={index}>
      {section.name && <Typography variant="sectionHeader">{section.name}</Typography>}
      {rows.map((rowItem, rIndex) => {
        return (
          <SectionRow row={rowItem} control={control} options={options} key={`${index}-row-${rIndex}`} />
        );
      })}
    </CardContent>
  );
};

export const SectionRow = ({ row, control, options }) => {
  const { fields, solitary, size, maxColumns } = row;
  const colsAllowed = maxColumns || 1;
  let colSize = 12 / fields.length;
  if (solitary && !isNaN(size)) {
    colSize = parseInt(size);
  }

  const spacing = colsAllowed === 1 ? 2 : { xs: 1, sm: 2, md: 4 };

  return (
    <Grid container spacing={spacing}>
      {fields.map((field) => (
        <Grid xs={colSize} key={`grid-item-${field?.render?.name}`}>
          <DynamicField
            field={field}
            control={control}
            options={options.fieldOptions || {}}
          />
        </Grid>
      ))}
    </Grid>
  );
};

SectionRow.propTypes = {
  row: PropTypes.shape({
    fields: PropTypes.array,
    solitary: PropTypes.bool,
    size: PropTypes.number,
    maxColumns: PropTypes.number,
  }),
  control: PropTypes.object,
  options: PropTypes.object,
};


// const renderFormSection = (section, control, index, options) => {
//   if (section.visible === false && options?.hideEmptySections) {
//     return null;
//   }

//   return (
//     <CardContent key={index}>
//       {section.name && <Typography variant="sectionHeader">{section.name}</Typography>}
//       {section.fields.map((field, fIndex) => (
//         <DynamicField
//           field={field}
//           sx={{ marginTop: fIndex ? '16px' : null }}
//           control={control}
//           key={field?.render?.name}
//           options={options.fieldOptions || {}}
//         />
//       ))}
//     </CardContent>
//   );
// };