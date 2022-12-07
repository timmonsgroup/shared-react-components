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

const GenericForm = ({ formTitle, headerTitle, cancelUrl, successUrl, isEdit, defaultValues, layoutOptions = {}, domainUrl, unitLabel, helpText, submitUrl, formatPayload, onSuccess, suppressSuccessToast }) => {
  const [modifying, setModifying] = useState(false);
  const { sections, layoutLoading, control, reset, handleSubmit } = useDynamicForm(layoutOptions, defaultValues, domainUrl, setModifying);
  const nav = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (data) => {
    const payload = formatPayload(data);
    console.log('formatted payload', payload);

    addOrUpdate(payload, isEdit, successUrl, cancelUrl);
  }

  const addOrUpdate = async (orgData, edit, successUrl, cancelUrl) => {
    setModifying(true);
    try {
      const result = await axios.post(submitUrl, orgData);
      if (result?.data?.streamID) {
        if (!suppressSuccessToast) {
          enqueueSnackbar(`${unitLabel} successfully ${edit ? 'updated' : 'created'}`, { variant: 'success' });
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
        enqueueSnackbar(`Error ${edit ? 'updating' : 'creating'} ${unitLabel}`, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(`Error ${edit ? 'updating' : 'creating'} ${unitLabel}`, { variant: 'error' });
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
                {/* <Button onClick={preSubmit} label={isEdit ? 'Edit' : 'Save'} /> */}
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
              {renderFormContent(sections, control)}
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

const renderFormContent = (sections, control) => {
  return (
    <form>
      {sections.map((section, index) => {
        return (
          <FormSection section={section} control={control} key={index} />
        );
      })}
    </form>
  );
}

const FormSection = ({section, control}) => {
  const nextCol = Math.ceil(section.fields.length / 2);
  const leftCol = section.fields.slice(0, nextCol);
  const rightCol = section.fields.slice(nextCol);

  return (
    <div>
      <Grid
        container
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
        <Grid item xs={6} key="left">
          {leftCol.map((field, index) => (
            <AnyField sx={{ marginTop: index ? '16px' : null }} layout={field.render} control={control} key={field?.render?.name}/>
          ))}
        </Grid>
        <Grid item xs={6} key="right">
          {rightCol.map((field, index) => (
            <AnyField sx={{ marginTop: index ? '16px' : null }} layout={field.render} control={control} key={field?.render?.name}/>
          ))}
        </Grid>
      </Grid>
    </div>
  )
}

FormSection.propTypes = {
  section: PropTypes.object,
  control: PropTypes.object,
}

export default GenericForm;