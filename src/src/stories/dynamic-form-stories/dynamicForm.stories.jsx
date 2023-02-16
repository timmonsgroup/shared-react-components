  import {
    generateDynamicFormStoryDefaultExport,
    DynamicFormStoryTemplate as Template,
  } from '../../helpers/story-helpers/dynamicFormStoryHelpers';

  import generateExampleDynamicFormTestData from "./test-data/generateExampleDynamicFormTestData";
  
  export default generateDynamicFormStoryDefaultExport({title: "Example Dynamic Form",});
  
  
  // ----------- Configure General AnyField Stories -----------
  

  export const dynamicForm = Template.bind({});

  const exampleDynamicFormTestData = generateExampleDynamicFormTestData();

  dynamicForm.args = {
    dynamicFormTestData: "fullFormDemo",
    configurationObject: exampleDynamicFormTestData
  }