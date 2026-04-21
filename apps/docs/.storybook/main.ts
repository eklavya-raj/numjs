import type { StorybookConfig } from '@storybook/react-vite';
import wasm from 'vite-plugin-wasm';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (config: import('vite').UserConfig) => {
    config.plugins = [...(config.plugins ?? []), wasm()];
    config.optimizeDeps = {
      ...(config.optimizeDeps ?? {}),
      exclude: [...((config.optimizeDeps?.exclude) ?? []), '@webwasm/numjs-core'],
    };
    return config;
  },
};

export default config;
