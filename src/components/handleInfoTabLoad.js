export default function handleInfoTabLoad(geo) {
  const { alpha3Code } = geo;
  fetch(`https://restcountries.eu/rest/v2/alpha/${alpha3Code}?fields=flag;capital;population;area`)
    .then(restCountry => restCountry.json())
    .then((restCountryData) => {
      let newGeo;
      const newPaths = this.state.geographyPaths.map((geography) => {
        if (geography.properties.alpha3Code === alpha3Code) {
          newGeo = Object.assign({}, geography);
          newGeo.properties = { ...newGeo.properties, ...restCountryData };
          return newGeo;
        }
        return geography;
      });
      this.setState({ geographyPaths: newPaths, selectedProperties: newGeo.properties });
    });
}
