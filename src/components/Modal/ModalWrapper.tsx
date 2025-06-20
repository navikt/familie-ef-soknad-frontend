import styled from 'styled-components';
import { Button, Modal } from '@navikt/ds-react';
import React from 'react';

const ModalContainer = styled(Modal)<{ maxWidth?: number }>`
  max-width: ${(props) => (props.maxWidth ? `${props.maxWidth}rem` : '40rem')};
`;

const Innhold = styled.div`
  margin-right: 2rem;
  margin-left: 2rem;
`;

const ButtonContainer = styled.div<{ marginTop?: number }>`
  display: flex;
  justify-content: flex-end;
  margin-top: ${(props) => (props.marginTop ? `${props.marginTop}rem` : '1rem')};
  margin-right: 2rem;
  margin-bottom: 0.5rem;
`;

const ModalKnapp = styled(Button)`
  padding-right: 1.5rem;
  padding-left: 1.5rem;
  margin-left: 1rem;
`;

interface ModalProps {
  tittel: string;
  visModal: boolean;
  onClose?: () => void;
  aksjonsknapper?: {
    hovedKnapp: Aksjonsknapp;
    lukkKnapp: Aksjonsknapp;
    marginTop?: number;
  };
  maxWidth?: number;
  ariaLabel?: string;
  children?: React.ReactNode;
}

interface Aksjonsknapp {
  onClick: () => void;
  tekst: string;
  disabled?: boolean;
}

export const ModalWrapper: React.FC<ModalProps> = ({
  tittel,
  visModal,
  onClose,
  aksjonsknapper,
  maxWidth,
  ariaLabel,
  children,
}) => {
  return (
    <ModalContainer
      open={visModal}
      onClose={onClose ? () => onClose() : () => null}
      maxWidth={maxWidth}
      aria-label={ariaLabel ? ariaLabel : tittel}
      header={{ heading: tittel, closeButton: !!onClose }}
    >
      <Modal.Body>
        <Innhold>{children}</Innhold>
        {aksjonsknapper && (
          <ButtonContainer marginTop={aksjonsknapper.marginTop}>
            <ModalKnapp
              variant="tertiary"
              onClick={aksjonsknapper.lukkKnapp.onClick}
              disabled={aksjonsknapper.lukkKnapp.disabled}
            >
              {aksjonsknapper.lukkKnapp.tekst}
            </ModalKnapp>
            <ModalKnapp
              variant="primary"
              onClick={aksjonsknapper.hovedKnapp.onClick}
              disabled={aksjonsknapper.hovedKnapp.disabled}
            >
              {aksjonsknapper.hovedKnapp.tekst}
            </ModalKnapp>
          </ButtonContainer>
        )}
      </Modal.Body>
    </ModalContainer>
  );
};
