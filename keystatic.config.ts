import { config, collection, fields } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    products: collection({
      label: 'Products',
      path: 'src/content/products/*',
      slugField: 'name',
      format: {
        contentField: 'description',
      },
      schema: {
        name: fields.text({
          label: 'Product Name',
          validation: { isRequired: true },
        }),
        description: fields.text({
          label: 'Description',
          multiline: true,
        }),
        image: fields.image({
          label: 'Product Image',
          directory: 'public/images/products',
          publicPath: '/images/products',
        }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Smart Meter', value: 'smart-meter' },
            { label: 'Smart Thermostat', value: 'smart-thermostat' },
            { label: 'ZigBee Device', value: 'zigbee-device' },
            { label: 'IoT Solution', value: 'iot-solution' },
          ],
          defaultValue: 'smart-meter',
        }),
        specs: fields.object(
          {
            model: fields.text({ label: 'Model' }),
            connectivity: fields.text({ label: 'Connectivity' }),
            dimensions: fields.text({ label: 'Dimensions' }),
          },
          { label: 'Specifications' },
        ),
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
          },
        ),
        language: fields.text({
          label: 'Language',
          validation: { isRequired: true },
        }),
      },
    }),
  },
});
