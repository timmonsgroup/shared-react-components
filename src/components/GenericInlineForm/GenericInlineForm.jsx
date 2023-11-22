/** @module GenericInlineForm */
//Third party bits
import React from 'react';
import PropTypes from 'prop-types';

import { useFormContext } from 'react-hook-form';

// Third party components
import { CardContent, Container, Stack, Box, Skeleton, useTheme } from '@mui/material';

// Internal bits
import Button from '../Button';
import LoadingSpinner from '../LoadingSpinner';
import { functionOrDefault, createRowFields } from '../../helpers';
import { SectionTop } from '../Section';
import { SectionRow } from './GenericConfigForm';



/**
 * Renderer for a section with
 * @callback renderColumnSection
 * @param {object} section - the section to render
 * @param {object} control - the control object from react-hook-form
 * @param {number} index - the index of the section
 * @param {object} [options] - options object
 * @param {number} [options.columnCount] - the number of columns to render
 * @param {renderSectionDescription} [options.renderSectionDescription] - a function to render the section description
 * @param {renderSectionTitle} [options.renderSectionTitle] - a function to render the section title
 * @param {renderSectionTop} [options.renderSectionTop] - a function to render the section top
 * @param {boolean} [options.hideEmptySections] - a flag to hide sections that are empty
 * @returns {React.ReactElement} - the rendered column section
 */
const renderColumnSection = (section, control, index, options) => {
  // create two columns of fields
  if (section.visible === false && options?.hideEmptySections) {
    return null;
  }

  const rows = createRowFields(section.fields, options?.columnCount);
  const hasTopRender = options?.renderSectionTop && (typeof options?.renderSectionTop === 'function');
  const hasTop = !hasTopRender && (section.name || section.description);

  return (
    <React.Fragment key={index}>
      {hasTopRender && options.renderSectionTop(section, index)}
      {hasTop &&
        <SectionTop
          title={section.name}
          description={section.description}
          renderDescription={options?.renderSectionDescription}
          renderTitle={options?.renderSectionTitle}
        />
      }
      <CardContent>
        {rows.map((rowItem, rIndex) => {
          return (
            <SectionRow row={rowItem} control={control} options={options} key={`${index}-row-${rIndex}`} />
          );
        })}
      </CardContent>
    </React.Fragment>
  );
};


/** @module InlineFormSections */
/**
 * @typedef {object} InlineFormSectionProps
 * @property {string} [title] - the title to display in the section
 * @property {string} [description] - the description to display in the section
 * @property {renderSectionDescription} [renderFormDescription] - a function to render the form description (bypassed if renderFormInformation is provided)
 * @property {renderSectionTitle} [renderFormTitle] - a function to render the form title (bypassed if renderFormInformation is provided)
 * @property {renderSectionTop} [renderFormInformation] - a function to render the form information (title and description)
 * @property {renderSectionTitle} [renderSectionTitle] - a function to render the section title
 * @property {renderSectionDescription} [renderSectionDescription] - a function to render the section description
 * @property {renderSectionTop} [renderSectionTop] - a function to render the section top
 * @property {function} [renderLoading] - a function to render the loading indicator
 * @property {number} [columnCount] - the number of columns to render
 * @property {object} [fieldOptions] - the options to pass to the fields
 * @property {boolean} [hideEmptySections] - whether or not to hide the section if it is empty
 * @property {object} [children] - the children to render
 */
/**
 * InlineFormSections will loop through the sections and render them and their fields inside an html form
 * @function InlineFormSections
 * @param {InlineFormSectionProps} props - props object
 * @returns {React.ReactElement} - the rendered form sections
 */
const InlineFormSections = ({
  children, formTitle, formDescription, renderFormDescription, renderFormTitle, columnCount = 1, fieldOptions, hideEmptySections = true,
  renderLoading, renderFormInformation, renderSectionTitle, renderSectionDescription, renderSectionTop
}) => {
  const { sections, formProcessing, useFormObject } = useFormContext();
  const { control } = useFormObject;

  const loadingIndicator = functionOrDefault(renderLoading, () => (
    <div>
      <h1>Processing</h1>
      <Skeleton variant="rectangular" height={300} />
    </div>
  ));

  if (formProcessing) {
    return loadingIndicator();
  }

  if (!sections) {
    return (
      <div>
        <h1>Error</h1>
        <p>No form sections were provided</p>
      </div>
    );
  }

  const theSection = renderColumnSection;
  const sectOpts = {
    columnCount,
    fieldOptions,
    hideEmptySections,
    renderSectionTitle,
    renderSectionDescription,
    renderSectionTop
  };

  const hasTopRender = renderFormInformation && (typeof renderFormInformation === 'function');
  const hasTopText = !hasTopRender && (formTitle || formDescription || renderFormDescription || renderFormTitle);

  return (
    <form data-src-form="genericForm">
      {sections.map((section, index) => {
        const sx = { position: 'relative' };
        if (index) {
          sx.marginTop = '16px';
        }
        return (
          <Box key={index} sx={sx}>
            {index === 0 && hasTopRender &&
              renderFormInformation(formTitle, formDescription)
            }
            {index === 0 && hasTopText &&
              <SectionTop title={formTitle} description={formDescription} renderDescription={renderFormDescription} renderTitle={renderFormTitle} />
            }
            {theSection(section, control, index, sectOpts)}
          </Box>
        );
      })}
      {children}
    </form>
  );
};
InlineFormSections.propTypes = {
  children: PropTypes.node,
  formTitle: PropTypes.string,
  formDescription: PropTypes.string,
  renderFormDescription: PropTypes.func,
  renderFormTitle: PropTypes.func,
  renderFormInformation: PropTypes.func,
  renderSectionTitle: PropTypes.func,
  renderSectionDescription: PropTypes.func,
  renderSectionTop: PropTypes.func,
  fieldOptions: PropTypes.object,
  hideEmptySections: PropTypes.bool,
  renderLoading: PropTypes.func,
  columnCount: PropTypes.number,
};


/** @module GenericInlineForm */
/**
 * A Generic Form with a header and buttons to submit and cancel
 * Must be wrapped in a FormProvider
 * @function GenericInlineForm
 * @param {object} props
 * @param {string} [props.resetColor] - the color to use for the edit button
 * @param {string} [props.submitColor] - the color to use for the submit button
 * @param {InlineFormSectionProps} [props.sectionProps] - the props to pass to the section (See FormSections Component)
 * @param {string} [props.resetLabel] - the label to use for the reset button
 * @param {string} [props.submitLabel] - the label to use for the submit button
 * @param {function} [props.onSubmit] - the function to call when the form is submitted
 * @param {boolean} [props.modifying] - whether or not the form is currently being modified
 * @param {object} [props.formOptions] - the options to pass to the form to customize the styling
 * @param {object} [props.children] - the children to render
 * @param {function} [props.renderLoading] - the function to render while the form is loading
 * @returns {React.ReactElement} - the rendered form
 */
const GenericInlineForm = ({
  resetColor, submitColor, sectionProps, onSubmit, modifying, formOptions,
  resetLabel, submitLabel, children, renderLoading
}) => {

  const theme = useTheme();

  const defaultThemeGroup = {
    container: {
      position: 'relative',
      marginTop: '16px'
    },
    buttonContainer: {
      margintTop: '55px',
      submitButton: {
        marginRight: '20px'
      },
      resetButton: {}
    }
  };

  // Attempt to use the themeGroup from props, then the inlineForm defined in the base theme
  const { inlineForm } = theme;
  const { themeGroup } = formOptions || {};
  const inlineFormGroup = themeGroup?.inlineForm || inlineForm || defaultThemeGroup;

  // Get the form context
  // useFormObject is all the properties from react-hook-form useForm object
  // formProcessing is a boolean that is true when the form is processing
  // forceReset is a function that will reset the form to the initial values
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

  const loadingIndicator = functionOrDefault(renderLoading, () => <LoadingSpinner isActive={true} />);

  return (
    <>
      {(formProcessing || modifying) && loadingIndicator()}
      <Container sx={inlineFormGroup?.container} maxWidth={false}>
        <Stack direction="row" spacing={3}>
          <Box>
            <InlineFormSections {...sectionProps}>
              {children}
            </InlineFormSections>
          </Box>
          <Box>
            <Box sx={inlineFormGroup?.buttonContainer}>
              <Button sx={inlineFormGroup?.submitButton} data-src-form-button="submit" color={submitColor} onClick={preSubmit} label={submitLabel || 'Submit'} />
              <Button sx={inlineFormGroup?.resetButton} data-src-form-button="reset" color={resetColor} onClick={forceReset} label={resetLabel || 'Clear'} />
            </Box>
          </Box>
        </Stack>
      </Container>
    </>
  );
};

GenericInlineForm.propTypes = {
  headerTitle: PropTypes.string,
  resetColor: PropTypes.string,
  cancelColor: PropTypes.string,
  cancelUrl: PropTypes.string,
  cancelLabel: PropTypes.string,
  resetLabel: PropTypes.string,
  isEdit: PropTypes.bool,
  submitLabel: PropTypes.string,
  submitColor: PropTypes.string,
  formOptions: PropTypes.shape({
    themeGroup: PropTypes.shape({
      inlineForm: PropTypes.shape({
        container: PropTypes.object,
        buttonContainer: PropTypes.object,
        submitButton: PropTypes.object,
        resetButton: PropTypes.object
      })
    })
  }),
  // Runtime error if this is not defined ABOVE
  sectionProps: PropTypes.shape(InlineFormSections.propTypes),
  children: PropTypes.node,
  onSubmit: PropTypes.func,
  modifying: PropTypes.bool,
  renderLoading: PropTypes.func,
};


export default GenericInlineForm;