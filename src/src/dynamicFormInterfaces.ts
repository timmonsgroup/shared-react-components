//data for configuring dynamic form:

interface dynamicFormData {
    sections: dynamicFormSection[]
}

interface dynamicFormSection {
    layout: fieldObject[],
    editable: boolean,
    enabled: boolean,
    fields: fieldId[]
}

type fieldId = number //Maybe? It's the id to look up a field in the field map. Also called a path

interface fieldObject {
    label: string,
    type: number,
    model: fieldModel,
    hidden: boolean,
    conditions: condition[],
    linkFormat: string,
    required: boolean,
    readonly: boolean,
    disabled: boolean,
    helperText: string,
    requiredErrorText: string,
    multiple: boolean,
    checkbox: boolean,
    possibleChoices?: choiceObject[],
    url?: string
    integerDigits?: number,
    fractionalDigits?: number,
    maxValue?: number,
    maxLength?: number,
    minLength?: number
}

interface fieldModel {
    name: string,
    id: number,
    data: object,
    integerDigits?: number,
    fractionalDigits?: number,
    maxValue?: number,
    maxLength?: number,
    minLength?: number,
    required?: boolean
}

interface choiceObject {
    name: string,
    id: string
}

interface condition {
    when: fieldId, // This is the id of a trigger field
    is: number | boolean | string, // when the fieldId in when is this value, then the then validations happen
    then: fieldId[], // an array of validations to run
    isValid: boolean
}