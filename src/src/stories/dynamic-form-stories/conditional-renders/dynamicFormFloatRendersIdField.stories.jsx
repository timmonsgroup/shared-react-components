import {
  generateDynamicFormStoryDefaultExport,
  DynamicFormStoryTemplate as Template,
  objectToString
} from '../../../helpers/story-helpers/dynamicFormStoryHelpers';

export default generateDynamicFormStoryDefaultExport({title: "conditionals/renders/Id Field and Label Field"});


// ----------- Configure General AnyField Stories -----------


export const dynamicForm = Template.bind({});

const renderObject = {url: 'https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=2', idField: "_id", labelField: "text"};

const exampleAPIResponse = `
  [
    {
      "status": {
        "verified": true,
        "sentCount": 1
      },
      "_id": "591f98883b90f7150a19c2a7",
      "__v": 0,
      "text": "A cat can sprint at about thirty-one miles per hour.",
      "source": "api",
      "updatedAt": "2020-08-23T20:20:01.611Z",
      "type": "cat",
      "createdAt": "2018-04-19T20:20:03.190Z",
      "deleted": false,
      "used": false,
      "user": "5a9ac18c7478810ea6c06381"
    },
    {
      "status": {
        "verified": null,
        "sentCount": 0
      },
      "_id": "63d51f9e871da558b32cc9f2",
      "user": "63d51a65871da558b32cc633",
      "text": ".mjh.",
      "type": "cat",
      "deleted": false,
      "createdAt": "2023-01-28T13:14:06.940Z",
      "updatedAt": "2023-01-28T13:14:06.940Z",
      "__v": 0
    }
  ]
`;

const setInfoBlockOptions = {
  conditionalThen: objectToString(renderObject),
  explanation: `populates its selection choices by pulling from 'https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=2' instead of using the preset default options.
  It sets the idField property to "_id" and the labelField property to "text" in the default response formatter.
  `,
  fieldWithConditionalsSetName: "CHOICE FIELD 1 (CHECKBOX)",
  exampleAPIResponse: exampleAPIResponse
};


dynamicForm.args = {
  dynamicFormTestData: "checkboxConditionalValidation",
  infoBlock: "DynamicFormConditional",
  infoBlockOptions: setInfoBlockOptions,
  ...renderObject,
  useDefaultChoiceFormatter: true
}
