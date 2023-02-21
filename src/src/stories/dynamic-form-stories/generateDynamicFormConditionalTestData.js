import { generateDynamicFormTestData } from "../../helpers/story-helpers/dynamicFormTestDataGenerator";
import { FIELD_TYPES } from "../../constants";

export function generateDynamicFormConditionalTestData(testDataOptions) {
    
    const conditions = [ 
        {when: "section1TEXT1name", isValid: true, then: testDataOptions.conditionalThen,},
        {when: "section1TEXT1name", isValid: false, then: {},}
    ];

    const triggerField = {type: FIELD_TYPES.TEXT, quantity: 1, options: {required: true } };
    const touchedField = testDataOptions.touchedField;

    touchedField.options.conditions =  conditions;

    const fieldList = [
        triggerField,
        touchedField
    ];
    
    const testData = generateDynamicFormTestData(fieldList);
    return testData;
} 