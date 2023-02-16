  import {
    generateDynamicFormStoryDefaultExport,
    DynamicFormStoryTemplate as Template,
  } from '../../helpers/story-helpers/dynamicFormStoryHelpers';

  import dynamicFormTestData1 from "./dynamicFormTestData1";
  
  export default generateDynamicFormStoryDefaultExport({title: "Example Dynamic Form",});
  
  
  // ----------- Configure General AnyField Stories -----------
  

  export const dynamicForm = Template.bind({});

  dynamicForm.args = {
    dynamicFormTestData: "fullFormDemo",
    configurationObject: dynamicFormTestData1
  }