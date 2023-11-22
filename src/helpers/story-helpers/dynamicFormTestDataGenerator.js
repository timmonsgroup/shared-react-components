import { FIELD_TYPES } from '../../constants';
import {generateDefaultSection, generateDefaultFieldLayout} from './dynamicFormStoryHelpers';

// fieldList is an array of objects with the shape:
// {
//      type: type number for field;
//      quantity: the number of fields to create of the set type
//      options: an options object. Currently allows the selection fields to be configured to be checkbox fields0
// }

export function generateDynamicFormTestData(fieldList) {
  const testData = {sections: []};
  const section = generateDefaultSection();

  // This tracks how many of each field type have been generated so far to manage naming fields properly
  const fieldTypeCounter = generateFieldTypeCounter();

  fieldList.forEach(({type, quantity = 1, options = {}}) => {
    const typeNameString = getTypeNameString(type);

    for(let i = 1; i <= quantity; i++){
      fieldTypeCounter[type]++;

      const defaultName = `section1${typeNameString}${fieldTypeCounter[type]}name`;
      const label = getFieldLabel(type, fieldTypeCounter[type], options);

      const baseField = generateDefaultFieldLayout();

      const newField = {
        ...baseField,
        type: type,
        path: defaultName,
        label: label,
        checkbox: options.checkbox,
        multiple: options.multiple,
        possibleChoices: options.url ? null : options.possibleChoices ?? defaultPossibleChoices,
        url: options.url,
        conditions: options.conditions,
        required: options.required,
        disabled: options.disabled,
        idField: options.idField,
        readOnly: options.readOnly,
      };

      newField.model.name = defaultName;

      section.layout.push(newField);
    }
  });

  testData.sections.push(section);

  return testData;
}

function getFieldLabel(type, fieldTypeCount, options = {}) {

  const { checkbox } = options;
  const typeNameString = getTypeNameString(type);

  let label = '';
  if (type == FIELD_TYPES.CHOICE || type == FIELD_TYPES.OBJECT) {
    const parts = options?.url ? ['URL'] : [];

    if (checkbox) {
      parts.push('CHECKBOX');
    } else {
      parts.push('TYPE AHEAD');
    }
    label = ` (${parts.join(' ')})`;
  }
  return `${typeNameString} FIELD ${fieldTypeCount}${label}`;
}

function getTypeNameString(type) {
  const fieldTypes = Object.entries(FIELD_TYPES);
  const keyValuePairForTypeConstant = fieldTypes.find(element => element[1] == type);

  return keyValuePairForTypeConstant[0];
}

// We need to initialize each element in the field type counter so we can increment them. Otherwise we try to increment NaN.
function generateFieldTypeCounter() {
  const fieldTypeCounter = {};
  const fieldTypeValues = Object.values(FIELD_TYPES);

  fieldTypeValues.forEach((type) => fieldTypeCounter[type] = 0);

  return fieldTypeCounter;
}

const defaultPossibleChoices = [
  {
    name: 'default Choice 1',
    id: 1
  },
  {
    name: 'default Choice 2',
    id: 2
  }
];