import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom/vitest';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

vi.mock('@navikt/nav-dekoratoren-moduler', () => ({
  setAvailableLanguages: vi.fn().mockImplementation(() => {
    return Promise.resolve();
  }),
  onLanguageSelect: vi.fn(),
  getCurrentConsent: vi.fn(),
}));
