// src/data/caseStudies.ts — REAL customer case studies from official sources.
// Source: 2026 OWON Technology Catalog (pp.21-28, 5 cases, `source: 'catalog'`)
// and 欧万养老看护AIOT方案画册 (3 senior-care cases, `source: 'brochure'`).
// NO fabricated content — every claim traces to the source documents.

export interface CaseStudyResult {
  metric: string;
  label: string;
}

export interface CaseStudy {
  slug: string;
  category: string;
  title: string;
  client: string;
  location: string;
  /** Placeholder image — real OWON product shot matching the case domain.
   *  Temporary: swap for a real case photo when one is available. */
  image: string;
  background: string;
  solution: string;
  results: CaseStudyResult[];
  /** Related product slugs (only models explicitly named by the source doc). */
  products: string[];
  /** 'catalog' = verified against 2026 Catalog; 'brochure' = from AiHome brochure. */
  source: 'catalog' | 'brochure';
}

export const caseStudies: CaseStudy[] = [
  {
    slug: '4g-clamp-meter-carbon',
    category: 'Carbon & Energy',
    title: 'Carbon Emission Monitoring with 4G Clamp-Type Smart Meter',
    client: 'A Global Energy Management Platform Provider',
    location: 'Multi-Country',
    image: 'https://documents.owon-iot.com/product-images/pc341-w-mqtt/pc341-w-mqtt-01.jpg',
    background:
      'Commissioned by national energy agencies to develop a carbon emission monitoring system for commercial incentive and penalty purposes. Required a smart meter that installs without disrupting existing billing systems, supports single/split/three-phase circuits from 50A to 1000A, adapts to different cellular networks, and complies with local data privacy regulations.',
    solution:
      "OWON delivered a Smart Electric Meter with open-type CTs for non-invasive installation on existing circuits. A single model supports all phase types and current ranges by simply changing CT size. Communicates via LTE with swappable modules for different countries. Device-level local APIs enable direct data forwarding to each country's designated cloud server, avoiding intermediate data servers for full regulatory compliance.",
    results: [
      { metric: '50A–1000A', label: 'Universal Range' },
      { metric: '4G/Cat1/CatM', label: 'Multi-Network' },
      { metric: 'Non-Invasive', label: 'Quick Install' },
      { metric: 'Local API', label: 'Data Sovereignty' },
    ],
    products: ['pc321'],
    source: 'catalog',
  },
  {
    slug: 'hybrid-thermostat',
    category: 'HVAC & Heating',
    title: 'Dual Fuel Thermostat for Heat Pump + Furnace Systems',
    client: 'A North American Furnace & Heat Pump Manufacturer',
    location: 'North America',
    image: 'https://documents.owon-iot.com/product-images/pct533c-w-ty/pct533c-w-ty-02.jpg',
    background:
      'Heat pump adoption has grown rapidly, but many households retain conventional heating/cooling equipment. The manufacturer needed a thermostat that controls both systems and intelligently switches between them for optimal cost-effectiveness. Additional requirements included outdoor temperature acquisition, compatibility with a proprietary Wi-Fi module and backend server, and humidifier/dehumidifier control.',
    solution:
      "OWON customized an existing thermostat model — rewrote firmware for dual-fuel switching logic, integrated outdoor temperature from online weather data and a wireless sensor, replaced the communication module with the client's designated Wi-Fi module (MQTT protocol), and added extra relays and terminals for humidity control.",
    results: [
      { metric: 'Dual Fuel', label: 'Heat Pump + Furnace' },
      { metric: 'Custom FW', label: 'Bespoke Control Logic' },
      { metric: 'MQTT', label: 'Client Server Compatible' },
      { metric: 'Extra Relays', label: 'Humidity Control' },
    ],
    products: [],
    source: 'catalog',
  },
  {
    slug: 'residential-heating-eu',
    category: 'HVAC & Heating',
    title: 'Government-Driven Residential Heating Energy Saving System',
    client: 'A European System Integrator',
    location: 'Europe',
    image: 'https://documents.owon-iot.com/product-images/pct513/pct513-01.jpg',
    background:
      'A government initiative to reduce residential heating energy consumption required a system that manages all mainstream European heating equipment — boilers, heat pumps, hot water, hydraulic and electric radiators, underfloor heating. Critical requirements: full offline operation, mobile app control without a Wi-Fi router (AP mode), and complete device-level local APIs for custom cloud and mobile development.',
    solution:
      'OWON provided a full ZigBee ecosystem centered on an Edge Gateway. PCT512 controls boilers/heat pumps, TRV517 handles hydraulic radiators, PIR323 + SLC621 manage electric heaters, and THS317-ET + SLC651 control underfloor heating. The gateway supports three modes — Local (same Wi-Fi), Internet (remote cloud), and AP (direct hotspot). TCP/IP and MQTT APIs provided for system integration.',
    results: [
      { metric: '3 Modes', label: 'Local / Internet / AP' },
      { metric: 'Offline', label: 'No Internet Required' },
      { metric: 'Full API', label: 'TCP/IP + MQTT' },
      { metric: 'All Equipment', label: 'Boiler to Underfloor' },
    ],
    products: ['pir323', 'ths317'],
    source: 'catalog',
  },
  {
    slug: 'hotel-room-management',
    category: 'Hospitality',
    title: 'Guest Room Management System for a Chain Resort Hotel',
    client: 'A Smart Hotel System Provider',
    location: 'Global',
    image: 'https://documents.owon-iot.com/product-images/hero/thermostat-family-hero.png',
    background:
      'The client sought a wireless IoT system to replace traditional wired BMS, which is expensive and difficult to install. They needed faster deployment, lower costs, and the ability to integrate both OWON and third-party smart devices through a unified gateway with device-level MQTT API. Some high-end locations also required Android-based touchscreen control panels.',
    solution:
      "OWON provided a complete ZigBee 3.0 ecosystem: IoT gateway (Wi-Fi/Ethernet/4G) with full MQTT device-level APIs, and a comprehensive line of hotel room devices — wall switches, relay switches, wall sockets, power meters, fan coil thermostats, curtain controllers, door/window sensors, temperature/humidity sensors, and occupancy sensors. The gateway supports offline mode with local device-to-device logic. Android touchscreen control panels were supplied from OWON's 20-year industrial tablet experience. Custom devices (DND buttons, door signage, relay switches) were developed for specific project needs.",
    results: [
      { metric: 'Wireless', label: 'No Wiring Required' },
      { metric: 'ZigBee 3.0', label: '3rd-Party Compatible' },
      { metric: 'Offline', label: 'Works Without Internet' },
      { metric: 'Full Line', label: 'All Room Devices' },
    ],
    products: ['seg-x5', 'pct504', 'pc321', 'cb432', 'pr412', 'dws332', 'ops305'],
    source: 'catalog',
  },
  {
    slug: 'home-energy-telecom',
    category: 'Telecom & Utility',
    title: 'Home Energy Management for Millions of Homes',
    client: 'A European Telecommunication Company',
    location: 'Europe',
    image: 'https://documents.owon-iot.com/product-images/pc321/pc321-01.jpg',
    background:
      'The telecom operator planned a Home Energy Management System (HEMS) for mass deployment to millions of homes. Requirements: monitor and control energy consumption, solar generation, and EV chargers; schedule HVAC equipment including boilers, heat pumps, and mini-split A/C; enable device-to-device interactions such as turning off A/C when a window opens or adjusting EV charging based on solar surplus; and provide device-level local APIs for direct cloud integration.',
    solution:
      "OWON delivered a complete ZigBee device suite — clamp power meters, Din rail relays, and smart plugs for energy monitoring; thermostats and IR blasters for HVAC control — plus a Smart ZigBee Hub with local networking capabilities for device-to-device interaction logic. The hub's complete local API allows direct connection to the Telco's backend server with no intermediate cloud dependency.",
    results: [
      { metric: 'Millions', label: 'Target Deployment' },
      { metric: 'ZigBee Hub', label: 'Local Intelligence' },
      { metric: 'EV + Solar', label: 'Full Home Energy' },
      { metric: 'Direct API', label: 'No Cloud Middleman' },
    ],
    products: ['cb432', 'pc321', 'wsp403'],
    source: 'catalog',
  },
  {
    slug: 'senior-care-platform',
    category: 'Senior Care',
    title: 'Smart Senior Care Platform — Home · Community · Facility',
    client: 'A State-Owned Senior Service Company (Hubei Cultural Tourism Group)',
    location: 'Hubei, China',
    image: 'https://documents.owon-iot.com/product-images/pir323/pir323-01.png',
    background:
      'Operating nearly 100 service locations across Hubei Province with 1,000+ home-based care beds and over 1 million cumulative visits (50,000+ monthly). Needed a unified platform managing three independent scenarios — home care, community care, and cafeteria services — plus a family app, admin backend, meal sales analytics, facility bed management, and AI-generated behavioral summaries for care decision support.',
    solution:
      'Deployed 4G door sensors, PIR detectors, smoke alarms, and water leak sensors — no gateway required, data goes directly to cloud. Resident activity data feeds into the AiHome platform for automatic behavioral summaries. Family members use the AiHome Family app; community staff use a web-based centralized monitoring dashboard. The cafeteria module supports meal sales tracking, menu management, and best-seller rankings. The platform includes built-in facility bed management for bed assignment and admission.',
    results: [
      { metric: '100+', label: 'Service Locations' },
      { metric: '1,000+', label: 'Home Care Beds' },
      { metric: '1M+', label: 'Cumulative Visits' },
      { metric: '3-in-1', label: 'Home · Community · Facility' },
    ],
    products: [],
    source: 'brochure',
  },
  {
    slug: 'senior-care-nursing-home',
    category: 'Senior Care',
    title: 'Five-Star Nursing Home — AiHome Wireless Monitoring System',
    client: 'A Five-Star Nursing Home (Fujian Province)',
    location: 'Fujian, China',
    image: 'https://documents.owon-iot.com/product-images/fds315/fds315-01.jpg',
    background:
      'Dual-phase project: a new 16-story smart ward building (18,000 m², 380 beds) plus retrofitting of an older building (200 beds). Required resident monitoring, environmental sensing, energy management, and temperature control. Devices had to be wireless, battery-powered, and adhesive-mounted to avoid operational disruptions. Software needed to be modular with no custom coding, deployed on a local server for data privacy and offline resilience.',
    solution:
      'Deployed the AiHome system (ZigBee wireless + configurable software): gateways, door/window sensors, PIR detectors, smoke alarms, water leak sensors, temperature/humidity sensors, sleep monitoring mats, fall-detection radar, and thermostats — nearly 1,000 devices. Battery-powered, peel-and-stick installation, deployable by non-technical staff. Software configured via module checkboxes. Local server keeps all data on-premises; full operation without internet. Both phases completed in just weeks.',
    results: [
      { metric: '~1,000', label: 'Devices Deployed' },
      { metric: '580', label: 'Beds Covered' },
      { metric: 'Weeks', label: 'Both Phases Delivered' },
      { metric: 'On-Prem', label: 'Data Stays Local' },
    ],
    products: [],
    source: 'brochure',
  },
  {
    slug: 'senior-care-api-integration',
    category: 'Senior Care',
    title: 'Platform API Integration — AI for Care Software Vendors',
    client: 'A Provincial Senior Care Software Provider',
    location: 'China',
    image: 'https://documents.owon-iot.com/product-images/seg-x5/seg-x5-01.jpg',
    background:
      "A well-established care management software vendor serving dozens of facilities and community sites across multiple cities lacked IoT device connectivity and AI behavioral analysis. Their platform couldn't deliver the safety monitoring, behavior reports, or proactive alerts that customers increasingly demanded. They needed to rapidly add IoT and AI capabilities for an upcoming tender — without building AI from scratch.",
    solution:
      "OWON provided hardware device APIs: 4G standalone devices and ZigBee gateways natively support MQTT/HTTP — the client's platform directly subscribes to device data. AI capabilities delivered via API: OWON's behavioral analysis API and health alert API are called over HTTP to generate resident behavior reports. After winning the tender, the full AiHome platform (including the AI engine) is deployed on the client's own servers for complete data sovereignty.",
    results: [
      { metric: 'MQTT/HTTP', label: 'Native Protocol Support' },
      { metric: 'AI API', label: 'Behavior + Health Alerts' },
      { metric: 'Rapid', label: 'Fast Tender Delivery' },
      { metric: 'Private', label: 'Full Data Sovereignty' },
    ],
    products: [],
    source: 'brochure',
  },
];
