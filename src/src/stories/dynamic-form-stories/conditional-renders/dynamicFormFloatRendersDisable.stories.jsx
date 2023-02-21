import {
    generateDynamicFormStoryDefaultExport,
    DynamicFormStoryTemplate as Template,
    objectToString
  } from '../../../helpers/story-helpers/dynamicFormStoryHelpers';
  
  export default generateDynamicFormStoryDefaultExport({title: "conditionals/renders/disable"});
  
  
  // ----------- Configure General AnyField Stories -----------
  

  export const dynamicForm = Template.bind({});

  const renderObject = {disabled: true};

  const setInfoBlockOptions = {
    conditionalThen: objectToString(renderObject),
    explanation: "sets its disabled attribute to true.",
    fieldWithConditionalsSetName: "FLOAT FIELD 1"
  };


  dynamicForm.args = {
    dynamicFormTestData: "floatConditional",
    infoBlock: "DynamicFormConditional",
    infoBlockOptions: setInfoBlockOptions,
    ...renderObject
  }
