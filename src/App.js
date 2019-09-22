import React, { Component } from 'react';
import { isMobile } from 'react-device-detect';
import { connect } from 'react-redux';
import { loadGeographyPaths, loadRegionData, getRegionEllipses } from './actions/dataActions';
import { setRegionCheckbox, setMap } from './actions/mapActions';
import SidebarContainer from './components/SidebarContainer';
import InterfaceElements from './components/InterfaceElements';
import Map from './Map';

class App extends Component {
  constructor() {
    super();

    this.state = {
      menuOpen: true,
    };
  }

  async componentDidMount() {
    const { setMap } = this.props;
    const { innerWidth, innerHeight } = window;
    if (isMobile) {
      const dimensions = innerHeight > innerWidth ? [310, 551] : [980, 551];
      setMap({ dimensions, zoomFactor: 1.5 });
    } else {
      this.adjustMapSize();
    }

    await this.handleAppDataLoad();

    window.addEventListener('orientationchange', this.toggleOrientation);
    // Disable on mobile due to keyboard triggering resize
    if (!isMobile) {
      window.addEventListener('resize', this.adjustMapSize);
    }
  }

  handleAppDataLoad = async () => {
    const {
      loadGeographyPaths,
      loadRegionData,
      setRegionCheckbox,
      getRegionEllipses,
    } = this.props;
    await loadGeographyPaths();
    await loadRegionData();
    await setRegionCheckbox();
    getRegionEllipses('World');
  };

  componentWillUnmount() {
    window.removeEventListener('orientationchange', this.toggleOrientation);
    window.removeEventListener('resize', this.adjustMapSize);
  }

  toggleOrientation = () => {
    const { map, setMap } = this.props;
    const { dimensions, zoomFactor } = map;
    const newDimensions = dimensions[0] === 310 ? [980, 551] : [310, 551];
    setMap({ dimensions: newDimensions, zoomFactor });
  };

  adjustMapSize = () => {
    const { map: dimensions, setMap } = this.props;
    const { innerWidth, innerHeight } = window;
    const ratio = innerWidth / innerHeight;
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
  };

  handleMenu = () => this.setState({ menuOpen: !this.state.menuOpen });

  render() {
    const { isQuizActive } = this.props.quiz;
    const { menuOpen } = this.state;
    const footerStyle = isMobile ? { fontSize: '10px' } : {};
    return (
      <div className="App">
        {!isQuizActive && (
          <header className="App-header">
            <h1 className="App-title">Map Quiz</h1>
          </header>
        )}
        <InterfaceElements />
        <SidebarContainer handleMenu={this.handleMenu} menuOpen={menuOpen} />

        <Map />
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
  quiz: state.quiz,
});

export default connect(
  mapStateToProps,
  {
    loadGeographyPaths,
    loadRegionData,
    getRegionEllipses,
    setRegionCheckbox,
    setMap,
  }
)(App);
