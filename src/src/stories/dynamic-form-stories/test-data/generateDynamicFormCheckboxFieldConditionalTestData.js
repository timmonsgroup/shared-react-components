import { dynamicFormTestDataGenerator } from "../../../helpers/story-helpers/dynamicFormTestDataGenerator";
import { FIELD_TYPES } from "../../../constants";

export function generateDynamicFormCheckboxFieldConditionalTestData(testDataOptions) {
    
    const conditions = [ 
        {when: "section1TEXT1name", isValid: true, then: testDataOptions,},
        {when: "section1TEXT1name", isValid: false, then: {},}
    ];
    
    const fieldList = [
        {type: FIELD_TYPES.TEXT, quantity: 1, options: {required: true } },
        {type: FIELD_TYPES.CHOICE, quantity: 1, options: { conditions: conditions, multiple: true, checkbox: true} },
    ];
    
    const testData = dynamicFormTestDataGenerator(fieldList);
    return testData;
} 