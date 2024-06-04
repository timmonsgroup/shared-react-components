import { ConfigForm, GenericConfigForm } from "@timmons-group/shared-react-components";
import { layout } from "./helpers/FormLayoutPreset";

const ConfigFormTester = () => {
  const formData = {
    email: 'duderino@gmail.com'
  }

  const onSubmit = (data) => {
    console.log('onSubmit', data)
  }

  return (
    <ConfigForm formLayout={layout.layout} data={formData}>
      <GenericConfigForm
        headerTitle="Bacon Bits"
        // isEdit={isEdit}
        // sectionProps={sectionProps}
        onSubmit={onSubmit}
      />
    </ConfigForm>
  )
}

export default ConfigFormTester