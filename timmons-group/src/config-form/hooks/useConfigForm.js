/** @module useFormConfig */
//Third party bits
import '../models/form';
import { useEffect, useMemo, useState, useLayoutEffect, useRef } from 'react';

import { useForm } from 'react-hook-form';
import { object } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Internal bits
import { getFieldValue } from './useFormLayout';
import axios from 'axios';
import {
  ID_FIELD,
  LABEL_FIELD,
  CONDITIONAL_RENDER, DEFAULT_VALUE } from '../constants';
import {
  objectReducer,
  FIELD_TYPES
} from '@timmons-group/shared-react-components';
import { checkConditional, defaultChoiceMapper } from '../helpers/formHelpers';

/**
 * @function processDynamicFormLayout
 * @description This function will take the form layout and the data and return the default values and validation schema for the form
 * @param {object} formLayout
 * @param {object} data
 * @returns {ProcessedDynamicFormLayout} - Object containing the default values, validation schema, and fields to watch for changes
 */
export const processDynamicFormLayout = (formLayout, data) => {
  // console.log('Processing Dynamic Form Layout');
  // Will hold the validation schema for the form
  const validations = {};
  // Will hold the correctly formatted field values for the form
  const defaultValues = {};
  // Will hold the fields that need to be watched for changes
  const fieldsToWatch = {};

  formLayout.sections.forEach(section => {
    for (const fieldId of section.fields) {
      if (formLayout.fields.has(fieldId)) {
        const field = formLayout.fields.get(fieldId);
        // Get the value from the incoming values correctly formatted
        // If it does not exist the returned value will be the correct default format
        const { name, value } = getFieldValue(field, data || {});
        defaultValues[name] = value;

        // Update the validation schema for this field
        // Do not add validations for read only fields
        if (!field.render?.readOnly) {
          validations[field.id] = field.validations;
        }

        // If this field exists in the triggerfields we need to watch the form for changes
        // console.log('Checking for trigger fields', fieldId, formLayout.triggerFields.has(fieldId));
        // console.log('Trigger Fields', formLayout.triggerFields);
        if (formLayout.triggerFields.has(fieldId)) {
          fieldsToWatch[fieldId] = true;
        }
      }
    }
  });

  return {
    defaultValues,
    validations: validations,
    watchFields: Object.entries(fieldsToWatch).map(([key]) => key),
  };
};

/**
 * Method to check for and setup conditional rendering
 * @function
 * @param {Map<string, object>} triggerFields - Map of fields that trigger conditional rendering
 * @param {Map<string, object>} fields - Map of all fields
 * @param {string} triggerId - ID of the field to check
 * @param {any} triggerValue - Value of the field to check
 * @param {object} options - Options for the conditional rendering
 * @param {any} formValue - Value of the field to check
 * @returns {Array} - Array of fields that need to be updated
 */
const processAffectedFields = (triggerField, fields, formValue, options) => {
  const { appliedConditionals } = options;
  if (formValue === '') formValue = null;
  // All fields touched by the trigger field are processed.
  const processedFields = [];

  let affectedFields = triggerField.touches || [];
  // Note the conditions are ONLY the ones that are related to the triggering field
  affectedFields.forEach((conditions, touchedId) => {
    const conditional = {
      hasAsync: false,
      loadedChoices: {},
      hasRenderValue: false,
      isUpdating: false,
      noPasses: true
    };
    // console.log('Touched: ', touchedId, 'Conditions: ', conditions);
    //check all the conditions
    conditions.forEach(({ conditionId, when, then }) => {
      // check if the operation is true
      const passes = checkConditional(when, formValue);
      const { fieldId, operation, value } = when;
      // console.log(`${passes ? '👍' : '❌'}`, fieldId, 'with fieldValue', formValue, 'operation', operation, 'value', value)
      if (passes) {
        conditional.noPasses = false;
        const loadOut = then;
        // If the field has a remoteUrl, we need to fetch the data
        const layout = loadOut?.layout;
        const isHidden = layout?.get(CONDITIONAL_RENDER.HIDDEN);
        if (!isHidden && layout?.has('url')) {
          conditional.hasAsync = true;
          const remoteUrl = layout?.get('url')?.replace('##thevalue##', formValue);
          // Note the ID_FIELD and LABEL_FIELD here are different from the useFormLayout hook
          // These are the values on this field's CONDITIONAL layout, not the default layout
          conditional.asyncLoader = () => fetchChoices(touchedId, remoteUrl, {
            mappedId: layout?.get(ID_FIELD),
            mappedLabel: layout?.get(LABEL_FIELD),
            triggerFieldId: touchedId,
            ...options
          });
        }

        // If the field has a condtional dependent renderProperty we need to parse it out
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
              conditional.hasRenderValue = true;
              conditional.renderValue = renderValue;
            }
          }
        }

        conditional.isUpdating = true;
        conditional.loadOut = loadOut;
      }
      // console.log('Applied "pass" state', appliedConditionals.current[conditionId], ' vs ', passes)
      const isApplied = appliedConditionals.current[conditionId] === passes;
      // If the conditional is not already applied, or it has async needs, we need to process it
      if (!isApplied || conditional.hasAsync) {
        appliedConditionals.current[conditionId] = passes;
        processedFields.push({ id: touchedId, conditional });
      }
    });
  });
  return processedFields;
};

/**
 * Creates a section object for the form
 * @function createRenderSection
 * @param {object} section - section object from the form layout
 * @param {Map<string, Field>} fieldMap -
 * @returns {FormSection} - Form section object
 */
const createRenderSection = (section, fieldMap) => {
  const formSection = {
    name: section.name || section.title,
    description: section.description,
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

    formSection.fields.push({ render: { ...render }, subFields: field.subFields, type: field.type, [DEFAULT_VALUE]: field[DEFAULT_VALUE] });
  });

  formSection.visible = visibleCount > 0;
  return formSection;
};

/**
 * Any properties returned here may be applied to the FormContext for use in child components
 * @example
 * const { useFormObject, formProcessing, sections } = useConfigForm(formLayout, data, options);
 * <FormProvider {...useFormObject} sections={sections} formProcessing={formProcessing}>
 * @function useConfigForm
 * @param {object} formLayout - Form layout object
 * @param {object} data - Data to pre-populate the form with
 * @param {object} [options] - any other options needed for the form
 * @param {function} [addCustomValidations] - function to add custom validations to the form MUST return an object
 * @returns {object} - Object containing the useFormObject, formProcessing, and sections
 */
export const useConfigForm = (formLayout, data, options, addCustomValidations) => {
  // Use memo because we do not need to re-run this function unless the formLayout or data changes
  // If we do not memoize certain form actions will trigger a re-run of the watch subscription building
  const { defaultValues, watchFields, validations: dynamicValidations } = useMemo(() => {
    return processDynamicFormLayout(formLayout, data)
  }, [formLayout, data]);
  const [sections, setSections] = useState([]);
  const [validations, setValidations] = useState({});
  const [formProcessing, setFormProcessing] = useState(true);
  const [readyForWatches, setReadyForWatches] = useState(false);
  const appliedConditionals = useRef({});

  // update the validation schema hookForm uses when the validation state changes
  const validationSchema = useMemo(
    () => {
      if (addCustomValidations && typeof addCustomValidations === 'function') {
        const newValids = addCustomValidations(validations);
        if (newValids) {
          return object({ ...newValids });
        }
        return object({ ...validations });
      }
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
  const { formState, watch, trigger, reset, resetField, setError, clearErrors, getFieldState } = useFormObject;

  useLayoutEffect(() => {
    // console.log('\tForm Layout Changed');
    if (!formProcessing) {
      // console.log('\t\tSetting form processing to true');
      setFormProcessing(true);
    }

    initTheForm({
      formLayout,
      setSections,
      validations: dynamicValidations,
      setValidations,
      isResetting: false,
      watchFields,
      setFormProcessing,
      setReadyForWatches,
      defaultValues,
      options: { ...options, setError, clearErrors, resetField, appliedConditionals }
    });

    return () => {
      // Cleanup
      appliedConditionals.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formLayout]);

  // If the schema changes and the form has been submitted, revalidate
  useEffect(() => {
    if (formState.isSubmitted) {
      trigger();
    }
    // We do not want formState.isSubmitted to be a dependency here, the trigger happens on form submit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validationSchema]);

  const forceReset = () => {
    // Yes we do need to reset the form
    reset(defaultValues);

    // Then set the formProcessing to true so it will re-render
    if (!formProcessing) {
      setFormProcessing(true);
    }

    // Then re-run the initTheForm function otherwise the triggers won't run because watch is dumb
    initTheForm({
      formLayout,
      sections,
      setSections,
      validations: dynamicValidations,
      setValidations,
      isResetting: true,
      watchFields,
      setFormProcessing,
      setReadyForWatches,
      defaultValues,
      options: { ...options, setError, clearErrors, resetField, appliedConditionals }
    });
  };


  // If we have any watchFields, watch them and update the form
  // The
  useLayoutEffect(() => {
    // console.log('\tReady for watches OR Watch Fields Changed');
    let subscription = null;
    if (readyForWatches && !subscription) {
      // console.log('\t\tSetting up subscription');
      // console.log('\t\t\t UPDATED Watch Fields: ', watchFields);
      subscription = watch((formValues, { name, type }) => {
        let watched = watchFields.includes(name);
        // console.log('\t\t\tWatched: ', watched, 'Name: ', name, 'Type: ', type)

        // This field is not watched
        if (!watched) {
          return;
        }

        if (type !== 'change') {
          // check if clusterField
          const maybeCluster = formLayout.fields.get(name);
          if (maybeCluster.type !== FIELD_TYPES.CLUSTER) {
            return;
          }
        }

        const finishSetup = ({ renderSections, resetFields, dynValid }) => {
          // console.log('\tFinish Setup');
          // This will reset any fields that were disabled
          // We grab the "empty" value from the field and set it as the default value
          const resetValues = {};
          for (const field in resetFields) {
            const fieldToReset = formLayout.fields.get(field);
            const { value } = getFieldValue(fieldToReset, {});
            resetValues[field] = value;
            resetField(field, { defaultValue: value });
          }

          // console.log('\t\tUpdate sections state (new render)');
          setSections(renderSections);

          // This will trigger the useMemo to update the validation schema
          // That hook will then trigger the useEffect to revalidate the form
          // console.log('\t\tUpdate validations state (new render)');
          setValidations((prevValues) => {
            return {
              ...prevValues,
              ...dynValid,
            };
          });

          // loop through the new validations and clear any errors IF the field is dirty
          for (const field in dynValid) {
            const fState = getFieldState(field);
            // console.log(field, '| DYN FIELD | ', fState)
            if (fState?.isDirty) {
              // console.log('Clearing error for: ', field);
              clearErrors(field);
            }
          }

          // console.log('\t\tSet form processing to false');
          setFormProcessing(false);
        };

        // Note we pass the reactive sections here AND NOT the formLayout.sections
        renderTheSections({
          sections,
          fields: formLayout.fields,
          triggerFields: formLayout.triggerFields,
          values: formValues,
          watchFields,
          fromWatch: true,
          triggeringFieldId: name,
          options: { ...options, setError, clearErrors, resetField, appliedConditionals },
          finishSetup
        });
      });
    }

    // Keep in mind that this will run on a renrender of the component BEFORE the next subscription is setup
    return () => {
      // TODO: Look into termination of any triggerfield async
      // Kill the existing subscription
      subscription?.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyForWatches, watchFields]);


  return {
    useFormObject,
    sections,
    formProcessing,
    forceReset,
  };
};

/**
 * Function to initialize the form
 * @function initTheForm
 * @param {object} props
 * @param {object} props.formLayout - Form layout object
 * @param {object} props.setSections - React hook to set the sections
 * @param {object} props.validations - Dynamic validations
 * @param {object} props.setValidations - React hook to set the validations
 * @param {boolean} props.isResetting - Whether or not the form is resetting
 * @param {array} props.watchFields - Array of fields to watch
 * @param {object} props.setFormProcessing - React hook to set the formProcessing state
 * @param {object} props.setReadyForWatches - React hook to set the readyForWatches state
 * @param {object} props.defaultValues - Default values for the form
 * @param {object} props.options - Options object
 */
const initTheForm = ({ formLayout, setSections, validations, setValidations, isResetting, watchFields, setFormProcessing, setReadyForWatches, defaultValues, options }) => {
  // Finish setting up the form
  // This is done in a separate function so we can await any async calls
  const finishSetup = ({ renderSections, dynValid }) => {
    setSections(renderSections);

    //If we have any dynamic validations, set them
    if (Object.keys(validations).length > 0) {
      setValidations(() => {
        return {
          ...validations,
          ...dynValid,
        };
      });
    }

    setFormProcessing(false);
    if (watchFields.length > 0 && !isResetting) {
      setReadyForWatches(true);
    }
  };

  renderTheSections({
    sections: formLayout.sections,
    fields: formLayout.fields,
    triggerFields: formLayout.triggerFields,
    values: defaultValues,
    watchFields,
    options,
    fromWatch: false,
    finishSetup
  });
};

/**
 * Renders the sections
 * @function renderTheSections
 * @param {object} props - Props object
 * @param {array} props.sections - Array of sections
 * @param {object} props.fields - Map of fields
 * @param {object} props.triggerFields - Map of trigger fields
 * @param {object} props.values - Form values
 * @param {array} props.watchFields - Array of fields to watch
 * @param {function} props.finishSetup - Function to finish setting up the form
 * @param {object} props.options - Options object
 * @param {boolean} props.fromWatch - Whether or not this is being called from a watch
 */
const renderTheSections = ({ sections, fields, triggerFields, values, watchFields, finishSetup, options, fromWatch, triggeringFieldId }) => {
  // console.log('Preparing next render of the sections (renderTheSections)');
  let renderSections = fromWatch ? sections : [];
  if (!fromWatch) {
    sections.forEach(section => {
      renderSections.push(createRenderSection(section, fields));
    });
  }

  const newAreUpdating = {};
  const newUpdatedFields = [];
  const newAsyncLoaders = {};
  const loadedChoices = {};
  const dynValid = {};
  const resetFields = {};
  let hasNewAsync = false;

  const updateNewConditional = (fieldId, conditional) => {
    if (conditional.isUpdating && !conditional.noPasses) {
      newAreUpdating[fieldId] = true;
      if (conditional.hasAsync && conditional.asyncLoader) {
        hasNewAsync = true;
        newAsyncLoaders[fieldId] = conditional.asyncLoader;
      };
      newUpdatedFields.push({ id: fieldId, type: 'update', ...conditional.loadOut });
    }
  };

  // Loop through all the triggerFields and see if the initial values have caused any fields to be updated
  const watchesToCheck = fromWatch ? [triggeringFieldId] : watchFields;
  // console.log('\tWatches to Check: ', watchesToCheck);
  // console.log('\tAll watches: ', watchFields);
  watchesToCheck.forEach((fieldId) => {
    // If somehow watching a field that is not in the formLayout, skip it
    const usedTriggerField = triggerFields.get(fieldId);
    if (!usedTriggerField) {
      return;
    }

    const triggeringField = triggerFields.get(fieldId);

    // Get the starting value of the field
    const formValue = values[fieldId];
    // Loop through all the fields that are dependent on this triggerField
    const updatednew = processAffectedFields(triggeringField, fields, formValue, options);
    updatednew.forEach(({ id, conditional }) => {
      updateNewConditional(id, conditional);
    });
    // console.log('Updated New: ', updatednew);

    // If this update is from a watch, we need to handle the reset of the affected fields
    if (fromWatch) {
      updatednew.forEach(({ id, conditional }) => {
        if (conditional.noPasses) {
          if (!newAreUpdating[id]) {
            newAreUpdating[id] = true;
            newUpdatedFields.push({ id: id, type: 'reset' });
          }
        }
      });
    }
  });

  // console.log('Updated Fields: ', updatedFields);
  // console.log('NEW Updated Fields: ', newUpdatedFields);
  const hasUpdates = Object.keys(newAreUpdating).length > 0;

  if (hasUpdates) {
    // If any of the affected fields have async needs, we need to wait for them to resolve
    if (hasNewAsync) {
      // Create an array of promise so we can await all.
      const optTypes = Object.keys(newAsyncLoaders).map((fId) => (
        // return Promise that stores the loadedChoices into the correct model
        newAsyncLoaders[fId]().then((loaded) => {
          loadedChoices[fId] = loaded;
        })
      ));

      // If we have choice loading promises, wait for them all to finish
      if (optTypes.length) {
        Promise.all(optTypes).finally(() => {
          renderSections = processConditionalUpdate(renderSections, fields, newUpdatedFields, loadedChoices, dynValid, resetFields);
          if (finishSetup && typeof finishSetup === 'function') {
            finishSetup({ renderSections, dynValid, resetFields });
          }
        });
      }
    } else {
      renderSections = processConditionalUpdate(renderSections, fields, newUpdatedFields, null, dynValid, resetFields);
      finishSetup({ renderSections, dynValid, resetFields });
    }
  } else {
    finishSetup({ renderSections, dynValid, resetFields });
  }
};

/**
 * Process the updated fields and update the render sections
 * @function processConditionalUpdate
 * @param {Array<FormSection>} sections - Array of all the sections in the form
 * @param {Map<string, object>} fields - Map of all the fields in the form
 * @param {Array<object>} updatedFields - Array of fields that need to be updated
 * @param {object} asyncThings - Object of async things that need to be loaded
 * @param {object} dynValid - Object of dynamic validations
 * @param {object} resetFields - Object of fields that need to be reset
 * @returns {Array<object>}
 */
const processConditionalUpdate = (sections, fields, updatedFields, asyncThings = {}, dynValid = {}, resetFields = {}) => {
  const revalidates = {};

  // Loop through the fields that need to be updated
  const layoutSections = sections.map(section => {
    updatedFields.forEach(field => {
      const fieldObject = fields.get(field.id);
      // Check if the field is in this section
      const sectionField = section.fields.find(x => x.render.name === fieldObject.id);
      if (sectionField) {
        revalidates[fieldObject.id] = true;
        let { render } = sectionField;
        // If the  type of update is ...update find the new validations and render bits
        if (field.type === 'update') {
          if (!fieldObject.render?.readOnly) {
            dynValid[fieldObject.id] = field.validation;
          }
          const updatedLayout = Object.fromEntries(field.layout);
          //Check for aysnc things
          const choices = asyncThings ? asyncThings[field.id] : null;
          // TODO: possibly handle more than just choices
          const asyncRender = choices ? { choices } : {};
          render = { ...render, ...updatedLayout, ...asyncRender };
        } else {
          //TODO: Is it possible that reset fields would need to be async?
          if (!fieldObject.render?.readOnly) {
            dynValid[fieldObject.id] = fieldObject.validations;
          }

          if (fieldObject.render?.hidden || fieldObject.render?.disabled) {
            // New logic actually reset the field value
            // Hope past Nathan just missed something and this is not a bad idea
            resetFields[fieldObject.id] = true;
          }

          // If the type of update is ...reset, find the original validations and render bits
          // Note that for render properties in the original layout to override the dynamic properties they MUST exist on the original layout even if
          // null or empty. This is important for fields that use the "choices" property.
          render = { ...render, ...fieldObject.render };
        }

        sectionField.render = render;

        if (sectionField.render.disabled) {
          resetFields[fieldObject.id] = true;
        }
      }
    });

    let hasVisible = false;
    // loop through the fields and break if we find a visible field
    for (const field of section.fields) {
      if (!field.render.hidden) {
        hasVisible = true;
        break;
      }
    }

    section.visible = hasVisible;

    return section;
  });

  return layoutSections;
};

/**
 * @typedef {Object} FetchChoicesOptions
 * @property {string} [urlDomain] - domain to use when fetching the data
 * @property {string} [mappedId] - property to use when mapping the id
 * @property {string} [mappedLabel] - property to use when mapping the label
 * @property {string} [triggerFieldId] - id of the field that triggered the load
 * @property {function} [choiceFormatter] - function to format the choices
 * @property {function} [clearErrors] - function to clear errors
 * @property {function} [setError] - function to set errors
 */

/**
 * Loads the data for the async fields
 * @async
 * @function
 * @param {string} fieldId - id of the field that is being loaded
 * @param {string} url - url to load the data from
 * @param {FetchChoicesOptions} object - url to load the data from
 * @returns {Promise<Array<object>>}
 */
export const fetchChoices = async (fieldId, url, { clearErrors, setError, resetField, urlDomain, mappedId, mappedLabel, triggerFieldId, choiceFormatter }) => {
  // console.log('Fetching data for field', fieldId);
  // If we are fetching new choices, we need to reset the field so the user is forced to make a new selection
  resetField(fieldId);
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

    return defaultChoiceMapper(res, { mappedId, mappedLabel });
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
