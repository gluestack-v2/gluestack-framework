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
        ['Introduction', 'Accessibility'],
        'Getting Started',
        ['Installation'],
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
