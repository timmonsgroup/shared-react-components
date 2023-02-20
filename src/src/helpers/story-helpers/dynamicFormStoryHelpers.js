import { useDynamicForm } from "../../hooks";
import { Typography } from '@mui/material';
import ContainerWithCard from '../../stories/ContainerWithCard';
import LineLoader from '../../stories/LineLoader';
import AnyField from '../../stories/AnyField';
import React from 'react';

const dynamicFormArgTypeConfiguration = {
  testDataOptions: {
    table: {
      disable: true,
    },
  },
}

export function generateDynamicFormStoryDefaultExport(options) {
    let storyTitle = "form/Dynamic Form";
    storyTitle += options?.title ? `/${options.title}` : "";
    const argTypeConfiguration = dynamicFormArgTypeConfiguration

    return ({
      title: storyTitle,
      argTypes: argTypeConfiguration,
    });
  }

  const customChoiceFormatter = (fieldId, response, options) => {
    const { data } = response;

    const choicesData = data.facts;

    const formattedChoices = choicesData.map((choiceData, index) => {
      return { id: index, label: choiceData};
      })
    
    return formattedChoices;
  }

export const DynamicFormStoryTemplate = ( args ) => {

  const { sections, layoutLoading, control } = useDynamicForm({layout: args.configurationObject }, null, null, null, { customChoiceFormatter });

  if (layoutLoading) {
    return (
      <ContainerWithCard>
        <LineLoader message="Loading..." />
      </ContainerWithCard>
    );
  }

    return (
      <>
        {sections.map((section, index) => renderFormSection(section, control, index))}
      </>
    );
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

export function generateDefaultSection() {
  return {
    layout: [],
    editable: true,
    enabled: true,
    name: "default section name"
    }
}

export function generateDefaultFieldLayout() {
  return {
    label: "Default Label",
    type: 0,
    hidden: false,
    conditions: [],
    linkFormat: {},
    required: false,
    readOnly: false,
    disabled: false,
    helperText: "default helper text",
    requiredErrorText: "I'm required!",
    multiple: false,
    checkbox: false,
    possibleChoices: null,
    url: '',
    path: "defaultPathModelName",
    model: {
        name: "defaultPathModelName",
        id: 1,
        data: {},
        labelField: null,
        idField: null
    }
  };
}