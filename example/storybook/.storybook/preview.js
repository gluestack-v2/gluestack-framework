import { addParameters } from '@storybook/client-api';
import { DocsContainer } from '@storybook/addon-docs/blocks';
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {},
  options: {
    storySort: {
      method: '',
      order: [
        'Overview',
        ['Introduction', 'Architecture', 'Features', 'File Conventions'],
        'Getting Started',
        ['Installation', 'CLI'],
        'Configuration',
        ['ENV Management', '.glue', 'Config Folder'],
        'Plugins',
        [
          'Development Plugins',
          ['glue-plugin-cli', 'glue-plugin-develop'],
          'Feature Plugins',
          [
            'glue-plugin-web',
            'glue-sdk-plugin',
            'glue-plugin-service-gateway',
            'glue-plugin-functions',
            'glue-plugin-database',
            'glue-plugin-database-client',
          ],
        ],
      ],
    },
  },
};

export const decorators = [
  (Story) => {
    return <Story />;
  },
];

addParameters({
  docs: {
    container: ({ children, context }) => {
      return <DocsContainer context={context}>{children}</DocsContainer>;
    },
  },
});
