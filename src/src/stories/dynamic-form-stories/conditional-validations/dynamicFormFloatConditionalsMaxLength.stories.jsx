import {
    generateDynamicFormStoryDefaultExport,
    DynamicFormStoryTemplate as Template,
    objectToString
  } from '../../../helpers/story-helpers/dynamicFormStoryHelpers';
  
  export default generateDynamicFormStoryDefaultExport({title: "conditionals/validations/maxLength"});
  
  
  // ----------- Configure General AnyField Stories -----------
  
  const validationObject = {maxLength: 3};

  const setInfoBlockOptions = {
    conditionalThen: objectToString(validationObject),
    explanation: 'enable the max length validation, configured to allow no more than ' + validationObject.maxLength + ' characters (including  "."s) in its input.',
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
