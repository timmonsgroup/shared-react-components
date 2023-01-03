import 'ol/ol.css';
import './map.css';
import React, { useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';
// import { LoadingSpinner } from '@timmons-group/shared-react-components';

import { createFeature, getFeatures, makeShapeLayer, useThemeMap } from './useMap';
import { useRef } from 'react';

const ThemeMap = forwardRef(({ defaultExtent, themes, mapSet, activeLayers, featuresClicked, features, existingFeatureLayer, highlightStyle }, ref) => {
  const [processing, setProcessing] = useState(false);
  const featureLayer = useRef(null);
  const oThemeMap = useThemeMap(themes, activeLayers);
  const { olMap, mapElement, resetView } = oThemeMap;
  const mapInit = useRef(false);
  const resize = useRef(null);
  const firstExtent = useRef(true);
  const activeLayersRef = useRef([]);


  useImperativeHandle(ref, () => {
    const themes = olMap.current.themes.themes || {};
    const {layerMap} = themes || {};
    return {
      setNewView: () => {
        // example method if parent component ever needs to call an internal method
      },
      getFeatureLayerExtent: () => {
        return featureLayer.current?.getSource().getExtent();
      },
      getLayerExtent: (layer) => {
        return layerMap[layer].getSource().getExtent();
      },
      highlightFeature: (layer, feature) => {
        // const id = feature.get('id'); use once we get the feature id in the props
        layerMap[layer]?.highlight(feature);
      },
      unhighlightFeature: (layer, feature) => {
        layerMap[layer]?.unhighlight(feature);
      },
      unhighlightAllFeatures: (layer) => {
        layerMap[layer]?.unhighlightAll();
      }
    };
  });


  useEffect(() => {
    activeLayersRef.current = activeLayers;
  }, [activeLayers]);

  // Monitor for changes to the default extent then zoom to and change the default extent of the map.
  useEffect(() => {
    if (olMap.current) {
      resetView(defaultExtent, firstExtent.current ? 0 : null);
      firstExtent.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultExtent]);

  // TODO debounce this
  const sizeChanged = () => {
    if (olMap.current) {
      olMap.current.updateSize();
    }
  }

  const handleMapClick = (e) => {
    if (featuresClicked) {
      setTimeout(async () => {
        setProcessing(true);
        const found = await getFeatures(e, olMap.current, activeLayersRef.current);
        setProcessing(false);
        featuresClicked(found);
      }, 125);
    }
  }

  useEffect(() => {
    const map = olMap.current;
    if (map && !mapInit.current) {
      mapInit.current = true;

      if (featuresClicked && !existingFeatureLayer) {
        featureLayer.current = makeShapeLayer(highlightStyle);
        map.addLayer(featureLayer.current);
      }

      if (existingFeatureLayer) {
        featureLayer.current = map.themes.themes.layerMap[existingFeatureLayer];
      }

      map.on('click', handleMapClick);

      resize.current = new ResizeObserver(sizeChanged);
      resize.current.observe(mapElement.current);

      // The useThemeMap hook does not have extent so we set it here (this will also add the extent button);
      if (defaultExtent) {
        resetView(defaultExtent, 0);
        firstExtent.current = false;
      }

      if (mapSet) {
        mapSet(oThemeMap);
      }
    }

    return () => {
      if (resize.current) {
        resize.current.disconnect();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [olMap.current]);

  useEffect(() => {
    if (olMap.current && featureLayer.current) {
      featureLayer.current.getSource().clear();
      if (features?.length > 0) {
        features.forEach((feature) => {
          createFeature(featureLayer.current, feature);
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [[JSON.stringify(features)]]);

  return (
    <div className="MapComponentContainer">
      <div className="MapContainer no-print">
        <div ref={mapElement} className="map">
        </div>
      </div>
      {/* <LoadingSpinner isActive={processing} /> */}
    </div>
  );
});

// Set the displayName to make it easier to identify in the React DevTools
// This needs to be set explicity because the forwardRef is used
// https://reactjs.org/docs/react-component.html#displayname
ThemeMap.displayName = 'ThemeMap';

// See Open Layers Style class for shape for highlightStyle
// https://openlayers.org/en/latest/apidoc/module-ol_style_Style-Style.html
ThemeMap.propTypes = {
  defaultExtent: PropTypes.array,
  existingFeatureLayer: PropTypes.string,
  themes: PropTypes.object,
  allowFeatures: PropTypes.bool,
  activeLayers: PropTypes.array,
  featuresClicked: PropTypes.func,
  features: PropTypes.array,
  mapSet: PropTypes.func,
  highlightStyle: PropTypes.object,
};

export default ThemeMap;