import React, { Component } from 'react';
import WheelReact from 'wheel-react';
import { geoTimes } from 'd3-geo-projection';
import { Button } from 'semantic-ui-react';
import { isMobile } from 'react-device-detect';
import { connect } from 'react-redux';
import InfoTab from './components/infoTab/infoTab';
import RegionButtons from './components/regionButtons';
import QuizBox from './components/quizBox/quizBox';
import handleInfoTabLoad from './components/infoTab/handleInfoTabLoad';
import handleCountryClick from './components/handleCountryClick';
import handleDoubleClick from './components/handleDoubleClick';
import CountrySearch from './components/countrySearch';
import regionEllipses from './components/regionEllipses';
import countryLabels from './components/countryLabels';
import StatusBar from './components/statusBar/statusBar';
import { loadPaths, loadData } from './actions/dataActions';
import {
  setRegionCheckbox,
  zoomMap,
  recenterMap,
  setMap,
} from './actions/mapActions';
import MobileMessage from './components/mobileMessage';
import { alpha3CodesSov } from './assets/regionAlpha3Codes';
import ChoroplethToggles from './components/ChoroplethToggles';
import DropdownSelectionStyles from './components/styles/DropdownSelectionStyles';
import DirectionPad from './components/DirectionPad';
import Map from './Map';

class App extends Component {
  constructor() {
    super();

    this.state = {
      center: [10, 0],
      defaultCenter: [10, 0],
      zoom: 1,
      defaultZoom: 1,
      zoomFactor: 2,
      scale: 210,
      dimensions: [980, 551],
      selectedProperties: '',
      disableOptimization: false,
      filterRegions: [],
      quizAnswers: [],
      quizGuesses: [],
      quiz: false,
      quizType: null,
      activeQuestionNum: null,
      disableInfoClick: false,
      currentMap: 'World',
      countryMarkers: [],
      capitalMarkers: [],
      fetchRequests: [],
      markerToggle: '',
      checkedRegions: {
        'North & Central America': true,
        'South America': true,
        Caribbean: true,
        Europe: true,
        Africa: true,
        Asia: true,
        Oceania: true,
      },
    };

    WheelReact.config({
      left: () => {
        // console.log('wheel left detected.');
      },
      right: () => {
        // console.log('wheel right detected.');
      },
      up: () => {
        // console.log('wheel up detected.');
        this.props.zoomMap(0.5);
      },
      down: () => {
        // console.log('wheel down detected.');
        this.props.zoomMap(2);
      },
    });

    this.projection = this.projection.bind(this);
    this.handleInfoTabLoad = handleInfoTabLoad.bind(this);
    this.handleCountryClick = handleCountryClick.bind(this);
    this.handleMapRefresh = this.handleMapRefresh.bind(this);
    this.handleDoubleClick = handleDoubleClick.bind(this);
    this.regionEllipses = regionEllipses.bind(this);
    this.countryLabels = countryLabels.bind(this);
    this.toggleOrientation = this.toggleOrientation.bind(this);
    this.adjustMapSize = this.adjustMapSize.bind(this);
  }

  async componentDidMount() {
    const {
      loadPaths,
      loadData,
      setRegionCheckbox,
      setMap,
      adjustMapSize,
    } = this.props;
    await loadPaths();
    await loadData();
    setRegionCheckbox();
    window.addEventListener('orientationchange', this.toggleOrientation);
    window.addEventListener('resize', this.adjustMapSize);

    const width = window.innerWidth;
    const height = window.innerHeight;

    if (isMobile) {
      const dimensions = height > width ? [310, 551] : [980, 551];
      setMap({ dimensions, zoomFactor: 1.5 });
    } else {
      this.adjustMapSize();
    }
  }

  componentWillUnmount() {
    WheelReact.clearTimeout();
    window.removeEventListener('orientationchange', this.toggleOrientation);
    window.removeEventListener('resize', this.adjustMapSize);
  }

  projection() {
    const { dimensions, scale } = this.state;
    return geoTimes()
      .translate(dimensions.map(x => x / 2))
      .scale(scale);
  }

  toggleOrientation() {
    const { map, setMap } = this.props;
    const { dimensions, zoomFactor } = map;
    const newDimensions = dimensions[0] === 310 ? [980, 551] : [310, 551];
    setMap({ dimensions: newDimensions, zoomFactor });
  }

  adjustMapSize() {
    const { map, setMap } = this.props;
    const { dimensions } = map;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const ratio = width / height;
    let newDimensions;
    if (ratio > 1.43) {
      newDimensions = [980, 551];
    } else if (ratio > 0.85) {
      newDimensions = [645, 551];
    } else {
      newDimensions = [420, 551];
    }
    if (newDimensions[0] !== dimensions[0]) {
      setMap({ dimensions: newDimensions, zoomFactor: 2 });
    }
  }

  handleMoveStart(currentCenter) {
    // console.log("Current center: ", currentCenter)
  }

  handleMoveEnd(newCenter) {
    // console.log("New center: ", newCenter)
  }

  handleMapRefresh(args) {
    this.setState({ ...args, disableOptimization: true }, () => {
      this.setState({ disableOptimization: false });
    });
  }

  setQuizRegions(value = null) {
    let checkedRegions = { ...this.state.checkedRegions };
    if (value) {
      checkedRegions[value] = !checkedRegions[value];
    }

    const filterRegions = Object.keys(checkedRegions)
      .filter(region => checkedRegions[region])
      .map(region => alpha3CodesSov[region])
      .reduce((a, b) => a.concat(b), []);

    this.handleMapRefresh({ checkedRegions, filterRegions });
  }

  render() {
    const {
      quiz,
      quizAnswers,
      quizGuesses,
      activeQuestionNum,
      selectedProperties,
      fetchRequests,
      currentMap,
      markerToggle,
      zoomFactor,
    } = this.state;

    const footerStyle = isMobile ? { fontSize: '10px' } : {};

    return (
      <div className="App">
        {!quiz && (
          <header className="App-header">
            <h1 className="App-title">Map Quiz</h1>
          </header>
        )}

        {isMobile && <MobileMessage />}

        <div className="zoomButtons">
          <Button.Group size="tiny" basic vertical>
            <Button
              onClick={() => this.props.zoomMap(zoomFactor)}
              icon="plus"
            />
            <Button
              onClick={() => this.props.zoomMap(1 / zoomFactor)}
              icon="minus"
            />
            <Button onClick={this.props.recenterMap} icon="undo" />
          </Button.Group>
        </div>

        <QuizBox />

        <DropdownSelectionStyles quiz={quiz} isMobile={isMobile}>
          <CountrySearch />
          <RegionButtons />
        </DropdownSelectionStyles>

        <StatusBar status={{ quiz, quizGuesses, quizAnswers }} />

        <InfoTab />

        <ChoroplethToggles />

        <DirectionPad />

        <div {...WheelReact.events}>
          <Map props={this} />
        </div>
        <footer>
          <div style={footerStyle}>
            Copyright © 2018 Devang Patel. All rights reserved.
          </div>
        </footer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.data,
  map: state.map,
});

export default connect(
  mapStateToProps,
  {
    loadPaths,
    loadData,
    setRegionCheckbox,
    zoomMap,
    recenterMap,
    setMap,
  }
)(App);
