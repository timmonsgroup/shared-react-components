  import {
    generateDynamicFormStoryDefaultExport,
    DynamicFormStoryTemplate as Template,
  } from '../../helpers/story-helpers/dynamicFormStoryHelpers';
  
  export default generateDynamicFormStoryDefaultExport({title: "dynamicForm Test!"});
  
  
  // ----------- Configure General AnyField Stories -----------
  

  export const dynamicForm = Template.bind({});

  dynamicForm.args = {
    dynamicFormTestData: "fullFormDemo"
  }
