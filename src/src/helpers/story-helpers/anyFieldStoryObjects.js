// An example of what a fully setup layout object looks like with default values.
// This would get fed into the parseFormLayout function in useFormLayout.js to generate a parsed layout.
// This is currently loaded into the loadArgsAndGetFieldRender function in anyFieldStoryHelpers.js as a base to build off of
// but that function would likely still fill its purpose loading up a new empty object. Still, it took a while to put this together
// and I thought it might still be helpful to look at as a reference, at least until it becomes outdated. -EGS 1/24/23
export const defaultLayout = {
    sections: [{
        layout: [{ //Layout is an array of fields
            label: "default Label",
            type: 0,
            model: {
                name: "DefaultModelName",
                id: 1,
                data: {}
            },
            hidden: false,
            conditions: [],
            linkFormat: {},
            required: true,
            readOnly: false,
            disabled: false,
            helperText: "default Helper Text",
            requiredErrorText: "default Required Error Text",
            multiple: false,
            checkbox: false,
            possibleChoices: [
                {
                    name: "default Choice 1",
                    id: 1
                },
                {
                    name: "default Choice 2",
                    id:2
                }
            ],
            url: "",
            path: "defaultPath"
        }],
        editable: false,
        enabled: true,
        name: "default"
        // Add properties with keys that match the values of the VALIDATION constants to object to have them loaded into validationMap for this field.
    }]
};

// An example object showing what an arg object would look like if you set every potential arg that would affect what parseFormLayout
// from useFormLayout.js would generate. - EGS 1/24/23
export const fullDefaultArgs = {
    label: "Default label",
    type: 0,
    modelName: "Default model name",
    modelId: 1,
    modelData: {},
    hidden: false,
    conditions: [],
    linkFormat: {},
    required: false,
    readOnly: false,
    disabled: false,
    helperText: "default helper text",
    requiredErrorText: "default required error text",
    multiple: false,
    checkbox: false,
    possibleChoices: [
        {
            name: "default Choice 1",
            id: 1
        },
        {
            name: "default Choice 2",
            id:2
        }
    ],
    url: "",
    path: "",
    editable: true,
    enabled: true,
    sectionName: "Default section name"
};

// Just an example of what a field.render object looks like for reference - EGS 1/24/23
// render: {
//     type: type,
//     label,
//     name,
//     hidden,
//     required,
//     disabled,
//     helperText: field.helperText,
//     requiredErrorText: field.requiredErrorText,
//     readOnly,
//     linkFormat,
// }