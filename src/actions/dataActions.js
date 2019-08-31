import { LOAD_PATHS, LOAD_DATA, DISABLE_OPT } from './types';
import {
  DataFix,
  CountryMarkersFix,
  CapitalMarkersFix,
  modifyWorldGeographyPaths,
} from '../helpers/attributeFix';
import {
  getWorldTopology,
  getWorldGeographyPaths,
  copyWorldGeographyPaths,
  getRestCountryData,
  getPopulationData,
  getRegionMarkers,
  getCapitalMarkers,
  updatePopDataInGeoPaths,
} from '../helpers/dataActionHelpers';

export const loadPaths = () => async dispatch => {
  const worldTopology = await getWorldTopology();
  let geographyPaths = getWorldGeographyPaths(worldTopology);
  geographyPaths = modifyWorldGeographyPaths(geographyPaths);

  await dispatch({ type: LOAD_PATHS, geographyPaths });
  dispatch({ type: DISABLE_OPT });
};

export const loadData = () => async dispatch => {
  let geographyPaths = copyWorldGeographyPaths();
  let restData = await getRestCountryData();
  const populationData = await getPopulationData();
  restData = DataFix(restData);

  geographyPaths
    .filter(x => (+x.id !== -99 ? 1 : 0))
    .forEach(geography => {
      const countryData = restData.find(c => +c.numericCode === +geography.id);

      geography.properties = countryData;
      geography.properties.spellings = [
        countryData.name,
        ...countryData.altSpellings,
        ...Object.values(countryData.translations),
      ];
    });

  updatePopDataInGeoPaths(populationData, geographyPaths);

  let regionMarkers = getRegionMarkers(geographyPaths);
  let capitalMarkers = getCapitalMarkers(geographyPaths);

  regionMarkers = CountryMarkersFix(regionMarkers);
  capitalMarkers = CapitalMarkersFix(capitalMarkers);

  const World = {
    geographyPaths,
    regionMarkers,
    capitalMarkers,
    subRegionName: 'country',
  };

  const regionDataSets = { World };

  await dispatch({
    type: LOAD_DATA,
    ...World,
    regionDataSets,
    populationData,
  });

  dispatch({ type: DISABLE_OPT });
};
