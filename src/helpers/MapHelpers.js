import { choroplethColor } from './choroplethFunctions';
import store from '../store';

const RIGHT_ANSWER_COLOR = 'rgb(144, 238, 144)';
const WRONG_ANSWER_COLOR = 'rgb(255, 69, 0)';
const PROMPT_COLOR = 'rgb(255, 255, 0)';
const DEFAULT_GEO_STYLE = {
  defaultColor: 'rgb(0, 140, 0)',
  hoverColor: 'rgb(0, 120, 0)',
  pressedColor: 'rgb(0, 70, 0)',
};
const DEFAULT_STROKE_STYLE = {
  strokeWidth: 0.05,
  strokeColor: 'white',
};

export const checkRegionHide = geography => {
  const { filterRegions, currentMap } = store.getState().map;
  const isRegionOnQuiz = filterRegions.includes(geography.properties.regionID);
  const isRegionHidden = currentMap !== 'World' ? !isRegionOnQuiz : false;
  return isRegionHidden;
};

export const getRegionStyles = () => {
  const { geographyPaths } = store.getState().data;
  return geographyPaths.reduce((regionStyles, geoPath) => {
    const { regionID } = geoPath.properties;
    regionStyles[regionID] = colorPicker(geoPath);
    return regionStyles;
  }, {});
};

export const getSelectUpdatedRegionStyles = regionIDList => {
  const { geographyPaths } = store.getState().data;
  const { regionStyles } = store.getState().map;
  return regionIDList.reduce(
    (newRegionStyles, regionID) => {
      const geoPath = geographyPaths.find(
        geoPath => geoPath.properties.regionID === regionID
      );
      if (geoPath) {
        newRegionStyles[regionID] = colorPicker(geoPath);
      }
      return newRegionStyles;
    },
    { ...regionStyles }
  );
};

export const colorPicker = geo => {
  const {
    isQuizActive,
    selectedProperties,
    infoTabShow,
  } = store.getState().quiz;
  const { choropleth } = store.getState().map;
  const isSelected =
    selectedProperties.regionID === geo.properties.regionID
      ? infoTabShow
      : false;
  const regionID = geo.properties.regionID;
  const geoStyleBasic = { ...DEFAULT_GEO_STYLE };
  const stroke = { ...DEFAULT_STROKE_STYLE };

  if (isSelected) {
    setGeoStyleSelected(geoStyleBasic, stroke);
  }

  if (isQuizActive) {
    updateGeographyQuizStyle(regionID, geoStyleBasic);
  }

  checkWorldViewHide(geo, geoStyleBasic, stroke);

  if (choropleth !== 'None' && !isQuizActive) {
    geoStyleBasic.defaultColor = choroplethColor(choropleth, geo);
  }

  const geoStyle = getGeoStyle(geoStyleBasic);

  return { geoStyle, stroke };
};

export const updateGeographyQuizStyle = (regionID, geoStyleBasic) => {
  const {
    quizGuesses,
    quizAnswers,
    isTypeQuizActive,
    activeQuestionNum,
  } = store.getState().quiz;
  const geoQuizIdx = quizAnswers.indexOf(regionID);

  // Fills region with name input request as yellow
  if (isTypeQuizActive && quizAnswers[activeQuestionNum] === regionID) {
    geoStyleBasic.defaultColor = PROMPT_COLOR;
    geoStyleBasic.hoverColor = PROMPT_COLOR;
  }

  // Fills status of region name guess, green for correct and red for incorrect
  if (isTypeQuizActive && quizGuesses[geoQuizIdx] !== undefined) {
    const answer = quizGuesses[geoQuizIdx][1]
      ? RIGHT_ANSWER_COLOR
      : WRONG_ANSWER_COLOR;
    geoStyleBasic.defaultColor = answer;
    geoStyleBasic.hoverColor = answer;
  }

  // Fills status of region click, green for correct and red for incorrect
  geoStyleBasic.pressedColor =
    !isTypeQuizActive && regionID === quizAnswers[activeQuestionNum]
      ? RIGHT_ANSWER_COLOR
      : WRONG_ANSWER_COLOR;

  // Fills correct region click guesses as green
  if (geoQuizIdx !== -1 && quizGuesses[geoQuizIdx]) {
    geoStyleBasic.defaultColor = RIGHT_ANSWER_COLOR;
    geoStyleBasic.hoverColor = RIGHT_ANSWER_COLOR;
  }
};

export const setGeoStyleSelected = (geoStyleBasic, stroke) => {
  const { defaultZoom } = store.getState().map;
  geoStyleBasic.defaultColor = 'rgb(0, 100, 0)';
  geoStyleBasic.hoverColor = 'rgb(0, 100, 0)';
  stroke.strokeWidth = 1 / defaultZoom;
  stroke.strokeColor = PROMPT_COLOR;
};

export const checkWorldViewHide = (geography, geoStyleBasic, stroke) => {
  const { currentMap, filterRegions } = store.getState().map;
  const { selectedProperties, infoTabShow } = store.getState().quiz;
  const isSelected =
    selectedProperties === geography.properties ? infoTabShow : false;
  const { regionOf, regionID } = geography.properties;
  const onQuiz = filterRegions.includes(regionID);
  if (currentMap === 'World' && !regionOf && !onQuiz) {
    geoStyleBasic.defaultColor = 'rgba(0, 104, 0, .05)';
    stroke.strokeWidth = !isSelected ? 0.01 : stroke.strokeWidth;
  }
};

export const getGeoStyle = ({ defaultColor, hoverColor, pressedColor }) => ({
  default: {
    fill: defaultColor,
    transition: 'fill .5s',
  },
  hover: {
    fill: hoverColor,
    transition: 'fill .5s',
  },
  pressed: {
    fill: pressedColor,
    transition: 'fill .5s',
  },
});

export const defaultStyle = {
  geoStyle: getGeoStyle({ ...DEFAULT_GEO_STYLE }),
  stroke: { ...DEFAULT_STROKE_STYLE },
};
