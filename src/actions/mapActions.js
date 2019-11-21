import { actions } from 'redux-tooltip';
import {
  getGeoPathCenterAndZoom,
  getOrientation,
  getNewCenter,
  getChoroplethTooltipContent,
  getVisibleRegionStyles,
} from '../helpers/mapActionHelpers';
import {
  getRegionStyles,
  getSelectUpdatedRegionStyles,
} from '../helpers/MapHelpers';
import { getChoroplethParams } from '../helpers/choroplethFunctions';
import * as types from './types';
import store from '../store';

const { show, hide } = actions;

export const setRegionCheckbox = regionName => async dispatch => {
  const checkedRegions = [...store.getState().map.checkedRegions];
  const { mapViewCountryIds } = store.getState().data;

  if (regionName) {
    const idx = checkedRegions.indexOf(regionName);
    if (idx === -1) {
      checkedRegions.push(regionName);
    } else if (checkedRegions.length > 1) {
      checkedRegions.splice(idx, 1);
    } else {
      return;
    }
  }

  await updateCheckedRegions(dispatch, checkedRegions);
  await partialMapRefresh(dispatch, mapViewCountryIds[regionName]);
};

export const regionSelect = regionName => async dispatch => {
  const { checkedRegions } = store.getState().map;
  const { mapViewRegionIds } = store.getState().data;
  await dispatch({
    type: types.CHANGE_MAP_VIEW,
    regionName,
    filterRegions: mapViewRegionIds[regionName] || [],
  });
  await partialMapRefresh(dispatch, mapViewRegionIds[regionName]);
  if (regionName === 'World') {
    await updateCheckedRegions(dispatch, checkedRegions);
    await dispatch({ type: types.UPDATE_MAP, regionStyles: getRegionStyles() });
    dispatch({ type: types.DISABLE_OPT });
  }
};

const updateCheckedRegions = async (dispatch, checkedRegions) => {
  const { mapViewCountryIds } = store.getState().data;
  const filterRegions = checkedRegions
    .map(region => mapViewCountryIds[region])
    .reduce((a, b) => a.concat(b), []);
  await dispatch({
    type: types.SET_REGION_CHECKBOX,
    checkedRegions,
    filterRegions,
  });
};

export const regionZoom = event => async dispatch => {
  const { geographyPaths } = store.getState().data;
  const { selectedProperties } = store.getState().quiz;
  const geographyPath = geographyPaths.find(
    x => x.properties.name === event.target.innerText
  );

  if (!geographyPath) {
    return;
  }

  const { properties } = geographyPath;
  const oldRegionID = selectedProperties.regionID;
  const newRegionID = properties.regionID;
  const regionIDList =
    oldRegionID === newRegionID ? [newRegionID] : [oldRegionID, newRegionID];
  const { center, zoom } = getGeoPathCenterAndZoom(geographyPath);
  await dispatch({
    type: types.REGION_SELECT,
    selectedProperties: properties,
    center,
    zoom,
  });
  await partialMapRefresh(dispatch, regionIDList);
};

export const zoomMap = factor => dispatch => {
  dispatch({ type: types.ZOOM_MAP, factor });
};

export const recenterMap = () => dispatch => {
  dispatch({ type: types.RECENTER_MAP });
};

export const setMap = ({ dimensions, zoomFactor }) => async dispatch => {
  const orientation = getOrientation(dimensions[0]);
  await dispatch({
    type: types.SET_MAP,
    dimensions,
    orientation,
    zoomFactor,
  });
  dispatch({ type: types.DISABLE_OPT });
};

export const moveMap = (event, data) => async dispatch => {
  const direction = data.value;
  const newCenter = getNewCenter(direction);
  await dispatch({
    type: types.MOVE_CENTER,
    center: newCenter,
  });
  dispatch({ type: types.DISABLE_OPT });
};

export const setChoropleth = choropleth => async dispatch => {
  const { currentMap } = store.getState().map;
  const mapChoroData = store.getState().data.choroplethParams[currentMap];
  if (!(mapChoroData && mapChoroData[choropleth]) && choropleth !== 'None') {
    const { regionStyles, bounds } = getChoroplethParams(choropleth);
    if (!regionStyles) {
      alert(`Sorry! ${choropleth} data not available.`);
      return;
    }
    await dispatch({
      type: types.SET_CHOROPLETH_PARAMS,
      currentMap,
      attribute: choropleth,
      regionStyles,
      bounds,
    });
  }
  await dispatch({ type: types.SET_CHOROPLETH, choropleth });
  const regionStyles = getVisibleRegionStyles();
  await dispatch({ type: types.UPDATE_MAP, regionStyles });
  dispatch({ type: types.DISABLE_OPT });
};

export const tooltipMove = (geography, evt) => dispatch => {
  const { choropleth } = store.getState().map;
  const { name } = geography.properties;
  let content = name;
  if (choropleth !== 'None') {
    content += getChoroplethTooltipContent(geography);
  }
  const x = evt.clientX;
  const y = evt.clientY + window.pageYOffset;
  dispatch(
    show({
      origin: { x, y },
      content,
    })
  );
};

export const tooltipLeave = () => dispatch => {
  dispatch(hide());
};

export const tooltipToggle = () => async dispatch => {
  await dispatch({ type: types.TOGGLE_TOOLTIP });
  dispatch({ type: types.DISABLE_OPT });
};

export const sliderSet = value => dispatch => {
  dispatch({ type: types.TOGGLE_SLIDER, value });
};

export const setChoroYear = value => async dispatch => {
  await dispatch({ type: types.SET_CHORO_YEAR, value });
  const regionStyles = getVisibleRegionStyles();
  await dispatch({ type: types.UPDATE_MAP, regionStyles });
  dispatch({ type: types.DISABLE_OPT });
};

export const partialMapRefresh = async (dispatch, regionIDList) => {
  await dispatch({
    type: types.UPDATE_MAP,
    regionStyles: getSelectUpdatedRegionStyles(regionIDList),
  });
  dispatch({ type: types.DISABLE_OPT });
};
