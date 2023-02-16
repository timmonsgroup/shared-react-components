import { FIELD_TYPES } from "../../constants";
import {generateDefaultSection, generateDefaultFieldLayout} from "./dynamicFormStoryHelpers";

// fieldList is an array of objects with the shape:
// {
//      type: type number for field;
//      quantity: the number of fields to create of the set type
//      options: an options object. Currently allows the selection fields to be configured to be checkbox fields0
// }

export function dynamicFormTestDataGenerator(fieldList) {
    const testData = {sections: []};
    const section = generateDefaultSection();
    
    // This tracks how many of each field type have been generated so far to manage naming fields properly
    const fieldTypeCounter = generateFieldTypeCounter(); 

    fieldList.forEach(({type, quantity, options = {}}, index) => {
        const typeNameString = getTypeNameString(type);

        for(let i = 1; i <= quantity; i++){
            fieldTypeCounter[type]++;

            const field = generateDefaultFieldLayout();
            const defaultNamingBase = "section1" + typeNameString + fieldTypeCounter[type];
            const label = getFieldLabel(type, fieldTypeCounter[type], options);

            field.type = type;
            field.path = defaultNamingBase + "name";
            field.model.name = defaultNamingBase + "name";
            field.label = label;
            field.checkbox = options.checkbox;
            field.multiple = options.checkbox;
            field.possibleChoices = options.url ? null : options.possibleChoices ?? defaultPossibleChoices;
            field.url = options.url;
            field.conditions = options.conditions;
            field.required = options.required;
            field.disabled = options.disabled;
            field.idField = options.idField;
            field.readOnly = true;
            
            section.layout.push(field);
        }
    });

    testData.sections.push(section);

    return testData;
}

function getFieldLabel(type, fieldTypeCount, options = {}) {

    const { checkbox } = options;
    const typeNameString = getTypeNameString(type);

    let label = typeNameString + " FIELD " + fieldTypeCount;

    if (type == FIELD_TYPES.CHOICE || type == FIELD_TYPES.OBJECT) {
        label += " (";

        if (options.url) {
            label += "URL ";
        }
        
        if (checkbox) {
            label += " CHECKBOX)";
        }
        else {
            label += " TYPE AHEAD)";
        }
    }

    return label;
}

function getTypeNameString(type) {
    const fieldTypes = Object.entries(FIELD_TYPES);
    const keyValuePairForTypeConstant = fieldTypes.find(element => element[1] == type);

    return keyValuePairForTypeConstant[0];
}

// We need to initialize each element in the field type counter so we can increment them. Otherwise we try to increment NaN.
function generateFieldTypeCounter() {
    const fieldTypeCounter = [];
    const fieldTypeValues = Object.values(FIELD_TYPES);

    fieldTypeValues.forEach((type) => fieldTypeCounter[type] = 0);

    return fieldTypeCounter;
}

const defaultPossibleChoices = [
    {
      name: "default Choice 1",
      id: 1
    },
    {
      name: "default Choice 2",
      id: 2
    }
  ];