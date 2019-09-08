import { choroplethColor } from './choroplethFunctions';
import store from '../store';

const RIGHT_ANSWER_COLOR = 'rgb(144, 238, 144)';
const WRONG_ANSWER_COLOR = 'rgb(255, 69, 0)';
const PROMPT_COLOR = 'rgb(255, 255, 0)';

export const checkRegionHide = geography => {
  const { filterRegions, currentMap, regionKey } = store.getState().map;
  const regionID = geography.properties[regionKey];
  const isRegionOnQuiz = filterRegions.includes(regionID);
  const isRegionHidden = currentMap !== 'World' ? !isRegionOnQuiz : false;
  return isRegionHidden;
};

export const colorPicker = geo => {
  const {
    isQuizActive,
    selectedProperties,
    infoTabShow,
  } = store.getState().quiz;
  const { regionKey } = store.getState().map;
  const { filterRegions, choropleth, defaultZoom } = store.getState().map;
  const isSelected =
    selectedProperties === geo.properties ? infoTabShow : false;
  const { regionOf } = geo.properties;
  const regionID = geo.properties[regionKey];
  let defaultColor = 'rgb(0, 140, 0)';
  let hoverColor = 'rgb(0, 120, 0)';
  let pressedColor = 'rgb(0, 70, 0)';
  let strokeWidth = 0.05;
  let strokeColor = 'black';

  if (isSelected) {
    defaultColor = 'rgb(0, 100, 0)';
    hoverColor = 'rgb(0, 100, 0)';
    strokeWidth = 1 / defaultZoom;
    strokeColor = PROMPT_COLOR;
  }

  let geoStyle = { defaultColor, hoverColor, pressedColor };

  if (isQuizActive === true) {
    geoStyle = getGeographyQuizStyling(regionID, geoStyle);
  }

  defaultColor = geoStyle.defaultColor;

  const onQuiz = filterRegions.includes(regionID);
  defaultColor = !regionOf && !onQuiz ? 'rgba(0, 104, 0, .05)' : defaultColor;
  strokeWidth = !isSelected && !regionOf && !onQuiz ? 0.01 : strokeWidth;

  if (choropleth !== 'None' && !isQuizActive) {
    defaultColor = choroplethColor(choropleth, geo);
  }

  geoStyle = getGeoStyle({ defaultColor, hoverColor, pressedColor });

  return {
    geoStyle,
    strokeWidth,
    strokeColor,
  };
};

export const getGeographyQuizStyling = (regionID, geoStyle) => {
  const {
    quizGuesses,
    quizAnswers,
    isTypeQuizActive,
    activeQuestionNum,
  } = store.getState().quiz;
  const geoQuizIdx = quizAnswers.indexOf(regionID);
  let { defaultColor, hoverColor, pressedColor } = geoStyle;

  // Fills region with name input request as yellow
  if (isTypeQuizActive && quizAnswers[activeQuestionNum] === regionID) {
    defaultColor = PROMPT_COLOR;
    hoverColor = PROMPT_COLOR;
  }

  // Fills status of region name guess, green for correct and red for incorrect
  if (isTypeQuizActive && quizGuesses[geoQuizIdx] !== undefined) {
    const answer = quizGuesses[geoQuizIdx][1]
      ? RIGHT_ANSWER_COLOR
      : WRONG_ANSWER_COLOR;
    defaultColor = answer;
    hoverColor = answer;
  }

  // Fills status of region click, green for correct and red for incorrect
  pressedColor =
    !isTypeQuizActive && regionID === quizAnswers[activeQuestionNum]
      ? RIGHT_ANSWER_COLOR
      : WRONG_ANSWER_COLOR;

  // Fills correct region click guesses as green
  if (geoQuizIdx !== -1 && quizGuesses[geoQuizIdx]) {
    defaultColor = RIGHT_ANSWER_COLOR;
    hoverColor = RIGHT_ANSWER_COLOR;
  }

  return { defaultColor, hoverColor, pressedColor };
};

export const getGeoStyle = ({ defaultColor, hoverColor, pressedColor }) => ({
  default: {
    fill: defaultColor,
    transition: 'fill .5s',
    outline: 'yellow',
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
