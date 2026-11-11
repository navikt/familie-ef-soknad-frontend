import {
    type RenderOptions as RtlRenderOptions,
    type RenderResult as RtlRenderResult,
    type Screen as RtlScreen,
    render as rtlRender,
    screen as rtlScreen,
} from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import type React from 'react';

type RenderOptions = Omit<RtlRenderOptions, 'queries'>;

type RenderResult = RtlRenderResult & {
    user: UserEvent;
    screen: RtlScreen;
};

export function render(ui: React.ReactNode, options?: RenderOptions): RenderResult {
    return {
        user: userEvent.setup(),
        screen: rtlScreen,
        ...rtlRender(ui, options),
    };
}
