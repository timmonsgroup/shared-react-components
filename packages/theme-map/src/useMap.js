import { useState, useRef, useEffect } from 'react';

// Openlayers
import { transformExtent } from 'ol/proj';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import {
  Fill,
  Stroke,
  Style,
} from 'ol/style';
import View from 'ol/View';
import { ZoomToExtent } from 'ol/control';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';


import Themes from 'ol-themes-ext';
import { mockMapConfig } from './mapConfig.js';

const initZoom = 6;

//Check the url hash for a mapDebug flag
const mapDebug = (window.location.hash.indexOf('mapDebug') > -1);

if (mapDebug) {
  console.log('Enabling map debugging');
  window.themesDebug = true;
}

export const makeShapeLayer = (styleDef) => {
  const source = new VectorSource({
    features: [],
  });

  if (!styleDef) {
    styleDef = {
      strokeColor: 'rgba(0,0.5,1,1)',
      strokeWidth: 4,
      fillColor: 'rgba(1,1,1,0.5)',
    };
  }

  const style = new Style({
    stroke: new Stroke({
      color: styleDef.strokeColor,
      width: styleDef.strokeWidth,
    }),
    fill: new Fill({
      color: styleDef.fillColor,
    }),
  });

  const vLay = new VectorLayer({ source, style });
  vLay.setZIndex(99);
  return vLay;
};

export const getLayerMap = (map) => {
  const layMap = {};
  map.themes.categories.forEach((category, cI) => {
    category.groups.forEach((group, gI) => {
      group.layers.forEach(layer => {
        layMap[layer.key] = {
          categoryId: category.key,
          categoryIndex: cI,
          groupIndex: gI,
          groupId: group.key,
        }
      });
    });
  });
  return layMap;
}

export const getFeatures = async (evt, map, activeLayers) => {
  const proms = activeLayers.map((name) => {
    const lay = map.themes.themes.layerMap[name];
    return lay?.getFeaturesUnderPixel(evt.pixel);
  });
  const things = await Promise.all(proms);
  const results = [];

  if (things?.length) {
    things.forEach((res) => {
      if (Array.isArray(res)) {
        res.forEach((item) => {
          results.push(...item?.features || []);
        });
      } else {
        results.push(...res?.features || []);
      }
    });
  }
  return results;
}

export const createFeature = (layer, shape) => {
  if (!layer || !shape) {
    return;
  }
  const source = layer.getSource();

  try {
    const features = new GeoJSON().readFeatures(shape);
    if (shape.properties) {
      features.forEach((feature) => {
        Object.keys(shape.properties).forEach((key) => {
          feature.set(key, shape.properties[key]);
        });
      });
    }
    source.addFeatures(features);
  }
  catch (e) {
    console.log('ERROR', e);
  }
};

const createOLMap = () => {
  const view = new View({
    zoom: initZoom,
    constrainResolution: true,
    projection: 'EPSG:3857',
    // Center must be provided as layer will not render if center AND extent are not provided
    center: [0, 0],
  });

  let olMapInstance = new Map({
    layers: [],
    view: view
  });

  let newMapObj = new Themes(olMapInstance);

  return newMapObj;
}

export const useThemeMap = (themes, activeLayers) => {
  const olMap = useRef(null);
  const mapElement = useRef(null);
  const mapSetupComplete = useRef(false);
  const layerMap = useRef({});
  const extentControl = useRef();
  const themeRef = useRef(themes);
  const [extent, setExtent] = useState(null);

  if (olMap.current === null) {
    olMap.current = createOLMap();
    if (window.themesDebug) {
      window.mapObj = olMap.current;
    }
  }

  /**
   * Reset the map view to the default extent.
   * If new extent is provided, it will be used instead and set as the new default.
   * @param {array} newExt The duration of the animation in milliseconds.
   */
  const resetView = (newExt, duration = 1000) => {
    if (olMap.current) {
      if (newExt) {
        setExtent(newExt);
      } else {
        newExt = extent;
      }

      if (newExt) {
        const updatedExt = transformExtent(newExt, 'EPSG:4326', 'EPSG:3857')
        olMap.current.getView().fit(updatedExt, { duration });
      }
    }
  };

  useEffect(() => {
    if (!mapElement.current || mapSetupComplete.current) {
      return;
    }

    olMap.current.setTarget(mapElement.current);

    if (!themeRef.current) {
      themeRef.current = { ...mockMapConfig };
    }

    olMap.current.themes.initCategories({ ...themeRef.current }, true);

    extentControl.current = new ZoomToExtent({
      extent
    });

    // Small tweak to get animation working on extent
    extentControl.current.handleZoomToExtent = () => {
      resetView();
    }

    olMap.current.addControl(extentControl.current);
    layerMap.current = getLayerMap(olMap.current);
    mapSetupComplete.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapElement.current]);

  //Because the reference to resetView would have the value of extent at the time the method was created
  // We need to update the reference on every extent update
  useEffect(() => {
    if (extentControl.current) {
      extentControl.current.handleZoomToExtent = () => {
        resetView();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extent]);

  useEffect(() => {
    if (!olMap.current || !activeLayers || activeLayers.length === 0) {
      return;
    }

    activeLayers.forEach(name => {
      const layMap = layerMap.current[name];
      if (layMap) {
        // ol-themes-ext gets mad on hot reload right here.
        try {
          olMap.current.themes.getCategoryByKey(layMap.categoryId).selectLayer(name);
        } catch (e) {
          console.log('getCategoryByKey useEffect activeLayers ERROR', e);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [[JSON.stringify(activeLayers)]]);

  return {
    resetView,
    layerMap,
    olMap,
    mapElement,
  }
}
