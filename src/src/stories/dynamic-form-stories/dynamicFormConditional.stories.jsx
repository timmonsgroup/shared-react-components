import {
    generateDynamicFormStoryDefaultExport,
    DynamicFormStoryTemplate as Template,
  } from '../../helpers/story-helpers/dynamicFormStoryHelpers';
import { generateDynamicFormFloatConditionalTestData } from './test-data/generateDynamicFormFloatConditionalTestData';
import { FIELD_TYPES } from "../../constants";
  
  export default generateDynamicFormStoryDefaultExport({title: "Conditionals"});
  
  
  // ----------- Configure Dynamic Form Conditional Stories -----------
  

  export const disable = Template.bind({});

  const conditionalDisableTestDataOptions = {
    conditionalThen: {disable: true},
    touchedField: { type: FIELD_TYPES.FLOAT, options: {} }
  }

  const conditionalDisableTestData = generateDynamicFormFloatConditionalTestData(conditionalDisableTestDataOptions);

  disable.args = {
    configurationObject: conditionalDisableTestData
  }


  export const url = Template.bind({});

  const conditionalUrlTestDataOptions = {
    conditionalThen: {url: 'https://dog-api.kinduff.com/api/facts?number=2'},
    touchedField: {type: FIELD_TYPES.CHOICE, options: { multiple: true, checkbox: true}, conditions: [] }
  }

  const conditionalUrlTestData = generateDynamicFormFloatConditionalTestData(conditionalUrlTestDataOptions);

  url.args = {
    configurationObject: conditionalUrlTestData
  }