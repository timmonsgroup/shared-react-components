import { AnyField, parseField } from "@timmons-group/shared-react-components"
import { useForm } from "react-hook-form"

const FormTester = () => {
  const useFormObject = useForm({
    mode: 'onBlur',
    shouldUnregister: true
  });

  // Form object will contain all the properties of useForm (React Hook Form)
  const { formState, control } = useFormObject;

  console.log('formState', formState)

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
  const emptyMap = new Map();
  const field = parseField(layout, emptyMap);
  // const getOptionDisabled = (option) => {
  //   if (option.id === 1) {
  //     return true;
  //   }
  // }
  const fieldComponentProps = {

  }

  console.log('field', field);
  return (
    <form>
      <AnyField layout={field.render} control={control} fieldComponentProps={fieldComponentProps} />
    </form>
  )
}

export default FormTester