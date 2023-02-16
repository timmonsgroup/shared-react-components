import {
    generateDynamicFormStoryDefaultExport,
    DynamicFormStoryTemplate as Template,
    objectToString
  } from '../../../helpers/story-helpers/dynamicFormStoryHelpers';
  
  export default generateDynamicFormStoryDefaultExport({title: "conditionals/renders/Hidden"});
  
  
  // ----------- Configure General AnyField Stories -----------
  

  export const dynamicForm = Template.bind({});

  const renderObject = {hidden: true};

  const setInfoBlockOptions = {
    conditionalThen: objectToString(renderObject),
    explanation: "sets its hidden attribute to true",
    fieldWithConditionalsSetName: "FLOAT FIELD 1"
  };


  dynamicForm.args = {
    dynamicFormTestData: "floatConditional",
    infoBlock: "DynamicFormConditional",
    infoBlockOptions: setInfoBlockOptions,
    ...renderObject
  }
