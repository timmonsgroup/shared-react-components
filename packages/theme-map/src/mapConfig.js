/*
    Ideally this would be in a database somewhere but we didnt really have the time as it shares the database with FireMAP for it so here it is
*/

const mockMapConfig = {
  layerCategories: [
    {
      key: 'cat_new_planning_area_basemaps',
      name: 'Basemaps',
      hidden: false,
      openness: 'open',
      opacity: 1,
      layerGroups: ['grp_basemaps'],
      multiphasic: false,
      selectiveness: 'monoselective',
      defaultSelection: ['lyr_esri_topo'],
    },
    {
      key: 'cat_new_planning_area_reference',
      name: 'Reference Layers',
      hidden: false,
      openness: 'open',
      opacity: 1,
      layerGroups: ['grp_new_planning_area_reference'],
      multiphasic: true,
      selectiveness: 'polyselective',
      defaultSelection: [],
    },
  ],
  layerGroups: [
    {
      key: 'grp_basemaps',
      name: null,
      openness: 'open',
      layers: [
        'lyr_esri_streets',
        'lyr_esri_world_image',
        'lyr_esri_topo',
        'lyr_esri_light_gray',
      ],
      order: 10,
    },
    {
      key: 'grp_new_planning_area_reference',
      name: null,
      openness: 'open',
      layers: [
        'ne-mw-pam-ref:Counties',
        'ne-mw-pam-ref:Townships, Cities, and Towns',
        'ne-mw-pam-ref:Fire Districts',
      ],
      order: 10,
    },
  ],
  layers: [
    {
      key: 'lyr_esri_light_gray',
      name: 'Light Gray',
      zIndex: 10,
      hidden: false,
      opacity: 1,
      xyz: {
        maxZoom: 19,
        minZoom: 3,
        endpoints: [
          {
            url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
            bbox: null,
            zIndex: 10,
            tokenKey: null,
            layerDefs: null,
            layersToShow: null,
          },
        ],
      },
    },
    {
      key: 'ne-mw-pam-ref:Counties',
      name: 'Counties',
      zIndex: 10,
      hidden: false,
      opacity: 1,
      wfs: {
        maxZoom: 19,
        minZoom: 3,
        endpoints: [
          {
            url: 'https://geoserver.northeast-midwest.wildfiresuite.dev.timmons-dev.com/geoserver/ows',
            bbox: null,
            zIndex: 100,
            tokenKey: null,
            layerDefs: null,
            layerToShow: 'ne-mw-pam-ref:Counties',
          },
        ],
      },
    },
    {
      key: 'lyr_esri_streets',
      name: 'Streets',
      zIndex: 20,
      hidden: false,
      opacity: 1,
      xyz: {
        maxZoom: 19,
        minZoom: 3,
        endpoints: [
          {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
            bbox: null,
            zIndex: 10,
            tokenKey: null,
            layerDefs: null,
            layersToShow: null,
          },
        ],
      },
    },
    {
      key: 'ne-mw-pam-ref:Townships, Cities, and Towns',
      name: 'Townships, Cities, and Towns',
      zIndex: 20,
      hidden: false,
      opacity: 1,
      wfs: {
        maxZoom: 19,
        minZoom: 3,
        endpoints: [
          {
            url: 'https://geoserver.northeast-midwest.wildfiresuite.dev.timmons-dev.com/geoserver/ows',
            bbox: null,
            zIndex: 100,
            tokenKey: null,
            layerDefs: null,
            layerToShow: 'ne-mw-pam-ref:townshipsCitiesAndTowns',
          },
        ],
      },
    },
    {
      key: 'ne-mw-pam-ref:Fire Districts',
      name: 'Fire Districts',
      zIndex: 30,
      hidden: false,
      opacity: 1,
      wfs: {
        maxZoom: 19,
        minZoom: 3,
        endpoints: [
          {
            url: 'https://geoserver.northeast-midwest.wildfiresuite.dev.timmons-dev.com/geoserver/ows',
            bbox: null,
            zIndex: 100,
            tokenKey: null,
            layerDefs: null,
            layerToShow: 'ne-mw-pam-ref:fireDistricts',
          },
        ],
      },
    },
    {
      key: 'lyr_esri_topo',
      name: 'Topo',
      zIndex: 30,
      hidden: false,
      opacity: 1,
      xyz: {
        maxZoom: 19,
        minZoom: 3,
        endpoints: [
          {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
            bbox: null,
            zIndex: 10,
            tokenKey: null,
            layerDefs: null,
            layersToShow: null,
          },
        ],
      },
    },
    {
      key: 'lyr_esri_world_image',
      name: 'Aerial',
      zIndex: 40,
      hidden: false,
      opacity: 1,
      xyz: {
        maxZoom: 19,
        minZoom: 3,
        endpoints: [
          {
            url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            bbox: null,
            zIndex: 10,
            tokenKey: null,
            layerDefs: null,
            layersToShow: null,
          },
        ],
      },
    },
  ],
};

export {
  mockMapConfig,
};
