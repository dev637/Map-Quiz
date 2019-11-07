import * as types from './types';
import { modifyWorldGeographyPaths } from '../helpers/attributeFix';
import {
  getWorldTopology,
  getWorldGeographyPaths,
  getPopulationData,
  getWorldDataSet,
  getMapViewIds,
  getNewRegionDataSet,
  getRegionSearchObjectArray,
  getRegionIdUniqueGeoPaths,
} from '../helpers/dataActionHelpers';
import {
  getFilterFunction,
  getEllipseMarkerProperties,
  getCaribbeanMarkerProperties,
} from '../helpers/regionEllipsesHelpers';
import { getRegionStyles } from '../helpers/MapHelpers';
import store from '../store';

export const loadGeographyPaths = () => async dispatch => {
  const worldTopology = await getWorldTopology();
  let geographyPaths = getWorldGeographyPaths(worldTopology);
  geographyPaths = modifyWorldGeographyPaths(geographyPaths);

  await dispatch({ type: types.LOAD_PATHS, geographyPaths });
  dispatch({ type: types.DISABLE_OPT });
};

export const loadRegionData = () => async dispatch => {
  const populationData = await getPopulationData();
  const worldDataSet = await getWorldDataSet(populationData);
  const { mapViewRegionIds, mapViewCountryIds } = getMapViewIds(worldDataSet);
  const regionDataSets = { World: { ...worldDataSet } };

  await dispatch({
    type: types.LOAD_DATA,
    ...worldDataSet,
    regionDataSets,
    populationData,
    mapViewRegionIds,
    mapViewCountryIds,
    regionStyles: getRegionStyles(), 
  });

  dispatch({ type: types.DISABLE_OPT });
};

export const processNewRegionDataSet = regionName => async dispatch => {
  dispatch({ type: types.LOADING_DATA, value: true });

  const newRegionDataSet = await getNewRegionDataSet(regionName);
  const { geographyPaths } = newRegionDataSet;
  let newRegionIdList = geographyPaths.map(x => x.properties.regionID);
  newRegionIdList = [...new Set(newRegionIdList)];

  await dispatch({
    type: types.ADD_REGION_DATA,
    regionName,
    newRegionDataSet,
    newRegionIdList,
  });

  dispatch({ type: types.LOADING_DATA, value: false });
};

export const loadRegionDataSet = regionDataSetKey => async dispatch => {
  let { regionDataSets } = store.getState().data;
  await dispatch({
    type: types.LOAD_REGION_DATA,
    currentMap: regionDataSetKey,
    subRegionName: regionDataSets[regionDataSetKey].subRegionName,
  });
};

export const getRegionEllipses = currentMap => dispatch => {
  const { map, data } = store.getState();
  const { filterRegions, regionKey } = map;
  const { geographyPaths } = data;
  const filterFunc = getFilterFunction(currentMap);
  const markersArray = geographyPaths
    .filter(x => filterRegions.includes(x.properties[regionKey]))
    .filter(filterFunc)
    .map(region => {
      const regionID = region.properties[regionKey];
      const caribbeanMap = currentMap === 'Caribbean';
      const markerData = caribbeanMap
        ? getCaribbeanMarkerProperties(regionID)
        : getEllipseMarkerProperties(region);
      markerData.region = region;
      return markerData;
    });

  dispatch({
    type: types.GET_ELLIPSES,
    currentMap,
    markersArray,
  });
};

export const getRegionSearchOptions = currentMap => dispatch => {
  const { map, data } = store.getState();
  const { regionKey } = map;
  const { geographyPaths, mapViewRegionIds } = data;

  let mapRegions = getRegionIdUniqueGeoPaths(geographyPaths).map(
    obj => obj.properties
  );
  if (currentMap !== 'World') {
    mapRegions = mapRegions.filter(x =>
      mapViewRegionIds[currentMap].includes(x[regionKey])
    );
  }

  const regionSearchOptions = getRegionSearchObjectArray(mapRegions, regionKey);

  dispatch({
    type: types.GET_REGION_SEARCH_LIST,
    currentMap,
    regionSearchOptions,
  });
};
