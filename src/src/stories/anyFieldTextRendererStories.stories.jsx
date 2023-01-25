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
  setDigits: {
    table: {
      disable: true
    }
  },
  integerDigits: {
    control: {
      type: 'number'
    },
    if: { arg: 'setDigits' }
  },
  fractionalDigits: {
    control: {
      type: 'number'
    },
    if: { arg: 'setDigits' }
  },
  ...standardAnyFieldArgTypeConfiguration
};

const anyFieldStoryDefaultExportOptions = {
  title: 'Text Renderer Fields',
  argTypes: standardAnyFieldTextRendererArgTypeConfiguration
};

export default generateAnyFieldStoryDefaultExport(anyFieldStoryDefaultExportOptions);


// ---------- Configure Stories ----------


const standardAnyFieldTextRendererArgs = {
  ...standardAnyFieldArgs,
  maxLength: '',
};

export const TextField = Template.bind({});
export const LongTextField = Template.bind({});
export const IntField = Template.bind({});
export const FloatField = Template.bind({});
export const LinkField = Template.bind({});

TextField.args = {
  ...standardAnyFieldTextRendererArgs,
  type: 0,
};

LongTextField.args = {
  ...standardAnyFieldTextRendererArgs,
  type: 1,
};

IntField.args = {
  ...standardAnyFieldTextRendererArgs,
  type: 2,
};

FloatField.args = {
  ...standardAnyFieldTextRendererArgs,
  type: 3,
  setDigits: true,
  integerDigits: undefined,
  fractionalDigits: undefined,
  maxValue: 12,
};

LinkField.args = {
  ...standardAnyFieldTextRendererArgs,
  type: 100,
};

//This is not hooked up yet
// export const CurrencyField = Template.bind({});

// CurrencyField.args = {
//     ...standardAnyFieldTextRendererArgs,
//     maxLength: "",

//     type: 4
// };
