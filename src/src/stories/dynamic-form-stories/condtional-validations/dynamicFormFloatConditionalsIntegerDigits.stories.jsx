import {
    generateDynamicFormStoryDefaultExport,
    DynamicFormStoryTemplate as Template,
    objectToString
  } from '../../../helpers/story-helpers/dynamicFormStoryHelpers';
  
  export default generateDynamicFormStoryDefaultExport({title: "conditionals/validations/integerDigits"});
  
  
  // ----------- Configure General AnyField Stories -----------
  

  export const dynamicForm = Template.bind({});

  const validationObject = {integerDigits: 2};

  const setInfoBlockOptions = {
    conditionalThen: objectToString(validationObject),
    explanation: "integer digits validation, configured to allow no more than " + validationObject.integerDigits + " digits after the decimal point"
  };

  dynamicForm.args = {
    dynamicFormTestData: "floatConditionalValidation",
    infoBlock: "DynamicFormConditionalValidation",
    infoBlockOptions: setInfoBlockOptions,
    ...validationObject
  }
