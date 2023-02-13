import { useDynamicForm } from "../../hooks";
import { Typography } from '@mui/material';
import ContainerWithCard from '../../stories/ContainerWithCard';
import LineLoader from '../../stories/LineLoader';
import AnyField from '../../stories/AnyField';
import React, { useState } from 'react'
import { StoryInfoBlock } from './infoBlocks/StoryInfoBlock';
import Button from "../../stories/Button";

const dynamicFormArgTypeConfiguration = {
  infoBlock: {
    table: {
      disable: true,
    },
  },
  dynamicFormTestData: {
    table: {
      disable: true,
    },
  },
  maxValue: {
    table: {
      disable: true,
    },
  },
  minLength: {
    table: {
      disable: true,
    },
  },
  maxLength: {
    table: {
      disable: true,
    },
  },
  integerDigits: {
    table: {
      disable: true,
    },
  },
  fractionalDigits: {
    table: {
      disable: true,
    },
  },
  required: {
    table: {
      disable: true,
    },
  },
  idField: {
    table: {
      disable: true,
    },
  },
  url: {
    table: {
      disable: true,
    },
  },
  disabled: {
    table: {
      disable: true,
    },
  },
  hidden: {
    table: {
      disable: true,
    },
  },
  helper: {
    table: {
      disable: true,
    },
  },
  reqText: {
    table: {
      disable: true,
    },
  },
  infoBlockOptions: {
    table: {
      disable: true
    },
  },
}

export function generateDynamicFormStoryDefaultExport(options) {
    let storyTitle = "form/Dynamic Form";
    storyTitle += options?.title ? `/${options.title}` : "";
    const argTypeConfiguration = dynamicFormArgTypeConfiguration

    return ({
      title: storyTitle,
    //   component: DynamicFormDemonstration,
      argTypes: argTypeConfiguration,
    });
  }

  const choiceFormatter = (fieldId, response, options) => {
    const { data } = response;

    const choicesData = data.facts;

    const formattedChoices = choicesData.map((choiceData, index) => {
      return { id: index, label: choiceData};
      })
    
    return formattedChoices;
  }

export const DynamicFormStoryTemplate = ( args ) => {

  const iterableArgs = Object.entries(args);
  let queryParameterString = "1&";
  for (const [key, value] of iterableArgs){
    if(key !=="dynamicFormTestData" && key !== "infoBlock" && key !== "infoBlockOptions") {
      queryParameterString += key + "=" + value;
    }
  }
  const [modifying, setModifying] = useState(false);
  const { sections, layoutLoading, control, trigger } = useDynamicForm({type: args.dynamicFormTestData, key: queryParameterString}, null, null, setModifying, { choiceFormatter });

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
        <Button sx={{ marginTop: '16px' }} onClick={() => trigger()} label="Trigger Validation" />
        <StoryInfoBlock infoBlockName={args.infoBlock} options={args.infoBlockOptions} />
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
    id: "defaultId",
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
    path: "defaultId",
    model: {
        name: "defaultModelName",
        modelId: 1,
        modelData: {},
        labelField: null,
        idField: null
    }
  };
}

export function objectToString(object) {
  const iterableThis = Object.entries(object);
  let thisString = "{ ";
  for (const [key, value] of iterableThis) {
    thisString += key + ": " + value;
  }
  thisString += " }";

  return thisString;
};