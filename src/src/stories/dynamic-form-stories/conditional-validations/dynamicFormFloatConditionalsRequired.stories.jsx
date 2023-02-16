import {
    generateDynamicFormStoryDefaultExport,
    DynamicFormStoryTemplate as Template,
    objectToString
  } from '../../../helpers/story-helpers/dynamicFormStoryHelpers';
  
  export default generateDynamicFormStoryDefaultExport({title: "conditionals/validations/Required"});
  
  
  // ----------- Configure General AnyField Stories -----------
  
  const validationObject = {required: true};

  const setInfoBlockOptions = {
    conditionalThen: objectToString(validationObject),
    explanation: 'enable the required validation, which requires the FLOAT FIELD 1 field to have some kind of input',
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
