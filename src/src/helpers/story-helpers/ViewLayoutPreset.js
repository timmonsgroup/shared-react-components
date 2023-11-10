export const BIG_VIEW_PRESET = {
  sections: [
    {
      name: 'Sample Information',
      editable: true,
      enabled: true,
      layout: [
        [
          {
            label: 'CWD Sample Number',
            path: 'cwdSampleID',
            type: 0,
          },
          {
            label: 'Date of Collection',
            path: 'dateOfCollection',
            type: 5,
          },
          {
            label: 'Cooperator',
            path: 'cooperator',
            type: 0,
          },
        ],
        [
          {
            label: 'Cervid Type',
            path: 'cervidType',
            type: 7,
          },
          {
            label: 'Sex of Cervid',
            path: 'cervidSex',
            type: 7,
          },
          {
            label: 'Age of Cervid',
            path: 'cervidAge',
            type: 7,
          },
        ],
        [
          {
            label: 'Genetics Data Collected',
            path: 'geneticsDataCollected',
            type: 0,
            defaultValue:'Don\'t need genetics'
          },
          {
            label: 'CWD Private Lands',
            path: 'cwdPrivateLands',
            type: 0,
          },
          {
            label: 'DMAP',
            path: 'dMap',
            type: 0,
          },
        ],
        [
          {
            label: 'Sample Type',
            path: 'sampleType',
            type: 7,
          },
          {
            label: 'County of Sample',
            path: 'countyOfSample',
            type: 7,
          },
          {
            type: 'component',
            component: 'EmptyField',
          },
        ],
        [
          {
            label: 'Comments',
            path: 'cwdSampleComments',
            type: 1,
          },
        ],
      ],
    },
    {
      name: 'Contact Information',
      editable: true,
      enabled: true,
      layout: [
        [
          {
            label: 'First Name',
            path: 'contactFirstName',
            type: 0,
          },
          {
            label: 'Middle Initial',
            path: 'contactMiddleInitial',
            type: 0,
          },
          {
            label: 'Last Name',
            path: 'contactLastName',
            type: 0,
          },
        ],
        [
          {
            label: 'Address',
            path: 'contactAddress',
            type: 0,
          },
          {
            label: 'Telephone Number',
            path: 'contactPhone',
            type: 0,
            phone: true,
          },
          {
            label: 'Email Address',
            path: 'contactEmail',
            type: 0,
            email: true,
          },
        ],
        [
          {
            label: 'City',
            path: 'contactCity',
            type: 0,
          },
          {
            label: 'State',
            path: 'contactState',
            type: 7,
          },
          {
            label: 'Zip Code',
            path: 'contactZipCode',
            type: 0,
          },
        ],
        [
          {
            label: 'County of Harvest',
            path: 'countyOfHarvest',
            type: 7,
          },
          {
            label: 'Game Check ID',
            path: 'gameCheckID',
            type: 0,
            hideIf: ['poc'],
          },
          {
            label: 'Conservation Identification Number',
            path: 'hunterCID',
            type: 0,
            hideIf: ['poc'],
          },
        ],
      ],
    },
    {
      name: 'Valid Information',
      editable: true,
      enabled: true,
      layout: [
        // [
        //  {
        //      type: 'text',
        //      text: 'This sample record is invalid',
        //      hidden: true,
        //      conditions: [{
        //          when: 'invalid',
        //          is: true,
        //          then: { hidden: false }
        //      }]
        //  }
        // ],
        [
          {
            label: 'First Name',
            path: 'validContactFirstName',
            type: 0,
            hidden: true,
            conditions: [
              {
                when: 'sampleType',
                is: 'Hunter Harvested',
                then: { hidden: false },
              },
            ],
          },
          {
            label: 'Middle Initial',
            path: 'validContactMiddleInitial',
            type: 0,
            hidden: true,
            conditions: [
              {
                when: 'sampleType',
                is: 'Hunter Harvested',
                then: { hidden: false },
              },
            ],
          },
          {
            label: 'Last Name',
            path: 'validContactLastName',
            type: 0,
            hidden: true,
            conditions: [
              {
                when: 'sampleType',
                is: 'Hunter Harvested',
                then: { hidden: false },
              },
            ],
          },
        ],
        [
          {
            label: 'Address',
            path: 'validContactAddress',
            type: 0,
            hidden: true,
            conditions: [
              {
                when: 'sampleType',
                is: 'Hunter Harvested',
                then: { hidden: false },
              },
            ],
          },
          {
            label: 'Telephone Number',
            path: 'validContactPhone',
            type: 0,
            phone: true,
            hidden: true,
            conditions: [
              {
                when: 'sampleType',
                is: 'Hunter Harvested',
                then: { hidden: false },
              },
            ],
          },
          {
            label: 'Email Address',
            path: 'validContactEmail',
            type: 0,
            email: true,
            hidden: true,
            conditions: [
              {
                when: 'sampleType',
                is: 'Hunter Harvested',
                then: { hidden: false },
              },
            ],
          },
        ],
        [
          {
            label: 'City',
            path: 'validContactCity',
            type: 0,
            hidden: true,
            conditions: [
              {
                when: 'sampleType',
                is: 'Hunter Harvested',
                then: { hidden: false },
              },
            ],
          },
          {
            label: 'State',
            path: 'validContactState',
            type: 7,
            hidden: true,
            conditions: [
              {
                when: 'sampleType',
                is: 'Hunter Harvested',
                then: { hidden: false },
              },
            ],
          },
          {
            label: 'Zip Code',
            path: 'validContactZipCode',
            type: 0,
            hidden: true,
            conditions: [
              {
                when: 'sampleType',
                is: 'Hunter Harvested',
                then: { hidden: false },
              },
            ],
          },
        ],
        [
          {
            label: 'County of Harvest',
            path: 'validCountyOfHarvest',
            type: 7,
            hidden: true,
            conditions: [
              {
                when: 'sampleType',
                is: 'Hunter Harvested',
                then: { hidden: false },
              },
            ],
          },
          {
            label: 'Game Check ID',
            path: 'validGameCheckID',
            type: 0,
            hideIf: ['poc'],
            hidden: true,
            conditions: [
              {
                when: 'sampleType',
                is: 'Hunter Harvested',
                then: { hidden: false },
              },
            ],
          },
          {
            label: 'Conservation Identification Number',
            path: 'validHunterCID',
            type: 0,
            hideIf: ['poc'],
            hidden: true,
            conditions: [
              {
                when: 'sampleType',
                is: 'Hunter Harvested',
                then: { hidden: false },
              },
            ],
          },
        ],
      ],
    },
    {
      name: 'Additional Positive Information',
      editable: false,
      enabled: true,
      layout: [
        [
          {
            label: 'Meat Kept or Relinquished',
            path: 'meatKeptOrRelinquished',
            type: 7,
            hidden: true,
            conditions: [
              {
                when: 'cwdSampleStatus',
                is: 'Positive',
                then: { hidden: false },
              },
            ],
          },
          {
            label: 'Plan for Disposal',
            path: 'planForDisposal',
            type: 7,
            hidden: true,
            conditions: [
              {
                when: 'cwdSampleStatus',
                is: 'Positive',
                then: { hidden: false },
              },
            ],
          },
          {
            label: 'Meat at Processor',
            path: 'meatAtProcessor',
            type: 7,
            hidden: true,
            conditions: [
              {
                when: 'cwdSampleStatus',
                is: 'Positive',
                then: { hidden: false },
              },
            ],
          },
        ],
        [
          {
            label: 'Meat Replacement Tag Requested',
            path: 'meatReplacementTagRequested',
            type: 7,
            hidden: true,
            conditions: [
              {
                when: 'cwdSampleStatus',
                is: 'Positive',
                then: { hidden: false },
              },
            ],
          },
          {
            label: 'Tag Issued Date',
            path: 'tagIssuedDate',
            type: 5,
            hidden: true,
            conditions: [
              {
                when: 'cwdSampleStatus',
                is: 'Positive',
                then: { hidden: false },
              },
            ],
          },
          {
            label: 'Notification Letter Sent Date',
            path: 'letterSentDate',
            type: 5,
            hidden: true,
            conditions: [
              {
                when: 'cwdSampleStatus',
                is: 'Positive',
                then: { hidden: false },
              },
            ],
          },
        ],
        {
          label: 'Comments',
          path: 'cwdSamplePositiveInformationComments',
          type: 1,
          solitary: true,
          hidden: true,
          conditions: [
            {
              when: 'cwdSampleStatus',
              is: 'Positive',
              then: { hidden: false },
            },
          ],
        },
        {
          label: 'Contact Dates',
          path: 'contactDates',
          type: 120,
          solitary: true,
          hidden: true,
          layout: [
            {
              label: 'Contact Date',
              path: 'contactDate',
              type: 5
            },
            {
              label: 'Contacted on Date',
              path: 'contacted',
              type: 7,
            },
          ],
          conditions: [
            {
              when: 'cwdSampleStatus',
              is: 'Positive',
              then: { hidden: false },
            },
          ],
        },
        [
          {
            label: 'Last Edited By',
            type: 0,
            path: 'modifiedByEmail',
            hidden: true,
            conditions: [
              {
                when: 'cwdSampleStatus',
                is: 'Positive',
                then: { hidden: false },
              },
            ],
          },
          {
            label: 'Private',
            path: 'privateStatus',
            type: 0,
            hidden: true,
            conditions: [
              {
                when: 'cwdSampleStatus',
                is: 'Positive',
                then: { hidden: false },
              },
            ],
          },
          {
            type: 'component',
            component: 'EmptyField',
            hidden: true,
            conditions: [
              {
                when: 'cwdSampleStatus',
                is: 'Positive',
                then: { hidden: false },
              },
            ],
          },
          {
            path: 'cwdSampleStatus',
            hidden: true,
          },
        ],
      ],
    },
    {
      name: 'Location',
      editable: true,
      enabled: true,
      layout: [
        [
          {
            label: 'Zone',
            path: 'utmZone',
            type: 7,          },
          {
            label: 'Easting',
            path: 'utmEasting',
            type: 0,
          },
          {
            label: 'Northing',
            path: 'utmNorthing',
            type: 0
          },
        ],
      ],
    },
  ],
};

export const VIEW_PRESET = {
  layoutKey: 'details',
  sections: [
    {
      editable: true,
      enabled: true,
      name: 'Encumbrance Summary',
      description: null,
      order: 1,
      columns: true,
      layout: [
        [
          {
            type: 'component',
            component: 'EncumbranceDetailMap',
          },
        ],
        [
          {
            type: 'header',
            text: 'Encumbrance Details',
          },
          {
            label: 'Permit Number',
            path: 'encumbranceId',
            type: 0,
            renderAsLinks: true,
            linkFormat: 'properties/{id}',
          },
          {
            label: 'A Link',
            path: 'someLink',
            type: 100,
          },
          {
            label: 'Legal Name',
            path: 'legalName',
            type: 0,
          },
          {
            label: 'Sovereign Lands Bodies',
            path: 'sovereignLandsBodies',
            type: 10,
            linkFormat: 'properties/{id}',
          },
          {
            label: 'Description',
            path: 'description',
            type: 1,
          },
          {
            label: 'Management Units',
            path: 'managementUnits',
            type: 1,
          },
          {
            label: 'Commencement',
            path: 'commencement',
            type: 5,
          },
          {
            label: 'Expiration',
            path: 'expiration',
            type: 5,
          },
          {
            label: 'Original Commencement',
            path: 'originalCommencement',
            type: 5,
          },
          {
            label: 'Original Expiration',
            path: 'originalExpiration',
            type: 5,
          },
          {
            label: 'Street',
            path: 'street',
            type: 0,
          },
          {
            label: 'City',
            path: 'city',
            type: 0,
          },
          {
            label: 'State',
            path: 'state',
            type: 7,
          },
          {
            label: 'Zip/Postal Code',
            path: 'zipCode',
            variant: 'zip',
            type: 0,
          },
          {
            label: 'Phone Number',
            path: 'phoneNumber',
            type: 0,
            className: 'baconBits',
            phone: true,
          },
        ],
        [
          {
            type: 'header',
            text: '',
          },
          {
            label: 'Permit Name',
            path: 'permitName',
            type: 0,
          },
          {
            label: 'Township',
            path: 'township',
            type: 0,
          },
          {
            label: 'Range',
            path: 'range',
            type: 0,
          },
          {
            label: 'Aliquot',
            path: 'aliquot',
            type: 1,
          },
        ],
      ],
    },
    {
      name: 'Clustered Section',
      layout: [
        {
          label: 'Invoice Items',
          type: 120,
          path: 'invoiceItems',
          layout: [
            {
              label: 'Description',
              type: 0,
              path: 'description',
            },
            {
              label: 'Amount',
              type: 4,
              path: 'amount',
            },
          ],
        },
        {
          label: 'Total',
          type: 4,
          path: 'total',
          className: 'textAlignRight',
        },
      ],
    },
  ],
};

const slbArray = [
  {
    id: 8,
    name: 'Galena Property',
  },
  {
    id: 11,
    name: 'Department of Transportation',
  },
  {
    id: 10,
    name: 'Fremont Island',
  },
];

const slbObj = {
  id: 8,
  name: 'Galena Property',
};

export const BigViewLayoutData = {
  privateStatus: 'true',
  modifiedByEmail: 'eric.schmiel@timmons.com',
  created: '2023-10-23T14:43:47.754Z',
  cwdSampleID: 'TT000001',
  cwdSampleRecordSeason: '2024',
  modifiedByID: '4ba4bfb3-a6f5-46d8-b325-35e474d4438e',
  createdByID: '4ba4bfb3-a6f5-46d8-b325-35e474d4438e',
  labResults: [
    {
      cwdSampleRecordID: '530d62f9-197c-42dc-8ceb-db183e7eae70',
      lrSpecimenDescription: 'LNODE',
      created: '2023-10-23T14:43:47.789Z',
      lrDateFinalized: '10/4/2023 16:38',
      lrLymphNode: 'Positive',
      lrSpecimenID: 'TT9-00098-6-1',
      createdByEmail: 'eric.schmiel@timmons.com',
      lrAccessionNumber: 'TT9-33398',
      modifiedByID: '4ba4bfb3-a6f5-46d8-b325-35e474d4438e',
      modifiedByEmail: 'eric.schmiel@timmons.com',
      modified: '2023-10-23T14:43:47.789Z',
      lrDateReceived: '10/1/2023 11:40',
      id: '193c6895-dbb0-418c-85f7-298e5b2efc8f',
      lrComments: '',
      cwdSampleID: 'TT000001',
      createdByID: '4ba4bfb3-a6f5-46d8-b325-35e474d4438e',
    },
  ],
  sortKey: '#METADATA#530d62f9-197c-42dc-8ceb-db183e7eae70',
  dateOfCollection: '2023-10-23T14:43:47.739Z',
  createdByEmail: 'eric.schmiel@timmons.com',
  cwdSampleStatus: 'Positive',
  id: 'CWD_SAMPLE_RECORD#530d62f9-197c-42dc-8ceb-db183e7eae70',
  modified: '2023-10-23T14:43:47.867Z',
  geneticsDataCollected: null,
  cwdPrivateLands: 'undefined',
  dMap: 'undefined',
  meatReplacementTagRequested: 'undefined',
};

export const ViewLayoutData = {
  range: '',
  street: '',
  aliquot: '',
  phoneNumber: '5671129045',
  zipCode: '',
  someLink: 'https://www.google.com',
  township: '',
  legalName: 'This is very legal',
  expiration: '2023-07-07T04:00:00.000Z',
  permitName: 'Mud',
  description: '',
  commencement: '2023-07-07T04:00:00.000Z',
  managementUnits: '',
  originalExpiration: '2023-07-07T04:00:00.000Z',
  originalCommencement: '2023-07-07T04:00:00.000Z',
  sovereignLandsBodies: [{ id: 1, name: 'Bill' }],
  name: null,
  version: 1,
  id: 6,
  createdBy: {
    id: '90306d20-5b57-4528-a3dd-90423ca01c31',
    name: 'nathan.grant@timmons.com',
    email: 'nathan.grant@timmons.com',
  },
  lastModifiedOn: '2023-07-07T20:47:52.930Z',
  lastModifiedBy: {
    id: '90306d20-5b57-4528-a3dd-90423ca01c31',
    name: 'nathan.grant@timmons.com',
    email: 'nathan.grant@timmons.com',
  },
  type_id: 1,
  permit_number: '410-00006',
  state: null,
  invoiceItems: [
    {
      amount: 123,
      description: 'Crickets',
    },
    {
      amount: 34,
      description: 'A fresh description',
    },
  ],
};
