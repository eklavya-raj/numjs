import React from 'react';
import type { Preview, Decorator } from '@storybook/react';
import { NpProvider } from '@numjs/react';

const withNpProvider: Decorator = (Story) => (
  <NpProvider fallback={<div style={{ padding: 24, color: '#64748b', fontFamily: 'monospace' }}>Loading WASM…</div>}>
    <Story />
  </NpProvider>
);

const preview: Preview = {
  decorators: [withNpProvider],
};

export default preview;
