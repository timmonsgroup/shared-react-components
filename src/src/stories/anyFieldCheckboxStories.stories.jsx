import {
  generateAnyFieldStoryDefaultExport,
  AnyFieldStoryTemplate as Template,
  standardSelectionAnyFieldArgs,
  standardAnyFieldSelectionArgTypeConfiguration,
  urlSelectionAnyFieldArgs
} from '../helpers/story-helpers/anyFieldStoryHelpers';


// ---------- Setup Default Export ----------


const anyFieldStoryDefaultExportOptions = {
  title: 'Checkbox Fields',
  argTypes: standardAnyFieldSelectionArgTypeConfiguration
};

export default generateAnyFieldStoryDefaultExport(anyFieldStoryDefaultExportOptions);


// ---------- Configure Stories ----------


const standardCheckboxAnyFieldArgs = {
  helperText: '',
  multiple: true,
  checkbox: true,
};

export const CheckboxChoiceField = Template.bind({});
export const CheckboxObjectField = Template.bind({});

export const CheckboxUrlChoiceField = Template.bind({});
export const CheckboxUrlObjectField = Template.bind({});

CheckboxChoiceField.args = {
  label: 'Checkbox Choice Field',
  ...standardSelectionAnyFieldArgs,
  ...standardCheckboxAnyFieldArgs,
  type: 7,
};

CheckboxObjectField.args = {
  label: 'Checkbox Object Field',
  ...standardSelectionAnyFieldArgs,
  ...standardCheckboxAnyFieldArgs,
  type: 10,
};

CheckboxUrlChoiceField.args = {
  label: 'URL Checkbox Choice Field',
  ...urlSelectionAnyFieldArgs,
  ...standardCheckboxAnyFieldArgs,
  type: 7
};

CheckboxUrlObjectField.args = {
  label: 'URL Checkbox Object Field',
  ...urlSelectionAnyFieldArgs,
  ...standardCheckboxAnyFieldArgs,
  type: 10,
};