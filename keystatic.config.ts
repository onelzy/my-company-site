import { config, collection, fields } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  routing: {
    path: '/keystatic',
  },
  collections: {
    // ===================================================================
    // Products — Core B2B product catalogue with dual-dimension taxonomy
    // ===================================================================
    products: collection({
      label: '产品',
      path: 'src/content/products/*',
      // slugField dictates the directory name for each entry.
      // Keystatic v0.5.x only accepts fields.text here — using 'name'.
      // The 'slug' field below is a separate URL-friendly identifier
      // auto-generated from name, used for Astro routing (/products/[slug]).
      slugField: 'name',
      format: {
        contentField: 'content',
      },
      schema: {
        // ---- Basic info ----
        name: fields.text({
          label: '产品名称',
          validation: { isRequired: true },
        }),
        model: fields.text({
          label: '产品型号',
        }),
        slug: fields.slug({
          name: { label: 'URL标识（自动从产品名生成）' },
        }),
        description: fields.text({
          label: '简短描述',
          multiline: true,
        }),
        content: fields.markdoc({
          label: '详细内容（Markdown）',
          extension: 'mdoc',
        }),

        // ---- Dimension 1: Product Type ----
        productType: fields.select({
          label: '产品类型（维度1 — 主分类）',
          options: [
            { label: '智能电表', value: 'smart-meters' },
            { label: '恒温器', value: 'thermostats' },
            { label: '智能养老', value: 'senior-care' },
            { label: '酒店客控', value: 'hotel-control' },
            { label: '软件&平台', value: 'software-platforms' },
          ],
          defaultValue: 'smart-meters',
        }),
        productSubType: fields.select({
          label: '产品子分类',
          defaultValue: 'single-phase',
          options: [
            // Smart Meters
            { label: '单相电表', value: 'single-phase' },
            { label: '三相电表', value: 'three-phase' },
            { label: '多回路监测', value: 'multi-circuit' },
            { label: '导轨式电表', value: 'din-rail' },
            { label: '防逆流方案', value: 'anti-backflow' },
            // Thermostats
            { label: '24Vac恒温器', value: '24vac' },
            { label: '锅炉+TRV套件', value: 'boiler-trv' },
            { label: 'ZigBee HVAC设备', value: 'zigbee-hvac' },
            // Senior Care
            { label: '紧急求助', value: 'emergency' },
            { label: '安全防护', value: 'safety' },
            { label: '定位追踪', value: 'tracking' },
            { label: '健康监测', value: 'health' },
            { label: '照护管理', value: 'management' },
            { label: '爱居安APP', value: 'aijuan-app' },
            { label: '居家养老Web端', value: 'home-care-web' },
            { label: '养老院护士站Web端', value: 'nursing-station-web' },
            // Hotel Control
            { label: '客房温控器', value: 'room-thermostat' },
            { label: '照明控制', value: 'lighting' },
            { label: '门牌显示', value: 'door-sign' },
            { label: '能源管理', value: 'energy-management' },
            // Software & Platforms
            { label: 'SmartOWON APP', value: 'smartowon-app' },
            { label: 'ZigBee设备Web控制端', value: 'zigbee-control-web' },
            { label: '能源监控Web端', value: 'energy-monitor-web' },
            { label: '代理商管理平台', value: 'partner-platform' },
            { label: 'EdgeEco IoT平台', value: 'iot-platform' },
          ],
        }),

        // ---- Dimension 2: Technical Solution ----
        techSolution: fields.select({
          label: '技术方案（维度2 — 主分类）',
          options: [
            { label: 'Tuya生态', value: 'tuya' },
            { label: 'MQTT开放协议', value: 'mqtt' },
            { label: 'ZigBee标准方案', value: 'zigbee' },
          ],
          defaultValue: 'tuya',
        }),
        techSubType: fields.select({
          label: '技术方案子分类',
          defaultValue: 'tuya-meters',
          options: [
            // Tuya
            { label: 'Tuya智能电表', value: 'tuya-meters' },
            { label: 'Tuya恒温器', value: 'tuya-thermostats' },
            { label: 'Tuya照明', value: 'tuya-lighting' },
            { label: 'Tuya网关', value: 'tuya-gateways' },
            { label: 'Tuya遥控器', value: 'tuya-remotes' },
            { label: 'Tuya照护', value: 'tuya-senior' },
            { label: 'Tuya房间传感器', value: 'tuya-sensors' },
            // MQTT
            { label: 'MQTT智能电表', value: 'mqtt-meters' },
            { label: 'MQTT恒温器', value: 'mqtt-thermostats' },
            { label: 'MQTT网关', value: 'mqtt-gateways' },
            { label: 'MQTT遥控器', value: 'mqtt-remotes' },
            { label: 'MQTT软件&平台', value: 'mqtt-software' },
            // ZigBee
            { label: 'ZigBee智能电表', value: 'zigbee-meters' },
            { label: 'ZigBee恒温器', value: 'zigbee-thermostats' },
            { label: 'ZigBee照明', value: 'zigbee-lighting' },
            { label: 'ZigBee网关', value: 'zigbee-gateways' },
            { label: 'ZigBee遥控器', value: 'zigbee-remotes' },
            { label: 'ZigBee照护', value: 'zigbee-senior' },
            { label: 'ZigBee房间传感器', value: 'zigbee-sensors' },
            { label: 'ZigBee能源管理', value: 'zigbee-energy' },
            { label: 'ZigBee软件&平台', value: 'zigbee-software' },
          ],
        }),

        // ---- Technical Specs (multi-select tags) ----
        communication: fields.array({
          label: '通讯方式',
          element: fields.select({
            label: '通讯方式',
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
              { label: 'RJ45 网口', value: 'rj45' },
            ],
          }),
        }),
        ecosystem: fields.array({
          label: '生态方式',
          element: fields.select({
            label: '生态方式',
            defaultValue: 'tuya',
            options: [
              { label: 'Tuya生态', value: 'tuya' },
              { label: 'MQTT开放协议', value: 'mqtt-open' },
              { label: 'ZigBee标准方案', value: 'zigbee-solution' },
              { label: 'Home Assistant', value: 'home-assistant' },
              { label: '本地API', value: 'local-api' },
            ],
          }),
        }),
        extraTags: fields.array({
          label: '附加标签',
          element: fields.select({
            label: '附加标签',
            defaultValue: 'modbus-rtu',
            options: [
              { label: 'Modbus RTU', value: 'modbus-rtu' },
              { label: 'Modbus TCP', value: 'modbus-tcp' },
            ],
          }),
        }),
        softwareType: fields.array({
          label: '软件类型',
          element: fields.select({
            label: '软件类型',
            defaultValue: 'app',
            options: [
              { label: 'APP端', value: 'app' },
              { label: 'Web端', value: 'web' },
              { label: '管理后台', value: 'admin' },
              { label: '数据分析平台', value: 'analytics' },
              { label: 'IoT平台', value: 'iot-platform' },
            ],
          }),
        }),

        // ---- Media & Specs ----
        image: fields.image({
          label: '产品图片',
          directory: 'public/images/products',
          publicPath: '/images/products',
        }),
        specs: fields.object(
          {
            accuracy: fields.text({ label: '精度等级' }),
            voltage: fields.text({ label: '额定电压' }),
            current: fields.text({ label: '额定电流' }),
            frequency: fields.text({ label: '频率' }),
            powerSupply: fields.text({ label: '供电方式' }),
            display: fields.text({ label: '显示方式' }),
            dimensions: fields.text({ label: '外形尺寸' }),
            weight: fields.text({ label: '重量' }),
            operatingTemp: fields.text({ label: '工作温度' }),
            protocol: fields.text({ label: '通信协议' }),
            certification: fields.text({ label: '认证' }),
            warranty: fields.text({ label: '质保期' }),
          },
          { label: '技术参数' }
        ),

        // ---- Language ----
        language: fields.select({
          label: '语言',
          options: [
            { label: 'English', value: 'en' },
            { label: '中文', value: 'zh' },
            { label: 'Español', value: 'es' },
            { label: 'Русский', value: 'ru' },
            { label: 'Français', value: 'fr' },
            { label: 'Deutsch', value: 'de' },
            { label: 'العربية', value: 'ar' },
            { label: 'Português', value: 'pt' },
          ],
          defaultValue: 'en',
        }),
      },
    }),

    // ===================================================================
    // Cases — Customer case studies
    // ===================================================================
    cases: collection({
      label: 'Cases',
      path: 'src/content/cases/*',
      slugField: 'title',
      format: {
        contentField: 'summary',
      },
      schema: {
        title: fields.text({
          label: 'Title',
          validation: { isRequired: true },
        }),
        client: fields.text({
          label: 'Client',
        }),
        industry: fields.text({
          label: 'Industry',
        }),
        summary: fields.text({
          label: 'Summary',
          multiline: true,
        }),
        image: fields.image({
          label: 'Case Image',
          directory: 'public/images/cases',
          publicPath: '/images/cases',
        }),
        language: fields.select({
          label: 'Language',
          options: [
            { label: 'English', value: 'en' },
            { label: '中文', value: 'zh' },
            { label: 'Español', value: 'es' },
            { label: 'Русский', value: 'ru' },
            { label: 'Français', value: 'fr' },
            { label: 'Deutsch', value: 'de' },
            { label: 'العربية', value: 'ar' },
            { label: 'Português', value: 'pt' },
          ],
          defaultValue: 'en',
        }),
      },
    }),

    // ===================================================================
    // About — Company profile (one entry per language, singleton pattern)
    // ===================================================================
    about: collection({
      label: 'About',
      path: 'src/content/about/*',
      slugField: 'language',
      format: {
        contentField: 'description',
      },
      schema: {
        companyName: fields.text({
          label: 'Company Name',
          validation: { isRequired: true },
        }),
        description: fields.text({
          label: 'Description',
          multiline: true,
        }),
        foundingYear: fields.integer({
          label: 'Founding Year',
        }),
        certifications: fields.array(
          fields.text({ label: 'Certification' }),
          {
            label: 'Certifications',
            itemLabel: (props) => props.value || 'Certification',
          }
        ),
        language: fields.text({
          label: 'Language',
          validation: { isRequired: true },
        }),
      },
    }),

    // ===================================================================
    // Solutions — Industry use-case driven solutions
    // ===================================================================
    solutions: collection({
      label: 'Solutions',
      path: 'src/content/solutions/*',
      slugField: 'title',
      format: {
        contentField: 'body',
      },
      schema: {
        title: fields.text({
          label: 'Title',
          validation: { isRequired: true },
        }),
        subtitle: fields.text({
          label: 'Subtitle',
          multiline: true,
        }),
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
            options: [
              { label: 'Smart Meters', value: 'smart-meters' },
              { label: 'Thermostats', value: 'thermostats' },
              { label: 'Senior Care', value: 'senior-care' },
              { label: 'Hotel Control', value: 'hotel-control' },
              { label: 'Software & Platforms', value: 'software-platforms' },
            ],
            defaultValue: 'smart-meters',
          }),
          {
            label: 'Related Product Lines',
            itemLabel: (props) => props.value || 'Product Line',
          }
        ),
        techSolution: fields.select({
          label: 'Technology',
          options: [
            { label: 'Tuya', value: 'tuya' },
            { label: 'MQTT', value: 'mqtt' },
            { label: 'ZigBee', value: 'zigbee' },
          ],
          defaultValue: 'zigbee',
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
            {
              value: fields.text({ label: 'Value (e.g. "30%")' }),
              label: fields.text({ label: 'Label (e.g. "Energy Savings")' }),
            },
            { label: 'Stat' }
          ),
          {
            label: 'Key Stats',
            itemLabel: (props) => props.fields.value || 'Stat',
          }
        ),
        body: fields.markdoc({
          label: 'Body Content',
          extension: 'mdoc',
        }),
        language: fields.select({
          label: 'Language',
          options: [
            { label: 'English', value: 'en' },
          ],
          defaultValue: 'en',
        }),
      },
    }),
  },
});
