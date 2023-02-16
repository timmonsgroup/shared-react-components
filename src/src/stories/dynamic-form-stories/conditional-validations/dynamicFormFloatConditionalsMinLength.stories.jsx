import {
    generateDynamicFormStoryDefaultExport,
    DynamicFormStoryTemplate as Template,
    objectToString
  } from '../../../helpers/story-helpers/dynamicFormStoryHelpers';
  
  export default generateDynamicFormStoryDefaultExport({title: "conditionals/validations/minLength"});
  
  
  // ----------- Configure General AnyField Stories -----------
  
  const validationObject = {minLength: 2};

  const setInfoBlockOptions = {
    conditionalThen: objectToString(validationObject),
    explanation: 'enable the min length validation, configured to make sure FLOAT FIELD 1 has at least ' + validationObject.minLength + ' characters (including  "."s) in its input.',
    fieldWithConditionalsSetName: "FLOAT FIELD 1"
  };

  export const dynamicForm = Template.bind({});

  dynamicForm.args = {
    dynamicFormTestData: "floatConditional",
    infoBlock: "DynamicFormConditional",
    infoBlockOptions: setInfoBlockOptions,
    validationStory: true,
    ...validationObject
  }
