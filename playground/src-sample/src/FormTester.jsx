import { AnyField, FIELD_TYPES, getFieldValue, parseField, PLACEHOLDER } from "@timmons-group/config-form"
import { useForm } from "react-hook-form"
import { createCurrencyModel, createDateModel, createAnyModel } from "./helpers/helpers";
import { yupResolver } from '@hookform/resolvers/yup';

console.log('yupResolver', yupResolver)

const dateLayout = createDateModel("date", "Enter a Date", true, { [PLACEHOLDER]: "Boogity"});
const numberField = createCurrencyModel("number", "Enter a Number", true, { [PLACEHOLDER]: "Bacon uints"});
const texty = createAnyModel(FIELD_TYPES.TEXT, "texty", "Enter some text", true, { [PLACEHOLDER]: "Pop Tarts"});

const FormTester = () => {
  const useFormObject = useForm({
    mode: 'onBlur',
    shouldUnregister: true,
    defaultValues: {
      organizationId: 2,
      date: null,
      number: 0,
      texty: "",
    },

  });

  // Form object will contain all the properties of useForm (React Hook Form)
  const { control } = useFormObject;

  const layout = {
    "label": "Organization",
    "path": "organizationId",
    "type": 10,
    "model": {
      "type": 10,
      "name": "organizationId",
    },
    "required": true,
    possibleChoices: [
      {id: 1, name: "Org 1", disabled: true},
      {id: 2, name: "Org 2"},
      {id: 3, name: "Org 3"},
    ],
  };

  const field = parseField(layout);
  const field2 = parseField(dateLayout);
  const field3 = parseField(numberField);
  const field4 = parseField(texty);
  const myValue = getFieldValue(field3, {number: '0'});
  const myValue2= getFieldValue(field4, {texty: 'sherbert'});
  console.log('myValue', myValue)
  console.log('myValue2', myValue2)
  const getOptionDisabled = (option) => {
    console.log(option);
    if (option.id === 1) {
      return true;
    }
  }
  const fieldComponentProps = {
    getOptionDisabled
  }

  return (
    <form>
      <AnyField layout={field.render} control={control} fieldComponentProps={fieldComponentProps} />
      <AnyField layout={field2.render} control={control} />
      <AnyField layout={field3.render} control={control} />
    </form>
  )
}

export default FormTester