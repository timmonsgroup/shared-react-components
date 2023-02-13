import { dynamicFormTestDataGenerator } from "../../helpers/story-helpers/dynamicFormTestDataGenerator";
import { FIELD_TYPES } from "../../constants";

const conditions = [ {when: "section1TEXT1path",  then: {disabled: false,}, is: "bingo"}];

const url = "https://dog-api.kinduff.com/api/facts?number=5";

const fieldList = [
    {type: FIELD_TYPES.TEXT, quantity: 2 },
    // {type: FIELD_TYPES.LONG_TEXT, quantity: 4 },
    // {type: FIELD_TYPES.INT, quantity: 1 },
    {type: FIELD_TYPES.FLOAT, quantity: 2, options: {conditions: conditions} },
    {type: FIELD_TYPES.DATE, quantity: 1 },
    {type: FIELD_TYPES.CHOICE, quantity: 2 },
    {type: FIELD_TYPES.OBJECT, quantity: 1 },
    {type: FIELD_TYPES.CHOICE, quantity: 1, options: {checkbox: true} },
    {type: FIELD_TYPES.OBJECT, quantity: 2, options: {checkbox: true} },
    {type: FIELD_TYPES.CHOICE, quantity: 1, options: {checkbox: true, url}},
    {type: FIELD_TYPES.OBJECT, quantity: 1, options: {checkbox: true, url}},
    {type: FIELD_TYPES.CHOICE, quantity: 1, options: {checkbox: false, url}},
    {type: FIELD_TYPES.OBJECT, quantity: 1, options: {checkbox: false, url}},
    {type: FIELD_TYPES.LINK, quantity: 2 },

];

const testData = dynamicFormTestDataGenerator(fieldList);
export default testData;