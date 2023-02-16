import {
    generateDynamicFormStoryDefaultExport,
    DynamicFormStoryTemplate as Template,
    objectToString
  } from '../../../helpers/story-helpers/dynamicFormStoryHelpers';
  
  export default generateDynamicFormStoryDefaultExport({title: "conditionals/renders/Required Text"});
  
  
  // ----------- Configure General AnyField Stories -----------
  

  export const dynamicForm = Template.bind({});

  const renderObject = {requiredErrorText: "Example conditional required error text"};

  const setInfoBlockOptions = {
    conditionalThen: objectToString(renderObject),
    explanation: 'changes the required error text to say "Example conditional required error text".',
    fieldWithConditionalsSetName: "FLOAT FIELD 1"
  };


  dynamicForm.args = {
    dynamicFormTestData: "requiredFloatConditional",
    infoBlock: "DynamicFormConditional",
    infoBlockOptions: setInfoBlockOptions,
    ...renderObject,
    validationStory: true
  }
