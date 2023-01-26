// AnyField.stories.jsx
import {
  generateAnyFieldStoryDefaultExport,
  AnyFieldStoryTemplate as Template,
  standardAnyFieldArgs
} from '../helpers/story-helpers/anyFieldStoryHelpers';

export default generateAnyFieldStoryDefaultExport();


// ----------- Configure General AnyField Stories -----------


export const DateField = Template.bind({});

DateField.args = {
  label: "Date Field",
  ...standardAnyFieldArgs,
  requiredErrorText: "Date input required",
  type: 5,
  id: 'DateFieldId',
  name: 'DateFieldName',
};