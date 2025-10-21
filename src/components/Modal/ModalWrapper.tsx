import { Button, Modal, VStack } from '@navikt/ds-react';
import React from 'react';

interface ModalProps {
  tittel: string;
  visModal: boolean;
  onClose?: () => void;
  aksjonsknapper?: {
    hovedKnapp: Aksjonsknapp;
    lukkKnapp: Aksjonsknapp;
    marginTop?: number;
  };
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
  children,
}) => {
  return (
    <Modal
      open={visModal}
      onClose={onClose ? () => onClose() : () => null}
      aria-label={tittel}
      header={{ heading: tittel, closeButton: !!onClose }}
      style={{ maxWidth: '40rem' }}
    >
      <Modal.Body>
        <VStack gap={'4'} marginInline={'6 6'}>
          {children}
          {aksjonsknapper && (
            <>
              <Button
                variant="tertiary"
                onClick={aksjonsknapper.lukkKnapp.onClick}
                disabled={aksjonsknapper.lukkKnapp.disabled}
              >
                {aksjonsknapper.lukkKnapp.tekst}
              </Button>
              <Button
                variant="primary"
                onClick={aksjonsknapper.hovedKnapp.onClick}
                disabled={aksjonsknapper.hovedKnapp.disabled}
              >
                {aksjonsknapper.hovedKnapp.tekst}
              </Button>
            </>
          )}
        </VStack>
      </Modal.Body>
    </Modal>
  );
};
