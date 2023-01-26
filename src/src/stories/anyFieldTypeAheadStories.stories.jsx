import {
  generateAnyFieldStoryDefaultExport,
  AnyFieldStoryTemplate as Template,
  standardSelectionAnyFieldArgs,
  standardAnyFieldSelectionArgTypeConfiguration
} from '../helpers/story-helpers/anyFieldStoryHelpers';


// ---------- Setup Default Export ----------


const anyFieldStoryDefaultExportOptions = {
  title: 'Type Ahead Dropdown Fields',
  argTypes: standardAnyFieldSelectionArgTypeConfiguration
};

export default generateAnyFieldStoryDefaultExport(anyFieldStoryDefaultExportOptions);


// ---------- Configure Stories ----------


const standardTypeAheadAnyFieldArgs = {
  ...standardSelectionAnyFieldArgs,
  multiple: false,
  checkbox: false,
};

export const TypeAheadChoiceField = Template.bind({});
export const TypeAheadObjectField = Template.bind({});

TypeAheadChoiceField.args = {
  label: "Type Ahead Choice Field",
  ...standardTypeAheadAnyFieldArgs,
  type: 7,
};

TypeAheadObjectField.args = {
  label: "Type Ahead Object Field",
  ...standardTypeAheadAnyFieldArgs,
  type: 10,
};