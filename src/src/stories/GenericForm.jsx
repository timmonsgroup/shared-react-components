import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Third party components
import { Card, CardContent, Container, Grid, Stack, Typography } from '@mui/material';

// Shared components
import LineLoader from './LineLoader';
import SubHeader from './SubHeader';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import ContainerWithCard from './ContainerWithCard';
import AnyField from './AnyField';

// Custom hooks
import { useDynamicForm } from '../hooks';

import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import axios from 'axios';

/**
 * The generic form component
 * @function GenericForm
 * @param {object} props
 * @param {string} props.formTitle - The title of the form
 * @param {string} props.headerTitle - The title of the header
 * @param {string} props.cancelUrl - The url to navigate to when the user cancels
 * @param {string} props.successUrl - The url to navigate to when the user successfully submits the form
 * @param {boolean} props.isEdit - Whether or not this is an edit form
 * @param {object} props.defaultValues - The default values for the form
 * @param {object} props.layoutOptions - The layout options for the form
 * @param {boolean} props.twoColumn - Whether or not to render the form in two columns
 * @param {string} props.domainUrl - The url for the domain
 * @param {string} props.unitLabel - The label for the unit
 * @param {string} props.helpText - The help text for the form
 * @param {string} props.submitUrl - The url to submit the form to
 * @param {object} props.alternatingCols - Whether or not to alternate the columns
 * @param {object} props.iconOptions - The options for the icons
 * @param {function} props.formatPayload - A function to format the payload before submitting
 * @param {function} props.onSuccess - A function to call when the form is successfully submitted
 * @param {boolean} props.suppressSuccessToast - Whether or not to suppress the success toast
 * @param {boolean} props.suppressErrorToast - Whether or not to suppress the success toast
 * @param {function} props.formatSubmitMessage - A function to format the success toaster message
 * @param {function} props.formatSubmitError - A function to format the error message (sends the error as a parameter and true if it came from the server)
 * @param {object} props.asyncOptions - The options for the async select fields
 * @param {boolean} props.hideEmptySections - Whether or not to render sections that have no visible fields
 * @param {string} props.cancelColor - The color of the cancel button
 * @param {string} props.submitColor - The color of the submit button
 * @param {string} props.editColor - The color of the edit button
 * @returns {React.ReactElement} - The component
 */
const GenericForm = ({
  formTitle, headerTitle, cancelUrl, successUrl, isEdit, defaultValues, layoutOptions = {}, twoColumn = false,
  domainUrl, unitLabel, helpText, submitUrl, formatPayload, onSuccess, alternatingCols = false, iconOptions = {},
  suppressSuccessToast, suppressErrorToast, formatSubmitMessage, formatSubmitError, asyncOptions, cancelColor = 'tertiary',
  submitColor = 'primary', editColor = 'primary', hideEmptySections = true
}) => {
  const [modifying, setModifying] = useState(false);
  const { sections, layoutLoading, control, reset, handleSubmit } = useDynamicForm(layoutOptions, defaultValues, domainUrl, setModifying, asyncOptions);
  const nav = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (data) => {
    const payload = formatPayload(data);

    addOrUpdate(payload, isEdit, successUrl, cancelUrl);
  };

  const addOrUpdate = async (orgData, edit, successUrl, cancelUrl) => {
    if (!submitUrl) {
      console.log('No submit url provided. Data to submit:', orgData);
      return;
    }

    setModifying(true);
    try {
      const result = await axios.post(submitUrl, orgData);
      if (result?.data?.streamID) {
        if (!suppressSuccessToast) {
          const successMsg = formatSubmitMessage ? formatSubmitMessage(result) : `${unitLabel} successfully ${edit ? 'updated' : 'created'}`;
          enqueueSnackbar(successMsg, { variant: 'success' });
        }
        // If we have an onSuccess callback, call it otherwise navigate to the successUrl
        if (onSuccess) {
          onSuccess(result);
        } else {
          nav(successUrl || cancelUrl);
          setModifying(false);
          nav(successUrl || cancelUrl);
        }
      } else {
        setModifying(false);
        if (!suppressErrorToast) {
          const errorMsg = formatSubmitError ? formatSubmitError(result) : `Error ${edit ? 'updating' : 'creating'} ${unitLabel}`;
          enqueueSnackbar(errorMsg, { variant: 'error' });
        }
      }
    } catch (error) {
      if (!suppressErrorToast) {
        // If we have a nice server error use it.
        const serverError = error?.response?.data?.error;
        // Sending a true flag to formatSubmitError indicates that the error came from the server
        const errorMsg = formatSubmitError ? formatSubmitError(error, true) : `Error ${edit ? 'updating' : 'creating'} ${unitLabel}`;

        enqueueSnackbar(serverError || errorMsg, { variant: 'error' });
      }
      setModifying(false);
    }
  };

  // onSubmit is not called if the form is invalid
  // so we need to manually check for this
  const preSubmit = (evt) => {
    handleSubmit(onSubmit)(evt);
  };

  const rendered = () => {
    if (layoutLoading) {
      return (
        <ContainerWithCard>
          <LineLoader message="Loading..." />
        </ContainerWithCard>
      )
    }

    const theSection = twoColumn ? renderTwoColumnSection : renderFormSection;
    const sectOpts = twoColumn ? { alternatingCols } : {};
    sectOpts.iconOptions = iconOptions;
    sectOpts.hideEmptySections = hideEmptySections;

    return (
      <>
        <SubHeader data-src-form-subheader="genericForm"
          title={headerTitle}
          rightRender={
            () =>
              <Stack spacing={2} direction="row" justifyContent="flex-end">
                <Button data-src-form-button="cancel" color={cancelColor} href={cancelUrl} label="Cancel" />
                {isEdit && <Button color={editColor} onClick={() => reset()} label={'Reset'} />}
                <Button data-src-form-button="submit" color={submitColor} onClick={preSubmit}>{isEdit ? 'Edit' : 'Save'}</Button>
              </Stack>
          }
        />
        <LoadingSpinner isActive={modifying} />
        <Container sx={{ position: 'relative', marginTop: '16px' }} maxWidth={false}>
          <form data-src-form="genericForm">
            {sections.map((section, index) => {
              const sx = { position: 'relative' };
              if (index) {
                sx.marginTop = '16px';
              }
              const hasTopText = formTitle || helpText;
              return (
                <Card key={index} sx={sx}>
                  {index === 0 && hasTopText &&
                    <>
                      <CardContent sx={{ paddingBottom: '0px' }}>
                        {formTitle && <Typography variant="sectionHeader">{formTitle}</Typography>}
                        {helpText && helpText()}
                      </CardContent>
                      <hr />
                    </>
                  }
                  {theSection(section, control, index, sectOpts)}
                </Card>
              );
            })}
          </form>
        </Container>
      </>
    );
  };

  return rendered();
};

GenericForm.propTypes = {
  formTitle: PropTypes.string,
  cancelUrl: PropTypes.string,
  successUrl: PropTypes.string,
  isEdit: PropTypes.bool,
  defaultValues: PropTypes.object,
  layoutOptions: PropTypes.shape({
    type: PropTypes.string,
    key: PropTypes.string,
    url: PropTypes.string,
    layout: PropTypes.object,
  }),
  twoColumn: PropTypes.bool,
  alternatingCols: PropTypes.bool,
  onSuccess: PropTypes.func,
  suppressSuccessToast: PropTypes.bool,
  submitUrl: PropTypes.string,
  formatPayload: PropTypes.func.isRequired,
  domainUrl: PropTypes.string,
  unitLabel: PropTypes.string,
  helpText: PropTypes.func,
  headerTitle: PropTypes.string,
  iconOptions: PropTypes.object,
  submitColor: PropTypes.string,
  editColor: PropTypes.string,
  cancelColor: PropTypes.string,
  hideEmptySections: PropTypes.bool,
  formatSubmitMessage: PropTypes.func,
  formatSubmitError: PropTypes.func,
  suppressErrorToast: PropTypes.bool
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

  return (
    <CardContent key={index}>
      {section.name && <Typography variant="sectionHeader">{section.name}</Typography>}
      <Grid
        container
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
        <Grid item xs={6} key={`${index}-left`}>
          {leftCol.map((field, fIndex) => (
            <AnyField
              sx={{ marginTop: fIndex ? '16px' : null }}
              layout={field.render}
              control={control}
              key={`${index}-left-${field?.render?.name}`}
              options={{ icon: options?.iconOptions }}
            />
          ))}
        </Grid>
        <Grid item xs={6} key={`${index}-right`}>
          {rightCol.map((field, fIndex) => (
            <AnyField
              sx={{ marginTop: fIndex ? '16px' : null }}
              layout={field.render}
              control={control}
              options={{ icon: options?.iconOptions }}
              key={`${index}-right-${field?.render?.name}`}
            />
          ))}
        </Grid>
      </Grid>
    </CardContent>
  );
};

// example of choiceFormatter function
// const choiceFormatter = (fieldId, res, otherOptions) => {
//   const { mappedId } = otherOptions || {};
//   return res?.data?.map((opt) => {
//     const id = mappedId && opt[mappedId] ? opt[mappedId] : opt.id || opt.streamID;
//     return { id, label: opt.name || opt.label }
//   })
// }

export default GenericForm;