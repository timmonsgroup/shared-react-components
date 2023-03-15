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
          {
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
            iconHelperText: 'Please select the Fire Department you are applying for funding on behalf of.',
            helperText:
              'When you select one of the options magic might happen',
            required: true,
            conditions: [
              {
                when: 'fireDepartment',
                isValid: true,
                then: {
                  helperText: 'The magic will die when you clear me!'
                }
              }
            ],
            disabled: false,
            // 'url': 'https://datausa.io/api/data?drilldowns=State&measures=dep'
            possibleChoices: [
              {
                name: 'BATTENS FD (Coffee County)',
                id: 7403,
                createdBy: null,
                lastModifiedBy: null,
                fdid: null,
                state: null,
                fireDepartmentType: {
                  id: 0,
                  name: 'Unknown',
                },
                region: null,
              },
              {
                name: 'Broomtown VFD (Cherokee County)',
                id: 7404,
                createdBy: null,
                lastModifiedBy: null,
                fdid: '1234',
                state: null,
                fireDepartmentType: {
                  id: 1,
                  name: 'Volunteer',
                },
                region: null,
              },
              {
                name: 'Cedar Bluff VFD (Cherokee County)',
                id: 7405,
                createdBy: null,
                lastModifiedBy: null,
                fdid: '5678',
                state: null,
                fireDepartmentType: {
                  id: 0,
                  name: 'Unknown',
                },
                region: null,
              },
              {
                name: 'Centre VFD (Cherokee County)',
                id: 7406,
                createdBy: null,
                lastModifiedBy: null,
                fdid: null,
                state: null,
                fireDepartmentType: {
                  id: 1,
                  name: 'Volunteer',
                },
                region: null,
              },
              {
                name: 'Cloudland VFD (Cherokee County)',
                id: 7407,
                createdBy: null,
                lastModifiedBy: null,
                fdid: null,
                state: null,
                fireDepartmentType: {
                  id: 0,
                  name: 'Unknown',
                },
                region: null,
              },
              {
                name: 'DUNCANVILLE VFD (Bibb County)',
                id: 7408,
                createdBy: null,
                lastModifiedBy: null,
                fdid: null,
                state: null,
                fireDepartmentType: {
                  id: 0,
                  name: 'Unknown',
                },
                region: null,
              },
              {
                name: 'Ellisville VFD (Calhoun County)',
                id: 7409,
                createdBy: null,
                lastModifiedBy: null,
                fdid: null,
                state: null,
                fireDepartmentType: {
                  id: 0,
                  name: 'Unknown',
                },
                region: null,
              },
              {
                name: 'FULLERS CROSSROADS FD (Crenshaw County)',
                id: 7410,
                createdBy: null,
                lastModifiedBy: null,
                fdid: null,
                state: null,
                fireDepartmentType: {
                  id: 0,
                  name: 'Unknown',
                },
                region: null,
              },
              {
                name: 'Gaylesville VFD (Cherokee County)',
                id: 7411,
                createdBy: null,
                lastModifiedBy: null,
                fdid: null,
                state: null,
                fireDepartmentType: {
                  id: 0,
                  name: 'Unknown',
                },
                region: null,
              },
              {
                name: 'Leesburg VFD (Cherokee County)',
                id: 7412,
                createdBy: null,
                lastModifiedBy: null,
                fdid: null,
                state: null,
                fireDepartmentType: {
                  id: 0,
                  name: 'Unknown',
                },
                region: null,
              },
              {
                name: 'McCords Crossroads VFD (Cherokee County)',
                id: 7413,
                createdBy: null,
                lastModifiedBy: null,
                fdid: null,
                state: null,
                fireDepartmentType: {
                  id: 0,
                  name: 'Unknown',
                },
                region: null,
              },
              {
                name: 'Mt. Weisner VFD (Calhoun County)',
                id: 7414,
                createdBy: null,
                lastModifiedBy: null,
                fdid: null,
                state: null,
                fireDepartmentType: {
                  id: 0,
                  name: 'Unknown',
                },
                region: null,
              },
              {
                name: 'Sand Rock VFD (Cherokee County)',
                id: 7415,
                createdBy: null,
                lastModifiedBy: null,
                fdid: null,
                state: null,
                fireDepartmentType: {
                  id: 0,
                  name: 'Unknown',
                },
                region: null,
              },
              {
                name: 'Spring Creek VFD (Cherokee County)',
                id: 7416,
                createdBy: null,
                lastModifiedBy: null,
                fdid: null,
                state: null,
                fireDepartmentType: {
                  id: 0,
                  name: 'Unknown',
                },
                region: null,
              },
              {
                name: 'Spring Garden VFD (Calhoun County)',
                id: 7417,
                createdBy: null,
                lastModifiedBy: null,
                fdid: null,
                state: null,
                fireDepartmentType: {
                  id: 0,
                  name: 'Unknown',
                },
                region: null,
              },
            ],
          },
          {
            'label': 'Requested Assistance Type(s)',
            'path': 'requested_assistance_types',
            'type': 7,
            'model': {
              'id': 14,
              'modelid': 10,
              'type': 7,
              'name': 'requested_assistance_types',
              'data': {
                'multi': true,
                'configLookupReference': 'grant_application:assistance_type'
              },
              'possibleChoices': [
                {
                  'id': 1,
                  'name': 'Communications'
                },
                {
                  'id': 2,
                  'name': 'Federal Property Conversion'
                },
                {
                  'id': 3,
                  'name': 'Inventoried Equipment'
                },
                {
                  'id': 4,
                  'name': 'PPE'
                },
                {
                  'id': 5,
                  'name': 'Tools & Supplies'
                },
                {
                  'id': 6,
                  'name': 'Training'
                }
              ]
            },
            'required': true,
            'disabled': false,
            'possibleChoices': [
              {
                'id': 1,
                'name': 'Communications'
              },
              {
                'id': 2,
                'name': 'Federal Property Conversion'
              },
              {
                'id': 3,
                'name': 'Inventoried Equipment'
              },
              {
                'id': 4,
                'name': 'PPE'
              },
              {
                'id': 5,
                'name': 'Tools & Supplies'
              },
              {
                'id': 6,
                'name': 'Training'
              }
            ],
            'multiple': true,
            'checkbox': true,
            'helperText': 'Check all that apply.',
            'iconHelperText': 'Indicate all types of assistance being requested. This may be different than what is approved for funding. Please enter this for all applications, to show program demand.'
          },
          {
            label: 'Another Field',
            path: 'anotherField',
            type: 10,
            model: {
              id: 5,
              modelid: 10,
              type: 2,
              name: 'anotherField',
              data: {}
            },
            placeholder: 'The typeahead will populate this field',
            iconHelperText: 'Please select the Fire Department you are applying for funding on behalf of.',
            helperText: 'When you select one of the options magic might happen',
            required: true,
            conditions: [
              {
                when: 'fireDepartment',
                isValid: true,
                then: {
                  url: 'https://dog-api.kinduff.com/api/facts?number=5'
                }
              }
            ],
            disabled: false
          },
          {
            label: 'Date Application Received',
            path: 'dateApplicationReceived',
            type: 5,
            readOnly: false,
            placeholder: 'This here is a date',
            defaultValue: 'today',
            iconHelperText:
              'TIP The date the application was received by the Wildfire Suite.',
            helperText:
              'The date the application was received by the Wildfire Suite.',
            model: {
              id: 6,
              modelid: 10,
              type: 5,
              name: 'dateApplicationReceived',
              data: {},
            },
            required: true,
            disabled: false,
          },
          {
            'label': 'Planned Federal Project Investment',
            'path': 'fedFundingItems', 'type': 120,
            'model': {
              'id': 19, 'modelid': 10, 'type': 120, 'name': 'fedFundingItems', 'data': {}
            },
            'required': false,
            'disabled': false,
            'conditions': [
              {
                'when': 'moMoney',
                'is': 100,
                'then': {
                  'hidden': false, 'required': true
                },
              },
            ],
            clusterColumnCount: 2,
            'hidden': true,
            'layout': [{
              'label': 'Federal Funding Source', 'path': 'fedFundingSource', 'type': 7,
              'model': {
                'id': 20, 'modelid': 10, 'type': 7, 'name': 'fedFundingSource',
                'data': {
                  'configLookupReference': 'grant_application:fed_funding_source'
                },
                'possibleChoices': [
                  { 'id': 0, 'name': '2023 - FS VFA' }, { 'id': 1, 'name': '2023 - DOI RFA' }, { 'id': 2, 'name': '2023 - BIL VFA' }, { 'id': 3, 'name': '2022 - FS VFA' }, { 'id': 5, 'name': '2022 - BIL VFA' }, { 'id': 6, 'name': '2021 - FS VFA' }, { 'id': 7, 'name': '2021 - DOI RFA' }, { 'id': 8, 'name': '2020 - FS VFA' }, { 'id': 9, 'name': '2020 - DOI RFA' }, { 'id': 10, 'name': '2019 - FS VFA' }, { 'id': 11, 'name': '2019 - DOI RFA' }
                ]
              },
              'required': true, 'disabled': false,
              'possibleChoices': [{ 'id': 0, 'name': '2023 - FS VFA' }, { 'id': 1, 'name': '2023 - DOI RFA' }, { 'id': 2, 'name': '2023 - BIL VFA' }, { 'id': 3, 'name': '2022 - FS VFA' }, { 'id': 5, 'name': '2022 - BIL VFA' }, { 'id': 6, 'name': '2021 - FS VFA' }, { 'id': 7, 'name': '2021 - DOI RFA' }, { 'id': 8, 'name': '2020 - FS VFA' }, { 'id': 9, 'name': '2020 - DOI RFA' }, { 'id': 10, 'name': '2019 - FS VFA' }, { 'id': 11, 'name': '2019 - DOI RFA' }], 'iconHelperText': "Funding source year is the federal fiscal year. NOTE: 'FS VFA' is funding from the regularly appropriated USDA Forest Service Consolidated Payments Grant (namely, Volunteer Fire Assistance in FY2019, Rural Fire Capacity for FY2020 & FY2021, and Volunteer Fire Capacity starting in FY2022). 'DOI RFA' is funding from the Department of Interior Rural Fire Assistance program, and 'BIL VFA' is funding from the Bipartisan Infrastructure Law program."
            }, { 'label': 'Planned Grant Amount', 'path': 'fedFundingAmount', 'type': 4, 'model': { 'id': 21, 'modelid': 10, 'type': 4, 'name': 'fedFundingAmount', 'data': { 'minValue': 0.01 } }, 'required': true, 'disabled': false, 'iconHelperText': 'Please enter the planned federal investment for the selected federal funding source. This amount may be different than actual reimbursements.' }]
          },
          {
            label: 'Cluster Field',
            path: 'amCluster',
            type: 120,
            helperText: 'I are a cluster field and I HELPED!!!',
            placeholder: 'A child of moMoney',
            hidden: true,
            addLabel: 'Add a pair',
            removeLabel: 'Remove a pair',
            solitary: true,
            model: {
              id: 8,
              modelid: 10,
              type: 120,
              name: 'amCluster',
            },
            minValue: 2.01,
            required: true,
            disabled: false,
            layout: [
              {
                label: 'Bob',
                path: 'bob',
                type: 4,
                helperText: 'Bob Helper',
                hidden: false,
                model: {
                  id: 8,
                  modelid: 10,
                  type: 4,
                  name: 'bob',
                },
                minValue: 2.01,
                required: true,
                disabled: false,
              },
              {
                label: 'Bob Two',
                path: 'bobTwo',
                type: 4,
                helperText: 'Bob Helper',
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
              }
            ]
          },
          {
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
          },
          {
            label: 'More Money',
            path: 'moMoney',
            type: 4,
            iconHelperText: 'Currency is moMoney.',
            helperText: 'I are current.',
            placeholder: "I don't know you",
            hidden: true,
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
                then: {
                  hidden: false,
                  minValue: 3.01,
                },
                when: 'fireDepartment',
                isValid: true,
              },
            ],
            required: true,
            disabled: false,
          },
          {
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
                is: '100',
              },
            ],
            required: true,
            disabled: false,
          },
        ],
      },
      {
        name: 'I\' another Section',
        description: 'I\'m a description',
        editable: true,
        enabled: true,
        order: 10,
        layout: [
          {
            label: 'Department Type 2',
            path: 'fdType2',
            type: 0,
            model: {
              id: 8,
              modelid: 10,
              type: 0,
              name: 'fdType2',
              data: {},
            },
            iconHelperText:
              'Please contact the Wildfire Suite Support for assistance updating the Department Type if missing or incorrect.',
            required: false,
            readOnly: true,
            hidden: true,
            conditions: [
              {
                then: {
                  renderPropertyId: 'fireDepartmentType.name',
                  hidden: false,
                },
                when: 'fireDepartment',
                isValid: true,
              },
            ],
          },
          {
            label: 'Department ID',
            path: 'departmentId',
            type: 0,
            model: {
              id: 7,
              modelid: 10,
              type: 0,
              name: 'departmentId',
              data: {},
            },
            required: false,
            readOnly: true,
            placeholder: 'But why?',
            hidden: true,
            conditions: [
              {
                then: {
                  renderPropertyId: 'fdid',
                  hidden: false,
                },
                when: 'fireDepartment',
                isValid: true,
              },
            ],
          },
        ],
      },
    ],
  },
};