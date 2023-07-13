export const VIEW_PRESET = {
  "layoutKey": "details",
  "sections": [
    {
      "editable": true,
      "enabled": true,
      "name": "Encumbrance Summary",
      "description": null,
      "order": 1,
      "columns": true,
      "layout": [
        [
          {
            type: 'component',
            component: 'EncumbranceDetailMap',
          }
        ],
        [
          {
            type: 'header',
            text: 'Encumbrance Details',
          },
          {
            "label": "Permit Number",
            "path": "encumbranceId",
            "type": 0,
            "model": {
              "id": 23,
              "modelid": 2,
              "type": 0,
              "name": "encumbranceId",
              "data": {
                "maxLength": 10,
                "minLength": 9
              }
            },
            "required": false,
            "disabled": false,
            "width": 100,
            "flex": 1
          },
          {
            "label": "Legacy ID",
            "path": "legacyId",
            "type": 0,
            "model": {
              "id": 11,
              "modelid": 2,
              "type": 0,
              "name": "legacyId",
              "data": {
                "maxLength": 50,
                "minLength": 1
              }
            },
            "required": false,
            "disabled": false,
            "width": 100,
            "flex": 1
          },
          {
            "label": "Legal Name",
            "path": "legalName",
            "type": 0,
            "model": {
              "id": 12,
              "modelid": 2,
              "type": 0,
              "name": "legalName",
              "data": {
                "maxLength": 50,
                "minLength": 1
              }
            },
            "required": false,
            "disabled": false,
            "width": 100,
            "flex": 1
          },
          {
            "label": "Sovereign Lands Bodies",
            "path": "sovereignLandsBodies",
            "type": 10,
            "model": {
              "id": 6,
              "modelid": 2,
              "type": 10,
              "name": "sovereignLandsBodies",
              "data": {
                "dynamic": true,
                "multiple": true,
                "objectTypeId": 1
              },
              "possibleChoices": []
            },
            "required": false,
            "disabled": false,
            "width": 100,
            "flex": 1,
            "linkFormat": "encumbrances/{id}"
          },
          {
            "label": "Description",
            "path": "description",
            "type": 1,
            "model": {
              "id": 13,
              "modelid": 2,
              "type": 1,
              "name": "description",
              "data": {
                "maxLength": 250,
                "minLength": 1
              }
            },
            "required": false,
            "disabled": false,
            "width": 100,
            "flex": 1
          },
          {
            "label": "Management Units",
            "path": "managementUnits",
            "type": 1,
            "model": {
              "id": 14,
              "modelid": 2,
              "type": 1,
              "name": "managementUnits",
              "data": {
                "maxLength": 250,
                "minLength": 1
              }
            },
            "required": false,
            "disabled": false,
            "width": 100,
            "flex": 1
          },
          {
            "label": "Commencement",
            "path": "commencement",
            "type": 5,
            "model": {
              "id": 7,
              "modelid": 2,
              "type": 5,
              "name": "commencement",
              "data": null
            },
            "required": false,
            "disabled": false,
            "width": 100,
            "flex": 1
          },
          {
            "label": "Expiration",
            "path": "expiration",
            "type": 5,
            "model": {
              "id": 8,
              "modelid": 2,
              "type": 5,
              "name": "expiration",
              "data": null
            },
            "required": false,
            "disabled": false,
            "width": 100,
            "flex": 1
          },
          {
            "label": "Original Commencement",
            "path": "originalCommencement",
            "type": 5,
            "model": {
              "id": 9,
              "modelid": 2,
              "type": 5,
              "name": "originalCommencement",
              "data": null
            },
            "required": false,
            "disabled": false,
            "width": 100,
            "flex": 1
          },
          {
            "label": "Original Expiration",
            "path": "originalExpiration",
            "type": 5,
            "model": {
              "id": 10,
              "modelid": 2,
              "type": 5,
              "name": "originalExpiration",
              "data": null
            },
            "required": false,
            "disabled": false,
            "width": 100,
            "flex": 1
          },
          {
            "label": "Street",
            "path": "street",
            "type": 0,
            "model": {
              "id": 15,
              "modelid": 2,
              "type": 0,
              "name": "street",
              "data": {
                "maxLength": 50,
                "minLength": 1
              }
            },
            "required": false,
            "disabled": false,
            "width": 100,
            "flex": 1
          },
          {
            "label": "City",
            "path": "city",
            "type": 0,
            "model": {
              "id": 16,
              "modelid": 2,
              "type": 0,
              "name": "city",
              "data": {
                "maxLength": 50,
                "minLength": 1
              }
            },
            "required": false,
            "disabled": false,
            "width": 100,
            "flex": 1
          },
          {
            "label": "State",
            "path": "state",
            "type": 7,
            "model": {
              "id": 17,
              "modelid": 2,
              "type": 7,
              "name": "state",
              "data": {
                "configLookupReference": "encumbrance:state"
              },
              "possibleChoices": [
                {
                  "id": 1,
                  "name": "Alabama"
                },
                {
                  "id": 2,
                  "name": "Alaska"
                },
                {
                  "id": 3,
                  "name": "Arizona"
                },
                {
                  "id": 4,
                  "name": "Arkansas"
                },
                {
                  "id": 5,
                  "name": "California"
                },
                {
                  "id": 6,
                  "name": "Colorado"
                },
                {
                  "id": 7,
                  "name": "Connecticut"
                },
                {
                  "id": 8,
                  "name": "Delaware"
                },
                {
                  "id": 9,
                  "name": "Florida"
                },
                {
                  "id": 10,
                  "name": "Georgia"
                },
                {
                  "id": 11,
                  "name": "Hawaii"
                },
                {
                  "id": 12,
                  "name": "Idaho"
                },
                {
                  "id": 13,
                  "name": "Illinois"
                },
                {
                  "id": 14,
                  "name": "Indiana"
                },
                {
                  "id": 15,
                  "name": "Iowa"
                },
                {
                  "id": 16,
                  "name": "Kansas"
                },
                {
                  "id": 17,
                  "name": "Kentucky"
                },
                {
                  "id": 18,
                  "name": "Louisiana"
                },
                {
                  "id": 19,
                  "name": "Maine"
                },
                {
                  "id": 20,
                  "name": "Maryland"
                },
                {
                  "id": 56,
                  "name": "Massachusetts"
                },
                {
                  "id": 21,
                  "name": "Michigan"
                },
                {
                  "id": 22,
                  "name": "Minnesota"
                },
                {
                  "id": 23,
                  "name": "Mississippi"
                },
                {
                  "id": 24,
                  "name": "Missouri"
                },
                {
                  "id": 25,
                  "name": "Montana"
                },
                {
                  "id": 26,
                  "name": "Nebraska"
                },
                {
                  "id": 27,
                  "name": "Nevada"
                },
                {
                  "id": 28,
                  "name": "New Hampshire"
                },
                {
                  "id": 29,
                  "name": "New Jersey"
                },
                {
                  "id": 30,
                  "name": "New Mexico"
                },
                {
                  "id": 31,
                  "name": "New York"
                },
                {
                  "id": 32,
                  "name": "North Carolina"
                },
                {
                  "id": 33,
                  "name": "North Dakota"
                },
                {
                  "id": 34,
                  "name": "Ohio"
                },
                {
                  "id": 35,
                  "name": "Oklahoma"
                },
                {
                  "id": 36,
                  "name": "Oregon"
                },
                {
                  "id": 37,
                  "name": "Pennsylvania"
                },
                {
                  "id": 38,
                  "name": "Rhode Island"
                },
                {
                  "id": 39,
                  "name": "South Carolina"
                },
                {
                  "id": 40,
                  "name": "South Dakota"
                },
                {
                  "id": 41,
                  "name": "Tennessee"
                },
                {
                  "id": 42,
                  "name": "Texas"
                },
                {
                  "id": 43,
                  "name": "Utah"
                },
                {
                  "id": 44,
                  "name": "Vermont"
                },
                {
                  "id": 45,
                  "name": "Virginia"
                },
                {
                  "id": 46,
                  "name": "Washington"
                },
                {
                  "id": 47,
                  "name": "West Virginia"
                },
                {
                  "id": 48,
                  "name": "Wisconsin"
                },
                {
                  "id": 49,
                  "name": "Wyoming"
                },
                {
                  "id": 50,
                  "name": "District of Columbia"
                },
                {
                  "id": 51,
                  "name": "American Samoa"
                },
                {
                  "id": 52,
                  "name": "Guam"
                },
                {
                  "id": 53,
                  "name": "Northern Mariana Islands"
                },
                {
                  "id": 54,
                  "name": "Puerto Rico"
                },
                {
                  "id": 55,
                  "name": "U.S. Virgin Islands"
                },
                {
                  "id": 0,
                  "name": "Unknown"
                }
              ]
            },
            "required": false,
            "disabled": false,
            "possibleChoices": [
              {
                "id": 1,
                "name": "Alabama"
              },
              {
                "id": 2,
                "name": "Alaska"
              },
              {
                "id": 3,
                "name": "Arizona"
              },
              {
                "id": 4,
                "name": "Arkansas"
              },
              {
                "id": 5,
                "name": "California"
              },
              {
                "id": 6,
                "name": "Colorado"
              },
              {
                "id": 7,
                "name": "Connecticut"
              },
              {
                "id": 8,
                "name": "Delaware"
              },
              {
                "id": 9,
                "name": "Florida"
              },
              {
                "id": 10,
                "name": "Georgia"
              },
              {
                "id": 11,
                "name": "Hawaii"
              },
              {
                "id": 12,
                "name": "Idaho"
              },
              {
                "id": 13,
                "name": "Illinois"
              },
              {
                "id": 14,
                "name": "Indiana"
              },
              {
                "id": 15,
                "name": "Iowa"
              },
              {
                "id": 16,
                "name": "Kansas"
              },
              {
                "id": 17,
                "name": "Kentucky"
              },
              {
                "id": 18,
                "name": "Louisiana"
              },
              {
                "id": 19,
                "name": "Maine"
              },
              {
                "id": 20,
                "name": "Maryland"
              },
              {
                "id": 56,
                "name": "Massachusetts"
              },
              {
                "id": 21,
                "name": "Michigan"
              },
              {
                "id": 22,
                "name": "Minnesota"
              },
              {
                "id": 23,
                "name": "Mississippi"
              },
              {
                "id": 24,
                "name": "Missouri"
              },
              {
                "id": 25,
                "name": "Montana"
              },
              {
                "id": 26,
                "name": "Nebraska"
              },
              {
                "id": 27,
                "name": "Nevada"
              },
              {
                "id": 28,
                "name": "New Hampshire"
              },
              {
                "id": 29,
                "name": "New Jersey"
              },
              {
                "id": 30,
                "name": "New Mexico"
              },
              {
                "id": 31,
                "name": "New York"
              },
              {
                "id": 32,
                "name": "North Carolina"
              },
              {
                "id": 33,
                "name": "North Dakota"
              },
              {
                "id": 34,
                "name": "Ohio"
              },
              {
                "id": 35,
                "name": "Oklahoma"
              },
              {
                "id": 36,
                "name": "Oregon"
              },
              {
                "id": 37,
                "name": "Pennsylvania"
              },
              {
                "id": 38,
                "name": "Rhode Island"
              },
              {
                "id": 39,
                "name": "South Carolina"
              },
              {
                "id": 40,
                "name": "South Dakota"
              },
              {
                "id": 41,
                "name": "Tennessee"
              },
              {
                "id": 42,
                "name": "Texas"
              },
              {
                "id": 43,
                "name": "Utah"
              },
              {
                "id": 44,
                "name": "Vermont"
              },
              {
                "id": 45,
                "name": "Virginia"
              },
              {
                "id": 46,
                "name": "Washington"
              },
              {
                "id": 47,
                "name": "West Virginia"
              },
              {
                "id": 48,
                "name": "Wisconsin"
              },
              {
                "id": 49,
                "name": "Wyoming"
              },
              {
                "id": 50,
                "name": "District of Columbia"
              },
              {
                "id": 51,
                "name": "American Samoa"
              },
              {
                "id": 52,
                "name": "Guam"
              },
              {
                "id": 53,
                "name": "Northern Mariana Islands"
              },
              {
                "id": 54,
                "name": "Puerto Rico"
              },
              {
                "id": 55,
                "name": "U.S. Virgin Islands"
              },
              {
                "id": 0,
                "name": "Unknown"
              }
            ],
            "width": 100,
            "flex": 1
          },
          {
            "label": "Zip/Postal Code",
            "path": "zipCode",
            "type": 0,
            "model": {
              "id": 18,
              "modelid": 2,
              "type": 0,
              "name": "zipCode",
              "data": {
                "maxLength": 6,
                "minLength": 1
              }
            },
            "required": false,
            "disabled": false,
            "width": 100,
            "flex": 1
          },
          {
            "label": "Section",
            "path": "section",
            "type": 0,
            "model": {
              "id": 19,
              "modelid": 2,
              "type": 0,
              "name": "section",
              "data": {
                "maxLength": 3,
                "minLength": 1
              }
            },
            "required": false,
            "disabled": false,
            "width": 100,
            "flex": 1
          },
        ],
        [
          {
            type: 'header',
            text: '',
          },
          {
            "label": "Permit Name",
            "path": "permitName",
            "type": 0,
            "model": {
              "id": 5,
              "modelid": 2,
              "type": 0,
              "name": "permitName",
              "data": {
                "maxLength": 50,
                "minLength": 1
              }
            },
            "required": false,
            "disabled": false,
            "width": 100,
            "flex": 1
          },
          {
            "label": "Township",
            "path": "township",
            "type": 0,
            "model": {
              "id": 20,
              "modelid": 2,
              "type": 0,
              "name": "township",
              "data": {
                "maxLength": 3,
                "minLength": 1
              }
            },
            "required": false,
            "disabled": false,
            "width": 100,
            "flex": 1
          },
          {
            "label": "Range",
            "path": "range",
            "type": 0,
            "model": {
              "id": 21,
              "modelid": 2,
              "type": 0,
              "name": "range",
              "data": {
                "maxLength": 3,
                "minLength": 1
              }
            },
            "required": false,
            "disabled": false,
            "width": 100,
            "flex": 1
          },
          {
            "label": "Aliquot",
            "path": "aliquot",
            "type": 1,
            "model": {
              "id": 22,
              "modelid": 2,
              "type": 1,
              "name": "aliquot",
              "data": {
                "maxLength": 500,
                "minLength": 1
              }
            },
            "required": false,
            "disabled": false,
            "width": 100,
            "flex": 1
          }
        ]
      ]
    }
  ]
};

export const ViewLayoutData = {
  "range": "",
  "street": "",
  "aliquot": "",
  "section": "",
  "zipCode": "",
  "legacyId": "Some old thing",
  "township": "",
  "legalName": "This is very legal",
  "expiration": "2023-07-07T04:00:00.000Z",
  "permitName": "Mud",
  "description": "",
  "commencement": "2023-07-07T04:00:00.000Z",
  "managementUnits": "",
  "originalExpiration": "2023-07-07T04:00:00.000Z",
  "originalCommencement": "2023-07-07T04:00:00.000Z",
  "sovereignLandsBodies": [
    {
      "type": "State",
      "regions": [
        {
          "id": 6,
          "name": "Wasatch Front"
        }
      ],
      "counties": [
        {
          "id": 18,
          "name": "Salt Lake County"
        }
      ],
      "id": 8,
      "name": "Galena Property",
      "version": 0,
      "createdOn": "2023-06-26T15:32:39.429Z",
      "createdBy": "00000000-0000-0000-0000-000000000000",
      "lastModifiedOn": "2023-06-26T15:32:39.429Z",
      "lastModifiedBy": "00000000-0000-0000-0000-000000000000"
    },
    {
      "type": "State",
      "regions": [
        {
          "id": 1,
          "name": "Bear River"
        },
        {
          "id": 2,
          "name": "Central"
        },
        {
          "id": 3,
          "name": "Northeast"
        },
        {
          "id": 4,
          "name": "Southeast"
        },
        {
          "id": 5,
          "name": "Southwest"
        },
        {
          "id": 6,
          "name": "Wasatch Front"
        }
      ],
      "counties": [
        {
          "id": 1,
          "name": "Beaver County"
        },
        {
          "id": 4,
          "name": "Carbon County"
        },
        {
          "id": 6,
          "name": "Davis County"
        },
        {
          "id": 7,
          "name": "Duchesne County"
        },
        {
          "id": 8,
          "name": "Emery County"
        },
        {
          "id": 9,
          "name": "Garfield County"
        },
        {
          "id": 10,
          "name": "Grand County"
        },
        {
          "id": 11,
          "name": "Iron County"
        },
        {
          "id": 12,
          "name": "Juab County"
        },
        {
          "id": 13,
          "name": "Kane County"
        },
        {
          "id": 14,
          "name": "Millard County"
        },
        {
          "id": 15,
          "name": "Morgan County"
        },
        {
          "id": 16,
          "name": "Piute County"
        },
        {
          "id": 18,
          "name": "Salt Lake County"
        },
        {
          "id": 19,
          "name": "San Juan County"
        },
        {
          "id": 20,
          "name": "Sanpete County"
        },
        {
          "id": 21,
          "name": "Sevier County"
        },
        {
          "id": 22,
          "name": "Summit County"
        },
        {
          "id": 23,
          "name": "Tooele County"
        },
        {
          "id": 25,
          "name": "Utah County"
        },
        {
          "id": 26,
          "name": "Wasatch County"
        },
        {
          "id": 27,
          "name": "Washington County"
        },
        {
          "id": 28,
          "name": "Wayne County"
        }
      ],
      "id": 11,
      "name": "Department of Transportation",
      "version": 0,
      "createdOn": "2023-06-26T15:32:39.429Z",
      "createdBy": "00000000-0000-0000-0000-000000000000",
      "lastModifiedOn": "2023-06-26T15:32:39.429Z",
      "lastModifiedBy": "00000000-0000-0000-0000-000000000000"
    },
    {
      "type": "State",
      "regions": [
        {
          "id": 1,
          "name": "Bear River"
        },
        {
          "id": 6,
          "name": "Wasatch Front"
        }
      ],
      "counties": [
        {
          "id": 29,
          "name": "Weber County"
        }
      ],
      "id": 10,
      "name": "Fremont Island",
      "version": 0,
      "createdOn": "2023-06-26T15:32:39.429Z",
      "createdBy": "00000000-0000-0000-0000-000000000000",
      "lastModifiedOn": "2023-06-26T15:32:39.429Z",
      "lastModifiedBy": "00000000-0000-0000-0000-000000000000"
    },
    {
      "type": "Sovereign",
      "regions": [
        {
          "id": 1,
          "name": "Bear River"
        },
        {
          "id": 6,
          "name": "Wasatch Front"
        }
      ],
      "counties": [
        {
          "id": 2,
          "name": "Box Elder County"
        },
        {
          "id": 6,
          "name": "Davis County"
        },
        {
          "id": 18,
          "name": "Salt Lake County"
        },
        {
          "id": 23,
          "name": "Tooele County"
        },
        {
          "id": 29,
          "name": "Weber County"
        }
      ],
      "id": 1,
      "name": "Great Salt Lake",
      "version": 0,
      "createdOn": "2023-06-26T15:32:39.429Z",
      "createdBy": "00000000-0000-0000-0000-000000000000",
      "lastModifiedOn": "2023-06-26T15:32:39.429Z",
      "lastModifiedBy": "00000000-0000-0000-0000-000000000000"
    }
  ],
  "name": null,
  "version": 1,
  "id": 6,
  "createdBy": {
    "id": "90306d20-5b57-4528-a3dd-90423ca01c31",
    "name": "nathan.grant@timmons.com",
    "email": "nathan.grant@timmons.com"
  },
  "lastModifiedOn": "2023-07-07T20:47:52.930Z",
  "lastModifiedBy": {
    "id": "90306d20-5b57-4528-a3dd-90423ca01c31",
    "name": "nathan.grant@timmons.com",
    "email": "nathan.grant@timmons.com"
  },
  "type_id": 1,
  "permit_number": "410-00006",
  "state": null
};