import { AnyField, parseField, PLACEHOLDER } from "@timmons-group/shared-react-components"
import { useForm } from "react-hook-form"
import { createDateModel } from "./helpers/helpers";

const dateLayout = createDateModel("date", "Enter a Date", true, { [PLACEHOLDER]: "Boogity"});

const FormTester = () => {
  const useFormObject = useForm({
    mode: 'onBlur',
    shouldUnregister: true,
    defaultValues: {
      organizationId: 2,
      date: null,
    }
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
  const emptyMap = new Map();
  const field = parseField(layout, emptyMap);
  const field2 = parseField(dateLayout, emptyMap);
  const getOptionDisabled = (option) => {
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
    </form>
  )
}

export default FormTester