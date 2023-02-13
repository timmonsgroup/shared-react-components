import {
    generateDynamicFormStoryDefaultExport,
    DynamicFormStoryTemplate as Template,
    objectToString
  } from '../../../helpers/story-helpers/dynamicFormStoryHelpers';
  
  export default generateDynamicFormStoryDefaultExport({title: "conditionals/validations/fractionalDigits"});
  
  
  // ----------- Configure General AnyField Stories -----------
  

  export const dynamicForm = Template.bind({});

  const validationObject = {fractionalDigits: 3};

  const setInfoBlockOptions = {
    conditionalThen: objectToString(validationObject),
    explanation: "fractional digits validation, configured to allow no more than " + validationObject.fractionalDigits + " digits after the decimal point"
  };

  dynamicForm.args = {
    dynamicFormTestData: "floatConditionalValidation",
    infoBlock: "DynamicFormConditionalValidation",
    infoBlockOptions: setInfoBlockOptions,
    ...validationObject
  }

