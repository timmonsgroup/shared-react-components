//Third party bits
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { flushSync } from 'react-dom';

import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { object } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Third party components
import { Card, CardContent, Container, Grid, Stack, Typography } from '@mui/material';

// Internal bits
import { getFieldValue, parseFormLayout, useFormLayout } from './useFormLayout';
import axios from 'axios';
import {
  ID_FIELD,
  LABEL_FIELD,
  CONDITIONAL_RENDER
} from '../constants';
import { objectReducer } from '../helpers';
import AnyField from '../stories/AnyField';
// export const ContextFormWrapper = ({ children, formLayout, data, onSubmit }) => {
//   return <FormProvider {...methods} >
//     {children}
//   </FormProvider>
// }

export const ConfigForm = ({ formLayout, data, children }) => {
  const [parsed, setParsed] = useState(null);

  useEffect(() => {
    const parseIt = async () => {
      const parsed = await parseFormLayout(formLayout, data);
      setParsed(parsed);
    };
    parseIt();
  }, [formLayout]);

  if (parsed) {
    console.log('parsed', parsed);

    return (
      <div>
        <h1>Config Form</h1>
        <p>Form Layout</p>
        <DynamicForm layout={parsed} data={data}>
          {children}
        </DynamicForm>
      </div>
    )
  }

  return (
    <div>
      <h1>Processing</h1>
      <p>Still waiting</p>
    </div>
  );
};

export const DynamicForm = ({ layout, data, onSubmit, children }) => {
  console.log('DynamicForm', layout);
  const {useFormObject, sections} = useConfigForm(layout, data);

  return (
    <FormProvider {...useFormObject} sections={sections}>
      {children}
      {/* <ConfigForm formLayout={layout} data={data} onSubmit={onSubmit} /> */}
    </FormProvider>
  );
};

export const NestedThing = ({ children }) => {
  const allThings = useFormContext();
  console.log('NestedThing', allThings);
  const { register, watch, setValue, getValues, sections, control } = allThings;
  const watchFields = watch();

  useEffect(() => {
    console.log('watchFields', watchFields);
    console.log('getValues', getValues());
  }, [watchFields]);

  return (
    <form data-src-form="genericForm">
      {sections.map((section, index) => {
        const sx = { position: 'relative' };
        if (index) {
          sx.marginTop = '16px';
        }
        // const hasTopText = formTitle || helpText;
        return (
          <Card key={index} sx={sx}>
            {renderFormSection(section, control, index, {})}
          </Card>
        );
      })}
    </form>
  );
};

const renderFormSection = (section, control, index, options) => {
  if (section.visible === false && options?.hideEmptySections) {
    return null;
  }

  return (
    <CardContent key={index}>
      {section.name && <Typography variant="sectionHeader">{section.name}</Typography>}
      {section.fields.map((field, fIndex) => (
        <AnyField
          sx={{ marginTop: fIndex ? '16px' : null }}
          layout={field.render}
          control={control}
          key={field?.render?.name}
          options={{ icon: options?.iconOptions }}
        />
      ))}
    </CardContent>
  );
};

export const processDynamicFormLayout = (formLayout, data) => {
  // Will hold the validation schema for the form
  const validations = {};
  // Will hold the correctly formatted field values for the form
  const defaultValues = {};
  // const realValues = {};
  // Will hold the fields that need to be watched for changes
  const fieldsToWatch = {};

  formLayout.sections.forEach(section => {
    for (const fieldId of section.fields) {
      if (formLayout.fields.has(fieldId)) {
        const field = formLayout.fields.get(fieldId);
        // Get the value from the incoming values correctly formatted
        // If it does not exist the returned value will be the correct default format
        // const { name:eN, value:eV } = getFieldValue(field, {});
        const { name, value } = getFieldValue(field, data || {});
        // defaultValues[eN] = eV;
        // realValues[name] = value;
        defaultValues[name] = value;


        // Update the validation schema for this field
        // Do not add validations for read only fields
        if (!field.render?.readOnly) {
          validations[field.id] = field.validations;
        }

        // If this field exists in the triggerfields we need to watch the form for changes
        if (formLayout.triggerFields.has(fieldId)) {
          fieldsToWatch[fieldId] = true;
        }
      }
    }
  });

  return {
    defaultValues,
    // realValues,
    validations: validations,
    watchFields: Object.entries(fieldsToWatch).map(([key]) => key),
  };
};

/**
 * Method to check for and setup conditional rendering
 * @param {*} triggerFields
 * @param {*} fields
 * @param {*} fieldId
 * @param {*} formValues
 * @param {*} type
 * @param {*} options
 * @returns
 */
const checkConditionalRender = (triggerFields, fields, fieldId, formValues, type, options) => {
  const triggerField = triggerFields.get(fieldId);
  if (!triggerField || type !== 'change') {
    return;
  }

  let formValue = formValues[fieldId];

  // Conditional async rendering
  // Flag to indicate if any fields triggered async rendering
  // let hasAsync = false;
  // Object where eached key is the field path and value is a promise that resolves to the choices
  // const asyncLoaders = {};
  // Object where each key is the field path and value an array of the choices
  // const loadedChoices = {};

  const conditional = {
    hasAsync: false,
    asyncLoaders: {},
    loadedChoices: {},
    hasRenderValue: false,
    isUpdating: false,
  };

  if (triggerField.fieldValues.has(formValue)) {
    // Get the fields that need to be updated
    let affectedFields = triggerField.fieldValues.get(formValue) || [];

    affectedFields.forEach((loadOut, fieldId) => {
      // If the field has a remoteUrl, we need to fetch the data
      const layout = loadOut?.layout;
      const isHidden = layout?.get(CONDITIONAL_RENDER.HIDDEN);
      if (!isHidden && layout?.has('url')) {
        conditional.hasAsync = true;
        const remoteUrl = layout?.get('url')?.replace('##thevalue##', formValue);
        // Note the ID_FIELD and LABEL_FIELD are here different from the useFormLayout hook
        // These are the values on this field's CONDITIONAL layout, not the default layout
        conditional.asyncLoaders[fieldId] = () => fetchChoices(fieldId, remoteUrl, {
          mappedId: layout?.get(ID_FIELD),
          mappedLabel: layout?.get(LABEL_FIELD),
          triggerFieldId: fieldId,
          ...options
        });
      }

      // If the field has a condtionall dependent renderProperty we need to parse it out
      const renderId = layout?.get(CONDITIONAL_RENDER.RENDER_PROPERTY_ID);
      if (!isHidden && renderId) {
        // Get the choices for the triggering field so we can find the matching selected value
        const { render: { choices } } = fields.get(triggerField.id);
        const triggerChoice = choices?.find(c => c.id === formValue);

        if (triggerChoice) {
          // If the renderId is a dot notation, we need to dig into the object
          // Otherwise, we can just use the value
          const renderValue = objectReducer(triggerChoice, renderId) || '';
          if (renderValue !== undefined && renderValue !== null) {
            // setValue(fieldId, renderValue);
            conditional.hasRenderValue = true;
            conditional.renderValue = renderValue;
          }
        }
      }

      conditional.isUpdating = true;
      // updatedFields.push({ id: fieldId, type: 'update', ...loadOut });
    });
  }

  return conditional;
};

/**
 * @typedef {Object} FetchChoicesOptions
 * @property {string} urlDomain - domain to use when fetching the data
 * @property {string} mappedId - property to use when mapping the id
 * @property {string} mappedLabel - property to use when mapping the label
 * @property {string} triggerFieldId - id of the field that triggered the load
 * @property {function} choiceFormatter - function to format the choices
 * @property {function} clearErrors - function to clear errors
 * @property {function} setError - function to set errors
 */

/**
 * Loads the data for the async fields
 * @async
 * @function
 * @param {string} fieldId - id of the field that is being loaded
 * @param {string} url - url to load the data from
 * @param {FetchChoicesOptions} object - url to load the data from
 * @returns promise
 */
export const fetchChoices = async (fieldId, url, { clearErrors, setError, urlDomain, mappedId, mappedLabel, triggerFieldId, choiceFormatter }) => {
  const fetchUrl = urlDomain ? `${urlDomain}${url}` : url;
  const things = await axios.get(fetchUrl).then(res => {
    // We may need to clear the error in the event that the error was caused by a previous failed attempt
    if (clearErrors && typeof clearErrors === 'function') {
      clearErrors(fieldId);
    }
    // If there is a valid choice formatter, use it
    if (choiceFormatter && typeof choiceFormatter === 'function') {
      // pass along extra options to the choice formatter
      return choiceFormatter(fieldId, res, { triggerFieldId, mappedId, mappedLabel });
    }

    const { data } = res || {};
    return data?.map((opt) => {
      const id = mappedId && opt[mappedId] ? opt[mappedId] : opt.id || opt.streamID;
      const label = mappedLabel && opt[mappedLabel] ? opt[mappedLabel] : opt.name || opt.label;
      return { id, label };
    });
  }
  ).catch(error => {
    if (error.name !== 'CanceledError') {
      console.error('\t', fieldId, 'Error fetching data', error);

      // We may want to inject an error message into the field
      if (setError && typeof setError === 'function') {
        setError(fieldId, { type: 'custom', message: 'There was a problem loading the possible choices for this field' });
      }
    }
  });
  return things || [];
};

/**
 * Creates a section object for the form
 * @param {object} section - section object from the form layout
 * @param {Map<string, Field>} fieldMap -
 * @returns
 */
const createRenderSection = (section, fieldMap) => {
  const formSection = {
    name: section.name || section.title,
    fields: [],
    visible: false
  };
  let visibleCount = 0;
  section.fields.forEach((fieldPath) => {
    const field = fieldMap.get(fieldPath) || {};
    const { render } = field || {};
    if (!render.hidden) {
      visibleCount++;
    }

    formSection.fields.push({ render: { ...render } });
  });

  formSection.visible = visibleCount > 0;
  return formSection;
};


export const useConfigForm = (formLayout, data) => {
  console.log('useConfigForm', formLayout)
  const { defaultValues, watchFields, validations: dynamicValidations } = processDynamicFormLayout(formLayout, data);
  const [sections, setSections] = useState([]);
  const [validations, setValidations] = useState({});

  console.log('defaultValues', defaultValues)

  // update the validation schema hookForm uses when the validation state changes
  const validationSchema = useMemo(
    () => {
      return object({ ...validations });
    },
    [validations]
  );

  const useFormObject = useForm({
    mode: 'onBlur',
    defaultValues: defaultValues,
    resolver: yupResolver(validationSchema),
    shouldUnregister: true
  });

  // Form object will contain all the properties of useForm (React Hook Form)
  const { formState, watch, trigger, setValue, reset, resetField, setError, clearErrors } = useFormObject;

  useEffect(() => {
    const renderSections = [];
    formLayout.sections.forEach(section => {
      renderSections.push(createRenderSection(section, formLayout.fields));
    });

    formLayout.fields.forEach((field) => {
      checkConditionalRender(formLayout.triggerFields, formLayout.fields, field.id, { watch, setValue, setError, clearErrors });
    });

    setSections(renderSections);

    //If we have any dynamic validations, set them
    if (Object.keys(dynamicValidations).length > 0) {
      console.log('dynamicValidations', dynamicValidations)
      setValidations(() => {
        return {
          ...dynamicValidations,
        };
      });
    }
    // reset(realValues);
  }, [formLayout]);

  // If the schema changes and the form has been submitted, revalidate
  useEffect(() => {
    if (formState.isSubmitted) {
      trigger();
    }
    // We do not want formState.isSubmitted to be a dependency here, the trigger happens on form submit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validationSchema]);

  return {
    useFormObject,
    sections
  };
};
