import {
    generateDynamicFormStoryDefaultExport,
    DynamicFormStoryTemplate as Template,
    objectToString
  } from '../../../helpers/story-helpers/dynamicFormStoryHelpers';
  
  export default generateDynamicFormStoryDefaultExport({title: "conditionals/renders/helper text"});
  
  
  // ----------- Configure General AnyField Stories -----------
  

  export const dynamicForm = Template.bind({});

  const renderObject = {helperText: "example conditional helper text"};

  const setInfoBlockOptions = {
    conditionalThen: objectToString(renderObject),
    explanation: 'changes the helper text to say "example conditional helper text".',
    fieldWithConditionalsSetName: "CHOICE FIELD 1 (CHECKBOX)"
  };


  dynamicForm.args = {
    dynamicFormTestData: "checkboxConditionalValidation",
    infoBlock: "DynamicFormConditional",
    infoBlockOptions: setInfoBlockOptions,
    ...renderObject
  }
