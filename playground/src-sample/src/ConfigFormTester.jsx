import { ConfigForm, GenericConfigForm, defaultChoiceMapper } from "@timmons-group/shared-react-components";
import { layout } from "./helpers/FormLayoutPreset";

export const choiceFormatter = (fieldId, response, options) => {
  if (fieldId === 'asyncPublicHolidays') {
    const { data } = response || {};
    const formattedChoices = data.map((choiceDataItem, index) => {
      return { id: index, label: choiceDataItem.name };
    });

    return formattedChoices;
  }

  return defaultChoiceMapper(response, options);
}

const ConfigFormTester = () => {
  const formData = {
    email: 'duderino@gmail.com'
  }

  const onSubmit = (data) => {
    console.log('onSubmit', data)
  }

  return (
    <ConfigForm formLayout={layout.layout} data={formData} parseOptions={{ choiceFormatter }}>
      <GenericConfigForm
        headerTitle="Bacon Bits"
        isEdit={true}
        // sectionProps={sectionProps}
        onSubmit={onSubmit}
      />
    </ConfigForm>
  )
}

export default ConfigFormTester