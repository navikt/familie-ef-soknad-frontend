import React from 'react';

interface Props {
  className: string;
}

export const FilIkon: React.FC<Props> = ({ className }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    focusable="false"
  >
    <title>Vedlegg</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 0L21 7V24H3V0H14ZM12 2H5V22H19V8H12V2ZM15 17V19H7V17H15ZM17 13V15H7V13H17ZM13 9V11H7V9H13ZM14 2.83V6L17.17 5.999L14 2.83Z"
      fill="#3E3832"
    />
  </svg>
);
