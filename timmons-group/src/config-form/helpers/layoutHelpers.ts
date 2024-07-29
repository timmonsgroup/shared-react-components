import { Conditional } from '../models/formFields.model';
import { checkConditional } from './formHelpers';

export const passesConditionals = (conditions: Array<Conditional> | Conditional, data: Record<string, any> = {}, nested = ''): boolean => {
  const indent = nested;
  console.log(`${indent}`, 'conditions', conditions)
  let result = true;
  const toProcess = Array.isArray(conditions) ? conditions : [conditions];

  for (const element of toProcess) {
    const condition = element;
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