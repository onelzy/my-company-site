// ===================================================================
// Products — utility functions and label maps for OWON B2B catalogue
// ===================================================================

// -------------------------------------------------------------------
// Supported locales (ISO 639-1) — must match content.config.ts schema
// -------------------------------------------------------------------
type Locale = 'en' | 'zh' | 'es' | 'ru' | 'fr' | 'de' | 'ar' | 'pt';

/** Record that holds a display label for each supported locale. */
type LocalizedRecord = Record<Locale, string>;

// ===================================================================
// PRODUCT TYPE LABELS — 5 main types + all ~25 sub-types
// ===================================================================

export const PRODUCT_TYPE_LABELS: Record<string, LocalizedRecord> = {
  // ----- Main types -----
  'smart-meters': {
    en: 'Smart Meters',
    zh: '智能电表',
    es: 'Medidores Inteligentes',
    ru: 'Умные счетчики',
    fr: 'Compteurs Intelligents',
    de: 'Intelligente Zähler',
    ar: 'عدادات ذكية',
    pt: 'Medidores Inteligentes',
  },
  thermostats: {
    en: 'Thermostats',
    zh: '温控器',
    es: 'Termostatos',
    ru: 'Термостаты',
    fr: 'Thermostats',
    de: 'Thermostate',
    ar: 'ثرموستات',
    pt: 'Termostatos',
  },
  'senior-care': {
    en: 'Senior Care',
    zh: '智慧养老',
    es: 'Cuidado de Mayores',
    ru: 'Уход за пожилыми',
    fr: 'Soins aux Seniors',
    de: 'Seniorenpflege',
    ar: 'رعاية المسنين',
    pt: 'Cuidados Sênior',
  },
  'hotel-control': {
    en: 'Hotel Control',
    zh: '酒店智控',
    es: 'Control Hotelero',
    ru: 'Гостиничное управление',
    fr: 'Contrôle Hôtelier',
    de: 'Hotelsteuerung',
    ar: 'تحكم فندقي',
    pt: 'Controle Hoteleiro',
  },
  'software-platforms': {
    en: 'Software & Platforms',
    zh: '软件与平台',
    es: 'Software y Plataformas',
    ru: 'ПО и платформы',
    fr: 'Logiciels et Plateformes',
    de: 'Software & Plattformen',
    ar: 'برمجيات ومنصات',
    pt: 'Software e Plataformas',
  },

  // ----- Smart Meters sub-types -----
  'single-phase': {
    en: 'Single Phase',
    zh: '单相',
    es: 'Monofásico',
    ru: 'Однофазный',
    fr: 'Monophasé',
    de: 'Einphasig',
    ar: 'أحادي الطور',
    pt: 'Monofásico',
  },
  'three-phase': {
    en: 'Three Phase',
    zh: '三相',
    es: 'Trifásico',
    ru: 'Трехфазный',
    fr: 'Triphasé',
    de: 'Dreiphasig',
    ar: 'ثلاثي الطور',
    pt: 'Trifásico',
  },
  'multi-circuit': {
    en: 'Multi-Circuit',
    zh: '多回路',
    es: 'Multicircuito',
    ru: 'Многоканальный',
    fr: 'Multi-Circuit',
    de: 'Mehrkreis',
    ar: 'متعدد الدوائر',
    pt: 'Multi-Circuito',
  },
  'din-rail': {
    en: 'DIN Rail',
    zh: '导轨式',
    es: 'Riel DIN',
    ru: 'DIN-рейка',
    fr: 'Rail DIN',
    de: 'DIN-Schiene',
    ar: 'سكة DIN',
    pt: 'Trilho DIN',
  },
  'anti-backflow': {
    en: 'Anti-Backflow',
    zh: '防逆流',
    es: 'Anti-Retorno',
    ru: 'Анти-реверс',
    fr: 'Anti-Retour',
    de: 'Rücklaufsperre',
    ar: 'مانع التدفق العكسي',
    pt: 'Anti-Retorno',
  },

  // ----- Thermostats sub-types -----
  '24vac': {
    en: '24V AC Thermostat',
    zh: '24V交流温控器',
    es: 'Termostato 24V AC',
    ru: 'Термостат 24В AC',
    fr: 'Thermostat 24V AC',
    de: '24V AC Thermostat',
    ar: 'ثرموستات 24 فولت',
    pt: 'Termostato 24V AC',
  },
  'boiler-trv': {
    en: 'Boiler & TRV',
    zh: '锅炉与散热器阀',
    es: 'Caldera y TRV',
    ru: 'Котел и ТРВ',
    fr: 'Chaudière et TRV',
    de: 'Boiler & TRV',
    ar: 'غلاية وصمام',
    pt: 'Caldeira e TRV',
  },
  'zigbee-hvac': {
    en: 'ZigBee HVAC',
    zh: 'ZigBee暖通空调',
    es: 'HVAC ZigBee',
    ru: 'ZigBee ОВиК',
    fr: 'CVC ZigBee',
    de: 'ZigBee HLK',
    ar: 'تدفئة ZigBee',
    pt: 'HVAC ZigBee',
  },

  // ----- Senior Care sub-types -----
  emergency: {
    en: 'Emergency Call',
    zh: '紧急呼叫',
    es: 'Llamada de Emergencia',
    ru: 'Экстренный вызов',
    fr: 'Appel d\'Urgence',
    de: 'Notruf',
    ar: 'نداء الطوارئ',
    pt: 'Chamada de Emergência',
  },
  safety: {
    en: 'Safety',
    zh: '安全防护',
    es: 'Seguridad',
    ru: 'Безопасность',
    fr: 'Sécurité',
    de: 'Sicherheit',
    ar: 'الأمان',
    pt: 'Segurança',
  },
  tracking: {
    en: 'Tracking',
    zh: '定位追踪',
    es: 'Rastreo',
    ru: 'Отслеживание',
    fr: 'Suivi',
    de: 'Tracking',
    ar: 'تتبع',
    pt: 'Rastreamento',
  },
  health: {
    en: 'Health Monitoring',
    zh: '健康监测',
    es: 'Monitoreo de Salud',
    ru: 'Мониторинг здоровья',
    fr: 'Suivi de Santé',
    de: 'Gesundheitsüberwachung',
    ar: 'مراقبة الصحة',
    pt: 'Monitoramento de Saúde',
  },
  management: {
    en: 'Management System',
    zh: '管理系统',
    es: 'Sistema de Gestión',
    ru: 'Система управления',
    fr: 'Système de Gestion',
    de: 'Managementsystem',
    ar: 'نظام الإدارة',
    pt: 'Sistema de Gestão',
  },
  'aijuan-app': {
    en: 'AiJuan App',
    zh: '爱眷App',
    es: 'App AiJuan',
    ru: 'AiJuan приложение',
    fr: 'App AiJuan',
    de: 'AiJuan App',
    ar: 'تطبيق AiJuan',
    pt: 'App AiJuan',
  },
  'home-care-web': {
    en: 'Home Care Web',
    zh: '居家养老Web',
    es: 'Web de Cuidado Domiciliario',
    ru: 'Веб ухода на дому',
    fr: 'Web Soins à Domicile',
    de: 'Home Care Web',
    ar: 'ويب الرعاية المنزلية',
    pt: 'Web de Cuidados Domiciliares',
  },
  'nursing-station-web': {
    en: 'Nursing Station Web',
    zh: '护理站Web',
    es: 'Web de Estación de Enfermería',
    ru: 'Веб медпункта',
    fr: 'Web Poste de Soins',
    de: 'Pflegestation Web',
    ar: 'ويب محطة التمريض',
    pt: 'Web de Posto de Enfermagem',
  },

  // ----- Hotel Control sub-types -----
  'room-thermostat': {
    en: 'Room Thermostat',
    zh: '客房温控器',
    es: 'Termostato de Habitación',
    ru: 'Комнатный термостат',
    fr: 'Thermostat de Chambre',
    de: 'Raumthermostat',
    ar: 'ثرموستات الغرفة',
    pt: 'Termostato de Quarto',
  },
  lighting: {
    en: 'Lighting Control',
    zh: '灯光控制',
    es: 'Control de Iluminación',
    ru: 'Управление освещением',
    fr: 'Contrôle d\'Éclairage',
    de: 'Lichtsteuerung',
    ar: 'التحكم بالإضاءة',
    pt: 'Controle de Iluminação',
  },
  'door-sign': {
    en: 'Door Sign',
    zh: '门牌显示',
    es: 'Señal de Puerta',
    ru: 'Дверной указатель',
    fr: 'Signalétique de Porte',
    de: 'Türschild',
    ar: 'لافتة الباب',
    pt: 'Placa de Porta',
  },
  'energy-management': {
    en: 'Energy Management',
    zh: '能源管理',
    es: 'Gestión Energética',
    ru: 'Энергоменеджмент',
    fr: 'Gestion Énergétique',
    de: 'Energiemanagement',
    ar: 'إدارة الطاقة',
    pt: 'Gestão de Energia',
  },

  // ----- Software & Platforms sub-types -----
  'smartowon-app': {
    en: 'SmartOWON App',
    zh: 'SmartOWON App',
    es: 'App SmartOWON',
    ru: 'SmartOWON приложение',
    fr: 'App SmartOWON',
    de: 'SmartOWON App',
    ar: 'تطبيق SmartOWON',
    pt: 'App SmartOWON',
  },
  'zigbee-control-web': {
    en: 'ZigBee Control Web',
    zh: 'ZigBee控制Web',
    es: 'Web de Control ZigBee',
    ru: 'Веб управления ZigBee',
    fr: 'Web Contrôle ZigBee',
    de: 'ZigBee Control Web',
    ar: 'ويب تحكم ZigBee',
    pt: 'Web de Controle ZigBee',
  },
  'energy-monitor-web': {
    en: 'Energy Monitor Web',
    zh: '能耗监测Web',
    es: 'Web de Monitoreo Energético',
    ru: 'Веб мониторинга энергии',
    fr: 'Web Monitoring Énergétique',
    de: 'Energie-Monitor Web',
    ar: 'ويب مراقبة الطاقة',
    pt: 'Web de Monitoramento de Energia',
  },
  'partner-platform': {
    en: 'Partner Platform',
    zh: '合作伙伴平台',
    es: 'Plataforma de Socios',
    ru: 'Партнерская платформа',
    fr: 'Plateforme Partenaire',
    de: 'Partner-Plattform',
    ar: 'منصة الشركاء',
    pt: 'Plataforma de Parceiros',
  },
  'iot-platform': {
    en: 'IoT Platform',
    zh: '物联网平台',
    es: 'Plataforma IoT',
    ru: 'IoT платформа',
    fr: 'Plateforme IoT',
    de: 'IoT-Plattform',
    ar: 'منصة إنترنت الأشياء',
    pt: 'Plataforma IoT',
  },
};

// ===================================================================
// TECH SOLUTION LABELS — 3 main solutions + all ~22 sub-types
// ===================================================================

export const TECH_SOLUTION_LABELS: Record<string, LocalizedRecord> = {
  // ----- Main solutions -----
  tuya: {
    en: 'Tuya',
    zh: '涂鸦智能',
    es: 'Tuya',
    ru: 'Tuya',
    fr: 'Tuya',
    de: 'Tuya',
    ar: 'تويا',
    pt: 'Tuya',
  },
  mqtt: {
    en: 'MQTT',
    zh: 'MQTT',
    es: 'MQTT',
    ru: 'MQTT',
    fr: 'MQTT',
    de: 'MQTT',
    ar: 'MQTT',
    pt: 'MQTT',
  },
  zigbee: {
    en: 'ZigBee',
    zh: 'ZigBee',
    es: 'ZigBee',
    ru: 'ZigBee',
    fr: 'ZigBee',
    de: 'ZigBee',
    ar: 'ZigBee',
    pt: 'ZigBee',
  },

  // ----- Tuya sub-types -----
  'tuya-meters': {
    en: 'Tuya Meters',
    zh: '涂鸦电表',
    es: 'Medidores Tuya',
    ru: 'Счетчики Tuya',
    fr: 'Compteurs Tuya',
    de: 'Tuya Zähler',
    ar: 'عدادات تويا',
    pt: 'Medidores Tuya',
  },
  'tuya-thermostats': {
    en: 'Tuya Thermostats',
    zh: '涂鸦温控器',
    es: 'Termostatos Tuya',
    ru: 'Термостаты Tuya',
    fr: 'Thermostats Tuya',
    de: 'Tuya Thermostate',
    ar: 'ثرموستات تويا',
    pt: 'Termostatos Tuya',
  },
  'tuya-lighting': {
    en: 'Tuya Lighting',
    zh: '涂鸦照明',
    es: 'Iluminación Tuya',
    ru: 'Освещение Tuya',
    fr: 'Éclairage Tuya',
    de: 'Tuya Beleuchtung',
    ar: 'إضاءة تويا',
    pt: 'Iluminação Tuya',
  },
  'tuya-gateways': {
    en: 'Tuya Gateways',
    zh: '涂鸦网关',
    es: 'Gateways Tuya',
    ru: 'Шлюзы Tuya',
    fr: 'Passerelles Tuya',
    de: 'Tuya Gateways',
    ar: 'بوابات تويا',
    pt: 'Gateways Tuya',
  },
  'tuya-remotes': {
    en: 'Tuya Remotes',
    zh: '涂鸦遥控器',
    es: 'Mandos Tuya',
    ru: 'Пульты Tuya',
    fr: 'Télécommandes Tuya',
    de: 'Tuya Fernbedienungen',
    ar: 'أجهزة تحكم تويا',
    pt: 'Controles Tuya',
  },
  'tuya-senior': {
    en: 'Tuya Senior Care',
    zh: '涂鸦养老',
    es: 'Cuidado Tuya',
    ru: 'Уход Tuya',
    fr: 'Soins Tuya',
    de: 'Tuya Seniorenpflege',
    ar: 'رعاية تويا',
    pt: 'Cuidados Tuya',
  },
  'tuya-sensors': {
    en: 'Tuya Sensors',
    zh: '涂鸦传感器',
    es: 'Sensores Tuya',
    ru: 'Датчики Tuya',
    fr: 'Capteurs Tuya',
    de: 'Tuya Sensoren',
    ar: 'مستشعرات تويا',
    pt: 'Sensores Tuya',
  },

  // ----- MQTT sub-types -----
  'mqtt-meters': {
    en: 'MQTT Meters',
    zh: 'MQTT电表',
    es: 'Medidores MQTT',
    ru: 'Счетчики MQTT',
    fr: 'Compteurs MQTT',
    de: 'MQTT Zähler',
    ar: 'عدادات MQTT',
    pt: 'Medidores MQTT',
  },
  'mqtt-thermostats': {
    en: 'MQTT Thermostats',
    zh: 'MQTT温控器',
    es: 'Termostatos MQTT',
    ru: 'Термостаты MQTT',
    fr: 'Thermostats MQTT',
    de: 'MQTT Thermostate',
    ar: 'ثرموستات MQTT',
    pt: 'Termostatos MQTT',
  },
  'mqtt-gateways': {
    en: 'MQTT Gateways',
    zh: 'MQTT网关',
    es: 'Gateways MQTT',
    ru: 'Шлюзы MQTT',
    fr: 'Passerelles MQTT',
    de: 'MQTT Gateways',
    ar: 'بوابات MQTT',
    pt: 'Gateways MQTT',
  },
  'mqtt-remotes': {
    en: 'MQTT Remotes',
    zh: 'MQTT遥控器',
    es: 'Mandos MQTT',
    ru: 'Пульты MQTT',
    fr: 'Télécommandes MQTT',
    de: 'MQTT Fernbedienungen',
    ar: 'أجهزة تحكم MQTT',
    pt: 'Controles MQTT',
  },
  'mqtt-software': {
    en: 'MQTT Software',
    zh: 'MQTT软件',
    es: 'Software MQTT',
    ru: 'ПО MQTT',
    fr: 'Logiciel MQTT',
    de: 'MQTT Software',
    ar: 'برمجيات MQTT',
    pt: 'Software MQTT',
  },

  // ----- ZigBee sub-types -----
  'zigbee-meters': {
    en: 'ZigBee Meters',
    zh: 'ZigBee电表',
    es: 'Medidores ZigBee',
    ru: 'Счетчики ZigBee',
    fr: 'Compteurs ZigBee',
    de: 'ZigBee Zähler',
    ar: 'عدادات ZigBee',
    pt: 'Medidores ZigBee',
  },
  'zigbee-thermostats': {
    en: 'ZigBee Thermostats',
    zh: 'ZigBee温控器',
    es: 'Termostatos ZigBee',
    ru: 'Термостаты ZigBee',
    fr: 'Thermostats ZigBee',
    de: 'ZigBee Thermostate',
    ar: 'ثرموستات ZigBee',
    pt: 'Termostatos ZigBee',
  },
  'zigbee-lighting': {
    en: 'ZigBee Lighting',
    zh: 'ZigBee照明',
    es: 'Iluminación ZigBee',
    ru: 'Освещение ZigBee',
    fr: 'Éclairage ZigBee',
    de: 'ZigBee Beleuchtung',
    ar: 'إضاءة ZigBee',
    pt: 'Iluminação ZigBee',
  },
  'zigbee-gateways': {
    en: 'ZigBee Gateways',
    zh: 'ZigBee网关',
    es: 'Gateways ZigBee',
    ru: 'Шлюзы ZigBee',
    fr: 'Passerelles ZigBee',
    de: 'ZigBee Gateways',
    ar: 'بوابات ZigBee',
    pt: 'Gateways ZigBee',
  },
  'zigbee-remotes': {
    en: 'ZigBee Remotes',
    zh: 'ZigBee遥控器',
    es: 'Mandos ZigBee',
    ru: 'Пульты ZigBee',
    fr: 'Télécommandes ZigBee',
    de: 'ZigBee Fernbedienungen',
    ar: 'أجهزة تحكم ZigBee',
    pt: 'Controles ZigBee',
  },
  'zigbee-senior': {
    en: 'ZigBee Senior Care',
    zh: 'ZigBee养老',
    es: 'Cuidado ZigBee',
    ru: 'Уход ZigBee',
    fr: 'Soins ZigBee',
    de: 'ZigBee Seniorenpflege',
    ar: 'رعاية ZigBee',
    pt: 'Cuidados ZigBee',
  },
  'zigbee-sensors': {
    en: 'ZigBee Sensors',
    zh: 'ZigBee传感器',
    es: 'Sensores ZigBee',
    ru: 'Датчики ZigBee',
    fr: 'Capteurs ZigBee',
    de: 'ZigBee Sensoren',
    ar: 'مستشعرات ZigBee',
    pt: 'Sensores ZigBee',
  },
  'zigbee-energy': {
    en: 'ZigBee Energy',
    zh: 'ZigBee能源',
    es: 'Energía ZigBee',
    ru: 'Энергия ZigBee',
    fr: 'Énergie ZigBee',
    de: 'ZigBee Energie',
    ar: 'طاقة ZigBee',
    pt: 'Energia ZigBee',
  },
  'zigbee-software': {
    en: 'ZigBee Software',
    zh: 'ZigBee软件',
    es: 'Software ZigBee',
    ru: 'ПО ZigBee',
    fr: 'Logiciel ZigBee',
    de: 'ZigBee Software',
    ar: 'برمجيات ZigBee',
    pt: 'Software ZigBee',
  },
};

// ===================================================================
// SPEC LABELS — labels for communication, ecosystem, extraTags, softwareType
// ===================================================================

export const SPEC_LABELS: Record<string, LocalizedRecord> = {
  // ----- Communication -----
  zigbee: {
    en: 'ZigBee',
    zh: 'ZigBee',
    es: 'ZigBee',
    ru: 'ZigBee',
    fr: 'ZigBee',
    de: 'ZigBee',
    ar: 'ZigBee',
    pt: 'ZigBee',
  },
  wifi: {
    en: 'WiFi',
    zh: 'WiFi',
    es: 'WiFi',
    ru: 'WiFi',
    fr: 'WiFi',
    de: 'WiFi',
    ar: 'WiFi',
    pt: 'WiFi',
  },
  '4g': {
    en: '4G',
    zh: '4G',
    es: '4G',
    ru: '4G',
    fr: '4G',
    de: '4G',
    ar: '4G',
    pt: '4G',
  },
  lora: {
    en: 'LoRa',
    zh: 'LoRa',
    es: 'LoRa',
    ru: 'LoRa',
    fr: 'LoRa',
    de: 'LoRa',
    ar: 'LoRa',
    pt: 'LoRa',
  },
  'nb-iot': {
    en: 'NB-IoT',
    zh: 'NB-IoT',
    es: 'NB-IoT',
    ru: 'NB-IoT',
    fr: 'NB-IoT',
    de: 'NB-IoT',
    ar: 'NB-IoT',
    pt: 'NB-IoT',
  },
  modbus: {
    en: 'Modbus',
    zh: 'Modbus',
    es: 'Modbus',
    ru: 'Modbus',
    fr: 'Modbus',
    de: 'Modbus',
    ar: 'Modbus',
    pt: 'Modbus',
  },
  mqtt: {
    en: 'MQTT',
    zh: 'MQTT',
    es: 'MQTT',
    ru: 'MQTT',
    fr: 'MQTT',
    de: 'MQTT',
    ar: 'MQTT',
    pt: 'MQTT',
  },
  tcpip: {
    en: 'TCP/IP',
    zh: 'TCP/IP',
    es: 'TCP/IP',
    ru: 'TCP/IP',
    fr: 'TCP/IP',
    de: 'TCP/IP',
    ar: 'TCP/IP',
    pt: 'TCP/IP',
  },
  rj45: {
    en: 'RJ45',
    zh: 'RJ45',
    es: 'RJ45',
    ru: 'RJ45',
    fr: 'RJ45',
    de: 'RJ45',
    ar: 'RJ45',
    pt: 'RJ45',
  },

  // ----- Ecosystem -----
  tuya: {
    en: 'Tuya',
    zh: '涂鸦智能',
    es: 'Tuya',
    ru: 'Tuya',
    fr: 'Tuya',
    de: 'Tuya',
    ar: 'تويا',
    pt: 'Tuya',
  },
  'mqtt-open': {
    en: 'MQTT Open',
    zh: 'MQTT开放',
    es: 'MQTT Abierto',
    ru: 'MQTT открытый',
    fr: 'MQTT Ouvert',
    de: 'MQTT Offen',
    ar: 'MQTT مفتوح',
    pt: 'MQTT Aberto',
  },
  'zigbee-solution': {
    en: 'ZigBee Solution',
    zh: 'ZigBee方案',
    es: 'Solución ZigBee',
    ru: 'ZigBee решение',
    fr: 'Solution ZigBee',
    de: 'ZigBee Lösung',
    ar: 'حل ZigBee',
    pt: 'Solução ZigBee',
  },
  'home-assistant': {
    en: 'Home Assistant',
    zh: 'Home Assistant',
    es: 'Home Assistant',
    ru: 'Home Assistant',
    fr: 'Home Assistant',
    de: 'Home Assistant',
    ar: 'Home Assistant',
    pt: 'Home Assistant',
  },
  'local-api': {
    en: 'Local API',
    zh: '本地API',
    es: 'API Local',
    ru: 'Локальный API',
    fr: 'API Locale',
    de: 'Lokale API',
    ar: 'API محلي',
    pt: 'API Local',
  },

  // ----- Extra Tags -----
  'modbus-rtu': {
    en: 'Modbus RTU',
    zh: 'Modbus RTU',
    es: 'Modbus RTU',
    ru: 'Modbus RTU',
    fr: 'Modbus RTU',
    de: 'Modbus RTU',
    ar: 'Modbus RTU',
    pt: 'Modbus RTU',
  },
  'modbus-tcp': {
    en: 'Modbus TCP',
    zh: 'Modbus TCP',
    es: 'Modbus TCP',
    ru: 'Modbus TCP',
    fr: 'Modbus TCP',
    de: 'Modbus TCP',
    ar: 'Modbus TCP',
    pt: 'Modbus TCP',
  },

  // ----- Software Type -----
  app: {
    en: 'App',
    zh: 'App',
    es: 'App',
    ru: 'Приложение',
    fr: 'App',
    de: 'App',
    ar: 'تطبيق',
    pt: 'App',
  },
  web: {
    en: 'Web',
    zh: 'Web',
    es: 'Web',
    ru: 'Веб',
    fr: 'Web',
    de: 'Web',
    ar: 'ويب',
    pt: 'Web',
  },
  admin: {
    en: 'Admin Panel',
    zh: '管理后台',
    es: 'Panel de Administración',
    ru: 'Админ-панель',
    fr: 'Panneau d\'Administration',
    de: 'Admin-Panel',
    ar: 'لوحة الإدارة',
    pt: 'Painel de Administração',
  },
  analytics: {
    en: 'Analytics',
    zh: '数据分析',
    es: 'Analíticas',
    ru: 'Аналитика',
    fr: 'Analytique',
    de: 'Analytik',
    ar: 'تحليلات',
    pt: 'Análises',
  },
  'iot-platform': {
    en: 'IoT Platform',
    zh: '物联网平台',
    es: 'Plataforma IoT',
    ru: 'IoT платформа',
    fr: 'Plateforme IoT',
    de: 'IoT-Plattform',
    ar: 'منصة إنترنت الأشياء',
    pt: 'Plataforma IoT',
  },
};

// ===================================================================
// HELPER: map type values to their parent categories
// ===================================================================

/** Maps each sub-type value to its parent main type. */
const SUB_TYPE_PARENT: Record<string, string> = {
  // Smart Meters
  'single-phase': 'smart-meters',
  'three-phase': 'smart-meters',
  'multi-circuit': 'smart-meters',
  'din-rail': 'smart-meters',
  'anti-backflow': 'smart-meters',
  // Thermostats
  '24vac': 'thermostats',
  'boiler-trv': 'thermostats',
  'zigbee-hvac': 'thermostats',
  // Senior Care
  emergency: 'senior-care',
  safety: 'senior-care',
  tracking: 'senior-care',
  health: 'senior-care',
  management: 'senior-care',
  'aijuan-app': 'senior-care',
  'home-care-web': 'senior-care',
  'nursing-station-web': 'senior-care',
  // Hotel Control
  'room-thermostat': 'hotel-control',
  lighting: 'hotel-control',
  'door-sign': 'hotel-control',
  'energy-management': 'hotel-control',
  // Software & Platforms
  'smartowon-app': 'software-platforms',
  'zigbee-control-web': 'software-platforms',
  'energy-monitor-web': 'software-platforms',
  'partner-platform': 'software-platforms',
  'iot-platform': 'software-platforms',
};

/** Maps each tech sub-type value to its parent tech solution. */
const TECH_SUB_PARENT: Record<string, string> = {
  // Tuya
  'tuya-meters': 'tuya',
  'tuya-thermostats': 'tuya',
  'tuya-lighting': 'tuya',
  'tuya-gateways': 'tuya',
  'tuya-remotes': 'tuya',
  'tuya-senior': 'tuya',
  'tuya-sensors': 'tuya',
  // MQTT
  'mqtt-meters': 'mqtt',
  'mqtt-thermostats': 'mqtt',
  'mqtt-gateways': 'mqtt',
  'mqtt-remotes': 'mqtt',
  'mqtt-software': 'mqtt',
  // ZigBee
  'zigbee-meters': 'zigbee',
  'zigbee-thermostats': 'zigbee',
  'zigbee-lighting': 'zigbee',
  'zigbee-gateways': 'zigbee',
  'zigbee-remotes': 'zigbee',
  'zigbee-senior': 'zigbee',
  'zigbee-sensors': 'zigbee',
  'zigbee-energy': 'zigbee',
  'zigbee-software': 'zigbee',
};

// ===================================================================
// UTILITY FUNCTIONS
// ===================================================================

/**
 * Get a localized label for a given value from a label map.
 * Falls back to the English label, then to the raw value if no label exists.
 */
export function getLocalizedLabel(
  labels: Record<string, LocalizedRecord>,
  value: string,
  locale: Locale = 'en',
): string {
  const entry = labels[value];
  if (!entry) return value;
  return entry[locale] ?? entry.en ?? value;
}

/**
 * Filter an array of products by the given filter state.
 *
 * Logic:
 * - AND between different filter groups (productType, techSolution, etc.)
 * - OR within multi-select groups (communication, ecosystem, etc.)
 * - A missing (undefined) filter or empty array means "match all" for that group.
 */
export function filterProducts<T extends {
  productType?: string;
  productSubType?: string;
  techSolution?: string;
  techSubType?: string;
  communication?: string[];
  ecosystem?: string[];
  extraTags?: string[];
  softwareType?: string[];
}>(
  products: T[],
  filters: {
    productType?: string;
    productSubType?: string;
    techSolution?: string;
    techSubType?: string;
    communication?: string[];
    ecosystem?: string[];
    extraTags?: string[];
    softwareType?: string[];
  },
): T[] {
  return products.filter((product) => {
    // --- Single-value filters (AND logic between groups) ---

    if (filters.productType && product.productType !== filters.productType) {
      return false;
    }

    if (filters.productSubType && product.productSubType !== filters.productSubType) {
      return false;
    }

    if (filters.techSolution && product.techSolution !== filters.techSolution) {
      return false;
    }

    if (filters.techSubType && product.techSubType !== filters.techSubType) {
      return false;
    }

    // --- Multi-select filters (OR logic within each group) ---
    // The product must have AT LEAST ONE of the selected values.

    if (
      filters.communication &&
      filters.communication.length > 0 &&
      (!product.communication ||
        !filters.communication.some((v) => product.communication!.includes(v)))
    ) {
      return false;
    }

    if (
      filters.ecosystem &&
      filters.ecosystem.length > 0 &&
      (!product.ecosystem ||
        !filters.ecosystem.some((v) => product.ecosystem!.includes(v)))
    ) {
      return false;
    }

    if (
      filters.extraTags &&
      filters.extraTags.length > 0 &&
      (!product.extraTags ||
        !filters.extraTags.some((v) => product.extraTags!.includes(v)))
    ) {
      return false;
    }

    if (
      filters.softwareType &&
      filters.softwareType.length > 0 &&
      (!product.softwareType ||
        !filters.softwareType.some((v) => product.softwareType!.includes(v)))
    ) {
      return false;
    }

    return true;
  });
}

/**
 * Return all distinct main product type values.
 */
export function getAllProductTypes(): string[] {
  return ['smart-meters', 'thermostats', 'senior-care', 'hotel-control', 'software-platforms'];
}

/**
 * Return the sub-type values for a given main product type.
 * Returns an empty array for unknown main types.
 */
export function getProductSubTypes(type: string): string[] {
  return Object.entries(SUB_TYPE_PARENT)
    .filter(([, parent]) => parent === type)
    .map(([subType]) => subType);
}

/**
 * Return all distinct tech solution values.
 */
export function getAllTechSolutions(): string[] {
  return ['tuya', 'mqtt', 'zigbee'];
}

/**
 * Return the tech sub-type values for a given tech solution.
 * Returns an empty array for unknown solutions.
 */
export function getTechSubTypes(solution: string): string[] {
  return Object.entries(TECH_SUB_PARENT)
    .filter(([, parent]) => parent === solution)
    .map(([subType]) => subType);
}
