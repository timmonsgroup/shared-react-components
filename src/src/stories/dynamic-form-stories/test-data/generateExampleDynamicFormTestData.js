import { generateDynamicFormTestData } from "../../../helpers/story-helpers/dynamicFormTestDataGenerator";
import { FIELD_TYPES } from "../../../constants";

export default function generateExampleDynamicFormTestData() {
    const url = "https://dog-api.kinduff.com/api/facts?number=5";
    const conditionUrl = "https://dog-api.kinduff.com/api/facts?number=2";

    const exampleCondition = [{
        when: "section1TEXT1name", is: "bingo", then: {url: conditionUrl}
    }];

    const fieldList = [
        {type: FIELD_TYPES.TEXT, quantity: 1 },
        {type: FIELD_TYPES.LONG_TEXT, quantity: 1 },
        {type: FIELD_TYPES.INT, quantity: 1 },
        {type: FIELD_TYPES.FLOAT, quantity: 1 },
        {type: FIELD_TYPES.DATE, quantity: 1 },
        {type: FIELD_TYPES.CHOICE, quantity: 1 },
        {type: FIELD_TYPES.OBJECT, quantity: 1 },
        {type: FIELD_TYPES.CHOICE, quantity: 1, options: {checkbox: true} },
        {type: FIELD_TYPES.OBJECT, quantity: 1, options: {checkbox: true} },
        {type: FIELD_TYPES.CHOICE, quantity: 1, options: {checkbox: true, url, conditions: exampleCondition}},
        {type: FIELD_TYPES.OBJECT, quantity: 1, options: {checkbox: true, url}},
        {type: FIELD_TYPES.CHOICE, quantity: 1, options: {checkbox: false, url}},
        {type: FIELD_TYPES.OBJECT, quantity: 1, options: {checkbox: false, url}},
        {type: FIELD_TYPES.LINK, quantity: 1 },

    ];

    const testData = generateDynamicFormTestData(fieldList);
    return testData;
}