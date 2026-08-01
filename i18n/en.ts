const en = {
  meta: {
    title: 'AUREON S5 — Smart Precision Excavator',
    description:
      'A 5-tonne mini excavator with ground penetrating radar and centimetre-level GNSS positioning. Built in Türkiye for European urban infrastructure work.',
    ogAlt: 'AUREON S5 Smart Precision Excavator',
  },

  brand: {
    name: 'AUREON',
    product: 'AUREON S5',
    slogan: 'Premium Machinery. Built to Endure.',
  },

  nav: {
    positioning: 'Positioning',
    technology: 'Technology',
    specifications: 'Specifications',
    fieldMap: 'Field map',
    export: 'Export',
    contact: 'Contact',
    menu: 'Menu',
    close: 'Close',
    languageLabel: 'Language',
  },

  loader: {
    label: 'Loading scene',
    hint: 'Preparing the scan sequence',
  },

  hero: {
    title: 'AUREON S5',
    subtitle: 'Smart Precision Excavator',
    scrollHint: 'Scroll',
    tags: {
      weight: '5,000 kg',
      gnss: 'GNSS ±2.5 cm',
      noise: '94 dB (LwA)',
      gpr: 'GPR 4.0 m',
    },
    tagNames: {
      weight: 'Operating weight',
      gnss: 'Positioning accuracy',
      noise: 'Sound power level',
      gpr: 'Scan depth',
    },
    sonarLabel: 'Ground Penetrating Radar — Active',
    scanState: {
      idle: 'Standby',
      scanning: 'Scanning',
      resolved: 'Targets resolved',
    },
    detectionFields: {
      depth: 'Depth',
      diameter: 'Ø',
      risk: 'Risk',
    },
    risk: {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
    },
    detections: [
      { id: 'water', label: 'PE-100 water main', depth: '2.40 m', diameter: 'Ø160 mm', risk: 'low' },
      { id: 'power', label: 'Medium voltage cable', depth: '1.15 m', diameter: 'Ø90 mm', risk: 'high' },
      { id: 'fiber', label: 'Fibre optic bundle', depth: '0.85 m', diameter: 'Ø48 mm', risk: 'medium' },
      { id: 'sewer', label: 'Concrete sewer line', depth: '3.20 m', diameter: 'Ø400 mm', risk: 'low' },
    ],
    message: {
      headline: 'It sees before it digs.',
      sub: 'Ground penetrating radar, standard on every S5.',
    },
    chapters: {
      arrival: 'Arrival',
      recognition: 'Recognition',
      scan: 'Subsurface scan',
      message: 'Statement',
    },
  },

  positioning: {
    eyebrow: 'Positioning',
    manifesto: 'The most expensive mistake in urban excavation is hitting what you could not see.',
    body:
      'The S5 was built around a single question: what is under the ground before the bucket goes in. Everything else — the hydraulics, the cabin, the noise envelope — follows from working in a street that is already full.',
    stats: [
      { value: '€ 54,900', label: 'Net sales price' },
      { value: '5,000 kg', label: 'Operating weight' },
      { value: '±2.5 cm', label: 'Positioning accuracy' },
    ],
  },

  technology: {
    eyebrow: 'Technology',
    title: 'Four systems, one purpose',
    intro: 'Nothing here is an option package. Every S5 leaves the line with all four.',
    cards: [
      {
        id: 'gpr',
        title: 'GPR subsurface scanning',
        body:
          'A dual-frequency radar array under the undercarriage maps pipes, cables and ducts before the first cut. Detections are logged with coordinates and depth.',
        metric: '4.0 m depth · ±3 cm',
        metricLabel: 'Detection range',
      },
      {
        id: 'gnss',
        title: 'GNSS / GPS positioning',
        body:
          'RTK-corrected dual-antenna positioning holds grade and line without a second operator on the ground. Design surfaces load directly to the cab display.',
        metric: '±2.5 cm RTK',
        metricLabel: 'Position accuracy',
      },
      {
        id: 'hydraulics',
        title: 'Smart hydraulic control',
        body:
          'A load-sensing circuit meters flow to demand rather than to engine speed. Attachment profiles are stored and recalled per tool.',
        metric: '248 bar',
        metricLabel: 'Working pressure',
      },
      {
        id: 'acoustics',
        title: 'Low noise & vibration',
        body:
          'An isolated powerpack and damped cab mounts keep the machine inside residential working windows and reduce operator exposure over a full shift.',
        metric: '94 dB (LwA) · 2.1 m/s²',
        metricLabel: 'Sound power · hand-arm vibration',
      },
    ],
  },

  specs: {
    eyebrow: 'Specifications',
    title: 'Technical data',
    note: 'Figures are for the standard configuration with rubber tracks and a 0.16 m³ bucket.',
    columns: { parameter: 'Parameter', value: 'Value' },
    groups: [
      {
        id: 'dimensions',
        title: 'Dimensions',
        rows: [
          ['Operating weight', '5,000 kg'],
          ['Transport length', '5,480 mm'],
          ['Transport width', '1,960 mm'],
          ['Cab height', '2,550 mm'],
          ['Track length on ground', '2,150 mm'],
          ['Ground clearance', '345 mm'],
          ['Tail swing radius', '1,290 mm'],
        ],
      },
      {
        id: 'engine',
        title: 'Engine',
        rows: [
          ['Model', 'AUREON D24-T'],
          ['Type', '4-cylinder turbo diesel'],
          ['Displacement', '2,400 cm³'],
          ['Rated power', '33.5 kW @ 2,200 rpm'],
          ['Max. torque', '165 Nm @ 1,600 rpm'],
          ['Fuel tank', '90 L'],
        ],
      },
      {
        id: 'hydraulics',
        title: 'Hydraulics',
        rows: [
          ['Working pressure', '248 bar'],
          ['Main pump flow', '2 × 58 L/min'],
          ['Auxiliary circuit', '75 L/min'],
          ['Swing torque', '11.4 kNm'],
          ['Hydraulic tank', '62 L'],
          ['Control', 'Load-sensing, electro-proportional'],
        ],
      },
      {
        id: 'performance',
        title: 'Digging performance',
        rows: [
          ['Max. digging depth', '3,720 mm'],
          ['Max. reach at ground level', '6,140 mm'],
          ['Max. dumping height', '4,180 mm'],
          ['Bucket breakout force', '41.2 kN'],
          ['Arm breakout force', '26.8 kN'],
          ['Standard bucket', '0.16 m³'],
          ['Travel speed', '2.6 / 4.5 km/h'],
        ],
      },
      {
        id: 'electronics',
        title: 'Electronics',
        rows: [
          ['GPR scan depth', '4.0 m'],
          ['GPR accuracy', '±3 cm'],
          ['GNSS accuracy', '±2.5 cm (RTK)'],
          ['Display', '10.1" anti-glare touch'],
          ['Telematics', '4G LTE / CAN-bus'],
          ['Onboard logging', '30 days'],
        ],
      },
      {
        id: 'compliance',
        title: 'Emission & compliance',
        rows: [
          ['Sound power level', '94 dB (LwA)'],
          ['Operator ear noise', '76 dB (LpA)'],
          ['Hand-arm vibration', '2.1 m/s²'],
          ['Whole-body vibration', '0.48 m/s²'],
          ['Emission stage', 'EU Stage V'],
          ['Certification', 'CE · ISO 9001'],
        ],
      },
    ],
  },

  map: {
    eyebrow: 'Reference field map',
    title: 'See an AUREON at work',
    subtitle: 'Look at a site, not a brochure. Visit the AUREON closest to you.',
    nearestPrefix: 'Nearest AUREON to you',
    locating: 'Locating',
    locationFallback: 'Default reference point: Madrid, Spain',
    distanceUnit: 'km',
    listView: 'List',
    globeView: 'Globe',
    dragHint: 'Drag to rotate · select a marker',
    selectPrompt: 'Select a marker to see the site record.',
    emptyRegion: 'No AUREON in this region yet —',
    emptyRegionCta: 'be the first',
    disclaimer: 'Reference site information is representative.',
    sectors: {
      'urban-renewal': 'Urban infrastructure renewal',
      'road-sewer': 'Road and sewerage works',
      landscaping: 'Landscaping and public realm',
      fiber: 'Fibre and telecom infrastructure',
      rebuild: 'Urban reconstruction',
      energy: 'Energy infrastructure lines',
      'urban-dig': 'Urban excavation and utilities',
      municipal: 'Municipal infrastructure works',
      water: 'Water mains and drainage',
      'road-urban': 'Road and urban infrastructure',
    } as Record<string, string>,
    countries: {
      slovenia: 'Slovenia',
      romania: 'Romania',
      bulgaria: 'Bulgaria',
      sweden: 'Sweden',
      ukraine: 'Ukraine',
      azerbaijan: 'Azerbaijan',
      georgia: 'Georgia',
      tunisia: 'Tunisia',
      libya: 'Libya',
      algeria: 'Algeria',
    } as Record<string, string>,
    panel: {
      sector: 'Sector',
      inField: 'In field',
      months: 'months',
      hours: 'operating hours',
      certificate: 'Certificate of authenticity',
      serial: 'Serial no.',
      production: 'Built',
      verified: 'Verified',
      cta: 'See this machine on site',
      photoPlaceholder: 'Site image',
      close: 'Close panel',
    },
    modal: {
      titlePrefix: 'Site visit request',
      body:
        'Your request goes to AUREON. We contact you once the host company has approved the visit.',
      privacyNote: 'Host company contact details are never published on this site.',
      fields: {
        name: 'Full name',
        company: 'Company',
        email: 'Email',
        phone: 'Phone',
        date: 'Preferred date',
        note: 'Note',
      },
      submit: 'Send request',
      sending: 'Sending',
      success: 'Request received. We will respond within 24 hours.',
      error: 'Something went wrong. Please try again.',
      close: 'Close',
    },
  },

  exportSection: {
    eyebrow: 'Export & documentation',
    title: 'From the line to your yard',
    body:
      'Every unit leaves with a complete customs file. Delivery to a Spanish yard runs 12–16 days from loading.',
    steps: [
      { id: 'production', label: 'Production' },
      { id: 'qc', label: 'Quality control' },
      { id: 'atr', label: 'A.TR issue' },
      { id: 'loading', label: 'Loading (CMR)' },
      { id: 'customs', label: 'Customs' },
      { id: 'delivery', label: 'Delivery' },
    ],
    badges: ['CE', 'Stage V', 'ISO 9001', 'A.TR movement certificate', 'Customs Union'],
    gtipLabel: 'Customs tariff code',
    gtip: '8429.52.10.00.00',
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Request a quotation',
    body:
      'Tell us where the machine will work and what it will dig. We answer with a written offer, delivery window and the nearest reference site.',
    responseNote: 'Written response within one business day.',
    form: {
      name: 'Full name',
      company: 'Company',
      country: 'Country',
      countryPlaceholder: 'Select a country',
      selectPlaceholder: 'Select',
      email: 'Email',
      phone: 'Phone',
      interest: 'Interest',
      message: 'Message',
      submit: 'Send',
      sending: 'Sending',
      success: 'Message received. We will respond within one business day.',
      error: 'Something went wrong. Please try again.',
      required: 'Required',
      invalidEmail: 'Enter a valid email address',
    },
    interests: [
      { id: 'purchase', label: 'Purchase' },
      { id: 'dealership', label: 'Dealership' },
      { id: 'visit', label: 'Site visit' },
    ],
  },

  footer: {
    quickLinks: 'Sections',
    legal: 'Legal',
    gtipLabel: 'GTIP',
    gtip: '8429.52.10.00.00',
    rights: 'All rights reserved.',
    company: 'AUREON Makina San. ve Tic. A.Ş.',
    address: 'Organize Sanayi Bölgesi, Ankara, Türkiye',
  },

  a11y: {
    skipToContent: 'Skip to content',
    scrollProgress: 'Page scroll progress',
    logoAlt: 'AUREON shield logo',
    heroCanvasAlt:
      'Three-dimensional view of the AUREON S5 excavator scanning buried utility lines with ground penetrating radar.',
    globeAlt: 'Interactive globe showing AUREON reference sites.',
  },
};

export type Dictionary = typeof en;
export default en;
