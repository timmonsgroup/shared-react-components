import { 
    generateAnyFieldStoryDefaultExport, 
    AnyFieldStoryTemplate as Template, 
    standardSelectionAnyFieldArgs, 
    standardAnyFieldSelectionArgTypeConfiguration 
} from "../helpers/story-helpers/anyFieldStoryHelpers";


// ---------- Setup Default Export ----------


const anyFieldStoryDefaultExportOptions = {
    title: "Checkbox Fields",
    argTypes: standardAnyFieldSelectionArgTypeConfiguration
};

export default generateAnyFieldStoryDefaultExport(anyFieldStoryDefaultExportOptions);


// ---------- Configure Stories ----------


const standardCheckboxAnyFieldArgs = {
    ...standardSelectionAnyFieldArgs,
    helperText: "",
    multiple: true,
    checkbox: true,
};

export const CheckboxChoiceField = Template.bind({});
export const CheckboxObjectField = Template.bind({});

CheckboxChoiceField.args = {
    ...standardCheckboxAnyFieldArgs,
    type: 7,
};

CheckboxObjectField.args = {
    ...standardCheckboxAnyFieldArgs,
    type: 10,
};