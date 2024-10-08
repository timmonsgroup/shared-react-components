import theTheme from '@timmons-group/shared-react-components/muiTheme';
import { FIRE_DEPTS } from './LargeDataset';
import { FIELD_TYPES } from '@timmons-group/config-form';
import { max } from 'date-fns';
const FUNDING_SOURCES = [
  {
    id: 0,
    name: '2023 - FS VFA',
  },
  {
    id: 1,
    name: '2023 - DOI RFA',
  },
  {
    id: 2,
    name: '2023 - BIL VFA',
  },
  {
    id: 3,
    name: '2022 - FS VFA',
  },
  {
    id: 5,
    name: '2022 - BIL VFA',
  },
  {
    id: 6,
    name: '2021 - FS VFA',
  },
  {
    id: 7,
    name: '2021 - DOI RFA',
  },
  {
    id: 8,
    name: '2020 - FS VFA',
  },
  {
    id: 9,
    name: '2020 - DOI RFA',
  },
  {
    id: 10,
    name: '2019 - FS VFA',
  },
  {
    id: 11,
    name: '2019 - DOI RFA',
  },
];

export const createTextModel = (
  name,
  label,
  required = false,
  otherThings = {},
  dataThings = {}
) => ({
  label,
  path: name,
  type: 0,
  model: {
    name,
    id: 5,
    modelid: 10,
    type: 0,
    data: dataThings,
  },
  required,
  ...otherThings,
});

export const createLongTextModel = (
  name,
  label,
  required = false,
  otherThings = {},
  dataThings = {}
) => ({
  label,
  path: name,
  type: 1,
  model: {
    name,
    id: 5,
    modelid: 10,
    type: 1,
    data: dataThings,
  },
  required,
  ...otherThings,
});

const emailField = createTextModel('email', 'Email', true, {
  placeholder: 'Please enter your email address',
  altHelperText: 'I GO ELSEWHERE!',
  email: true,
  helperText: 'I am an email field!',
  // conditions: [
  //   {
  //     when: 'fireDepartment',
  //     isValid: true,
  //     then: {
  //       helperText: 'I am no longer an email field!',
  //       email: false,
  //     }
  //   }
  // ],
});

const customRegexField = createTextModel(
  'customRegexFieldID',
  'Custom Regex Field ID',
  true,
  {
    placeholder: 'This field needs to match this patten: "/^[a-z0-9]+$/i"',
    helperText: 'I match the regex! /^[a-z0-9]+$/i',
    regexpValidation: {
      pattern: '^[a-z0-9]+$',
      flags: 'i',
      errorMessage:
        'Please enter a value that only contains alphanumeric characters',
    },
    // conditions: [
    //   {
    //     when: 'fireDepartment',
    //     isValid: true,
    //     then: {
    //       helperText: 'I am no longer an email field!',
    //       email: false,
    //     }
    //   }
    // ],
  }
);

const zipField = createTextModel('zipCode', 'Zippity', true, {
  zip: true,
});

const phoneField = createTextModel('phone', 'Phone Number', true, {
  phone: true,
});

const longText = createLongTextModel('longText', 'Long Text', true, {
  placeholder: 'Please enter a long text',
  altHelperText: 'I GO ELSEWHERE!',
  helperText: 'I am a long text field!',
  enforceTrim: true,
  noTrim: false,
  maxLength: 10,
  conditions: [
    {
      when: {
        fieldId: 'email',
        operation: 'eq',
        value: 'money@gmail.com'
      },
      then: {
        noTrim: true,
        // enforceTrim: false,
      }
    },
  ]
});

const fireDepartmentField = {
  label: 'Fire Department',
  path: 'fireDepartment',
  type: 10,
  model: {
    id: 5,
    modelid: 10,
    type: 2,
    name: 'fireDepartment',
    data: {},
  },
  placeholder: 'The typeahead will populate this field',
  altHelperText: 'I GO ELSEWHERE!',
  iconHelperText:
    'Please select the Fire Department you are applying for funding on behalf of.',
  helperText:
    'When you select one of the options magic might happen. Like random dog facts or something. Somewhere. Maybe.',
  required: true,
  conditions: [
    {
      when: 'fireDepartment',
      isValid: true,
      then: {
        helperText: 'The magic will die when you clear me!',
      },
    },
  ],
  disabled: false,
  // 'url': 'https://datausa.io/api/data?drilldowns=State&measures=dep'
  possibleChoices: FIRE_DEPTS,
};

const clusterField = {
  label: 'Invoice Items',
  path: 'amCluster',
  type: 120,
  helperText: 'Add items and amounts',
  addLabel: 'Add an item',
  removeLabel: 'Remove an item',
  solitary: true,
  inline: true,
  model: {
    id: 8,
    modelid: 10,
    type: 120,
    name: 'amCluster',
  },
  minValue: 2.01,
  required: true,
  disabled: false,
  hidden: true,
  conditions: [
    {
      then: {
        hidden: false,
      },
      when: 'moMoney',
      is: 100,
    },
  ],
  layout: [
    {
      label: 'Description',
      path: 'bob',
      type: 0,
      hidden: false,
      model: {
        id: 8,
        modelid: 10,
        type: 4,
        name: 'bob',
      },
      // minValue: 2.01,
      required: true,
      disabled: false,
    },
    {
      label: 'Amount',
      path: 'bobTwo',
      type: 4,
      hidden: false,
      model: {
        id: 8,
        modelid: 10,
        type: 4,
        name: 'bobTwo',
      },
      minValue: 2.01,
      required: true,
      disabled: false,
    },
  ],
};

const checkboxes = {
  label: 'Requested Assistance Type(s)',
  path: 'requested_assistance_types',
  type: 7,
  model: {
    id: 14,
    modelid: 10,
    type: 7,
    name: 'requested_assistance_types',
    data: {
      multi: true,
      configLookupReference: 'grant_application:assistance_type',
    },
    possibleChoices: [
      {
        id: 1,
        name: 'Communications',
      },
      {
        id: 2,
        name: 'Federal Property Conversion',
      },
      {
        id: 3,
        name: 'Inventoried Equipment',
      },
      {
        id: 4,
        name: 'PPE',
      },
      {
        id: 5,
        name: 'Tools & Supplies',
      },
      {
        id: 6,
        name: 'Training',
      },
    ],
  },
  required: true,
  disabled: false,
  possibleChoices: [
    {
      id: 1,
      name: 'Communications',
    },
    {
      id: 2,
      name: 'Federal Property Conversion',
    },
    {
      id: 3,
      name: 'Inventoried Equipment',
    },
    {
      id: 4,
      name: 'PPE',
    },
    {
      id: 5,
      name: 'Tools & Supplies',
    },
    {
      id: 6,
      name: 'Training',
    },
  ],
  multiple: true,
  checkbox: true,
  helperText: 'Check all that apply.',
  altHelperText: 'I am under the checkboxes.',
  iconHelperText:
    'Indicate all types of assistance being requested. This may be different than what is approved for funding. Please enter this for all applications, to show program demand.',
};

const anotherCluster = {
  label: 'Planned Federal Project Investment',
  path: 'fedFundingItems',
  type: 120,
  model: {
    id: 19,
    modelid: 10,
    type: 120,
    name: 'fedFundingItems',
    data: {},
  },
  required: true,
  disabled: false,
  inline: true,
  clusterColumnCount: 2,
  emptyMessage: 'No items added yet.',
  hidden: false,
  // 'conditions': [
  //   {
  //     'is': 4,
  //     'then': {
  //       'hidden': false,
  //       'required': true
  //     },
  //     'when': 'moMoney'
  //   },
  //   {
  //     'is': '50',
  //     'then': {
  //       'hidden': false,
  //       'required': true
  //     },
  //     'when': 'moMoney'
  //   }
  // ],
  helperText:
    'Please indicate the planned federal funding source and ($) amount at time of approval. Actual reimbursement to FD may be different.',
  layout: [
    {
      label: 'Federal Funding Source',
      path: 'fedFundingSource',
      type: 7,
      model: {
        id: 20,
        modelid: 10,
        type: 7,
        name: 'fedFundingSource',
      },
      required: true,
      disabled: false,
      possibleChoices: FUNDING_SOURCES,
      // helperText: 'I am a helper text',
      iconHelperText:
        "Funding source year is the federal fiscal year. NOTE: 'FS VFA' is funding from the regularly appropriated USDA Forest Service Consolidated Payments Grant (namely, Volunteer Fire Assistance in FY2019, Rural Fire Capacity for FY2020 & FY2021, and Volunteer Fire Capacity starting in FY2022). 'DOI RFA' is funding from the Department of Interior Rural Fire Assistance program, and 'BIL VFA' is funding from the Bipartisan Infrastructure Law program.",
    },
    createTextModel(
      'fedFundingYear',
      'Funding Source Year',
      2,
      true,
      'Please enter the federal fiscal year for the selected federal funding source. This may be different than the actual reimbursement year.'
    ),
    createTextModel(
      'fedFundingBacon',
      'Funding Source Year',
      2,
      true,
      'Please enter the federal fiscal year for the selected federal funding source. This may be different than the actual reimbursement year.'
    ),
    // checkboxes,
    {
      label: 'Planned Grant Amount',
      path: 'fedFundingAmount',
      type: 4,
      model: {
        id: 21,
        modelid: 10,
        type: 4,
        name: 'fedFundingAmount',
        data: {
          minValue: 0.01,
        },
      },
      // altHelperText: 'I am a helper text',
      required: true,
      disabled: false,
      iconHelperText:
        'Please enter the planned federal investment for the selected federal funding source. This amount may be different than actual reimbursements.',
    },
  ],
};

const integerField = {
  label: 'Integer Field',
  path: 'intTest',
  type: 2,
  solitary: true,
  singleColumnSize: 6,
  iconHelperText: 'Interger is intTest.',
  helperText: 'I are current.',
  placeholder: 'I was once a float like you',
  minValue: 1.01,
  maxValue: 100,
  model: {
    id: 8,
    modelid: 10,
    type: 2,
    name: 'intTest',
    data: {},
  },
  required: true,
  disabled: false,
};

const moneyField = {
  label: 'More Money',
  path: 'moMoney',
  type: 4,
  iconHelperText: 'Currency is moMoney.',
  helperText: 'I are current.',
  placeholder: "I don't know you",
  // hidden: true,
  model: {
    data: {
      minValue: 1.01,
    },
    id: 8,
    modelid: 10,
    type: 4,
    name: 'moMoney',
  },
  minValue: 2.01,
  conditions: [
    {
      when: {
        fieldId: 'email',
        operation: 'neq',
        value: 'money@gmail.com'
      },
      then: {
        hidden: false,
        minValue: 3.01,
        required: false,
      }
    },
    {
      when: 'someOtherField',
      is: '102',
      then: {
        hidden: false,
        minValue: 102,
        required: false,
      },
    },
  ],
  required: true,
  disabled: false,
};

const moneyChild = {
  label: 'More Money Child',
  path: 'moMoneyChild',
  type: 4,
  helperText: 'I are child.',
  placeholder: 'A child of moMoney',
  hidden: true,
  model: {
    data: {
      minValue: 1.01,
    },
    id: 8,
    modelid: 10,
    type: 4,
    name: 'moMoneyChild',
  },
  minValue: 2.01,
  conditions: [
    {
      then: {
        hidden: false,
        minValue: 3.01,
      },
      when: 'moMoney',
      is: 100,
      required: true,
    },
  ],
  required: false,
  disabled: false,
};

const asyncTypeahead = {
  label: 'Public Holidays',
  path: 'asyncPublicHolidays',
  type: 10,
  model: {
    id: 5,
    modelid: 10,
    type: 2,
    name: 'asyncPublicHolidays',
    data: {},
  },
  url: 'https://date.nager.at/api/v2/publicholidays/2020/US',
  placeholder: 'Using the URL to populate this field',
  // iconHelperText:
  //   'Please select the Fire Department you are applying for funding on behalf of.',
  // helperText:
  //   'You need to pick a fire department before I can hydrate this field.',
  // required: true,
  // conditions: [
  //   {
  //     when: 'fireDepartment',
  //     isValid: true,
  //     then: {
  //       helperText: "I'm so glad you picked a fire department!",
  //       url: 'https://dog-api.kinduff.com/api/facts?number=5',
  //     },
  //   },
  // ],
  disabled: false,
};

const dateField = {
  label: 'Date Application Received',
  path: 'dateApplicationReceived',
  type: 5,
  readOnly: false,
  placeholder: 'This here is a date',
  defaultValue: 'today',
  altHelperText: 'I am under the date picker label',
  iconHelperText:
    'TIP The date the application was received by the Wildfire Suite.',
  helperText: 'The date the application was received by the Wildfire Suite.',
  model: {
    id: 6,
    modelid: 10,
    type: 5,
    name: 'dateApplicationReceived',
    data: {},
  },
  required: true,
  disabled: false,
  maxValue: '9/26/2024',
  // disableFuture: true,
  disableFutureErrorText:
    'This error text appears when the date picker fails its disable future validation ${max}',
};

const virginiaCities = {
  label: 'Cities',
  placeholder: 'Select a city',
  path: 'virginiaCities',
  type: 10,
  model: {
    id: 5,
    modelid: 10,
    type: 10,
    name: 'virginiaCities',
  },
  possibleChoices: [
    {
      name: 'Richmond',
      id: 'richmond',
    },
    {
      name: 'Charlottesville',
      id: 'charlottesville',
    },
    {
      name: 'Roanoke',
      id: 'roanoke',
    },
    {
      name: 'Blacksburg',
      id: 'blacksburg',
    },
    {
      name: 'Lynchburg',
      id: 'lynchburg',
    },
    {
      name: 'Staunton',
      id: 'staunton',
    },
    {
      name: 'Harrisonburg',
      id: 'harrisonburg',
    }
  ],
  required: false
}

const conditionalUrlField = {
  "label": "Groups",
  "path": "groups",
  "type": FIELD_TYPES.OBJECT,
  "model": {
    "id": 2,
    "modelid": 30,
    "type": FIELD_TYPES.OBJECT,
    "name": "groups",
    "data": {
      "useId": true,
      // "multiple": true,
      "objectTypeId": 20
    }
  },
  "required": true,
  "disabled": true,
  "hidden": false,
  "conditions": [
    // {
    //   "then": {
    //     "url": "https://api.openbrewerydb.org/v1/breweries?by_city=##thevalue##&per_page=10",
    //     "disabled": false,
    //     "required": true
    //   },
    //   "when": "virginiaCities",
    //   "isValid": true
    // }
    {
      when: {
        fieldId: 'virginiaCities',
        operation: 'isNotNull',
      },
      then: {
        url: 'https://api.openbrewerydb.org/v1/breweries?by_city=##thevalue##&per_page=10',
        disabled: false,
        required: true
      }
    }
  ]
}

export const POTENTIAL_CHANGES_NEEDED_PICKLIST_VALUES = Object.freeze({
  YES: 7,
  NO: 8
})

export const layoutWithNumericValues = {
  layout: {
    data: {
      create: '/api/grantApplication/new',
    },
    id: 2,
    modelId: 10,
    enabled: true,
    name: 'FD Grant Application',
    editable: true,
    layoutKey: 'new_fd',
    type: 1,

    sections: [
      {
        editable: true,
        enabled: true,
        name: 'Section One',
        order: 10,
        layout: [
          {
            label: ' ',
            path: 'needsPotentialChanges',
            type: FIELD_TYPES.CHOICE,
            model: {
              name: 'needsPotentialChanges',
              id: 5,
              modelid: 10,
              type: FIELD_TYPES.CHOICE,
            },
            possibleChoices: [
              { id: POTENTIAL_CHANGES_NEEDED_PICKLIST_VALUES.YES, name: 'Yes' },
              { id: POTENTIAL_CHANGES_NEEDED_PICKLIST_VALUES.NO, name: 'No' }
            ],
          },
          {
            label: 'New Format',
            path: 'newFormat',
            type: FIELD_TYPES.LONG_TEXT,
            model: {
              name: 'newFormat',
              id: 5,
              modelid: 10,
              type: FIELD_TYPES.LONG_TEXT,
            },
            required: false,
            hidden: true,
            minLength: 10,
            maxLength: 2000,
            conditions: [
              {
                when: 'someOtherField',
                is: 7,
                then: {
                  required: true,
                  hidden: false
                }
              },
              {
                when: {
                  fieldId: 'someOtherField',
                  operation: 'eq',
                  value: 7
                },
                then: {
                  required: true,
                  hidden: false
                }
              }
            ],
          }
        ],
      },
    ],
  },
};

export const layout = {
  layout: {
    data: {
      create: '/api/grantApplication/new',
    },
    id: 2,
    modelId: 10,
    enabled: true,
    name: 'FD Grant Application',
    editable: true,
    layoutKey: 'new_fd',
    type: 1,
    sections: [
      {
        editable: true,
        enabled: true,
        name: 'Section One',
        order: 10,
        layout: [
          dateField,
          longText,
          moneyChild,
          emailField,
          moneyField,
          asyncTypeahead,
          integerField,
          virginiaCities,
          conditionalUrlField,
        ],
      },
      // {
      //   name: "I' another Section",
      //   description: "I'm a description",
      //   editable: true,
      //   enabled: true,
      //   order: 10,
      //   layout: [
      //     {
      //       label: 'Department Type 2',
      //       path: 'fdType2',
      //       type: 0,
      //       model: {
      //         id: 8,
      //         modelid: 10,
      //         type: 0,
      //         name: 'fdType2',
      //         data: {},
      //       },
      //       iconHelperText:
      //         'Please contact the Wildfire Suite Support for assistance updating the Department Type if missing or incorrect.',
      //       required: false,
      //       readOnly: true,
      //       hidden: true,
      //       conditions: [
      //         {
      //           then: {
      //             renderPropertyId: 'fireDepartmentType.name',
      //             hidden: false,
      //           },
      //           when: 'fireDepartment',
      //           isValid: true,
      //         },
      //       ],
      //     },
      //     {
      //       label: 'Department ID',
      //       path: 'departmentId',
      //       type: 0,
      //       model: {
      //         id: 7,
      //         modelid: 10,
      //         type: 0,
      //         name: 'departmentId',
      //         data: {},
      //       },
      //       required: false,
      //       readOnly: true,
      //       placeholder: 'But why?',
      //       hidden: true,
      //       conditions: [
      //         {
      //           then: {
      //             renderPropertyId: 'fdid',
      //             hidden: false,
      //           },
      //           when: 'fireDepartment',
      //           isValid: true,
      //         },
      //       ],
      //     },
      //     {
      //       label: 'Cluster Must Validate',
      //       path: 'validateCluster',
      //       type: 0,
      //       model: {
      //         id: 7,
      //         modelid: 10,
      //         type: 0,
      //         name: 'validateCluster',
      //         data: {},
      //       },
      //       required: false,
      //       hidden: true,
      //       conditions: [
      //         {
      //           then: {
      //             hidden: false,
      //             helperText: 'You have at least one cluster. I appear',
      //           },
      //           when: 'amCluster',
      //           isValid: true,
      //         },
      //       ],
      //     },
      //   ],
      // },
    ],
  },
};

export const viewLayout = {
  layout: {
    id: 2,
    modelId: 10,
    enabled: true,
    name: 'FD Grant Application',
    editable: true,
    layoutKey: 'view_fd',
    type: 'whateverViewTypeIs',
    sections: [
      {
        enabled: true,
        name: 'No columns or rows',
        order: 10,
        layout: [emailField, zipField, phoneField, fireDepartmentField],
      },
      {
        enabled: true,
        columns: false,
        name: 'Section with Rows',
        order: 10,
        layout: [
          [emailField, zipField],

          [phoneField, fireDepartmentField],
        ],
      },
    ],
  },
};

export const inlineFormLayout = {
  layout: {
    data: {
      create: '/api/grantApplication/new',
    },
    id: 2,
    modelId: 10,
    enabled: true,
    name: 'Inline Form Layout Name',
    editable: true,
    layoutKey: 'ALLSAMPLEFILTER',
    type: 1,
    sections: [
      {
        name: '',
        editable: true,
        enabled: true,
        layout: [
          {
            label: 'Surveillance Season',
            path: 'season',
            type: 7,
            listName: 'HUNT_SEASON',
            required: true,
            requiredErrorText: 'Please select a season',
            model: {
              name: 'season',
            },
            possibleChoices: [
              {
                id: '2024',
                name: '2024-2025',
              },
              {
                id: '2023',
                name: '2023-2024',
              },
              {
                id: '2022',
                name: '2022-2023',
              },
              {
                id: '2021',
                name: '2021-2022',
              },
              {
                id: '2020',
                name: '2020-2021',
              },
              {
                id: '2019',
                name: '2019-2020',
              },
            ],
          },
          {
            label: 'Hunter First Name',
            path: 'hunterFirstName',
            type: 0,
            required: false,
            maxLength: 25,
            model: {
              name: 'hunterFirstName',
            },
          },
          {
            label: 'Hunter Last Name',
            path: 'hunterLastName',
            type: 0,
            required: false,
            maxLength: 25,
            model: {
              name: 'hunterLastName',
            },
          },
        ],
      },
    ],
  },
};
