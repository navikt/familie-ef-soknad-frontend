import { useLokalIntlContext } from '../context/LokalIntlContext';
import React from 'react';
import { hentTekstMedEnVariabel } from '../utils/søknad';

interface Props {
  id: string;
  replaceArgument0?: string;
}

const FormattedHtmlMessage: React.FC<Props> = ({ id, replaceArgument0 }) => {
  const intl = useLokalIntlContext();
  let text = intl.formatMessage({ id: id });
  if (replaceArgument0) {
    text = hentTekstMedEnVariabel(id, intl, replaceArgument0);
  }
  return <span dangerouslySetInnerHTML={{ __html: text }} />;
};

export default React.memo(FormattedHtmlMessage);
