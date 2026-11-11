import createUseContext from 'constate';
import { useState } from 'react';
import type { Toggles } from '../models/søknad/toggles';

const [TogglesProvider, useToggles] = createUseContext(() => {
    const [toggles, settToggles] = useState<Toggles>({});
    TogglesProvider.displayName = 'TOGGLES_PROVIDER';

    return { toggles, settToggles };
});

export { TogglesProvider, useToggles };
