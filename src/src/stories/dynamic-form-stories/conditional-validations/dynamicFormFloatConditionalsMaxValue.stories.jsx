import {
    generateDynamicFormStoryDefaultExport,
    DynamicFormStoryTemplate as Template,
    objectToString
  } from '../../../helpers/story-helpers/dynamicFormStoryHelpers';
  
  export default generateDynamicFormStoryDefaultExport({title: "conditionals/validations/maxValue"});
  
  
  // ----------- Configure General AnyField Stories -----------
  

  export const dynamicForm = Template.bind({});

  const validationObject = {maxValue: 5};

  const setInfoBlockOptions = {
    conditionalThen: objectToString(validationObject),
    explanation: "enable the max value validation, configured to allow a value no greater than 5",
    fieldWithConditionalsSetName: "FLOAT FIELD 1"
  };


  dynamicForm.args = {
    dynamicFormTestData: "floatConditional",
    infoBlock: "DynamicFormConditional",
    infoBlockOptions: setInfoBlockOptions,
    validationStory: true,
    ...validationObject
  }
