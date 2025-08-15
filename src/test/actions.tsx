import { render } from './render';
import { TestContainer } from './TestContainer';
import { OvergangsstønadApp } from '../søknader/overgangsstønad/OvergangsstønadApp';
import { Screen, waitFor, within } from '@testing-library/dom';
import { expect } from 'vitest';
import { UserEvent } from '@testing-library/user-event/index';
import BarnetilsynApp from '../søknader/barnetilsyn/BarnetilsynApp';
import SkolepengerApp from '../søknader/skolepenger/SkolepengerApp';

export const navigerTilStegOvergangsstønad = async () => {
  const { screen, user } = render(
    <TestContainer>
      <OvergangsstønadApp />
    </TestContainer>
  );

  await waitFor(() => {
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Søknad om overgangsstønad',
      })
    ).toBeInTheDocument();
  });

  await user.click(
    screen.getByRole('button', {
      name: 'Fortsett på søknaden',
    })
  );

  return { screen, user };
};

export const navigerTilStegBarnetilsyn = async () => {
  const { screen, user } = render(
    <TestContainer>
      <BarnetilsynApp />
    </TestContainer>
  );

  await waitFor(() => {
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Søknad om barnetilsyn',
      })
    ).toBeInTheDocument();
  });

  await user.click(
    screen.getByRole('button', {
      name: 'Fortsett på søknaden',
    })
  );

  return { screen, user };
};

export const navigerTilStegSkolepenger = async () => {
  const { screen, user } = render(
    <TestContainer>
      <SkolepengerApp />
    </TestContainer>
  );

  await waitFor(() => {
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Søknad om stønad til skolepenger',
      })
    ).toBeInTheDocument();
  });

  await user.click(
    screen.getByRole('button', {
      name: 'Fortsett på søknaden',
    })
  );

  return { screen, user };
};

export const klikkRadioknapp = async (
  groupName: string,
  radioLabel: string,
  screen: Screen,
  user: UserEvent
) => {
  const radioGroup = screen.getByRole('group', { name: groupName });
  const radio = within(radioGroup).getByRole('radio', { name: radioLabel });
  await user.click(radio);
};

export const klikkCheckbox = async (name: string, screen: Screen, user: UserEvent) => {
  await user.click(screen.getByRole('checkbox', { name: name }));
};

export const klikkKomponentMedId = async (id: string, screen: Screen, user: UserEvent) => {
  await user.click(screen.getByTestId(id));
};

export const skrivFritekst = async (
  name: string,
  fritekst: string,
  screen: Screen,
  user: UserEvent
) => {
  await user.type(screen.getByRole('textbox', { name: name }), fritekst);
};

export const skrivFritekstTilKomponentMedId = async (
  id: string,
  fritekst: string,
  screen: Screen,
  user: UserEvent
) => {
  await user.type(screen.getByTestId(id), fritekst);
};
