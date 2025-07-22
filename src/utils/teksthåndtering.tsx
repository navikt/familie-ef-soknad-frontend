import { LokalIntlShape } from '../language/typer';

export const storeForbokstaver = (tekst: string): string => {
  return tekst
    .split(' ')
    .map((ord) =>
      ord
        .split('-')
        .map((navn) => navn.charAt(0).toUpperCase() + navn.slice(1).toLowerCase())
        .join('-')
    )
    .join(' ');
};

const parseHtml = (htmlString: string): React.ReactNode => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  const finnNode = (node: ChildNode, key: number): React.ReactNode => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const children = Array.from(el.childNodes).map((child, i) => finnNode(child, i));

      switch (el.tagName.toLowerCase()) {
        case 'a':
          return (
            <a
              key={key}
              href={el.getAttribute('href') || ''}
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          );
        case 'strong':
          return <strong key={key}>{children}</strong>;
        case 'em':
          return <em key={key}>{children}</em>;
        case 'br':
          return <br key={key} />;
        case 'ul':
          return <ul key={key}>{children}</ul>;
        case 'ol':
          return <ol key={key}>{children}</ol>;
        case 'li':
          return <li key={key}>{children}</li>;
        default:
          return <span key={key}>{children}</span>;
      }
    }

    return null;
  };

  return <>{Array.from(doc.body.childNodes).map((node, i) => finnNode(node, i))}</>;
};

export const hentHTMLTekst = (id: string, intl: LokalIntlShape): React.ReactNode => {
  const tekststreng = intl.formatMessage({ id });
  return parseHtml(tekststreng);
};

export const hentHTMLTekstMedEnVariabel = (id: string, intl: LokalIntlShape, variabel: string) => {
  const tekststreng = intl.formatMessage({ id: id }, { 0: variabel });
  return parseHtml(tekststreng);
};

export const hentHTMLTekstMedFlereVariabler = (
  id: string,
  intl: LokalIntlShape,
  variabel?: Record<string, string>
) => {
  const tekststreng = intl.formatMessage({ id: id }, variabel);
  return parseHtml(tekststreng);
};
