import { FIELD_TYPES } from '../../constants';

const createColumn = (label, colId, type = FIELD_TYPES.TEXT, flex = 1) => (
  {
    label,
    path: colId,
    type,
    flex
  }
);

const landTitle = createColumn('Lands Title', 'name');
landTitle.linkFormat = '/land/{id}';
export const LANDS_GRID_LAYOUT = {
  'data': {
    'bulkList': '/api/joinRequest/all'
  },
  'grid': {
    'sort': {
      'field': 'CreationDate',
      'order': 'asc'
    },
    'idColumn': 'GlobalID'
  },
  'id': 12,
  'modelId': 30,
  'enabled': true,
  'name': 'Test Layout',
  'editable': false,
  'layoutKey': 'list',
  'type': 2,
  'sections': [{
    'editable': true,
    'enabled': true,
    'name': 'Properties',
    'order': 20,
    'layout': [
      landTitle,
      createColumn('Land Type', 'type'),
      createColumn('Area', 'regions', FIELD_TYPES.OBJECT),
      createColumn('Counties', 'counties', FIELD_TYPES.OBJECT),
    ]
  }]
};

// GRID DATA

export const DEFAULT_GRID = [
  {
    id: '1',
    name: 'Name 1',
    type: { id: 1, name: 'Type1' },
    status: { id: 1, name: 'Status1' },
    initiatedOn: '2021-01-01',
    initiatedBy: { id: 1, name: 'Initiated By 1' },
    lastUpdatedOn: '2021-01-01',
    lastUpdatedBy: { id: 1, name: 'Last Updated By 1' },
    activeOn: '2021-01-01',
    sampleLink: { label: 'Sample Link', url: 'https://www.google.com' },
  },
  {
    id: '2',
    name: 'Name 2',
    type: { id: 1, name: 'Type1' },
    status: { id: 2, name: 'Status2' },
    sampleLink: 'https://www.google.com',
  },
  {
    id: '3',
    name: 'Name 3',
    type: null,
    status: { id: 3, name: 'Status3' },
  },
  {
    id: '4',
    name: 'Name 4',
    sampleLink: { label: 'Sample Link', link: 'doop' },
  },
  {
    id: '5',
    name: 'Name 5',
    type: { id: 2, name: 'Type2' },
    status: { id: 1, name: 'Status1' },
  },
  {
    id: '6',
    name: 'Name 6',
    type: { id: 1, name: 'Type1' },
    status: { id: 2, name: 'Status2' },
    sampleLink: { label: 'Sample Link', url: 'https://www.google.com' },
  },
  {
    id: '7',
    name: 'Name 7',
    type: { id: 2, name: 'Type2' },
    status: { id: 3, name: 'Status3' },
  },
  {
    id: '8',
    name: 'Name 8',
    type: { id: 2, name: 'Type2' },
    sampleLink: { label: 'Sample Link', link: 'doop' },
  },
  {
    id: '9',
    name: 'Name 9',
    type: { id: 2, name: 'Type2' },
    status: { id: 1, name: 'Status1' },
  },
  {
    id: '10',
    name: 'Name 10',
    type: { id: 1, name: 'Type1' },
    status: { id: 2, name: 'Status2' },
    sampleLink: { label: 'Sample Link', url: 'https://www.google.com' },
  },
  {
    id: '11',
    name: 'Name 11',
    type: { id: 1, name: 'Type1' },
    status: { id: 3, name: 'Status3' },
  },
  {
    id: '12',
    name: 'Name 12',
    sampleLink: { label: 'Sample Link', link: 'doop' },
  },
  {
    id: '13',
    name: 'Name 13',
    type: { id: 1, name: 'Type1' },
    status: { id: 1, name: 'Status1' },
  },
  {
    id: '14',
    name: 'Name 14',
    type: { id: 2, name: 'Type2' },
    status: { id: 2, name: 'Status2' },
    sampleLink: { label: 'Sample Link', url: 'https://www.google.com' },
  },
  {
    id: '15',
    name: 'Name 15',
    type: { id: 1, name: 'Type1' },
    status: { id: 3, name: 'Status3' },
  },
  {
    id: '16',
    name: 'Name 16',
    type: { id: 1, name: 'Type1' },
    sampleLink: { label: 'Sample Link', link: 'doop' },
  },
  {
    id: '17',
    name: 'Name 17',
    status: { id: 1, name: 'Status1' },
  },
  {
    id: '18',
    name: 'Name 18',
    type: { id: 1, name: 'Type1' },
    status: { id: 2, name: 'Status2' },
    sampleLink: { label: 'Sample Link', url: 'https://www.google.com' },
  },
  {
    id: '19',
    name: 'Name 19',
    type: { id: 2, name: 'Type2' },
    status: { id: 3, name: 'Status3' },
  },
  {
    id: '20',
    name: 'Name 20',
    type: { id: 2, name: 'Type2' },
    sampleLink: { label: 'Sample Link', link: 'doop' },
  }
];

export const LAND_GRID = [
  {
    'id': 3,
    'name': 'Bear Lake',
    'type': 'Sovereign',
    'regions': [
      {
        'id': 1,
        'name': 'Bear River'
      }
    ],
    'counties': [
      {
        'id': 17,
        'name': 'Rich County'
      }
    ]
  },
  {
    'id': 4,
    'name': 'Bear River',
    'type': 'Sovereign',
    'regions': [
      {
        'id': 3,
        'name': 'Bear River'
      }
    ],
    'counties': [
      {
        'id': 2,
        'name': 'Box Elder County'
      },
      {
        'id': 3,
        'name': 'Cache County'
      },
      {
        'id': 17,
        'name': 'Rich County'
      }
    ]
  },
  {
    'id': 7,
    'name': 'Colorado River',
    'type': 'Sovereign',
    'regions': [
      {
        'id': 4,
        'name': 'Southeast'
      }
    ],
    'counties': [
      {
        'id': 9,
        'name': 'Garfield County'
      },
      {
        'id': 10,
        'name': 'Grand County'
      },
      {
        'id': 13,
        'name': 'Kane County'
      },
      {
        'id': 19,
        'name': 'San Juan County'
      }
    ]
  },
  {
    'id': 13,
    'name': 'Dalton Wells',
    'type': 'Exchange',
    'regions': [
      {
        'id': 4,
        'name': 'Southeast'
      }
    ],
    'counties': [
      {
        'id': 10,
        'name': 'Grand County'
      }
    ]
  },
  {
    'id': 11,
    'name': 'Department of Transportation',
    'type': 'State',
    'regions': [
      {
        'id': 1,
        'name': 'Bear River'
      },
      {
        'id': 2,
        'name': 'Central'
      },
      {
        'id': 3,
        'name': 'Northeast'
      },
      {
        'id': 4,
        'name': 'Southeast'
      },
      {
        'id': 5,
        'name': 'Southwest'
      },
      {
        'id': 6,
        'name': 'Wasatch Front'
      }
    ],
    'counties': [
      {
        'id': 1,
        'name': 'Beaver County'
      },
      {
        'id': 4,
        'name': 'Carbon County'
      },
      {
        'id': 6,
        'name': 'Davis County'
      },
      {
        'id': 7,
        'name': 'Duchesne County'
      },
      {
        'id': 8,
        'name': 'Emery County'
      },
      {
        'id': 9,
        'name': 'Garfield County'
      },
      {
        'id': 10,
        'name': 'Grand County'
      },
      {
        'id': 11,
        'name': 'Iron County'
      },
      {
        'id': 12,
        'name': 'Juab County'
      },
      {
        'id': 13,
        'name': 'Kane County'
      },
      {
        'id': 14,
        'name': 'Millard County'
      },
      {
        'id': 15,
        'name': 'Morgan County'
      },
      {
        'id': 16,
        'name': 'Piute County'
      },
      {
        'id': 18,
        'name': 'Salt Lake County'
      },
      {
        'id': 19,
        'name': 'San Juan County'
      },
      {
        'id': 20,
        'name': 'Sanpete County'
      },
      {
        'id': 21,
        'name': 'Sevier County'
      },
      {
        'id': 22,
        'name': 'Summit County'
      },
      {
        'id': 23,
        'name': 'Tooele County'
      },
      {
        'id': 25,
        'name': 'Utah County'
      },
      {
        'id': 26,
        'name': 'Wasatch County'
      },
      {
        'id': 27,
        'name': 'Washington County'
      },
      {
        'id': 28,
        'name': 'Wayne County'
      }
    ]
  },
  {
    'id': 12,
    'name': 'Division of Wildlife Resources',
    'type': 'State',
    'regions': [
      {
        'id': 1,
        'name': 'Bear River'
      },
      {
        'id': 2,
        'name': 'Central'
      },
      {
        'id': 3,
        'name': 'Northeast'
      },
      {
        'id': 4,
        'name': 'Southeast'
      },
      {
        'id': 5,
        'name': 'Southwest'
      },
      {
        'id': 6,
        'name': 'Wasatch Front'
      }
    ],
    'counties': [
      {
        'id': 1,
        'name': 'Beaver County'
      },
      {
        'id': 4,
        'name': 'Carbon County'
      },
      {
        'id': 6,
        'name': 'Davis County'
      },
      {
        'id': 7,
        'name': 'Duchesne County'
      },
      {
        'id': 8,
        'name': 'Emery County'
      },
      {
        'id': 9,
        'name': 'Garfield County'
      },
      {
        'id': 10,
        'name': 'Grand County'
      },
      {
        'id': 11,
        'name': 'Iron County'
      },
      {
        'id': 12,
        'name': 'Juab County'
      },
      {
        'id': 13,
        'name': 'Kane County'
      },
      {
        'id': 14,
        'name': 'Millard County'
      },
      {
        'id': 15,
        'name': 'Morgan County'
      },
      {
        'id': 16,
        'name': 'Piute County'
      },
      {
        'id': 18,
        'name': 'Salt Lake County'
      },
      {
        'id': 19,
        'name': 'San Juan County'
      },
      {
        'id': 20,
        'name': 'Sanpete County'
      },
      {
        'id': 21,
        'name': 'Sevier County'
      },
      {
        'id': 22,
        'name': 'Summit County'
      },
      {
        'id': 23,
        'name': 'Tooele County'
      },
      {
        'id': 25,
        'name': 'Utah County'
      },
      {
        'id': 26,
        'name': 'Wasatch County'
      },
      {
        'id': 27,
        'name': 'Washington County'
      },
      {
        'id': 28,
        'name': 'Wayne County'
      }
    ]
  },
  {
    'id': 10,
    'name': 'Fremont Island',
    'type': 'State',
    'regions': [
      {
        'id': 1,
        'name': 'Bear River'
      },
      {
        'id': 6,
        'name': 'Wasatch Front'
      }
    ],
    'counties': [
      {
        'id': 29,
        'name': 'Weber County'
      }
    ]
  },
  {
    'id': 8,
    'name': 'Galena Property',
    'type': 'State',
    'regions': [
      {
        'id': 6,
        'name': 'Wasatch Front'
      }
    ],
    'counties': [
      {
        'id': 18,
        'name': 'Salt Lake County'
      }
    ]
  },
  {
    'id': 1,
    'name': 'Great Salt Lake',
    'type': 'Sovereign',
    'regions': [
      {
        'id': 1,
        'name': 'Bear River'
      },
      {
        'id': 6,
        'name': 'Wasatch Front'
      }
    ],
    'counties': [
      {
        'id': 2,
        'name': 'Box Elder County'
      },
      {
        'id': 6,
        'name': 'Davis County'
      },
      {
        'id': 18,
        'name': 'Salt Lake County'
      },
      {
        'id': 23,
        'name': 'Tooele County'
      },
      {
        'id': 29,
        'name': 'Weber County'
      }
    ]
  },
  {
    'id': 6,
    'name': 'Green River',
    'type': 'Sovereign',
    'regions': [
      {
        'id': 4,
        'name': 'Southeast'
      }
    ],
    'counties': [
      {
        'id': 4,
        'name': 'Carbon County'
      },
      {
        'id': 8,
        'name': 'Emery County'
      },
      {
        'id': 10,
        'name': 'Grand County'
      },
      {
        'id': 19,
        'name': 'San Juan County'
      },
      {
        'id': 24,
        'name': 'Uintah County'
      },
      {
        'id': 28,
        'name': 'Wayne County'
      }
    ]
  },
  {
    'id': 5,
    'name': 'Jordan River',
    'type': 'Sovereign',
    'regions': [
      {
        'id': 6,
        'name': 'Wasatch Front'
      }
    ],
    'counties': [
      {
        'id': 6,
        'name': 'Davis County'
      },
      {
        'id': 18,
        'name': 'Salt Lake County'
      },
      {
        'id': 25,
        'name': 'Utah County'
      }
    ]
  },
  {
    'id': 15,
    'name': 'North Block',
    'type': 'Exchange',
    'regions': [
      {
        'id': 4,
        'name': 'Southeast'
      }
    ],
    'counties': [
      {
        'id': 10,
        'name': 'Grand County'
      }
    ]
  },
  {
    'id': 14,
    'name': 'Prairie Dog Haven',
    'type': 'Exchange',
    'regions': [
      {
        'id': 4,
        'name': 'Southeast'
      }
    ],
    'counties': [
      {
        'id': 10,
        'name': 'Grand County'
      }
    ]
  },
  {
    'id': 9,
    'name': 'Taylorsville Property',
    'type': 'State',
    'regions': [
      {
        'id': 6,
        'name': 'Wasatch Front'
      }
    ],
    'counties': [
      {
        'id': 18,
        'name': 'Salt Lake County'
      }
    ]
  },
  {
    'id': 2,
    'name': 'Utah Lake',
    'type': 'Sovereign',
    'regions': [
      {
        'id': 6,
        'name': 'Wasatch Front'
      }
    ],
    'counties': [
      {
        'id': 25,
        'name': 'Utah County'
      }
    ]
  }
];