//Third party bits
import { useEffect, useMemo, useState } from 'react';
import { flushSync } from 'react-dom';

import { useForm } from 'react-hook-form';
import { object } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Internal bits
import { getFieldValue, useFormLayout } from './useFormLayout';
import axios from 'axios';
import { IDFIELD } from '../constants';

/**
 * useDynamicForm is a hook that handles the fields and validations for a dynamic form.
 * @param {string} type - object type for standard PAM get layout endpoint
 * @param {string} key - layout key for standard PAM get layout endpoint
 * @param {object} incomingValues - object of the defaut or initial values for the form (optional)
 * @param {string} url - url if you are not using the standard pam endpoint (optional)
 * @param {string} urlDomain - domain to use for the url (optional)
 * @param {function} setLoading - function to set the loading state of the form for async conditional items (optional)
 * @returns {...useForm, array, boolean} - all the properties of useFom, and array of the sections, a loading boolean
 */
export const useDynamicForm = (layoutOptions = {}, incomingValues = {}, urlDomain, setLoading) => {
  const [parsedLayout, layoutLoading] = useFormLayout(layoutOptions?.type, layoutOptions?.key, layoutOptions?.url, urlDomain);

  const [sections, setSections] = useState([]);
  const [hasWatches, setHasWatches] = useState(false);
  const [validations, setValidations] = useState({});

  // update the validation schema hookForm uses when the validation state changes
  const validationSchema = useMemo(
    () => {
      return object({ ...validations });
    },
    [validations]
  );

  // If the schema changes and the form has been submitted, revalidate
  useEffect(() => {
    if (formState.isSubmitted) {
      trigger();
    }
    // We do not want formState.isSubmitted to be a dependency here, the trigger happens on form submit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validationSchema]);

  const useFormObject = useForm({
    mode: 'onBlur',
    resolver: yupResolver(validationSchema)
  });

  // Form object will contain all the properties of useForm (React Hook Form)
  const { formState, watch, trigger, setValue, reset, resetField, setError, clearErrors } = useFormObject;

  useEffect(() => {
    if (layoutLoading) {
      return;
    }

    // Will hold the validation schema for the form
    const dynValid = {};

    // flag to see if we need any watches (triggered by a field value changing)
    let watchMe = false;

    // Will hold the correctly formatted field values for the form
    const dynValues = {};
    parsedLayout.sections.forEach(section => {
      for (const fieldId of section.fields) {
        if (parsedLayout.fields.has(fieldId)) {
          const field = parsedLayout.fields.get(fieldId);
          // Get the value from the incoming values correctly formatted
          // If it does not exist the returned value will be the correct default format
          const { name, value } = getFieldValue(field, incomingValues || {});
          dynValues[name] = value;

          // Update the validation schema for this field
          dynValid[field.id] = field.validations;

          // If this field exists in the triggerfields we need to watch the form for changes
          if (parsedLayout.triggerFields.has(fieldId)) {
            watchMe = true;
          }
        }
      }
    });

    // TODO figure out a way to only watch the fields that are needed
    if (watchMe) {
      setHasWatches(watchMe);
    }

    //If we have any dynamic validations, set them
    if (Object.keys(dynValid).length > 0) {
      setValidations(() => {
        return {
          ...dynValid,
        };
      });
    }

    // Create our renderable sections
    const renderSections = [];
    parsedLayout.sections.forEach(section => {
      const formSection = {
        name: section.name,
        fields: []
      };

      section.fields.forEach((fieldPath) => {
        const field = parsedLayout.fields.get(fieldPath) || {};
        const { render } = field || {};
        formSection.fields.push({ render: { ...render } });

        // TODO: Nuke this when defaultValue is implemented
        // THIS should move to getFieldValue method
        // Preselect the first option if there is only one option
        if (render.choices?.length === 1) {
          setValue(render.name, render.choices[0]);
        }
      });
      renderSections.push(formSection);
    });

    setSections(renderSections);

    // We do this to cause any watched fields to fire on initial load
    // This will also set the sections.
    reset(dynValues);
    // }
    // We really only want to run this on layoutLoading changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutLoading]);

  useEffect(() => {
    let subscription = null;
    // If we have watched fields, we need to watch them
    if (hasWatches && !subscription) {
      /**
       * Method to complete the watch logic and update state.
       * @param {array} updatedFields - array of field ids that need to be modified and if it was an "update" or "reset"
       * @param {object} asyncThings - object of async render bits that should be folded into the layouts
       */
      const finishWatch = (updatedFields, asyncThings = {}) => {
        const dynValid = {};
        const resetFields = {};
        const revalidates = {};

        // Loop through the fields that need to be updated
        const layoutSections = sections.map(section => {
          updatedFields.forEach(field => {
            const fieldObject = parsedLayout.fields.get(field.id);
            const fndField = section.fields.find(x => x.render.name === fieldObject.id);
            if (fndField) {
              revalidates[fieldObject.id] = true;
              let { render } = fndField;
              // If the  type of update is ...update find the new validations and render bits
              if (field.type === 'update') {
                dynValid[fieldObject.id] = field.validation;
                const updatedLayout = Object.fromEntries(field.layout);
                //Check for aysnc things
                const choices = asyncThings ? asyncThings[field.id] : null;
                // TODO: possibly handle more than just choices
                const asyncRender = choices ? { choices } : {};
                render = { ...render, ...updatedLayout, ...asyncRender };
              } else {
                //TODO: Is it possible that reset fields would need to be async?
                dynValid[fieldObject.id] = fieldObject.validations;
                // If the type of update is ...reset, find the original validations and render bits
                // Note that for render properties in the original layout to override the dynamic properties they MUST exist on the original layout even if
                // null or empty. This is important for fields that use the "choices" property.
                render = { ...render, ...fieldObject.render };
              }

              fndField.render = render;

              if (fndField.render.disabled) {
                resetFields[fieldObject.id] = true;
              }
            }
          });
          return section;
        });

        // Update the sections
        setSections(layoutSections);

        // This will trigger the useMemo to update the validation schema
        // That hook will then trigger the useEffect to revalidate the form
        setValidations((prevValues) => {
          return {
            ...prevValues,
            ...dynValid,
          };
        });

        // This will reset any fields that were disabled
        // We need to bypass the batch updates here or the disabled fields may trigger their own validation before the schema update occurs
        // and out validation appearance will be out of sync with the schema
        flushSync(() => {
          for (const field in resetFields) {
            resetField(field);
          }
        });
      }

      const fetchData = async (fieldId, url, mappedId) => {
        const fetchUrl = urlDomain ? `${urlDomain}${url}` : url;
        const things = await axios.get(fetchUrl).then(res => {
          // We need to clear the error in the event that the error was caused by a previous failed attempt
          clearErrors(fieldId);
          return res?.data?.map((opt) => {
            const id = mappedId && opt[mappedId] ? opt[mappedId] : opt.id || opt.streamID;
            return { id, label: opt.name || opt.label }
          });
        }
        ).catch(error => {
          if (error.name !== 'CanceledError') {
            // Inject an error message into the field
            setError(fieldId, { type: 'custom', message: 'There was a problem loading the possible choices for this field' });
          }
        });
        return things || [];
      }

      // There may be a way to dynamically watch just the needed fields, they all seem hacky
      // This subscription will fire on every change

      /**
       * value is the value of the watched field
       * name is the name of the watched field
       * type is what happened. We only care about 'change'
       **/
      subscription = watch((value, { name, type }) => {
        // const triggerField = parsedLayout.triggerFields.get(`fields.${name}`);
        const triggerField = parsedLayout.triggerFields.get(name);
        if (!triggerField || type !== 'change') {
          return;
        }

        let formValue = value[name];

        // This is old logic when we were an object {id: valueHere} instead of the value directly
        // const triggerFieldType = parsedLayout.fields.get(triggerField.id).type;
        // if (triggerFieldType === FIELDS.Object || triggerFieldType === FIELDS.CHOICE) {
        //   formValue = formValue?.id;
        // }

        // Array of fields that were affected by the change
        const updatedFields = [];

        // Conditional async rendering
        // Flag to indicate if any fields triggered async rendering
        let hasAsync = false;
        // Object where eached key is the field path and value is a promise that resolves to the choices
        const asyncLoaders = {};
        // Object where each key is the field path and value an array of the choices
        const loadedChoices = {};
        // Track if it is already updating. Things get weird if we try to update and reset the same field at the same time
        const areUpdating = {};

        const updateLoop = (fValue) => {
          // See if the new value matches any of the trigger values
          // fieldValues is a map. Each value is an array of fields that are affected by that value
          if (triggerField.fieldValues.has(fValue)) {
            // Get the fields that need to be updated
            let affectedFields = triggerField.fieldValues.get(fValue) || [];

            affectedFields.forEach((loadOut, fieldId) => {
              // If the field has a remoteUrl, we need to fetch the data
              if (loadOut?.layout?.has('url')) {
                hasAsync = true;
                const remoteUrl = loadOut?.layout?.get('url')?.replace('##thevalue##', formValue);
                asyncLoaders[fieldId] = () => fetchData(fieldId, remoteUrl, loadOut?.layout?.get(IDFIELD));
              }

              areUpdating[fieldId] = true;
              updatedFields.push({ id: fieldId, type: 'update', ...loadOut });
            });
          }
        };

        // Check for exact form value match
        updateLoop(formValue);

        // A flag to determine if this "onChange" field has a null value. If it does, we need to handle resets for affected fields heavy handedly
        let nullChangeValue = false;

        // Check for any "onChange" fields
        if (triggerField.hasOnChange) {
          if (formValue !== null && formValue !== undefined) {
            updateLoop('anyValue');
          } else {
            nullChangeValue = true;
          }
        }

        // touches is a map of all the fields affected by this triggerfield
        // fieldId is the key and the value is a map of the field values from this triggerfield that affect it
        const touchedFields = triggerField.touches;

        // Add a reset to the updatedFields array
        const addReset = (fieldId) => {
          if (!areUpdating[fieldId]) {
            areUpdating[fieldId] = true;
            updatedFields.push({ id: fieldId, type: 'reset' });
          }
        };

        // Determine any fields that need to be reset
        touchedFields.forEach((value, fieldId) => {
          // If this field is not affected by the new value, it needs to be reset (probably)
          // We check if the field is already being updated because we don't want to reset a field that is being updated
          // This would happen with a field that has a remoteUrl that updates on EVERY triggerfield change.
          if (!value.has(formValue)) {
            addReset (fieldId);
          } else if (value.has('anyValue') && nullChangeValue) {
            // We need to reset any fields that may have been triggered by an "anyValue" trigger and allow it to be reset when the triggerfield is null
            addReset(fieldId);
          }
        });

        // If any of the affected fields have async needs, we need to wait for them to resolve
        if (hasAsync) {
          // Create an array of promise so we can await all.
          const optTypes = Object.keys(asyncLoaders).map((typeId) => (
            // return Promise that stores the loadedChoices into the correct model
            asyncLoaders[typeId]().then((loaded) => {
              loadedChoices[typeId] = loaded;
            })
          ));

          // If we have choice loading promises, wait for them all to finish
          if (optTypes.length) {
            if (setLoading) {
              setLoading(true);
            }

            Promise.all(optTypes).finally(() => {
              finishWatch(updatedFields, loadedChoices);
              if (setLoading) {
                setLoading(false);
              }
            });
          }
        } else {
          finishWatch(updatedFields);
        }
      });
    }
    return () => {
      // TODO: Look into termination of any triggerfield async
      subscription?.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasWatches]);

  return {
    ...useFormObject,
    sections,
    layoutLoading,
  }
}