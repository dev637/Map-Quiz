const alpha3Codes = {
  world: [],
  naca: ["CAN", "USA", "BLZ", "CRI", "GTM", "HND", "MEX", "NIC", "PAN", "SLV"],
  "South America": ["ARG", "BOL", "BRA", "CHL", "COL", "ECU", "GUY", "PER", "PRY", "SUR", "URY", "VEN", "GUF"],
  Caribbean: ["ABW", "AIA", "ATG", "BHS", "BLM", "BRB", "CUB", "CUW", "CYM", "DMA", "DOM", "GRD", "HTI", "JAM", "KNA", "LCA", "MAF", "MSR", "PRI", "SXM", "TCA", "TTO", "VCT", "VGB", "VIR", "GLP", "MTQ", "BES"],
  Africa: ["AGO", "BDI", "BEN", "BFA", "BWA", "CAF", "CIV", "CMR", "COD", "COG", "COM", "CPV", "DJI", "DZA", "EGY", "ERI", "ETH", "GAB", "GHA", "GIN", "GMB", "GNB", "GNQ", "KEN", "LBR", "LBY", "LSO", "MAR", "MDG", "MLI", "MOZ", "MRT", "MUS", "MWI", "NAM", "NER", "NGA", "RWA", "ESH", "SDN", "SSD", "SEN", "SLE", "SOM", "STP", "SWZ", "SYC", "TCD", "TGO", "TUN", "TZA", "UGA", "ZAF", "ZMB", "ZWE", "MYT", "REU"],
  Europe: ["ALB", "AND", "AUT", "BEL", "BGR", "BIH", "BLR", "CHE", "CYP", "CZE", "DEU", "DNK", "ESP", "EST", "FIN", "FRA", "GBR", "GRC", "HRV", "HUN", "IRL", "ISL", "ITA", "LIE", "LTU", "LUX", "LVA", "MCO", "MDA", "MKD", "MLT", "MNE", "NLD", "NOR", "POL", "PRT", "ROU", "RUS", "SMR", "SRB", "SVK", "SVN", "SWE", "UKR", "VAT", "KOS"],
  Asia: ["AFG", "ARE", "ARM", "AZE", "BGD", "BHR", "BRN", "BTN", "CHN", "GEO", "IDN", "IND", "IRN", "IRQ", "ISR", "JOR", "JPN", "KAZ", "KGZ", "KHM", "KOR", "KWT", "LAO", "LBN", "LKA", "MDV", "MMR", "MNG", "MYS", "NPL", "OMN", "PAK", "PHL", "PRK", "PSE", "QAT", 
  "SAU", "SGP", "SYR", "THA", "TJK", "TKM", "TLS", "TUR", "TWN", "UZB", "VNM", "YEM"],
  Oceania: ["ASM", "AUS", "FJI", "FSM", "GUM", "KIR", "MHL", "MNP", "NCL", "NFK", "NRU", "NZL", "PLW", "PNG", "SLB", "TON", "VUT", "WLF", "WSM", "COK", "PYF", "PCN", "NIU", "TKL"]
}

const mapConfig = {
  world: { center: [10,0], zoom: 1 },
  naca: { center: [-95,30], zoom: 2.5 },
  "South America": { center: [-65,-30], zoom: 2 },
  Caribbean: { center: [-70,17], zoom: 8.5 },
  Africa: { center: [10,-5], zoom: 2 },
  Europe: { center: [5,50], zoom: 3.5 },
  Asia: { center: [90,20], zoom: 2 },
  Oceania: { center: [-190,-22], zoom: 2 }
}

export { alpha3Codes, mapConfig }