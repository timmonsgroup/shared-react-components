import {
    generateDynamicFormStoryDefaultExport,
    DynamicFormStoryTemplate as Template,
    objectToString
  } from '../../../helpers/story-helpers/dynamicFormStoryHelpers';
  
  export default generateDynamicFormStoryDefaultExport({title: "conditionals/renders/URL"});
  
  
  // ----------- Configure General AnyField Stories -----------
  

  export const dynamicForm = Template.bind({});

  const renderObject = {url: 'https://dog-api.kinduff.com/api/facts?number=2'};


  const exampleAPIResponse = `
    {
      "facts": [
        "The name of the dog on the Cracker Jacks box is Bingo. The Taco Bell Chihuahua is a rescued dog named Gidget.",
        "The first dog chapel was established in 2001. It was built in St. Johnsbury, Vermont, by Stephan Huneck, a children’s book author whose five dogs helped him recuperate from a serious illness."
      ],
      "success": true
    }`;

  const exampleChoiceFormatter = 
    `const choiceFormatter = (fieldId, response, options) => {
        const { data } = response;

        const choiceDataList = data.facts;

        const formattedChoices = choiceDataList.map((choiceDataItem, index) => {
            return { id: index, label: choiceDataItem };
        })

        return formattedChoices;
     }`;

  const setInfoBlockOptions = {
    conditionalThen: objectToString(renderObject),
    explanation: "populates its selection choices by pulling from 'https://dog-api.kinduff.com/api/facts?number=2' instead of using the preset default options",
    fieldWithConditionalsSetName: "CHOICE FIELD 1 (CHECKBOX)",
    exampleAPIResponse: exampleAPIResponse,
    exampleCustomChoiceFormatter: exampleChoiceFormatter
  };

  dynamicForm.args = {
    dynamicFormTestData: "checkboxConditionalValidation",
    infoBlock: "DynamicFormConditional",
    infoBlockOptions: setInfoBlockOptions,
    ...renderObject
  }
