import {
  generateAnyFieldStoryDefaultExport,
  AnyFieldStoryTemplate as Template,
  standardSelectionAnyFieldArgs,
  standardAnyFieldSelectionArgTypeConfiguration,
  urlSelectionAnyFieldArgs
} from '../helpers/story-helpers/anyFieldStoryHelpers';


// ---------- Setup Default Export ----------


const anyFieldStoryDefaultExportOptions = {
  title: 'Type Ahead Dropdown Fields',
  argTypes: standardAnyFieldSelectionArgTypeConfiguration
};

export default generateAnyFieldStoryDefaultExport(anyFieldStoryDefaultExportOptions);


// ---------- Configure Stories ----------


const standardTypeAheadAnyFieldArgs = {
  multiple: false,
  checkbox: false,
};

export const TypeAheadChoiceField = Template.bind({});
export const TypeAheadObjectField = Template.bind({});

export const TypeAheadUrlChoiceField = Template.bind({});
export const TypeAheadUrlObjectField = Template.bind({});

TypeAheadChoiceField.args = {
  label: "Type Ahead Choice Field",
  ...standardSelectionAnyFieldArgs,
  ...standardTypeAheadAnyFieldArgs,
  type: 7,
};

TypeAheadObjectField.args = {
  label: "Type Ahead Object Field",
  ...standardSelectionAnyFieldArgs,
  ...standardTypeAheadAnyFieldArgs,
  type: 10,
};

TypeAheadUrlChoiceField.args = {
  label: 'URL Type Ahead Choice Field',
  ...urlSelectionAnyFieldArgs,
  ...standardTypeAheadAnyFieldArgs,
  type: 7
};

TypeAheadUrlObjectField.args = {
  label: 'URL Type Ahead Object Field',
  ...urlSelectionAnyFieldArgs,
  ...standardTypeAheadAnyFieldArgs,
  type: 10,
};