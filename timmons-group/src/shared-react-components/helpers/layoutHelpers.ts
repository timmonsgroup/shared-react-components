import { Conditional } from '../models/formFields.model';

export const checkConditional = (condition: Conditional, data: Record<string, any> = {}, indent = ''): boolean => {
  console.log(indent, 'check condition', condition)
  const { value, operation, fieldId } = condition;
  const fieldValue = data[fieldId];
  console.log(indent, fieldId, 'with fieldValue', fieldValue, 'operation', operation, 'value', value)
  switch (operation) {
    case 'eq':
      return fieldValue === value;
    case 'neq':
      return fieldValue !== value;
    case 'gt':
      return fieldValue > value;
    case 'gte':
      return fieldValue >= value;
    case 'lt':
      return fieldValue < value;
    case 'lte':
      return fieldValue <= value;
    case 'contains':
      return fieldValue.includes(value);
    case 'notContains':
      return !fieldValue.includes(value);
    case 'startsWith':
      return fieldValue.startsWith(value);
    case 'endsWith':
      return fieldValue.endsWith(value);
    case 'in':
      return fieldValue.includes(value);
    case 'notIn':
      return !fieldValue.includes(value);
    case 'regex':
      return new RegExp(value as string).test(fieldValue);
    case 'notRegex':
      return !new RegExp(value as string).test(fieldValue);
    case 'isNull':
      return fieldValue === null;
    case 'isNotNull':
      return fieldValue !== null;
  }
}

export const passesConditionals = (conditions: Array<Conditional> | Conditional, data: Record<string, any> = {}, nested = ''): boolean => {
  const indent = nested;
  console.log(`${indent}`, 'conditions', conditions)
  let result = true;
  const toProcess = Array.isArray(conditions) ? conditions : [conditions];

  for (let i = 0; i < toProcess.length; i++) {
    const condition = toProcess[i];
    const { and, or } = condition;
    // check if the condition is true
    if (!checkConditional(condition, data)) {
      result = false;
      if (and || !or) {
        console.log(`${indent}`, '\tFailed test. Has ands or no ors')
        break;
      }

      if (or) {
        console.log(`${indent}`, '\tMaybe Failed test. HAS ors, checking those conditions')
        result = passesConditionals(or, data, nested + '\t');
      }
    } else {
      console.log(`${indent}`, '\tPassed this condition. Checking for ands')
    }

    if (and) {
      console.log(`${indent}`, '\tHas ands')
      result = passesConditionals(and, data, nested + '\t');
    }
  }
  console.log(`${indent}`, 'result of', result, 'for', conditions)
  return result;
}