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
 * @param {function} props.formatPayload - A function to format the payload before submitting
 * @param {function} props.onSuccess - A function to call when the form is successfully submitted
 * @param {boolean} props.suppressSuccessToast - Whether or not to suppress the success toast
 * @param {boolean} props.suppressErrorToast - Whether or not to suppress the success toast
 * @param {function} props.formatSubmitMessage - A function to format the success toaster message
 * @param {function} props.formatSubmitError - A function to format the error message (sends the error as a parameter and true if it came from the server)
 * @returns
 */
const GenericForm = ({
  formTitle, headerTitle, cancelUrl, successUrl, isEdit, defaultValues, layoutOptions = {}, twoColumn = false,
  domainUrl, unitLabel, helpText, submitUrl, formatPayload, onSuccess,
  suppressSuccessToast, suppressErrorToast, formatSubmitMessage, formatSubmitError, asyncOptions
}) => {
  const [modifying, setModifying] = useState(false);
  const { sections, layoutLoading, control, reset, handleSubmit } = useDynamicForm(layoutOptions, defaultValues, domainUrl, setModifying, asyncOptions);
  const nav = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (data) => {
    const payload = formatPayload(data);

    addOrUpdate(payload, isEdit, successUrl, cancelUrl);
  }

  const addOrUpdate = async (orgData, edit, successUrl, cancelUrl) => {
    setModifying(true);
    try {
      const result = await axios.post(submitUrl, orgData);
      if (result?.data?.streamID) {
        if (!suppressSuccessToast) {
          const successMsg = formatSubmitMessage ? formatSubmitMessage(result) : `${unitLabel} successfully ${edit ? 'updated' : 'created'}`;
          enqueueSnackbar(successMsg, { variant: 'success' });
        }
        // If we have an onSuccess callback, call it otherwise navigate to the successUrl
        if (onSuccess){
          onSuccess(result);
        } else {
          nav(successUrl || cancelUrl);
          setModifying(false);
          nav(successUrl || cancelUrl);
        }
      } else {
        setModifying(false);
        if(!suppressErrorToast) {
          const errorMsg = formatSubmitError ? formatSubmitError(result) : `Error ${edit ? 'updating' : 'creating'} ${unitLabel}`;
          enqueueSnackbar(errorMsg, { variant: 'error' });
        }
      }
    } catch (error) {
      if(!suppressErrorToast) {
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
  }

  const rendered = () => {
    if (layoutLoading) {
      return (
        <ContainerWithCard>
          <LineLoader message="Loading..." />
        </ContainerWithCard>
      )
    }

    const theSection = twoColumn ? renderTwoColumnSection : renderFormSection;

    return (
      <>
        <SubHeader
          title={headerTitle}
          rightRender={
            () =>
              <Stack spacing={2} direction="row" justifyContent="flex-end">
                <Button color="tertiary" href={cancelUrl} label="Cancel" />
                {isEdit && <Button color="primary" onClick={() => reset()} label={'Reset'} />}
                <Button onClick={preSubmit}>{isEdit ? 'Edit' : 'Save'}</Button>
              </Stack>
          }
        />
        <LoadingSpinner isActive={modifying} />
        <Container sx={{ position: 'relative', marginTop: '16px' }} maxWidth={false}>
          <Card sx={{ position: 'relative' }}>
            <CardContent sx={{ paddingBottom: '0px' }}>
              {formTitle && <Typography variant="sectionHeader">{formTitle}</Typography>}
              {helpText && helpText()}
            </CardContent>
            <hr />
            <CardContent>
              <form>
                {sections.map((section, index) => theSection(section, control, index))}
              </form>
            </CardContent>
          </Card>
        </Container>
      </>
    );
  }

  return rendered();
}

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
  }),
  suppressSuccessToast: PropTypes.bool,
  submitUrl: PropTypes.string.isRequired,
  formatPayload: PropTypes.func.isRequired,
  domainUrl: PropTypes.string,
  unitLabel: PropTypes.string,
}

const renderFormSection = (section, control, index) => {
  return (
    <div key={index}>
      {section.title && <Typography variant="sectionHeader">{section.title}</Typography>}
      {section.fields.map((field, fIndex) => (
        <AnyField sx={{ marginTop: fIndex ? '16px' : null }} layout={field.render} control={control} key={field?.render?.name}/>
      ))}
    </div>
  );
}

const renderTwoColumnSection = (section, control, index) => {
  const nextCol = Math.ceil(section.fields.length / 2);
  const leftCol = section.fields.slice(0, nextCol);
  const rightCol = section.fields.slice(nextCol);

  return (
    <div key={index}>
      <Grid
        container
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
        <Grid item xs={6} key={`${index}-left`}>
          {leftCol.map((field, fIndex) => (
            <AnyField sx={{ marginTop: fIndex ? '16px' : null }} layout={field.render} control={control} key={`${index}-left-${field?.render?.name}`}/>
          ))}
        </Grid>
        <Grid item xs={6} key={`${index}-right`}>
          {rightCol.map((field, fIndex) => (
            <AnyField sx={{ marginTop: fIndex ? '16px' : null }} layout={field.render} control={control} key={`${index}-right-${field?.render?.name}`}/>
          ))}
        </Grid>
      </Grid>
    </div>
  )
}

// example of choiceFormatter function
const choiceFormatter = (fieldId, data, otherOptions) => {
  console.log('choiceFormatter', fieldId, data, otherOptions);
  const { mappedId } = otherOptions || {};
  return data?.map((opt) => {
    const id = mappedId && opt[mappedId] ? opt[mappedId] : opt.id || opt.streamID;
    return { id, label: opt.name || opt.label }
  })
}

export default GenericForm;