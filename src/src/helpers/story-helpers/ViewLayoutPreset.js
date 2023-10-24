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
            type: 100
          },
          {
            label: 'Legal Name',
            path: 'legalName',
            type: 0
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
            type: 1
          },
          {
            label: 'Management Units',
            path: 'managementUnits',
            type: 1
          },
          {
            label: 'Commencement',
            path: 'commencement',
            type: 5
          },
          {
            label: 'Expiration',
            path: 'expiration',
            type: 5
          },
          {
            label: 'Original Commencement',
            path: 'originalCommencement',
            type: 5
          },
          {
            label: 'Original Expiration',
            path: 'originalExpiration',
            type: 5
          },
          {
            label: 'Street',
            path: 'street',
            type: 0
          },
          {
            label: 'City',
            path: 'city',
            type: 0
          },
          {
            label: 'State',
            path: 'state',
            type: 7
          },
          {
            label: 'Zip/Postal Code',
            path: 'zipCode',
            variant: 'zip',
            type: 0
          },
          {
            label: 'Phone Number',
            path: 'phoneNumber',
            type: 0,
            className: 'baconBits',
            phone: true
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
            type: 0
          },
          {
            label: 'Township',
            path: 'township',
            type: 0
          },
          {
            label: 'Range',
            path: 'range',
            type: 0
          },
          {
            label: 'Aliquot',
            path: 'aliquot',
            type: 1
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
        }
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
