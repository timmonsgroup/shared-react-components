import {
  generateAnyFieldStoryDefaultExport,
  AnyFieldStoryTemplate as Template,
  standardSelectionAnyFieldArgs,
  standardAnyFieldSelectionArgTypeConfiguration
} from '../helpers/story-helpers/anyFieldStoryHelpers';


// ---------- Setup Default Export ----------


const anyFieldStoryDefaultExportOptions = {
  title: 'Checkbox Fields',
  argTypes: standardAnyFieldSelectionArgTypeConfiguration
};

export default generateAnyFieldStoryDefaultExport(anyFieldStoryDefaultExportOptions);


// ---------- Configure Stories ----------


const standardCheckboxAnyFieldArgs = {
  ...standardSelectionAnyFieldArgs,
  helperText: '',
  multiple: true,
  checkbox: true,
};

export const CheckboxChoiceField = Template.bind({});
export const CheckboxObjectField = Template.bind({});

export const CheckboxUrlChoiceField = Template.bind({});
export const CheckboxUrlObjectField = Template.bind({});

CheckboxChoiceField.args = {
    label: "Checkbox Choice Field",
  ...standardCheckboxAnyFieldArgs,
  type: 7,
};

CheckboxObjectField.args = {
    label: "Checkbox Object Field",
  ...standardCheckboxAnyFieldArgs,
  type: 10,
};

CheckboxUrlChoiceField.args = {
  url: "https://catfact.ninja/facts",  
  ...standardCheckboxAnyFieldArgs,
  type: 7,
  possibleChoices: null
};

CheckboxUrlObjectField.args = {
  url: "https://catfact.ninja/facts",  
  ...standardCheckboxAnyFieldArgs,
  type: 10,
  possibleChoices: null
};