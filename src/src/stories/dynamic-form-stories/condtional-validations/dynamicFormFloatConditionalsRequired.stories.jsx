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
    explanation: 'required validation, which requires the FLOAT FIELD 1 field to have some kind of input'
  };

  export const dynamicForm = Template.bind({});

  dynamicForm.args = {
    dynamicFormTestData: "floatConditionalValidation",
    infoBlock: "DynamicFormConditionalValidation",
    infoBlockOptions: setInfoBlockOptions,
    ...validationObject
  }
