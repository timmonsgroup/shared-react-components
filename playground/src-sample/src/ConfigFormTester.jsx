import { ConfigForm, GenericConfigForm } from "@timmons-group/config-form";
import { layout } from "./helpers/FormLayoutPreset";
import { useFormContext } from "react-hook-form";

const options = {
  mode: 'onChange'
}

const ConfigFormTester = () => {
  const formData = {
    email: 'duderino@gmail.com',
    // dateApplicationReceived: '2022-01-01',
    // dateApplicationReceived: '2024-01-02T05:00:00.000Z',
    dateApplicationReceived: '2024-09-11T20:54:39.768Z',
    // dateApplicationReceived: '12/31/2023',
  }

  const onSubmit = (data) => {
    console.log('onSubmit', data)
  }

  return (
    <ConfigForm formLayout={layout.layout} data={formData} formOptions={options}>
      <GenericConfigForm
        headerTitle="Bacon Bits"
        // isEdit={isEdit}
        // sectionProps={sectionProps}
        onSubmit={onSubmit}
      />
      <AThing />
    </ConfigForm>
  )
}

const AThing = () => {
  const {useFormObject} = useFormContext();
  return (
    <div>
      <h1>Thing</h1>
      <button onClick={() => {
        console.log('Values', useFormObject.getValues())
        console.log('FormState', useFormObject.formState)
      }}
      >DO IT</button>
    </div>
  )
}

export default ConfigFormTester