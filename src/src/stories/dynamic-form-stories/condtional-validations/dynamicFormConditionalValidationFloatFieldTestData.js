import { dynamicFormTestDataGenerator } from "../../../helpers/story-helpers/dynamicFormTestDataGenerator";
import { FIELD_TYPES } from "../../../constants";

export function generateDynamicFormFloatFieldConditionalTestData(testDataOptions) {
    
    const conditions = [ 
        {when: "section1TEXT1path", isValid: true, then: testDataOptions,},
        {when: "section1TEXT1path", isValid: false, then: {},}
    ];
    
    const fieldList = [
        {type: FIELD_TYPES.TEXT, quantity: 1, options: {required: true } },
        {type: FIELD_TYPES.FLOAT, quantity: 1, options: { conditions: conditions} },
    ];
    
    const testData = dynamicFormTestDataGenerator(fieldList);
    return testData;
} 