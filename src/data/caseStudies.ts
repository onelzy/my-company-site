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
  /** Bulleted "Project Requirements" exactly as listed in the source doc. */
  requirements?: string[];
  /** Bulleted solution points exactly as listed in the source doc. */
  solutionPoints?: string[];
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
    image: '/images/case-studies/4g-clamp-carbon-diagram.webp',
    background:
      'Commissioned by several national energy management agencies, this software platform provider intends to develop a carbon emission monitoring system for commercial incentive or penalty purposes — a global project requiring rapid installation, universal hardware, multi-country network compatibility, and per-country data compliance.',
    requirements: [
      'A smart electric meter that can be rapidly installed without disrupting the existing metering and billing systems, minimizing deployment risks, challenges, timelines, and costs.',
      'A universal device supporting single-phase, split-phase, and three-phase circuits, with various load scenarios ranging from 50A to 1000A, to minimize logistics and distribution costs.',
      'As a global project, the smart electric meter must be compatible with different network environments in different countries and maintain a stable connection at all times.',
      'Data transmission and storage must comply with data security and privacy regulations in each country.',
    ],
    solution:
      "OWON delivered a Smart Electric Meter with open-type CTs for non-invasive installation on existing circuits, plus device-level local APIs for data aggregation. A single model supports all phase types and current ranges up to 1000A by simply changing the size of the CTs. Communicates via LTE with swappable communication modules for different countries' networks. Device local APIs forward energy data directly to each country's designated cloud server, avoiding security and privacy issues that may arise from data passing through intermediate data servers.",
    solutionPoints: [
      'The Smart Meter is equipped with open-type CTs, facilitating easy and quick installation; it measures energy data independently from the existing metering and billing systems.',
      'Supports single-phase, split-phase, and three-phase circuits; accommodates load scenarios of up to 1000A by simply changing the size of the CTs.',
      'Communicates through LTE networks and readily adapts to different countries\u2019 networks by replacing the LTE communication modules.',
      'Includes local APIs for devices, allowing OWON to forward the energy data directly to each country\u2019s designated cloud server — no intermediate data servers, full regulatory compliance.',
    ],
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
    image: '/images/case-studies/hybrid-thermostat-diagram.webp',
    background:
      'Heat pumps have been widely deployed in recent years as a more efficient and economical heating and cooling solution, yet many households still retain another set of conventional cooling and heating devices. This furnace and heat pump manufacturer needed a thermostat that controls both sets of equipment simultaneously and switches between them for optimal cost-effectiveness — without sacrificing comfort.',
    requirements: [
      'A special thermostat to control both sets of equipment simultaneously and switch between them for optimal cost-effectiveness without sacrificing comfort.',
      'The system must acquire the outdoor temperature as the prerequisite of its operation mode.',
      'A specific Wi-Fi module is required to follow the manufacturer\u2019s designated communication protocol and interface with their existing backend server.',
      'The thermostat must be able to control a humidifier or dehumidifier.',
    ],
    solution:
      "OWON customized the thermostat based on one of its existing models, allowing the new device to be compatible with the client's system: firmware rewritten for dual-fuel switching logic, outdoor temperature obtained from online data or a wireless outdoor sensor, the client's designated Wi-Fi module transmitting to their backend server over MQTT, and extra relays and connection terminals added for humidifier/dehumidifier control.",
    solutionPoints: [
      'Rewrote the thermostat\u2019s firmware according to the equipment manufacturer\u2019s specified control logic.',
      'Obtained the outdoor temperature either from online data or a wireless outdoor temperature sensor.',
      'Replaced the original communication module with the designated Wi-Fi module, transmitting information to the client\u2019s backend server following the MQTT protocol.',
      'Customized the hardware by adding more relays and connection terminals to support both humidifiers and dehumidifiers.',
    ],
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
    image: '/images/case-studies/residential-heating-diagram.webp',
    background:
      'A government initiative to reduce residential heating energy consumption required a system that manages all mainstream European heating equipment — boilers, heat pumps, hot water, hydraulic and electric radiators, underfloor heating. Critical requirements: full offline operation, mobile app control without a Wi-Fi router (AP mode), and complete device-level local APIs for custom cloud and mobile development.',
    requirements: [
      'Should monitor and control boilers, heat pumps, hot water, hydraulic radiators, electrical radiators, underfloor heating, etc.',
      'Should work normally under offline mode, without relying on an Internet connection.',
      'The mobile app should control the system with or without an Internet connection, even without a Wi-Fi router.',
      'Requires a complete set of \"device-level local APIs\" to develop a cloud server and mobile APP.',
    ],
    solution:
      'OWON provided a full ZigBee ecosystem centered on an Edge Gateway. PCT512 controls boilers/heat pumps, TRV517 handles hydraulic radiators, PIR323 + SLC621 manage electric heaters, and THS317-ET + SLC651 control underfloor heating. The gateway supports three modes — Local (same Wi-Fi), Internet (remote cloud), and AP (direct hotspot). TCP/IP and MQTT APIs provided for system integration.',
    solutionPoints: [
      'Provide various field devices to control HVAC equipment: PCT512 controls the boiler or heat pump; TRV517 controls hydraulic radiators in each room; PIR323 + SLC621 detect room temperature and control the electric heater using the Smart Relay; THS317-ET + SLC651 detect floor temperature and control the manifold using the Underfloor Heating Controller.',
      'Provide an Edge Gateway to support multiple system working modes: Local mode (mobile app accesses the Edge Gateway under the same Wi-Fi router), Internet mode (mobile app accesses the cloud server and controls the HVAC system remotely), AP Mode (mobile app accesses the Edge Gateway directly while the gateway works as a Wi-Fi hotspot).',
      'Provide APIs for System Integration: OWON TCP/IP API designs the mobile APP supporting Local Mode and AP Mode; OWON MQTT API designs the cloud server and mobile APP under Internet Mode.',
    ],
    results: [
      { metric: '3 Modes', label: 'Local / Internet / AP' },
      { metric: 'Offline', label: 'No Internet Required' },
      { metric: 'Full API', label: 'TCP/IP + MQTT' },
      { metric: 'All Equipment', label: 'Boiler to Underfloor' },
    ],
    products: ['pir323', 'ths317', 'slc611'],
    source: 'catalog',
  },
  {
    slug: 'hotel-room-management',
    category: 'Hospitality',
    title: 'Guest Room Management System for a Chain Resort Hotel',
    client: 'A Smart Hotel System Provider',
    location: 'Global',
    image: '/images/case-studies/hotel-room-diagram.webp',
    background:
      'The client sought a wireless IoT system to replace traditional wired BMS, which is expensive and difficult to install. They needed faster deployment, lower costs, and the ability to integrate both OWON and third-party smart devices through a unified gateway with device-level MQTT API. Some high-end locations also required Android-based touchscreen control panels.',
    requirements: [
      'Use IoT gateway to aggregate all smart devices and provide a device-level MQTT API for system integration.',
      'The IoT gateway should ensure the normal operation of smart devices even when disconnected from the server.',
      'The IoT gateway must be open to integration with additional smart devices, including those from third parties.',
      'OWON should provide a full line of off-the-shelf IoT devices for immediate deployment.',
      'Device customization and new product development are available to meet special project needs.',
      'Some high-end locations require an Android-based touchscreen control panel as part of the system.',
    ],
    solution:
      "OWON provided a complete ZigBee 3.0 ecosystem: IoT gateway (Wi-Fi/Ethernet/4G) with full MQTT device-level APIs, and a comprehensive line of hotel room devices — wall switches, relay switches, wall sockets, power meters, fan coil thermostats, curtain controllers, door/window sensors, temperature/humidity sensors, and occupancy sensors. The gateway supports offline mode with local device-to-device logic. Android touchscreen control panels were supplied from OWON's 20-year industrial tablet experience. Custom devices (DND buttons, door signage, relay switches) were developed for specific project needs.",
    solutionPoints: [
      'Provides an IoT gateway equipped with ZigBee connectivity to aggregate all smart devices. The gateway has a full set of device-level MQTT APIs and connects to the client\u2019s server through Wi-Fi, Ethernet, or 4G.',
      'In offline mode, the gateway is capable of not only controlling each ZigBee device, but also supporting logical interaction between devices.',
      'The gateway is compatible with the ZigBee 3.0 standard and can work with any third-party devices following the same standard.',
      'Provides a full line of standard hotel room management devices including lighting wall switches, relay switches, wall sockets, power meters, fan coil thermostats, curtain control modules, door/window sensors, temperature/humidity sensors, occupancy sensors, etc.',
      'Customizes a few devices for specific projects\u2019 requirements, such as relay switches, fan-coil thermostats, and door sensors.',
      'Converts some regular devices to smart devices by embedding communication modules into the designated hardware, such as DND buttons and door signage.',
      'Thanks to OWON\u2019s 20-year experience in designing and manufacturing industrial tablets, we provide the project with various sizes of Android touchscreen control panels.',
    ],
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
    image: '/images/case-studies/home-energy-diagram.webp',
    background:
      'The telecom operator planned a Home Energy Management System (HEMS) for mass deployment to millions of homes. Requirements: monitor and control energy consumption, solar generation, and EV chargers; schedule HVAC equipment including boilers, heat pumps, and mini-split A/C; enable device-to-device interactions such as turning off A/C when a window opens or adjusting EV charging based on solar surplus; and provide device-level local APIs for direct cloud integration.',
    requirements: [
      'Monitors and controls the overall home energy consumption, solar power generation, EV chargers, etc.',
      'Controls and schedules the HVAC equipment, including gas boilers, electric heat pumps, and mini-split A/C units.',
      'Allows functional interaction between components within the system. For example, turn off split A/C when a window is opened, change the EV charging status according to the solar power generation mode, etc.',
      'Requires a complete set of \"device-level local APIs\" to directly connect to the Telco\u2019s backend cloud server.',
    ],
    solution:
      "OWON delivered a complete ZigBee device suite — clamp power meters, Din rail relays, and smart plugs for energy monitoring; thermostats and IR blasters for HVAC control — plus a Smart ZigBee Hub with local networking capabilities for device-to-device interaction logic. The hub's complete local API allows direct connection to the Telco's backend server with no intermediate cloud dependency.",
    solutionPoints: [
      'Energy management devices: Provides various ZigBee devices, such as clamp power meters, Din rail relays, and smart plugs for energy monitoring, controlling, and scheduling purposes.',
      'HVAC control devices: Provides ZigBee thermostat and IR blasters to interface with different HVAC equipment.',
      'Smart ZigBee Hub: Provides a ZigBee Hub with strong local networking features that allow flexible interaction between the local Smart Devices.',
      'Complete API interfaces: The ZigBee hub comes with a complete local API that allows the telecommunication company to access the full functionality of OWON\u2019s ZigBee system.',
    ],
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
