import {
  generateAnyFieldStoryDefaultExport,
  AnyFieldStoryTemplate as Template,
  standardAnyFieldArgs,
  standardAnyFieldArgTypeConfiguration
} from '../helpers/story-helpers/anyFieldStoryHelpers';



// ---------- Setup Default Export ----------
const standardAnyFieldTextRendererArgTypeConfiguration = {
  maxLength: {
    control: {
      type: 'number'
    },
  },
  useFloatControls: {
    table: {
      disable: true
    }
  },
  integerDigits: {
    control: {
      type: 'number'
    },
    if: { arg: 'useFloatControls' }
  },
  fractionalDigits: {
    control: {
      type: 'number'
    },
    if: { arg: 'useFloatControls' }
  },
  maxValue: {
    control: {
      type: 'number'
    },
    if: { arg: 'useFloatControls'}
  },
  ...standardAnyFieldArgTypeConfiguration
};

const anyFieldStoryDefaultExportOptions = {
  title: 'Text Renderer Fields',
  argTypes: standardAnyFieldTextRendererArgTypeConfiguration
};

export default generateAnyFieldStoryDefaultExport(anyFieldStoryDefaultExportOptions);


// ---------- Configure Stories ----------


export const TextField = Template.bind({});
export const LongTextField = Template.bind({});
export const IntField = Template.bind({});
export const FloatField = Template.bind({});
export const LinkField = Template.bind({});

TextField.args = {
  label: "Text Field",
  ...standardAnyFieldArgs,
  requiredErrorText: "Text required",
  type: 0,
};

LongTextField.args = {
  label: "Long Text Field",
  ...standardAnyFieldArgs,
  requiredErrorText: "Text required",
  type: 1,
};

IntField.args = {
  label: "Int Field",
  ...standardAnyFieldArgs,
  requiredErrorText: "Whole number required",
  type: 2,
};

FloatField.args = {
  label: "Float Field",
  ...standardAnyFieldArgs,
  requiredErrorText: "Whole number or decimal number required",
  type: 3,
  useFloatControls: true,
  integerDigits: undefined,
  fractionalDigits: undefined,
  maxValue: undefined,
};

LinkField.args = {
  label: "Link Field",
  ...standardAnyFieldArgs,
  requiredErrorText: "Link text required",
  type: 100,
};

//This is not hooked up yet
// export const CurrencyField = Template.bind({});

// CurrencyField.args = {
//     ...standardAnyFieldArgs,
//     maxLength: "",

//     type: 4
// };
