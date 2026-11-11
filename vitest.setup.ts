import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';
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
