
import React from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object } from 'yup';

import { parseFormLayout } from '../../hooks';
import AnyField from '../../stories/AnyField';
import Button from "../../stories/Button";


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

  const { control, trigger, formState } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(validationSchema)
  });

  return (
    <>
      <AnyField control={control} layout={field.render} key={field.render.name} />
      <Button sx={{ marginTop: '16px' }} onClick={() => trigger()} label="Trigger Validation" />
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

  testSectionLayout.label = args.label ?? "Default Label";
  testSectionLayout.type = args.type ?? 0;
  testSectionLayout.hidden = args.hidden ?? false;
  testSectionLayout.conditions = args.conditions ?? [];
  testSectionLayout.linkFormat = args.linkFormat ?? {};
  testSectionLayout.required = args.required ?? false;
  testSectionLayout.readOnly = args.readOnly ?? false;
  testSectionLayout.disabled = args.disabled ?? false;
  testSectionLayout.helperText = args.helperText ?? "default helper text";
  testSectionLayout.requiredErrorText = args.requiredErrorText ?? "";
  testSectionLayout.multiple = args.multiple ?? false;
  testSectionLayout.checkbox = args.checkbox ?? false;
  testSectionLayout.possibleChoices = args.possibleChoices ?? [
    {
      name: "default Choice 1",
      id: 1
    },
    {
      name: "default Choice 2",
      id: 2
    }
  ];
  testSectionLayout.url = args.url ?? "";
  testSectionLayout.path = args.path ?? "";

  // Validations
  testSectionLayout.integerDigits = args.integerDigits ?? null;
  testSectionLayout.fractionalDigits = args.fractionalDigits ?? null;
  testSectionLayout.maxValue = args.maxValue ?? null;
  testSectionLayout.maxLength = args.maxLength ?? null;
  testSectionLayout.minLength = args.minLength ?? null;

  testSectionLayout.model = {};
  testSectionLayout.model.name = args.modelName ?? "defaultModelName";
  testSectionLayout.model.id = args.modelId ?? 1;
  testSectionLayout.model.data = args.modelData ?? {};

  testSection.editable = args.editable ?? true;
  testSection.enabled = args.enabled ?? true;
  testSection.name = args.sectionName ?? "default section name";

  const parsedLayout = await parseFormLayout(testLayout);
  const fieldId = parsedLayout.sections[0].fields[0];
  const field = parsedLayout.fields.get(fieldId);

  return field;
};