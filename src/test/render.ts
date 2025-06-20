import React from 'react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import {
  render as rtlRender,
  RenderOptions as RtlRenderOptions,
  RenderResult as RtlRenderResult,
  Screen as RtlScreen,
  screen as rtlScreen,
} from '@testing-library/react';

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
