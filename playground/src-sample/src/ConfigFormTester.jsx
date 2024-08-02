import { ConfigForm, GenericConfigForm, defaultChoiceMapper, yupCurrency } from "@timmons-group/shared-react-components";
import { layout } from "./helpers/FormLayoutPreset";

const choiceFormatter = (fieldId, response, options) => {
  if (fieldId === 'asyncPublicHolidays') {
    const { data } = response || {};
    const formattedChoices = data.map((choiceDataItem, index) => {
      return { id: index, label: choiceDataItem.name };
    });

    return formattedChoices;
  }

  return defaultChoiceMapper(response, options);
}

function customValidations(configFormValidations) {
  console.log('configFormValidations', configFormValidations)
  return {
    ...configFormValidations,
    intTest: yupCurrency().required('Bacon is required'),
  }
}

const ConfigFormTester = () => {
  const formData = {
    email: 'duderino@gmail.com',
    moMoneyChild: 0,

  }

  const onSubmit = (data) => {
    console.log('onSubmit', data)
  }

  return (
    <ConfigForm formLayout={layout.layout} data={formData} parseOptions={{ choiceFormatter }}/*  addCustomValidations={customValidations} */>
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