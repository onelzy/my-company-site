import { config, collection, fields } from '@keystatic/core';

export default config({
  storage: { kind: 'local' },

  collections: {
    // ================================================================
    // Products
    // ================================================================
    products: collection({
      label: 'Products',
      path: 'src/content/products/*',
      slugField: 'name',
      format: { contentField: 'content' },
      schema: {
        name: fields.text({ label: 'Product Name', validation: { isRequired: true } }),
        model: fields.text({ label: 'Model Number' }),
        slug: fields.slug({ name: { label: 'URL Slug (auto-generated from name)' } }),
        description: fields.text({ label: 'Short Description', multiline: true }),
        content: fields.markdoc({ label: 'Detailed Content', extension: 'mdoc' }),
        productType: fields.select({
          label: 'Product Type',
          options: [
            { label: 'Smart Meters', value: 'smart-meters' },
            { label: 'Thermostats', value: 'thermostats' },
            { label: 'Senior Care', value: 'senior-care' },
            { label: 'Hotel Control', value: 'hotel-control' },
            { label: 'Software & Platforms', value: 'software-platforms' },
          ],
          defaultValue: 'smart-meters',
        }),
        productSubType: fields.select({
          label: 'Product Sub-Type',
          defaultValue: 'single-phase',
          options: [
            { label: 'Single Phase', value: 'single-phase' },
            { label: 'Three Phase', value: 'three-phase' },
            { label: 'Multi-Circuit', value: 'multi-circuit' },
            { label: 'DIN Rail', value: 'din-rail' },
            { label: 'Anti-Backflow', value: 'anti-backflow' },
            { label: '24V AC Thermostat', value: '24vac' },
            { label: 'Boiler & TRV', value: 'boiler-trv' },
            { label: 'ZigBee HVAC', value: 'zigbee-hvac' },
            { label: 'Emergency Call', value: 'emergency' },
            { label: 'Safety', value: 'safety' },
            { label: 'Tracking', value: 'tracking' },
            { label: 'Health Monitoring', value: 'health' },
            { label: 'Management', value: 'management' },
            { label: 'AiJuan App', value: 'aijuan-app' },
            { label: 'Home Care Web', value: 'home-care-web' },
            { label: 'Nursing Station Web', value: 'nursing-station-web' },
            { label: 'Room Thermostat', value: 'room-thermostat' },
            { label: 'Lighting Control', value: 'lighting' },
            { label: 'Door Sign', value: 'door-sign' },
            { label: 'Energy Management', value: 'energy-management' },
            { label: 'SmartOWON App', value: 'smartowon-app' },
            { label: 'ZigBee Control Web', value: 'zigbee-control-web' },
            { label: 'Energy Monitor Web', value: 'energy-monitor-web' },
            { label: 'Partner Platform', value: 'partner-platform' },
            { label: 'EdgeEco IoT Platform', value: 'iot-platform' },
          ],
        }),
        techSolution: fields.select({
          label: 'Tech Solution',
          options: [
            { label: 'Tuya', value: 'tuya' },
            { label: 'MQTT', value: 'mqtt' },
            { label: 'ZigBee', value: 'zigbee' },
          ],
          defaultValue: 'tuya',
        }),
        techSubType: fields.select({
          label: 'Tech Sub-Type',
          defaultValue: 'tuya-meters',
          options: [
            { label: 'Tuya Smart Meters', value: 'tuya-meters' },
            { label: 'Tuya Thermostats', value: 'tuya-thermostats' },
            { label: 'Tuya Lighting', value: 'tuya-lighting' },
            { label: 'Tuya Gateways', value: 'tuya-gateways' },
            { label: 'Tuya Remotes', value: 'tuya-remotes' },
            { label: 'Tuya Senior Care', value: 'tuya-senior' },
            { label: 'Tuya Sensors', value: 'tuya-sensors' },
            { label: 'MQTT Smart Meters', value: 'mqtt-meters' },
            { label: 'MQTT Thermostats', value: 'mqtt-thermostats' },
            { label: 'MQTT Gateways', value: 'mqtt-gateways' },
            { label: 'MQTT Remotes', value: 'mqtt-remotes' },
            { label: 'MQTT Software', value: 'mqtt-software' },
            { label: 'ZigBee Smart Meters', value: 'zigbee-meters' },
            { label: 'ZigBee Thermostats', value: 'zigbee-thermostats' },
            { label: 'ZigBee Lighting', value: 'zigbee-lighting' },
            { label: 'ZigBee Gateways', value: 'zigbee-gateways' },
            { label: 'ZigBee Remotes', value: 'zigbee-remotes' },
            { label: 'ZigBee Senior Care', value: 'zigbee-senior' },
            { label: 'ZigBee Sensors', value: 'zigbee-sensors' },
            { label: 'ZigBee Energy Management', value: 'zigbee-energy' },
            { label: 'ZigBee Software', value: 'zigbee-software' },
          ],
        }),
        communication: fields.array(
          fields.select({
            label: 'Communication',
            defaultValue: 'zigbee',
            options: [
              { label: 'ZigBee', value: 'zigbee' },
              { label: 'Wi-Fi', value: 'wifi' },
              { label: '4G', value: '4g' },
              { label: 'LoRa', value: 'lora' },
              { label: 'NB-IoT', value: 'nb-iot' },
              { label: 'Modbus', value: 'modbus' },
              { label: 'MQTT', value: 'mqtt' },
              { label: 'TCP/IP', value: 'tcpip' },
              { label: 'RJ45 Ethernet', value: 'rj45' },
            ],
          }),
          { label: 'Communication Methods', itemLabel: (p) => p.value || 'Method' }
        ),
        ecosystem: fields.array(
          fields.select({
            label: 'Ecosystem',
            defaultValue: 'tuya',
            options: [
              { label: 'Tuya', value: 'tuya' },
              { label: 'MQTT Open', value: 'mqtt-open' },
              { label: 'ZigBee', value: 'zigbee-solution' },
              { label: 'Home Assistant', value: 'home-assistant' },
              { label: 'Local API', value: 'local-api' },
            ],
          }),
          { label: 'Ecosystems', itemLabel: (p) => p.value || 'Ecosystem' }
        ),
        extraTags: fields.array(
          fields.select({
            label: 'Extra Tag',
            defaultValue: 'modbus-rtu',
            options: [
              { label: 'Modbus RTU', value: 'modbus-rtu' },
              { label: 'Modbus TCP', value: 'modbus-tcp' },
            ],
          }),
          { label: 'Extra Tags', itemLabel: (p) => p.value || 'Tag' }
        ),
        softwareType: fields.array(
          fields.select({
            label: 'Software Type',
            defaultValue: 'app',
            options: [
              { label: 'Mobile App', value: 'app' },
              { label: 'Web App', value: 'web' },
              { label: 'Admin Panel', value: 'admin' },
              { label: 'Analytics Platform', value: 'analytics' },
              { label: 'IoT Platform', value: 'iot-platform' },
            ],
          }),
          { label: 'Software Types', itemLabel: (p) => p.value || 'Type' }
        ),
        image: fields.image({
          label: 'Product Image',
          directory: 'public/images/products',
          publicPath: '/images/products',
        }),
        specs: fields.object(
          {
            accuracy: fields.text({ label: 'Accuracy Class' }),
            voltage: fields.text({ label: 'Rated Voltage' }),
            current: fields.text({ label: 'Rated Current' }),
            frequency: fields.text({ label: 'Frequency' }),
            powerSupply: fields.text({ label: 'Power Supply' }),
            display: fields.text({ label: 'Display' }),
            dimensions: fields.text({ label: 'Dimensions' }),
            weight: fields.text({ label: 'Weight' }),
            operatingTemp: fields.text({ label: 'Operating Temperature' }),
            protocol: fields.text({ label: 'Protocol' }),
            certification: fields.text({ label: 'Certifications' }),
            warranty: fields.text({ label: 'Warranty' }),
          },
          { label: 'Technical Specs' }
        ),
        language: fields.select({
          label: 'Language',
          options: [{ label: 'English', value: 'en' }],
          defaultValue: 'en',
        }),
      },
    }),

    // ================================================================
    // Solutions
    // ================================================================
    solutions: collection({
      label: 'Solutions',
      path: 'src/content/solutions/*',
      slugField: 'title',
      format: { contentField: 'body' },
      schema: {
        title: fields.text({ label: 'Title', validation: { isRequired: true } }),
        subtitle: fields.text({ label: 'Subtitle', multiline: true }),
        industry: fields.select({
          label: 'Industry',
          options: [
            { label: 'Smart Hotels', value: 'smart-hotels' },
            { label: 'Senior Care', value: 'senior-care' },
            { label: 'Energy Management', value: 'energy-management' },
            { label: 'Smart Building', value: 'smart-building' },
            { label: 'Industrial IoT', value: 'industrial-iot' },
          ],
          defaultValue: 'smart-hotels',
        }),
        productLines: fields.array(
          fields.select({
            label: 'Product Line',
            defaultValue: 'smart-meters',
            options: [
              { label: 'Smart Meters', value: 'smart-meters' },
              { label: 'Thermostats', value: 'thermostats' },
              { label: 'Senior Care', value: 'senior-care' },
              { label: 'Hotel Control', value: 'hotel-control' },
              { label: 'Software & Platforms', value: 'software-platforms' },
            ],
          }),
          { label: 'Related Product Lines', itemLabel: (p) => p.value || 'Line' }
        ),
        techSolution: fields.select({
          label: 'Technology',
          defaultValue: 'zigbee',
          options: [
            { label: 'Tuya', value: 'tuya' },
            { label: 'MQTT', value: 'mqtt' },
            { label: 'ZigBee', value: 'zigbee' },
          ],
        }),
        heroImage: fields.image({
          label: 'Hero Image',
          directory: 'public/images/solutions',
          publicPath: '/images/solutions',
        }),
        diagramImage: fields.image({
          label: 'Topology Diagram',
          directory: 'public/images/solutions',
          publicPath: '/images/solutions',
        }),
        stats: fields.array(
          fields.object(
            { value: fields.text({ label: 'Value' }), label: fields.text({ label: 'Label' }) },
            { label: 'Stat' }
          ),
          { label: 'Key Stats', itemLabel: (p) => ((p.fields as Record<string, unknown>).value as string) || 'Stat' }
        ),
        body: fields.markdoc({ label: 'Body Content', extension: 'mdoc' }),
        language: fields.select({
          label: 'Language',
          options: [{ label: 'English', value: 'en' }],
          defaultValue: 'en',
        }),
      },
    }),

    // ================================================================
    // Blog (via Cases for now — customer case studies)
    // ================================================================
    cases: collection({
      label: 'Case Studies',
      path: 'src/content/cases/*',
      slugField: 'title',
      format: { contentField: 'summary' },
      schema: {
        title: fields.text({ label: 'Title', validation: { isRequired: true } }),
        client: fields.text({ label: 'Client' }),
        industry: fields.select({
          label: 'Industry',
          defaultValue: 'smart-hotels',
          options: [
            { label: 'Smart Hotels', value: 'smart-hotels' },
            { label: 'Senior Care', value: 'senior-care' },
            { label: 'Energy Management', value: 'energy-management' },
            { label: 'Smart Building', value: 'smart-building' },
            { label: 'Industrial IoT', value: 'industrial-iot' },
          ],
        }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        image: fields.image({ label: 'Case Image', directory: 'public/images/cases', publicPath: '/images/cases' }),
        language: fields.select({
          label: 'Language',
          options: [{ label: 'English', value: 'en' }],
          defaultValue: 'en',
        }),
      },
    }),
  },
});
