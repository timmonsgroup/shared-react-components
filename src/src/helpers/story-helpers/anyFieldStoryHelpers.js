
import React from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object } from 'yup';

import { getFieldValue, parseFormLayout } from '../../hooks';
import AnyField from '../../stories/AnyField';
import Button from "../../stories/Button";
import { StoryInfoBlock } from './infoBlocks/StoryInfoBlock';


// ---------- Setup ArgType Configurations ----------


export const standardAnyFieldArgTypeConfiguration = {
  type: {
    table: {
      disable: true,
    },
  },
  modelName: {
    table: {
      disable: true,
    },
  },
  control: {
    table: {
      disable: true,
    },
  },
  rules: {
    table: {
      disable: true,
    },
  },
  layout: {
    table: {
      disable: true,
    },
  },
  id: {
    table: {
      disable: true
    }
  },
  name: {
    table: {
      disable: true
    }
  },
  multiple: {
    table: {
      disable: true
    }
  },
  checkbox: {
    table: {
      disable: true
    }
  },
  infoBlock: {
    table: {
      disable: true
    }
  },
  infoBlockOptions: {
    table: {
      disable: true
    }
  },
  options: {
    table: {
      disable: true
    }
  }
};

export const standardAnyFieldSelectionArgTypeConfiguration = {
  multiple: {
    table: {
      disable: true
    }
  },
  checkbox: {
    table: {
      disable: true
    }
  },
  url: {
    table: {
      disable: true
    }
  },
  disablePossibleChoices: {
    table: {
      disable: true
    }
  },
  possibleChoices: {
    control: {
      type: 'array'
    },
    if: { arg: 'disablePossibleChoices',  truthy: false}
  },
  ...standardAnyFieldArgTypeConfiguration
};


// ---------- Setup Standard AnyField Arg Objects ----------


export const standardAnyFieldArgs = {
  disabled: false,
  required: false,
};

export const standardSelectionAnyFieldArgs = {
  ...standardAnyFieldArgs,
  requiredErrorText: "Selection required",
  possibleChoices: [
    {
      name: "default Choice 1",
      id: 1
    },
    {
      name: "default Choice 2",
      id: 2
    }
  ],
}

export const urlSelectionAnyFieldArgs = {
  ...standardAnyFieldArgs,
  requiredErrorText: "Selection required",
  url: 'https://dog-api.kinduff.com/api/facts?number=5',
  possibleChoices: null,
  infoBlock: "AnyFieldUrlSelection",
  infoBlockOptions: {url: 'https://dog-api.kinduff.com/api/facts?number=5'},
  disablePossibleChoices: true
};

// --------------------------------------
// ---------- Helper Functions ----------
// --------------------------------------


export function generateAnyFieldStoryDefaultExport(options) {
  let storyTitle = "form/AnyField";
  storyTitle += options?.title ? `/${options.title}` : "";
  const argTypeConfiguration = options?.argTypes ?? standardAnyFieldArgTypeConfiguration;

  return ({
    title: storyTitle,
    component: AnyField,
    argTypes: argTypeConfiguration,
    loaders: [
      async (context) => {
        const field = await loadArgsAndGetField(context.args);

        return ({
          field: field
        });
      },
    ]
  });
}

export const AnyFieldStoryTemplate = (args, { loaded: { field } }) => {
  const fieldValidationsInSchemaCreationFormat = { [field.id]: field.validations };
  const validationSchema = object(fieldValidationsInSchemaCreationFormat);

  // Need to get a correct default value for the field to avoid "uncontrolled to controlled" errors
  const { value } = getFieldValue(field, {});

  const { control, trigger } = useForm({
    defaultValues: {
      [field.id]: value
    },
    mode: 'onBlur',
    resolver: yupResolver(validationSchema)
  });

  return (
    <>
      <AnyField control={control} layout={field.render} key={field.render.name} />
      <Button sx={{ marginTop: '16px' }} onClick={() => trigger()} label="Trigger Validation" />
      <StoryInfoBlock infoBlockName={args.infoBlock} options={args.infoBlockOptions} />
    </>
  );
}

// Copy Default Layout
// Load arg selections into default layout
// parse layout
// retrieve field and return it.
export async function loadArgsAndGetField(args) {
  const testLayout = {
    sections: [{
      layout: [{}]
    }]
  };
  const testSection = testLayout.sections[0];
  const testSectionLayout = testLayout.sections[0].layout[0];

  testSectionLayout.label = args.label ?? 'Default Label';
  testSectionLayout.id = args.id ?? 'defaultId';
  testSectionLayout.type = args.type ?? 0;
  testSectionLayout.hidden = args.hidden ?? false;
  testSectionLayout.conditions = args.conditions ?? [];
  testSectionLayout.linkFormat = args.linkFormat ?? {};
  testSectionLayout.required = args.required ?? false;
  testSectionLayout.readOnly = args.readOnly ?? false;
  testSectionLayout.disabled = args.disabled ?? false;
  testSectionLayout.helperText = args.helperText ?? 'default helper text';
  testSectionLayout.requiredErrorText = args.requiredErrorText ?? '';
  testSectionLayout.multiple = args.multiple ?? false;
  testSectionLayout.checkbox = args.checkbox ?? false;
  testSectionLayout.possibleChoices = args.possibleChoices; // url check doesn't work unless this is nullish - EGS 1/30/23
  testSectionLayout.url = args.url ?? '';
  testSectionLayout.path = testSectionLayout.id ?? 'defaultId';

  // Validations
  testSectionLayout.integerDigits = args.integerDigits 
  testSectionLayout.fractionalDigits = args.fractionalDigits 
  testSectionLayout.maxValue = args.maxValue 
  testSectionLayout.maxLength = args.maxLength 
  testSectionLayout.minLength = args.minLength 

  testSectionLayout.model = {};
  testSectionLayout.model.name = args.modelName ?? 'defaultModelName';
  testSectionLayout.model.id = args.modelId ?? 1;
  testSectionLayout.model.data = args.modelData ?? {};
  testSectionLayout.model.data.labelField = args.labelField;
  testSectionLayout.model.data.idField = args.idField;

  testSection.editable = args.editable ?? true;
  testSection.enabled = args.enabled ?? true;
  testSection.name = args.sectionName ?? 'default section name';

  const choiceFormatter = (fieldId, response, options) => {
    const { data } = response;

    const choicesData = data.facts;

    const formattedChoices = choicesData.map((choiceData, index) => {
      return { id: index, label: choiceData};
      })
    
    return formattedChoices;
  }

  const parsedLayout = await parseFormLayout(testLayout, null, { choiceFormatter });
  const fieldId = parsedLayout.sections[0].fields[0];
  const field = parsedLayout.fields.get(fieldId);

  return field;
};