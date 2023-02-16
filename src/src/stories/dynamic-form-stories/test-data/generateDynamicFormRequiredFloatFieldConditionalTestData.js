import { dynamicFormTestDataGenerator } from "../../../helpers/story-helpers/dynamicFormTestDataGenerator";
import { FIELD_TYPES } from "../../../constants";

export function generateDynamicFormRequiredFloatFieldConditionalTestData(testDataOptions) {
    
    const conditions = [ 
        {when: "section1TEXT1name", isValid: true, then: testDataOptions,},
        {when: "section1TEXT1name", isValid: false, then: {required: true},}
    ];
    
    const fieldList = [
        {type: FIELD_TYPES.TEXT, quantity: 1, options: {required: true } },
        {type: FIELD_TYPES.FLOAT, quantity: 1, options: { required: true, conditions: conditions} },
    ];
    
    const testData = dynamicFormTestDataGenerator(fieldList);
    return testData;
} 