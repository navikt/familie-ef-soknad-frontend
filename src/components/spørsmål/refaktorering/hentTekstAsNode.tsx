import React from 'react';
import { LokalIntlShape } from '../../../language/typer';

export const hentTekstMedReact = (
  id: string,
  intl: LokalIntlShape,
  values?: Record<string, React.ReactNode>
): React.ReactNode => {
  const message = intl.messages[id];
  if (!message) return id;

  const parts = message.split(/({\w+})/g);

  return parts.map((part, index) => {
    const match = part.match(/{(\w+)}/);
    if (match) {
      const key = match[1];
      return (
        <React.Fragment key={index}>
          {values?.[key] ?? `{${key}}`}
        </React.Fragment>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};
