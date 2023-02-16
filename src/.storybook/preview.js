import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDecorator } from '@storybook/react';
import { initialize, mswDecorator } from 'msw-storybook-addon';
import theme from '../src/muiTheme';
import { authContext } from '../src/hooks/useAuth';
import {rest } from 'msw';
import dynamicFormTestData1 from "../src/stories/dynamic-form-stories/dynamicFormTestData1";
import { generateDynamicFormFloatFieldConditionalTestData } from "../src/stories/dynamic-form-stories/test-data/generateDynamicFormFloatFieldConditionalTestData";
import { generateDynamicFormCheckboxFieldConditionalTestData } from "../src/stories/dynamic-form-stories/test-data/generateDynamicFormCheckboxFieldConditionalTestData";
import { generateDynamicFormRequiredFloatFieldConditionalTestData } from "../src/stories/dynamic-form-stories/test-data/generateDynamicFormRequiredFloatFieldConditionalTestData"

initialize();

const ThemeProviderFn = (storyFn) => {
  // Creating a fake auth context so useAuth will work in certain stories
  const auth = {
    authState: {
      user: {
        acl: null
      }
    }
  };

  // Wrap our component with a theme and auth provider so we can pass them to our components
  // LocalizationProvider is needed for the date picker
  return (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <authContext.Provider value={auth}>
      <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>
    </authContext.Provider>
  </LocalizationProvider>);
};

addDecorator(ThemeProviderFn);

export const decorators = [mswDecorator];

export const parameters = {
  msw: {
      handlers: [
          rest.get(`http://localhost:6006/api/layout/get`, (request, response, context) => {
            const searchParams = request.url.searchParams;
            const testDataOptions = {};
            for (const [key, value] of searchParams) {
              if(key !== "objectType" && key !== "layoutKey") {
                if(!testDataOptions["url"]) {
                  testDataOptions[key] = handleBooleanStrings(value);
                } else {
                  testDataOptions["url"] += "&" + key + "=" + value; 
                }

              }
            }

            const objectType = searchParams.get("objectType");
            let testData;

            switch(objectType) {
              case 'fullFormDemo':
                testData = dynamicFormTestData1;
                break;
              case 'floatConditional':
                testData = generateDynamicFormFloatFieldConditionalTestData(testDataOptions)//floatFieldConditionalValidationTestData; //generateFloatTestData(testDataOptions)
                break; 
              case 'requiredFloatConditional':
                testData = generateDynamicFormRequiredFloatFieldConditionalTestData(testDataOptions)
                break;
              case 'checkboxConditionalValidation':
                testData = generateDynamicFormCheckboxFieldConditionalTestData(testDataOptions)
            }
          
              return response(
                  context.json(testData)
              )
          }),
      ]
    }
};

function handleBooleanStrings(value) {
  if(value == "true") {
    return true;
  } else if (value == "false") {
    return false;
  }
  return value;
}