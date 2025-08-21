import { mockGet, mockMellomlagretSøknadOvergangsstønad } from '../../../../test/axios';
import {
  klikkCheckbox,
  klikkRadioknapp,
  navigerTilStegOvergangsstønad,
  skrivFritekst,
} from '../../../../test/aksjoner';
import { describe, expect, test } from 'vitest';
import {
  lagBooleanFelt,
  lagIBarn,
  lagIForelder,
  lagIMedforelder,
  lagPerson,
  lagSpørsmålBooleanFelt,
  lagTekstfelt,
} from '../../../../test/domeneUtils';
import { dagensDato, dagensIsoDatoMinusMåneder, formatDate } from '../../../../utils/dato';

vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn((url: string) => mockGet(url, 'overgangsstonad')),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    },
  };
});

const barn = lagIBarn({
  id: '1',
  navn: lagTekstfelt({ label: 'Navn', verdi: 'GÅEN PC' }),
  fødselsdato: lagTekstfelt({ verdi: dagensIsoDatoMinusMåneder(65) }),
  ident: lagTekstfelt({ verdi: '18877598140' }),
  født: lagSpørsmålBooleanFelt({ verdi: true }),
  alder: lagTekstfelt({ label: 'Alder', verdi: '5' }),
  harSammeAdresse: lagBooleanFelt('', true),
  forelder: lagIForelder({
    navn: lagTekstfelt({ verdi: 'SØKENDE FORELDER' }),
    id: '1',
    ident: lagTekstfelt({ verdi: '22891699941' }),
  }),
  medforelder: {
    label: '',
    verdi: lagIMedforelder({ navn: 'SPRUDLENDE MEDFORELDER', ident: '19872448961' }),
  },
  skalHaBarnepass: lagSpørsmålBooleanFelt({
    spørsmålid: '',
    svarid: '',
    label: '',
    verdi: true,
  }),
});

const barnMedSammeMedforelder = lagIBarn({
  id: '2',
  navn: lagTekstfelt({ label: 'Navn', verdi: 'GAMMEL TRUBADUR' }),
  fødselsdato: lagTekstfelt({ verdi: dagensIsoDatoMinusMåneder(45) }),
  ident: lagTekstfelt({ verdi: '09469425085' }),
  født: lagSpørsmålBooleanFelt({ verdi: true }),
  alder: lagTekstfelt({ label: 'Alder', verdi: '3' }),
  harSammeAdresse: lagBooleanFelt('', true),
  forelder: lagIForelder({
    navn: lagTekstfelt({ verdi: 'SØKENDE FORELDER' }),
    id: '1',
    ident: lagTekstfelt({ verdi: '22891699941' }),
  }),
  medforelder: {
    label: '',
    verdi: lagIMedforelder({ navn: 'SPRUDLENDE MEDFORELDER', ident: '19872448961' }),
  },
  skalHaBarnepass: lagSpørsmålBooleanFelt({
    spørsmålid: '',
    svarid: '',
    label: '',
    verdi: true,
  }),
});

const barnMedAnnenMedforelder = lagIBarn({
  id: '2',
  navn: lagTekstfelt({ label: 'Navn', verdi: 'GAMMEL TRUBADUR' }),
  fødselsdato: lagTekstfelt({ verdi: dagensIsoDatoMinusMåneder(45) }),
  ident: lagTekstfelt({ verdi: '09469425085' }),
  født: lagSpørsmålBooleanFelt({ verdi: true }),
  alder: lagTekstfelt({ label: 'Alder', verdi: '3' }),
  harSammeAdresse: lagBooleanFelt('', true),
  forelder: lagIForelder({
    navn: lagTekstfelt({ verdi: 'UKJENT KJEKKAS' }),
    id: '1',
    ident: lagTekstfelt({ verdi: '24520386773' }),
  }),
  medforelder: {
    label: '',
    verdi: lagIMedforelder({ navn: 'GÅEN MEDFORELDER', ident: '19872448961' }),
  },
  skalHaBarnepass: lagSpørsmålBooleanFelt({
    spørsmålid: '',
    svarid: '',
    label: '',
    verdi: true,
  }),
});

describe('BarnasBosted-Steg for overgangsstønad og skolepenger', () => {
  test('Skal navigere til BarnasBosted-steg fra mellomlagret søknad', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted');
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(
      screen.getByRole('heading', { level: 2, name: 'Den andre forelderen og samvær' })
    ).toBeInTheDocument();
  });

  test('Initielle tekster er tilstede', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted');
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(
      screen.getByRole('heading', { level: 2, name: 'Den andre forelderen og samvær' })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'GÅEN PC' })).toBeInTheDocument();
    expect(screen.getByText('Barnets andre forelder')).toBeInTheDocument();
    expect(screen.getByText('Navn')).toBeInTheDocument();
    expect(screen.getByText('GÅEN SKADE')).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: 'Bor GÅEN PCs andre forelder i Norge?' })
    ).toBeInTheDocument();
  });

  test('Medforelder bor ikke i Norge', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    expect(
      screen.queryByRole('group', { name: 'Har den andre forelderen samvær med GÅEN PC?' })
    ).not.toBeInTheDocument();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Nei', screen, user);

    expect(
      screen.getByRole('combobox', { name: 'Hvilket land bor den andre forelderen i?' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('group', { name: 'Har den andre forelderen samvær med GÅEN PC?' })
    ).not.toBeInTheDocument();

    await user.selectOptions(
      screen.getByRole('combobox', {
        name: 'Hvilket land bor den andre forelderen i?',
      }),
      'Belgia'
    );

    expect(
      screen.getByRole('group', { name: 'Har den andre forelderen samvær med GÅEN PC?' })
    ).toBeInTheDocument();
  });

  test('Medforelder bor i Norge', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    expect(
      screen.queryByRole('group', { name: 'Har den andre forelderen samvær med GÅEN PC?' })
    ).not.toBeInTheDocument();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);

    expect(
      screen.getByRole('group', { name: 'Har den andre forelderen samvær med GÅEN PC?' })
    ).toBeInTheDocument();
  });

  test('Andre forelder har mindre samvær enn en ettermiddag og annenhver helg, har beskrivende samværsavtale', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);

    expect(
      screen.getByText(
        'Med samvær mener vi all tid som barnet tilbringer sammen med den andre forelderen, også dersom du er til stede. Det gjelder både hvis samværet foregår hos den andre forelderen, hjemme hos deg eller andre steder. Hvis den andre forelderen treffer barnet sjelden og/eller under tilsyn, regnes dette også som samvær.'
      )
    );
    expect(
      screen.getByRole('group', {
        name: 'Har den andre forelderen samvær med GÅEN PC?',
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('group', {
        name: 'Har dere skriftlig samværsavtale for GÅEN PC?',
      })
    ).not.toBeInTheDocument();

    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Ja, men ikke mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende',
      screen,
      user
    );

    expect(
      screen.getByRole('button', { name: 'Opplysninger vi trenger i samværsavtalen' })
    ).toBeInTheDocument();

    await klikkRadioknapp(
      'Har dere skriftlig samværsavtale for GÅEN PC?',
      'Ja, og den beskriver når barnet er sammen med hver av foreldrene',
      screen,
      user
    );

    expect(
      screen.getByText((tekst) => tekst.includes('Du må legge ved samværsavtalen'))
    ).toBeInTheDocument();

    expect(
      screen.getByRole('group', {
        name: 'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      })
    ).toBeInTheDocument();
  });

  test('Andre forelder har mindre samvær enn en ettermiddag og annenhver helg, har ikke-beskrivende samværsavtale', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);

    expect(
      screen.getByText(
        'Med samvær mener vi all tid som barnet tilbringer sammen med den andre forelderen, også dersom du er til stede. Det gjelder både hvis samværet foregår hos den andre forelderen, hjemme hos deg eller andre steder. Hvis den andre forelderen treffer barnet sjelden og/eller under tilsyn, regnes dette også som samvær.'
      )
    );
    expect(
      screen.getByRole('group', {
        name: 'Har den andre forelderen samvær med GÅEN PC?',
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('group', {
        name: 'Har dere skriftlig samværsavtale for GÅEN PC?',
      })
    ).not.toBeInTheDocument();

    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Ja, men ikke mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende',
      screen,
      user
    );

    expect(
      screen.getByRole('button', { name: 'Opplysninger vi trenger i samværsavtalen' })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Opplysninger vi trenger i samværsavtalen' })
    );

    expect(
      screen.getByText((tekst) => tekst.includes('Vi trenger opplysninger om'))
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'hvor mange dager og netter barnet oppholder barnet seg hos den andre forelderen i minst en to ukers-periode'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes('når barnet reiser til og fra den andre forelderen')
      )
    ).toBeInTheDocument();

    await klikkRadioknapp(
      'Har dere skriftlig samværsavtale for GÅEN PC?',
      'Ja, men den beskriver ikke når barnet er sammen med hver av foreldrene',
      screen,
      user
    );

    expect(
      screen.getByText((tekst) => tekst.includes('Du må legge ved samværsavtalen'))
    ).toBeInTheDocument();

    expect(
      screen.getByRole('group', {
        name: 'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      })
    ).toBeInTheDocument();
  });

  test('Andre forelder har mindre samvær enn en ettermiddag og annenhver helg, har ikke samværsavtale', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);

    expect(
      screen.queryByRole('group', {
        name: 'Har dere skriftlig samværsavtale for GÅEN PC?',
      })
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(
        'Med samvær mener vi all tid som barnet tilbringer sammen med den andre forelderen, også dersom du er til stede. Det gjelder både hvis samværet foregår hos den andre forelderen, hjemme hos deg eller andre steder. Hvis den andre forelderen treffer barnet sjelden og/eller under tilsyn, regnes dette også som samvær.'
      )
    );

    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Ja, men ikke mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende',
      screen,
      user
    );

    await klikkRadioknapp('Har dere skriftlig samværsavtale for GÅEN PC?', 'Nei', screen, user);

    expect(
      screen.getByRole('group', {
        name: 'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      })
    ).toBeInTheDocument();
  });

  test('Andre forelder har mer samvær enn en ettermiddag og annenhver helg, har beskrivende samværsavtale', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);

    expect(
      screen.queryByRole('group', {
        name: 'Har dere skriftlig samværsavtale for GÅEN PC?',
      })
    ).not.toBeInTheDocument();

    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Ja, mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende',
      screen,
      user
    );

    expect(
      screen.getByRole('button', { name: 'Opplysninger vi trenger i samværsavtalen' })
    ).toBeInTheDocument();

    await klikkRadioknapp(
      'Har dere skriftlig samværsavtale for GÅEN PC?',
      'Ja, og den beskriver når barnet er sammen med hver av foreldrene',
      screen,
      user
    );

    expect(
      screen.getByText((tekst) => tekst.includes('Du må legge ved samværsavtalen'))
    ).toBeInTheDocument();

    expect(
      screen.getByRole('group', {
        name: 'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      })
    ).toBeInTheDocument();
  });

  test('Andre forelder har mer samvær enn en ettermiddag og annenhver helg, har ikke-beskrivende samværsavtale', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);

    expect(
      screen.queryByRole('group', {
        name: 'Har dere skriftlig samværsavtale for GÅEN PC?',
      })
    ).not.toBeInTheDocument();

    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Ja, mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende',
      screen,
      user
    );

    expect(
      screen.getByRole('button', { name: 'Opplysninger vi trenger i samværsavtalen' })
    ).toBeInTheDocument();

    await klikkRadioknapp(
      'Har dere skriftlig samværsavtale for GÅEN PC?',
      'Ja, men den beskriver ikke når barnet er sammen med hver av foreldrene',
      screen,
      user
    );

    expect(
      screen.getByText((tekst) => tekst.includes('Du må legge ved samværsavtalen'))
    ).toBeInTheDocument();
    expect(screen.getByText('Hvordan praktiserer dere samværet?')).toBeInTheDocument();
    expect(
      screen.getByText(
        'hvor mange dager og netter barnet oppholder seg hos den andre forelderen i minst en to ukers-periode'
      )
    ).toBeInTheDocument();
    expect(screen.getAllByText('når barnet reiser til og fra den andre forelderen')).toHaveLength(
      2
    );
    expect(screen.getByTestId('hvordanPraktiseresSamværet')).toBeInTheDocument();
    expect(
      screen.queryByRole('group', {
        name: 'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      })
    ).not.toBeInTheDocument();

    await user.type(screen.getByTestId('hvordanPraktiseresSamværet'), 'Ved å være sammen');

    expect(
      screen.queryByRole('group', {
        name: 'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      })
    ).toBeInTheDocument();
  });

  test('Andre forelder har mer samvær enn en ettermiddag og annenhver helg, har ikke samværsavtale', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);

    expect(
      screen.queryByRole('group', {
        name: 'Har dere skriftlig samværsavtale for GÅEN PC?',
      })
    ).not.toBeInTheDocument();

    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Ja, mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende',
      screen,
      user
    );

    expect(
      screen.getByRole('button', { name: 'Opplysninger vi trenger i samværsavtalen' })
    ).toBeInTheDocument();

    await klikkRadioknapp('Har dere skriftlig samværsavtale for GÅEN PC?', 'Nei', screen, user);

    expect(
      screen.queryByText((tekst) => tekst.includes('Du må legge ved samværsavtalen'))
    ).not.toBeInTheDocument();
    expect(screen.getByText('Hvordan praktiserer dere samværet?')).toBeInTheDocument();
    expect(
      screen.getByText(
        'hvor mange dager og netter barnet oppholder seg hos den andre forelderen i minst en to ukers-periode'
      )
    ).toBeInTheDocument();
    expect(screen.getAllByText('når barnet reiser til og fra den andre forelderen')).toHaveLength(
      2
    );
    expect(screen.getByTestId('hvordanPraktiseresSamværet')).toBeInTheDocument();
    expect(
      screen.queryByRole('group', {
        name: 'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      })
    ).not.toBeInTheDocument();

    await user.type(screen.getByTestId('hvordanPraktiseresSamværet'), 'Ved å være sammen');

    expect(
      screen.getByRole('group', {
        name: 'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      })
    ).toBeInTheDocument();
  });

  test('Andre forelder har ikke samvær', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);

    expect(
      screen.queryByRole('group', {
        name: 'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate??',
      })
    ).not.toBeInTheDocument();

    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );

    expect(
      screen.queryByRole('group', {
        name: 'Har dere skriftlig samværsavtale for GÅEN PC?',
      })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('group', {
        name: 'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      })
    ).toBeInTheDocument();
  });

  test('Bor foreldre i nærheten av hverandre; Ja', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );

    expect(
      screen.queryByRole('textbox', { name: 'Hvordan bor dere nærme hverandre?' })
    ).not.toBeInTheDocument();

    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Ja',
      screen,
      user
    );

    expect(
      screen.getByRole('textbox', { name: 'Hvordan bor dere nærme hverandre?' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('group', {
        name: 'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      })
    ).not.toBeInTheDocument();

    await user.type(
      screen.getByRole('textbox', { name: 'Hvordan bor dere nærme hverandre?' }),
      'Tralala'
    );

    expect(
      screen.getByRole('group', {
        name: 'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      })
    ).toBeInTheDocument();
  });

  test('Bor foreldre i nærheten av hverandre; Nei', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );

    expect(
      screen.queryByRole('group', {
        name: 'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      })
    ).not.toBeInTheDocument();

    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Nei',
      screen,
      user
    );

    expect(
      screen.getByRole('group', {
        name: 'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      })
    ).toBeInTheDocument();
  });

  test('Bor foreldre i nærheten av hverandre; Vet ikke', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );

    expect(
      screen.queryByRole('group', {
        name: 'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      })
    ).not.toBeInTheDocument();

    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );

    expect(
      screen.getByRole('group', {
        name: 'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      })
    ).toBeInTheDocument();
  });

  test('Har foreldre bodd sammen før; Ja', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );
    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );
    expect(
      screen.queryByRole('group', {
        name: 'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      })
    ).not.toBeInTheDocument();
    expect(
      screen.getAllByRole('button', {
        name: 'Grunnen til at vi spør om dette',
      })
    ).toHaveLength(1);

    expect(
      screen.queryByRole('textbox', { name: 'Når flyttet dere fra hverandre?' })
    ).not.toBeInTheDocument();

    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Ja',
      screen,
      user
    );

    expect(
      screen.getByRole('textbox', { name: 'Når flyttet dere fra hverandre?' })
    ).toBeInTheDocument();

    await skrivFritekst('Når flyttet dere fra hverandre?', '02.06.2025', screen, user);

    expect(
      screen.getByRole('group', {
        name: 'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      })
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', {
        name: 'Grunnen til at vi spør om dette',
      })
    ).toHaveLength(2);

    expect(
      screen.getByText(
        'Vi spør om dette for å kunne vurdere om du er så mye sammen med den andre av barnets foreldre at du ikke regnes som enslig mor eller far.'
      )
    ).toBeInTheDocument();
  });

  test('Har foreldre bodd sammen før; Nei', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );
    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );
    expect(
      screen.queryByRole('group', {
        name: 'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      })
    ).not.toBeInTheDocument();
    expect(
      screen.getAllByRole('button', {
        name: 'Grunnen til at vi spør om dette',
      })
    ).toHaveLength(1);

    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Nei',
      screen,
      user
    );

    expect(
      screen.getByRole('group', {
        name: 'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      })
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', {
        name: 'Grunnen til at vi spør om dette',
      })
    ).toHaveLength(2);

    expect(
      screen.getByText(
        'Vi spør om dette for å kunne vurdere om du er så mye sammen med den andre av barnets foreldre at du ikke regnes som enslig mor eller far.'
      )
    ).toBeInTheDocument();
  });

  test('Hvor mye er foreldrene sammen; Møtes ikke', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );
    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );
    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Nei',
      screen,
      user
    );

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();

    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      'Vi møtes ikke',
      screen,
      user
    );

    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });

  test('Hvor mye er foreldrene sammen; Kun når barnet hentes eller leveres', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );
    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );
    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Nei',
      screen,
      user
    );

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();

    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      'Vi møtes kun når barnet skal hentes eller leveres',
      screen,
      user
    );

    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });

  test('Hvor mye er foreldrene sammen; Møtes utenom henting og levering', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );
    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );
    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Nei',
      screen,
      user
    );

    expect(
      screen.queryByRole('textbox', {
        name: 'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      })
    ).not.toBeInTheDocument();

    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      'Vi møtes også utenom henting og levering',
      screen,
      user
    );

    expect(
      screen.getByRole('textbox', {
        name: 'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      })
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();

    await skrivFritekst(
      'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      'Mye',
      screen,
      user
    );

    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });

  test('Neste-knapp tar deg til oversiktssiden, 1 barn', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );
    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );
    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      'Vi møtes ikke',
      screen,
      user
    );

    await user.click(screen.getByRole('button', { name: 'Neste' }));

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Den andre forelderen og samvær',
      })
    ).toBeInTheDocument();
    expect(screen.getByText('GÅEN PC')).toBeInTheDocument();
    expect(screen.getByText('Bor GÅEN PCs andre forelder i Norge?')).toBeInTheDocument();
    expect(screen.getByText('Ja')).toBeInTheDocument();
    expect(screen.getByText('Har den andre forelderen samvær med GÅEN PC?')).toBeInTheDocument();
    expect(
      screen.getByText('Nei, den andre forelderen har ikke samvær med barnet')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Jeg vet ikke hvor den andre forelderen bor')).toBeInTheDocument();
    expect(
      screen.getByText('Har du bodd sammen med den andre forelderen til GÅEN PC før?')
    ).toBeInTheDocument();
    expect(screen.getByText('Nei')).toBeInTheDocument();
    expect(
      screen.getByText('Hvor mye er du sammen med den andre forelderen til GÅEN PC?')
    ).toBeInTheDocument();
    expect(screen.getByText('Vi møtes ikke')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Endre informasjon Endre informasjon' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });
});

describe('BarnasBosted-Steg for overgangsstønad og skolepenger, (kun terminbarn)', () => {
  test('Personalia-spm om medforelder dukker opp, (oppgir ikke den andre forelderen, annet)', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted', undefined, {
      person: lagPerson({
        barn: [
          lagIBarn({
            fødselsdato: lagTekstfelt({ verdi: dagensIsoDatoMinusMåneder(0) }),
            født: lagSpørsmålBooleanFelt({ verdi: false }),
            harSammeAdresse: lagBooleanFelt('', true),
          }),
        ],
      }),
    });
    const { screen, user } = await navigerTilStegOvergangsstønad();

    expect(screen.getByText(`Barn med termin ${formatDate(dagensDato)}`)).toBeInTheDocument();
    expect(screen.getByText('Barnets andre forelder')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Navn' })).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Jeg kan ikke oppgi den andre forelderen' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('group', { name: 'Hvorfor kan du ikke oppgi den andre forelderen?' })
    ).not.toBeInTheDocument();

    await klikkCheckbox('Jeg kan ikke oppgi den andre forelderen', screen, user);

    expect(
      screen.getByRole('group', { name: 'Hvorfor kan du ikke oppgi den andre forelderen?' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', { name: 'Hvorfor kan du ikke oppgi den andre forelderen?' })
    ).not.toBeInTheDocument();

    await klikkRadioknapp('Hvorfor kan du ikke oppgi den andre forelderen?', 'Annet', screen, user);

    expect(
      screen.getByRole('textbox', { name: 'Hvorfor kan du ikke oppgi den andre forelderen?' })
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();

    await user.type(
      screen.getByRole('textbox', { name: 'Hvorfor kan du ikke oppgi den andre forelderen?' }),
      'Ymse'
    );

    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });

  test('Personalia-spm om medforelder dukker opp, (oppgir ikke den andre forelderen, donor)', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted', undefined, {
      person: lagPerson({
        barn: [
          lagIBarn({
            fødselsdato: lagTekstfelt({ verdi: dagensIsoDatoMinusMåneder(0) }),
            født: lagSpørsmålBooleanFelt({ verdi: false }),
            harSammeAdresse: lagBooleanFelt('', true),
          }),
        ],
      }),
    });
    const { screen, user } = await navigerTilStegOvergangsstønad();

    expect(screen.getByText(`Barn med termin ${formatDate(dagensDato)}`)).toBeInTheDocument();
    expect(screen.getByText('Barnets andre forelder')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Navn' })).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Jeg kan ikke oppgi den andre forelderen' })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('group', { name: 'Hvorfor kan du ikke oppgi den andre forelderen?' })
    ).not.toBeInTheDocument();

    await klikkCheckbox('Jeg kan ikke oppgi den andre forelderen', screen, user);

    expect(
      screen.getByRole('group', { name: 'Hvorfor kan du ikke oppgi den andre forelderen?' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', { name: 'Hvorfor kan du ikke oppgi den andre forelderen?' })
    ).not.toBeInTheDocument();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();

    await klikkRadioknapp('Hvorfor kan du ikke oppgi den andre forelderen?', 'Donor', screen, user);

    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });

  test('Personalia-spm om medforelder dukker opp, (kjent andre forelder) ', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted', undefined, {
      person: lagPerson({
        barn: [
          lagIBarn({
            fødselsdato: lagTekstfelt({ verdi: dagensIsoDatoMinusMåneder(0) }),
            født: lagSpørsmålBooleanFelt({ verdi: false }),
            harSammeAdresse: lagBooleanFelt('', true),
          }),
        ],
      }),
    });
    const { screen, user } = await navigerTilStegOvergangsstønad();

    expect(screen.getByText(`Barn med termin ${formatDate(dagensDato)}`)).toBeInTheDocument();
    expect(screen.getByText('Barnets andre forelder')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Navn' })).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Jeg kan ikke oppgi den andre forelderen' })
    ).toBeInTheDocument();

    await user.type(screen.getByRole('textbox', { name: 'Navn' }), 'Ola Nordmann');

    await user.type(
      screen.getByRole('textbox', {
        name: 'Fødselsnummer / d-nummer (11 siffer)',
      }),
      '1234'
    );

    expect(screen.getByText('Ugyldig fødselsnummer eller d-nummer')).toBeInTheDocument();

    expect(
      screen.queryByRole('group', { name: 'Bor barnets andre forelder i Norge?' })
    ).not.toBeInTheDocument();

    await user.clear(
      screen.getByRole('textbox', {
        name: 'Fødselsnummer / d-nummer (11 siffer)',
      })
    );

    await user.type(
      screen.getByRole('textbox', {
        name: 'Fødselsnummer / d-nummer (11 siffer)',
      }),
      '09469425085'
    );

    expect(
      screen.getByRole('group', { name: 'Bor barnets andre forelder i Norge?' })
    ).toBeInTheDocument();

    await user.clear(
      screen.getByRole('textbox', {
        name: 'Fødselsnummer / d-nummer (11 siffer)',
      })
    );

    expect(
      screen.queryByRole('group', { name: 'Bor barnets andre forelder i Norge?' })
    ).not.toBeInTheDocument();

    await klikkCheckbox('Jeg kjenner ikke fødselsnummer / d-nummer', screen, user);

    expect(
      screen.getByRole('textbox', { name: 'Fødselsdato (kun hvis du vet)' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('group', { name: 'Bor barnets andre forelder i Norge?' })
    ).toBeInTheDocument();
  });

  test('Spm om barnets adresse terminbarn ikke skal bo hos søker', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted', undefined, {
      person: lagPerson({
        barn: [
          lagIBarn({
            fødselsdato: lagTekstfelt({ verdi: dagensIsoDatoMinusMåneder(0) }),
            født: lagSpørsmålBooleanFelt({ verdi: false }),
            harSammeAdresse: lagBooleanFelt('', false),
          }),
        ],
      }),
    });
    const { screen, user } = await navigerTilStegOvergangsstønad();

    expect(screen.getByText(`Barn med termin ${formatDate(dagensDato)}`)).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: 'Skal barnet ha adresse hos deg?' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('group', { name: 'Bor barnets andre forelder i Norge?' })
    ).not.toBeInTheDocument();

    await klikkRadioknapp(
      'Skal barnet ha adresse hos deg?',
      'Ja, og vi har eller skal registrere adressen i Folkeregisteret',
      screen,
      user
    );
    expect(
      screen.getByText(
        'Du må oppdatere adressen i Folkeregisteret så fort som mulig, slik at vi kan behandle søknaden din med riktig informasjon.'
      )
    );
    expect(screen.getByText('Barnets andre forelder')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Navn' })).toBeInTheDocument();

    await klikkRadioknapp(
      'Skal barnet ha adresse hos deg?',
      'Ja, men den andre forelderen samarbeider ikke om adresseendring',
      screen,
      user
    );
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Hvis barnet faktisk bor hos deg, må du ta kontakt med Folkeregisteret for å få hjelp til å registrere riktig adresse.'
        )
      )
    );
    expect(screen.getByText('Barnets andre forelder')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Navn' })).toBeInTheDocument();

    await klikkRadioknapp(
      'Skal barnet ha adresse hos deg?',
      'Nei, barnet har adresse hos den andre forelderen fordi vi har avtale om delt fast bosted',
      screen,
      user
    );
    expect(screen.getByText('Barnets andre forelder')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Navn' })).toBeInTheDocument();

    await klikkRadioknapp('Skal barnet ha adresse hos deg?', 'Nei', screen, user);
    expect(
      screen.getByText(
        'Når barnet ikke bor hos deg, har du ikke rett til stønad til enslig mor eller far.'
      )
    );
    expect(screen.getByText('Barnets andre forelder')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Navn' })).toBeInTheDocument();
  });
});

describe('2 barn, samme forelder', () => {
  test('Oversikten over første barn, første spørsmål andre barn', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted', undefined, {
      person: lagPerson({
        barn: [barn, barnMedSammeMedforelder],
      }),
    });
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );
    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );
    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      'Vi møtes ikke',
      screen,
      user
    );

    await user.click(screen.getByRole('button', { name: 'Neste' }));

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Den andre forelderen og samvær',
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'GÅEN PC' })).toBeInTheDocument();
    expect(screen.getByText('GÅEN PCs andre forelder')).toBeInTheDocument();
    expect(screen.getByText('SPRUDLENDE MEDFORELDER')).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Bor GÅEN PCs andre forelder i Norge?'))
    ).toBeInTheDocument();
    expect(screen.getByText('Ja')).toBeInTheDocument();
    expect(screen.getByText('Har den andre forelderen samvær med GÅEN PC?')).toBeInTheDocument();
    expect(
      screen.getAllByText('Nei, den andre forelderen har ikke samvær med barnet')
    ).toHaveLength(2); //Denne dukker opp en gang i oversikten over første barn, og er et alternativ for første spørsmål på neste barn
    expect(
      screen.getByText(
        'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Jeg vet ikke hvor den andre forelderen bor')).toBeInTheDocument();
    expect(
      screen.getByText('Har du bodd sammen med den andre forelderen til GÅEN PC før?')
    ).toBeInTheDocument();
    expect(screen.getByText('Nei')).toBeInTheDocument();
    expect(
      screen.getByText('Hvor mye er du sammen med den andre forelderen til GÅEN PC?')
    ).toBeInTheDocument();
    expect(screen.getByText('Vi møtes ikke')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Endre informasjon Endre informasjon' })
    ).toBeInTheDocument();

    expect(screen.getByText('GAMMEL TRUBADUR')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Du har besvart spørsmålene om relasjonen din til den andre forelderen på et annet barn. Siden du har flere barn med samme forelder, trenger du bare å svare på spørsmålene én gang. Hvis du vil endre svarene dine, må du gå tilbake til barnet hvor du svarte på spørsmålene.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Med samvær mener vi all tid som barnet tilbringer sammen med den andre forelderen, også dersom du er til stede. Det gjelder både hvis samværet foregår hos den andre forelderen, hjemme hos deg eller andre steder. Hvis den andre forelderen treffer barnet sjelden og/eller under tilsyn, regnes dette også som samvær.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: 'Har den andre forelderen samvær med GAMMEL TRUBADUR?' })
    ).toBeInTheDocument();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
  });

  test('Oversikten over første barn, spørsmålflyt for andre barn', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted', undefined, {
      person: lagPerson({
        barn: [barn, barnMedSammeMedforelder],
      }),
    });
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );
    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );
    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      'Vi møtes ikke',
      screen,
      user
    );

    expect(
      screen.queryByRole('group', { name: 'Har den andre forelderen samvær med GAMMEL TRUBADUR?' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Neste' }));

    expect(
      screen.getByRole('group', { name: 'Har den andre forelderen samvær med GAMMEL TRUBADUR?' })
    ).toBeInTheDocument();

    await klikkRadioknapp(
      'Har den andre forelderen samvær med GAMMEL TRUBADUR?',
      'Ja, men ikke mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende',
      screen,
      user
    );

    expect(
      screen.getByRole('group', { name: 'Har dere skriftlig samværsavtale for GAMMEL TRUBADUR?' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Opplysninger vi trenger i samværsavtalen' })
    ).toBeInTheDocument();
    expect(screen.queryByText('Du må legge ved samværsavtalen')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();

    await klikkRadioknapp(
      'Har dere skriftlig samværsavtale for GAMMEL TRUBADUR?',
      'Ja, og den beskriver når barnet er sammen med hver av foreldrene',
      screen,
      user
    );

    expect(screen.getByText('Du må legge ved samværsavtalen')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    await klikkRadioknapp(
      'Har dere skriftlig samværsavtale for GAMMEL TRUBADUR?',
      'Ja, men den beskriver ikke når barnet er sammen med hver av foreldrene',
      screen,
      user
    );

    expect(screen.getByText('Du må legge ved samværsavtalen')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    await klikkRadioknapp(
      'Har dere skriftlig samværsavtale for GAMMEL TRUBADUR?',
      'Nei',
      screen,
      user
    );

    expect(screen.queryByText('Du må legge ved samværsavtalen')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    await klikkRadioknapp(
      'Har den andre forelderen samvær med GAMMEL TRUBADUR?',
      'Ja, mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende',
      screen,
      user
    );
    await klikkRadioknapp(
      'Har dere skriftlig samværsavtale for GAMMEL TRUBADUR?',
      'Ja, og den beskriver når barnet er sammen med hver av foreldrene',
      screen,
      user
    );

    expect(screen.getByText('Du må legge ved samværsavtalen')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    expect(screen.getAllByText('Vi trenger opplysninger om')).toHaveLength(1);
    expect(screen.getAllByText('når barnet reiser til og fra den andre forelderen')).toHaveLength(
      1
    );

    await klikkRadioknapp(
      'Har dere skriftlig samværsavtale for GAMMEL TRUBADUR?',
      'Ja, men den beskriver ikke når barnet er sammen med hver av foreldrene',
      screen,
      user
    );

    expect(screen.getByText('Du må legge ved samværsavtalen')).toBeInTheDocument();
    expect(screen.getByText('Hvordan praktiserer dere samværet?')).toBeInTheDocument();
    expect(screen.getAllByText('Vi trenger opplysninger om')).toHaveLength(2);
    expect(
      screen.getByText(
        'hvor mange dager og netter barnet oppholder seg hos den andre forelderen i minst en to ukers-periode'
      )
    ).toBeInTheDocument();
    expect(screen.getAllByText('når barnet reiser til og fra den andre forelderen')).toHaveLength(
      2
    );
    expect(screen.getByTestId('hvordanPraktiseresSamværet')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).toBeInTheDocument();

    await user.type(screen.getByTestId('hvordanPraktiseresSamværet'), 'Ved å være sammen');

    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    await klikkRadioknapp(
      'Har dere skriftlig samværsavtale for GAMMEL TRUBADUR?',
      'Nei',
      screen,
      user
    );

    expect(screen.queryByText('Du må legge ved samværsavtalen')).not.toBeInTheDocument();
    expect(screen.getByText('Hvordan praktiserer dere samværet?')).toBeInTheDocument();
    expect(screen.getAllByText('Vi trenger opplysninger om')).toHaveLength(2);
    expect(
      screen.getByText(
        'hvor mange dager og netter barnet oppholder seg hos den andre forelderen i minst en to ukers-periode'
      )
    ).toBeInTheDocument();
    expect(screen.getAllByText('når barnet reiser til og fra den andre forelderen')).toHaveLength(
      2
    );
    expect(screen.getByTestId('hvordanPraktiseresSamværet')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(screen.getByTestId('hvordanPraktiseresSamværet')).toHaveValue('');

    await user.type(screen.getByTestId('hvordanPraktiseresSamværet'), 'ikke ha samværsavtale');

    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    await klikkRadioknapp(
      'Har den andre forelderen samvær med GAMMEL TRUBADUR?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );

    expect(
      screen.queryByRole('group', { name: 'Har dere skriftlig samværsavtale for GAMMEL TRUBADUR?' })
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('hvordanPraktiseresSamværet')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });

  test('Oversikten over begge barn', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted', undefined, {
      person: lagPerson({
        barn: [barn, barnMedSammeMedforelder],
      }),
    });
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );
    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );
    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      'Vi møtes ikke',
      screen,
      user
    );
    await user.click(screen.getByRole('button', { name: 'Neste' }));
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GAMMEL TRUBADUR?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );
    await user.click(screen.getByRole('button', { name: 'Neste' }));

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Den andre forelderen og samvær',
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'GÅEN PC' })).toBeInTheDocument();
    expect(screen.getByText('GÅEN PCs andre forelder')).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Bor GÅEN PCs andre forelder i Norge?'))
    ).toBeInTheDocument();
    expect(screen.getByText('Har den andre forelderen samvær med GÅEN PC?')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('Har du bodd sammen med den andre forelderen til GÅEN PC før?')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Hvor mye er du sammen med den andre forelderen til GÅEN PC?')
    ).toBeInTheDocument();

    expect(screen.getByRole('heading', { level: 3, name: 'GAMMEL TRUBADUR' })).toBeInTheDocument();
    expect(screen.getByText('GAMMEL TRUBADURs andre forelder')).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Bor GAMMEL TRUBADURs andre forelder i Norge?'))
    ).toBeInTheDocument();
    expect(
      screen.getByText('Har den andre forelderen samvær med GAMMEL TRUBADUR?')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Bor du og den andre forelderen til GAMMEL TRUBADUR i samme hus, blokk, gårdstun, kvartal eller vei/gate?'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('Har du bodd sammen med den andre forelderen til GAMMEL TRUBADUR før?')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Hvor mye er du sammen med den andre forelderen til GAMMEL TRUBADUR?')
    ).toBeInTheDocument();

    expect(screen.getAllByText('SØKENDE FORELDER')).toHaveLength(2); //Denne skal egentlig være SPRUDLENE MEDFORELDER
    expect(screen.getAllByText('Ja')).toHaveLength(2);
    expect(
      screen.getAllByText('Nei, den andre forelderen har ikke samvær med barnet')
    ).toHaveLength(2);
    expect(screen.getAllByText('Jeg vet ikke hvor den andre forelderen bor')).toHaveLength(2);
    expect(screen.getAllByText('Nei')).toHaveLength(2);
    expect(screen.getAllByText('Vi møtes ikke')).toHaveLength(2);
    expect(
      screen.getAllByRole('button', { name: 'Endre informasjon Endre informasjon' })
    ).toHaveLength(2);

    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });
});

describe('2 barn, forskjellige foreldre', () => {
  test('Oversikten over første barn, første spørsmål andre barn', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted', undefined, {
      person: lagPerson({
        barn: [barn, barnMedAnnenMedforelder],
      }),
    });
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );
    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );
    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      'Vi møtes ikke',
      screen,
      user
    );

    await user.click(screen.getByRole('button', { name: 'Neste' }));

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Den andre forelderen og samvær',
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'GÅEN PC' })).toBeInTheDocument();
    expect(screen.getByText('GÅEN PCs andre forelder')).toBeInTheDocument();
    expect(screen.getByText('GÅEN MEDFORELDER')).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Bor GÅEN PCs andre forelder i Norge?'))
    ).toBeInTheDocument();
    expect(screen.getByText('Har den andre forelderen samvær med GÅEN PC?')).toBeInTheDocument();
    expect(
      screen.getByText('Nei, den andre forelderen har ikke samvær med barnet')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Jeg vet ikke hvor den andre forelderen bor')).toBeInTheDocument();
    expect(
      screen.getByText('Har du bodd sammen med den andre forelderen til GÅEN PC før?')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Hvor mye er du sammen med den andre forelderen til GÅEN PC?')
    ).toBeInTheDocument();
    expect(screen.getByText('Vi møtes ikke')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Endre informasjon Endre informasjon' })
    ).toBeInTheDocument();

    expect(screen.getAllByText('Ja')).toHaveLength(2); //En per barn på spørsmål om annen forelder bor i Norge
    expect(screen.getAllByText('Nei')).toHaveLength(2); //En per barn på spørsmål om annen forelder bor i Norge

    expect(screen.getByText('GAMMEL TRUBADUR')).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: 'Bor GAMMEL TRUBADURs andre forelder i Norge?' })
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
  });

  test('Oversikten over første barn, spørsmålflyt for andre barn', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted', undefined, {
      person: lagPerson({
        barn: [barn, barnMedAnnenMedforelder],
      }),
    });
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );
    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );
    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      'Vi møtes ikke',
      screen,
      user
    );

    expect(
      screen.queryByRole('group', { name: 'Har den andre forelderen samvær med GAMMEL TRUBADUR?' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Neste' }));

    expect(
      screen.queryByRole('group', { name: 'Har den andre forelderen samvær med GÅEN PC?' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: 'Bor GAMMEL TRUBADURs andre forelder i Norge?' })
    ).toBeInTheDocument();

    await klikkRadioknapp('Bor GAMMEL TRUBADURs andre forelder i Norge?', 'Nei', screen, user);

    expect(
      screen.getByRole('combobox', { name: 'Hvilket land bor den andre forelderen i?' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('group', { name: 'Har den andre forelderen samvær med GAMMEL TRUBADUR?' })
    ).not.toBeInTheDocument();

    await user.selectOptions(
      screen.getByRole('combobox', {
        name: 'Hvilket land bor den andre forelderen i?',
      }),
      'Kuwait'
    );

    expect(
      screen.getByRole('group', { name: 'Har den andre forelderen samvær med GAMMEL TRUBADUR?' })
    ).toBeInTheDocument();

    await klikkRadioknapp('Bor GAMMEL TRUBADURs andre forelder i Norge?', 'Ja', screen, user);

    expect(
      screen.getByRole('group', { name: 'Har den andre forelderen samvær med GAMMEL TRUBADUR?' })
    ).toBeInTheDocument();

    await klikkRadioknapp(
      'Har den andre forelderen samvær med GAMMEL TRUBADUR?',
      'Ja, men ikke mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende',
      screen,
      user
    );

    expect(
      screen.getByRole('group', { name: 'Har dere skriftlig samværsavtale for GAMMEL TRUBADUR?' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Opplysninger vi trenger i samværsavtalen' })
    ).toBeInTheDocument();
    expect(screen.queryByText('Du må legge ved samværsavtalen')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('group', {
        name: 'Bor du og den andre forelderen til GAMMEL TRUBADUR i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      })
    ).not.toBeInTheDocument();

    await klikkRadioknapp(
      'Har dere skriftlig samværsavtale for GAMMEL TRUBADUR?',
      'Ja, og den beskriver når barnet er sammen med hver av foreldrene',
      screen,
      user
    );

    expect(screen.getByText('Du må legge ved samværsavtalen')).toBeInTheDocument();
    expect(
      screen.getByRole('group', {
        name: 'Bor du og den andre forelderen til GAMMEL TRUBADUR i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      })
    ).toBeInTheDocument();

    await klikkRadioknapp(
      'Har dere skriftlig samværsavtale for GAMMEL TRUBADUR?',
      'Ja, men den beskriver ikke når barnet er sammen med hver av foreldrene',
      screen,
      user
    );

    expect(screen.getByText('Du må legge ved samværsavtalen')).toBeInTheDocument();
    expect(
      screen.getByRole('group', {
        name: 'Bor du og den andre forelderen til GAMMEL TRUBADUR i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      })
    ).toBeInTheDocument();

    await klikkRadioknapp(
      'Har dere skriftlig samværsavtale for GAMMEL TRUBADUR?',
      'Nei',
      screen,
      user
    );

    expect(screen.queryByText('Du må legge ved samværsavtalen')).not.toBeInTheDocument();
    expect(
      screen.getByRole('group', {
        name: 'Bor du og den andre forelderen til GAMMEL TRUBADUR i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      })
    ).toBeInTheDocument();

    await klikkRadioknapp(
      'Har den andre forelderen samvær med GAMMEL TRUBADUR?',
      'Ja, mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende',
      screen,
      user
    );
    await klikkRadioknapp(
      'Har dere skriftlig samværsavtale for GAMMEL TRUBADUR?',
      'Ja, og den beskriver når barnet er sammen med hver av foreldrene',
      screen,
      user
    );

    expect(screen.getByText('Du må legge ved samværsavtalen')).toBeInTheDocument();
    expect(
      screen.getByRole('group', {
        name: 'Bor du og den andre forelderen til GAMMEL TRUBADUR i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      })
    ).toBeInTheDocument();

    expect(screen.getAllByText('Vi trenger opplysninger om')).toHaveLength(1);
    expect(screen.getAllByText('når barnet reiser til og fra den andre forelderen')).toHaveLength(
      1
    );

    await klikkRadioknapp(
      'Har dere skriftlig samværsavtale for GAMMEL TRUBADUR?',
      'Ja, men den beskriver ikke når barnet er sammen med hver av foreldrene',
      screen,
      user
    );

    expect(
      screen.queryByRole('group', {
        name: 'Bor du og den andre forelderen til GAMMEL TRUBADUR i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      })
    ).not.toBeInTheDocument();
    expect(screen.getByText('Du må legge ved samværsavtalen')).toBeInTheDocument();
    expect(screen.getByText('Hvordan praktiserer dere samværet?')).toBeInTheDocument();
    expect(screen.getAllByText('Vi trenger opplysninger om')).toHaveLength(2);
    expect(
      screen.getByText(
        'hvor mange dager og netter barnet oppholder seg hos den andre forelderen i minst en to ukers-periode'
      )
    ).toBeInTheDocument();
    expect(screen.getAllByText('når barnet reiser til og fra den andre forelderen')).toHaveLength(
      2
    );
    expect(screen.getByTestId('hvordanPraktiseresSamværet')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).toBeInTheDocument();

    await user.type(screen.getByTestId('hvordanPraktiseresSamværet'), 'Ved å være sammen');

    expect(
      screen.getByRole('group', {
        name: 'Bor du og den andre forelderen til GAMMEL TRUBADUR i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      })
    ).toBeInTheDocument();

    await klikkRadioknapp(
      'Har dere skriftlig samværsavtale for GAMMEL TRUBADUR?',
      'Nei',
      screen,
      user
    );

    expect(
      screen.queryByRole('group', {
        name: 'Bor du og den andre forelderen til GAMMEL TRUBADUR i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      })
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Du må legge ved samværsavtalen')).not.toBeInTheDocument();
    expect(screen.getByText('Hvordan praktiserer dere samværet?')).toBeInTheDocument();
    expect(screen.getAllByText('Vi trenger opplysninger om')).toHaveLength(2);
    expect(
      screen.getByText(
        'hvor mange dager og netter barnet oppholder seg hos den andre forelderen i minst en to ukers-periode'
      )
    ).toBeInTheDocument();
    expect(screen.getAllByText('når barnet reiser til og fra den andre forelderen')).toHaveLength(
      2
    );
    expect(screen.getByTestId('hvordanPraktiseresSamværet')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(screen.getByTestId('hvordanPraktiseresSamværet')).toHaveValue('');

    await user.type(screen.getByTestId('hvordanPraktiseresSamværet'), 'ikke ha samværsavtale');

    expect(
      screen.getByRole('group', {
        name: 'Bor du og den andre forelderen til GAMMEL TRUBADUR i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      })
    ).toBeInTheDocument();

    await klikkRadioknapp(
      'Har den andre forelderen samvær med GAMMEL TRUBADUR?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );

    expect(
      screen.queryByRole('group', { name: 'Har dere skriftlig samværsavtale for GAMMEL TRUBADUR?' })
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('hvordanPraktiseresSamværet')).not.toBeInTheDocument();
    expect(
      screen.getByRole('group', {
        name: 'Bor du og den andre forelderen til GAMMEL TRUBADUR i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      })
    ).toBeInTheDocument();

    await klikkRadioknapp(
      'Bor du og den andre forelderen til GAMMEL TRUBADUR i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Ja',
      screen,
      user
    );

    expect(
      screen.getByRole('textbox', { name: 'Hvordan bor dere nærme hverandre?' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('group', {
        name: 'Har du bodd sammen med den andre forelderen til GAMMEL TRUBADUR før?',
      })
    ).not.toBeInTheDocument();

    await user.type(
      screen.getByRole('textbox', { name: 'Hvordan bor dere nærme hverandre?' }),
      'Ved å eksistere'
    );

    expect(
      screen.getByRole('group', {
        name: 'Har du bodd sammen med den andre forelderen til GAMMEL TRUBADUR før?',
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('Hvor mye er du sammen med den andre forelderen til GAMMEL TRUBADUR?')
    ).not.toBeInTheDocument();

    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GAMMEL TRUBADUR før?',
      'Nei',
      screen,
      user
    );
    expect(
      screen.getByRole('group', {
        name: 'Hvor mye er du sammen med den andre forelderen til GAMMEL TRUBADUR?',
      })
    ).toBeInTheDocument();

    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GAMMEL TRUBADUR?',
      'Vi møtes også utenom henting og levering',
      screen,
      user
    );

    expect(
      screen.getByRole('textbox', {
        name: 'Hvor mye er du sammen med den andre forelderen til GAMMEL TRUBADUR?',
      })
    ).toBeInTheDocument();

    await user.type(
      screen.getByRole('textbox', {
        name: 'Hvor mye er du sammen med den andre forelderen til GAMMEL TRUBADUR?',
      }),
      'Masse'
    );

    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GAMMEL TRUBADUR?',
      'Vi møtes kun når barnet skal hentes eller leveres',
      screen,
      user
    );

    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GAMMEL TRUBADUR?',
      'Vi møtes ikke',
      screen,
      user
    );

    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GAMMEL TRUBADUR før?',
      'Ja',
      screen,
      user
    );

    expect(
      screen.getByRole('textbox', { name: 'Når flyttet dere fra hverandre?' })
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', {
        name: 'Hvor mye er du sammen med den andre forelderen til GAMMEL TRUBADUR?',
      })
    ).not.toBeInTheDocument();

    await user.type(
      screen.getByRole('textbox', { name: 'Når flyttet dere fra hverandre?' }),
      '12.06.2025'
    );

    expect(
      screen.getByRole('group', {
        name: 'Hvor mye er du sammen med den andre forelderen til GAMMEL TRUBADUR?',
      })
    ).toBeInTheDocument();

    await klikkRadioknapp(
      'Bor du og den andre forelderen til GAMMEL TRUBADUR i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Nei',
      screen,
      user
    );

    expect(
      screen.getByRole('group', {
        name: 'Har du bodd sammen med den andre forelderen til GAMMEL TRUBADUR før?',
      })
    ).toBeInTheDocument();

    await klikkRadioknapp(
      'Bor du og den andre forelderen til GAMMEL TRUBADUR i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );

    expect(
      screen.getByRole('group', {
        name: 'Har du bodd sammen med den andre forelderen til GAMMEL TRUBADUR før?',
      })
    ).toBeInTheDocument();
  });

  test('Oversikten over begge barn', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted', undefined, {
      person: lagPerson({
        barn: [barn, barnMedAnnenMedforelder],
      }),
    });
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );
    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );
    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      'Vi møtes ikke',
      screen,
      user
    );
    await user.click(screen.getByRole('button', { name: 'Neste' }));

    await klikkRadioknapp('Bor GAMMEL TRUBADURs andre forelder i Norge?', 'Ja', screen, user);

    await klikkRadioknapp(
      'Har den andre forelderen samvær med GAMMEL TRUBADUR?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );
    await klikkRadioknapp(
      'Bor du og den andre forelderen til GAMMEL TRUBADUR i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );
    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GAMMEL TRUBADUR før?',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GAMMEL TRUBADUR?',
      'Vi møtes ikke',
      screen,
      user
    );
    await user.click(screen.getByRole('button', { name: 'Neste' }));

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Den andre forelderen og samvær',
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'GÅEN PC' })).toBeInTheDocument();
    expect(screen.getByText('GÅEN PCs andre forelder')).toBeInTheDocument();
    expect(screen.getByText('SØKENDE FORELDER')).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Bor GÅEN PCs andre forelder i Norge?'))
    ).toBeInTheDocument();
    expect(screen.getByText('Har den andre forelderen samvær med GÅEN PC?')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('Har du bodd sammen med den andre forelderen til GÅEN PC før?')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Hvor mye er du sammen med den andre forelderen til GÅEN PC?')
    ).toBeInTheDocument();

    expect(screen.getByRole('heading', { level: 3, name: 'GAMMEL TRUBADUR' })).toBeInTheDocument();
    expect(screen.getByText('GAMMEL TRUBADURs andre forelder')).toBeInTheDocument();
    expect(screen.getByText('UKJENT KJEKKAS')).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Bor GAMMEL TRUBADURs andre forelder i Norge?'))
    ).toBeInTheDocument();
    expect(
      screen.getByText('Har den andre forelderen samvær med GAMMEL TRUBADUR?')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Bor du og den andre forelderen til GAMMEL TRUBADUR i samme hus, blokk, gårdstun, kvartal eller vei/gate?'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('Har du bodd sammen med den andre forelderen til GAMMEL TRUBADUR før?')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Hvor mye er du sammen med den andre forelderen til GAMMEL TRUBADUR?')
    ).toBeInTheDocument();

    expect(screen.getAllByText('Ja')).toHaveLength(2);
    expect(
      screen.getAllByText('Nei, den andre forelderen har ikke samvær med barnet')
    ).toHaveLength(2);
    expect(screen.getAllByText('Jeg vet ikke hvor den andre forelderen bor')).toHaveLength(2);
    expect(screen.getAllByText('Nei')).toHaveLength(2);
    expect(screen.getAllByText('Vi møtes ikke')).toHaveLength(2);
    expect(
      screen.getAllByRole('button', { name: 'Endre informasjon Endre informasjon' })
    ).toHaveLength(2);

    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });
});

describe('Oppsummeringssiden viser riktig informasjon', () => {
  test('Oversikten viser annen forelder bor i Norge', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted', undefined, {
      person: lagPerson({ barn: [barn] }),
    });
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );
    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );
    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      'Vi møtes ikke',
      screen,
      user
    );

    await user.click(screen.getByRole('button', { name: 'Neste' }));

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Den andre forelderen og samvær',
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'GÅEN PC' })).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Bor GÅEN PCs andre forelder i Norge?'))
    ).toBeInTheDocument();
    expect(screen.getByText('Ja')).toBeInTheDocument();
  });
  test('Oversikten viser annen forelder bor ikke i Norge', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted', undefined, {
      person: lagPerson({ barn: [barn] }),
    });
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Nei', screen, user);

    await user.selectOptions(
      screen.getByRole('combobox', {
        name: 'Hvilket land bor den andre forelderen i?',
      }),
      'Argentina'
    );

    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );
    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );
    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      'Vi møtes ikke',
      screen,
      user
    );

    await user.click(screen.getByRole('button', { name: 'Neste' }));

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Den andre forelderen og samvær',
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'GÅEN PC' })).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Bor GÅEN PCs andre forelder i Norge?'))
    ).toBeInTheDocument();
    expect(screen.getAllByText('Nei')).toHaveLength(2); //Nei dukker opp på et annet spørsmål og.
    expect(
      screen.getByText((tekst) => tekst.includes('Hvilket land bor den andre forelderen i?'))
    ).toBeInTheDocument();
    expect(screen.getByText('Argentina')).toBeInTheDocument();
  });
  test('Oversikten viser annen forelder har mindre samvær enn en ettermiddag + annenhver helg', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted', undefined, {
      person: lagPerson({ barn: [barn] }),
    });
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Ja, men ikke mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende',
      screen,
      user
    );
    await klikkRadioknapp('Har dere skriftlig samværsavtale for GÅEN PC?', 'Nei', screen, user);
    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );
    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      'Vi møtes ikke',
      screen,
      user
    );

    await user.click(screen.getByRole('button', { name: 'Neste' }));

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Den andre forelderen og samvær',
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'GÅEN PC' })).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Har den andre forelderen samvær med GÅEN PC?'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Ja, men ikke mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende'
      )
    ).toBeInTheDocument();
  });
  test('Oversikten viser annen forelder har mer samvær enn en ettermiddag + annenhver helg', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted', undefined, {
      person: lagPerson({ barn: [barn] }),
    });
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Ja, mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende',
      screen,
      user
    );
    await klikkRadioknapp(
      'Har dere skriftlig samværsavtale for GÅEN PC?',
      'Ja, og den beskriver når barnet er sammen med hver av foreldrene',
      screen,
      user
    );
    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );
    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      'Vi møtes ikke',
      screen,
      user
    );

    await user.click(screen.getByRole('button', { name: 'Neste' }));

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Den andre forelderen og samvær',
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'GÅEN PC' })).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Har den andre forelderen samvær med GÅEN PC?'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Ja, mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende'
      )
    ).toBeInTheDocument();
  });
  test('Oversikten viser annen forelder har ikke samvær', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted', undefined, {
      person: lagPerson({ barn: [barn] }),
    });
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );
    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );
    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      'Vi møtes ikke',
      screen,
      user
    );

    await user.click(screen.getByRole('button', { name: 'Neste' }));

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Den andre forelderen og samvær',
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'GÅEN PC' })).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Har den andre forelderen samvær med GÅEN PC?'))
    ).toBeInTheDocument();
    expect(
      screen.getByText('Nei, den andre forelderen har ikke samvær med barnet')
    ).toBeInTheDocument();
  });
  test('Oversikten viser har ukjent samvær, beskrivende samværsavtale', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted', undefined, {
      person: lagPerson({ barn: [barn] }),
    });
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Ja, mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende',
      screen,
      user
    );
    await klikkRadioknapp(
      'Har dere skriftlig samværsavtale for GÅEN PC?',
      'Ja, og den beskriver når barnet er sammen med hver av foreldrene',
      screen,
      user
    );
    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );
    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      'Vi møtes ikke',
      screen,
      user
    );

    await user.click(screen.getByRole('button', { name: 'Neste' }));

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Den andre forelderen og samvær',
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'GÅEN PC' })).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Har den andre forelderen samvær med GÅEN PC?'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Ja, mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende'
      )
    ).toBeInTheDocument();
  });
  test('Oversikten viser har ukjent samvær, ikke-beskrivende samværsavtale', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted', undefined, {
      person: lagPerson({ barn: [barn] }),
    });
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Ja, mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende',
      screen,
      user
    );
    await klikkRadioknapp(
      'Har dere skriftlig samværsavtale for GÅEN PC?',
      'Ja, men den beskriver ikke når barnet er sammen med hver av foreldrene',
      screen,
      user
    );

    await user.type(screen.getByTestId('hvordanPraktiseresSamværet'), 'En beskrivelse av samværet');

    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );
    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      'Vi møtes ikke',
      screen,
      user
    );

    await user.click(screen.getByRole('button', { name: 'Neste' }));

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Den andre forelderen og samvær',
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'GÅEN PC' })).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Har den andre forelderen samvær med GÅEN PC?'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Ja, mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Har dere skriftlig samværsavtale for GÅEN PC?')).toBeInTheDocument();
    expect(
      screen.getByText('Ja, men den beskriver ikke når barnet er sammen med hver av foreldrene')
    ).toBeInTheDocument();
    expect(screen.getByText('Hvordan praktiserer dere samværet?')).toBeInTheDocument();
    expect(screen.getByText('En beskrivelse av samværet')).toBeInTheDocument();
  });
  test('Oversikten viser har ukjent samvær, ikke samværsavtale', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted', undefined, {
      person: lagPerson({ barn: [barn] }),
    });
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Ja, mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende',
      screen,
      user
    );
    await klikkRadioknapp('Har dere skriftlig samværsavtale for GÅEN PC?', 'Nei', screen, user);

    await user.type(screen.getByTestId('hvordanPraktiseresSamværet'), 'En beskrivelse av samværet');

    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );
    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      'Vi møtes ikke',
      screen,
      user
    );

    await user.click(screen.getByRole('button', { name: 'Neste' }));

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Den andre forelderen og samvær',
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'GÅEN PC' })).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Har den andre forelderen samvær med GÅEN PC?'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Ja, mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Har dere skriftlig samværsavtale for GÅEN PC?')).toBeInTheDocument();
    expect(screen.getAllByText('Nei')).toHaveLength(2); // Nei på et annet spørsmål også
    expect(screen.getByText('Hvordan praktiserer dere samværet?')).toBeInTheDocument();
    expect(screen.getByText('En beskrivelse av samværet')).toBeInTheDocument();
  });
  test('Oversikten viser foreldre bor nærme', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted', undefined, {
      person: lagPerson({ barn: [barn] }),
    });
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );

    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Ja',
      screen,
      user
    );

    await user.type(
      screen.getByRole('textbox', { name: 'Hvordan bor dere nærme hverandre?' }),
      'Naboer'
    );

    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      'Vi møtes ikke',
      screen,
      user
    );

    await user.click(screen.getByRole('button', { name: 'Neste' }));

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Den andre forelderen og samvær',
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'GÅEN PC' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?'
      )
    ).toBeInTheDocument();
    expect(screen.getAllByText('Ja')).toHaveLength(2);
  });
  test('Oversikten viser foreldre bor ikke nærme', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted', undefined, {
      person: lagPerson({ barn: [barn] }),
    });
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );

    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Nei',
      screen,
      user
    );

    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      'Vi møtes ikke',
      screen,
      user
    );

    await user.click(screen.getByRole('button', { name: 'Neste' }));

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Den andre forelderen og samvær',
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'GÅEN PC' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?'
      )
    ).toBeInTheDocument();
    expect(screen.getAllByText('Nei')).toHaveLength(2);
  });
  test('Oversikten viser vet ikke hvor den andre forelderen bor', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted', undefined, {
      person: lagPerson({ barn: [barn] }),
    });
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );

    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );

    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      'Vi møtes ikke',
      screen,
      user
    );

    await user.click(screen.getByRole('button', { name: 'Neste' }));

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Den andre forelderen og samvær',
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'GÅEN PC' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Jeg vet ikke hvor den andre forelderen bor')).toBeInTheDocument();
  });
  test('Oversikten viser har bodd med den andre forelderen før', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted', undefined, {
      person: lagPerson({ barn: [barn] }),
    });
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );

    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );

    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Ja',
      screen,
      user
    );

    await user.type(
      screen.getByRole('textbox', {
        name: 'Når flyttet dere fra hverandre?',
      }),
      '02.06.2025'
    );

    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      'Vi møtes ikke',
      screen,
      user
    );

    await user.click(screen.getByRole('button', { name: 'Neste' }));

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Den andre forelderen og samvær',
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'GÅEN PC' })).toBeInTheDocument();
    expect(
      screen.getByText('Har du bodd sammen med den andre forelderen til GÅEN PC før?')
    ).toBeInTheDocument();
    expect(screen.getAllByText('Ja')).toHaveLength(2);
    expect(screen.getByText('Når flyttet dere fra hverandre?')).toBeInTheDocument();
    expect(screen.getByText('02.06.2025')).toBeInTheDocument();
  });
  test('Oversikten viser har ikke bodd med den andre forelderen før', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted', undefined, {
      person: lagPerson({ barn: [barn] }),
    });
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );

    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );

    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Nei',
      screen,
      user
    );

    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      'Vi møtes ikke',
      screen,
      user
    );

    await user.click(screen.getByRole('button', { name: 'Neste' }));

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Den andre forelderen og samvær',
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'GÅEN PC' })).toBeInTheDocument();
    expect(
      screen.getByText('Har du bodd sammen med den andre forelderen til GÅEN PC før?')
    ).toBeInTheDocument();
    expect(screen.getByText('Nei')).toBeInTheDocument();
  });
  test('Oversikten viser møter ikke andre forelder', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted', undefined, {
      person: lagPerson({ barn: [barn] }),
    });
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );

    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );

    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Nei',
      screen,
      user
    );

    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      'Vi møtes ikke',
      screen,
      user
    );

    await user.click(screen.getByRole('button', { name: 'Neste' }));

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Den andre forelderen og samvær',
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'GÅEN PC' })).toBeInTheDocument();
    expect(
      screen.getByText('Hvor mye er du sammen med den andre forelderen til GÅEN PC?')
    ).toBeInTheDocument();
    expect(screen.getByText('Vi møtes ikke')).toBeInTheDocument();
  });
  test('Oversikten viser møtes ved henting og levering', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted', undefined, {
      person: lagPerson({ barn: [barn] }),
    });
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );

    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );

    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Nei',
      screen,
      user
    );

    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      'Vi møtes kun når barnet skal hentes eller leveres',
      screen,
      user
    );

    await user.click(screen.getByRole('button', { name: 'Neste' }));

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Den andre forelderen og samvær',
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'GÅEN PC' })).toBeInTheDocument();
    expect(
      screen.getByText('Hvor mye er du sammen med den andre forelderen til GÅEN PC?')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Vi møtes kun når barnet skal hentes eller leveres')
    ).toBeInTheDocument();
  });
  test('Oversikten viser møtes utenom henting og levering', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted', undefined, {
      person: lagPerson({ barn: [barn] }),
    });
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );

    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );

    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Nei',
      screen,
      user
    );

    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      'Vi møtes også utenom henting og levering',
      screen,
      user
    );

    await user.type(
      screen.getByRole('textbox', {
        name: 'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      }),
      'Masse'
    );

    await user.click(screen.getByRole('button', { name: 'Neste' }));

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Den andre forelderen og samvær',
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'GÅEN PC' })).toBeInTheDocument();
    expect(
      screen.getAllByText('Hvor mye er du sammen med den andre forelderen til GÅEN PC?')
    ).toHaveLength(2); //De to spørsmålene er like
    expect(screen.getByText('Vi møtes også utenom henting og levering')).toBeInTheDocument();
    expect(screen.getByText('Masse')).toBeInTheDocument();
  });
});

describe('Endre informasjon', () => {
  test('Oversikten viser møter ikke andre forelder', async () => {
    mockMellomlagretSøknadOvergangsstønad('/barnas-bosted', undefined, {
      person: lagPerson({ barn: [barn] }),
    });
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Nei, den andre forelderen har ikke samvær med barnet',
      screen,
      user
    );

    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Jeg vet ikke hvor den andre forelderen bor',
      screen,
      user
    );

    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Nei',
      screen,
      user
    );

    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      'Vi møtes ikke',
      screen,
      user
    );

    await user.click(screen.getByRole('button', { name: 'Neste' }));

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Den andre forelderen og samvær',
      })
    ).toBeInTheDocument();
    expect(screen.getByText('GÅEN PC')).toBeInTheDocument();
    expect(screen.getByText('GÅEN PCs andre forelder')).toBeInTheDocument();
    expect(screen.getByText('SØKENDE FORELDER')).toBeInTheDocument();
    expect(screen.getByText('Bor GÅEN PCs andre forelder i Norge?')).toBeInTheDocument();
    expect(screen.getByText('Ja')).toBeInTheDocument();
    expect(screen.getByText('Har den andre forelderen samvær med GÅEN PC?')).toBeInTheDocument();
    expect(
      screen.getByText('Nei, den andre forelderen har ikke samvær med barnet')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Jeg vet ikke hvor den andre forelderen bor')).toBeInTheDocument();
    expect(
      screen.getByText('Har du bodd sammen med den andre forelderen til GÅEN PC før?')
    ).toBeInTheDocument();
    expect(screen.getByText('Nei')).toBeInTheDocument();
    expect(
      screen.getByText('Hvor mye er du sammen med den andre forelderen til GÅEN PC?')
    ).toBeInTheDocument();
    expect(screen.getByText('Vi møtes ikke')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Endre informasjon Endre informasjon' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Endre informasjon Endre informasjon' }));

    expect(screen.getByRole('heading', { level: 3, name: 'GÅEN PC' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 4, name: 'Barnets andre forelder' })
    ).toBeInTheDocument();
    expect(screen.getByText('Navn')).toBeInTheDocument();
    expect(screen.getByText('SPRUDLENDE MEDFORELDER')).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: 'Har den andre forelderen samvær med GÅEN PC?' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', {
        name: 'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', {
        name: 'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', {
        name: 'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    await klikkRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Nei', screen, user);

    await user.selectOptions(
      screen.getByRole('combobox', {
        name: 'Hvilket land bor den andre forelderen i?',
      }),
      'Kuwait'
    );

    await klikkRadioknapp(
      'Har den andre forelderen samvær med GÅEN PC?',
      'Ja, mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende',
      screen,
      user
    );

    await klikkRadioknapp(
      'Har dere skriftlig samværsavtale for GÅEN PC?',
      'Ja, men den beskriver ikke når barnet er sammen med hver av foreldrene',
      screen,
      user
    );

    await user.type(screen.getByTestId('hvordanPraktiseresSamværet'), 'Ved å være sammen');

    await klikkRadioknapp(
      'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
      'Nei',
      screen,
      user
    );

    await klikkRadioknapp(
      'Har du bodd sammen med den andre forelderen til GÅEN PC før?',
      'Ja',
      screen,
      user
    );

    await skrivFritekst('Når flyttet dere fra hverandre?', '02.06.2025', screen, user);

    await klikkRadioknapp(
      'Hvor mye er du sammen med den andre forelderen til GÅEN PC?',
      'Vi møtes kun når barnet skal hentes eller leveres',
      screen,
      user
    );

    await user.click(screen.getByTestId('leggTilForelderKnapp'));

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Den andre forelderen og samvær',
      })
    ).toBeInTheDocument();
    expect(screen.getByText('GÅEN PC')).toBeInTheDocument();
    expect(screen.getByText('GÅEN PCs andre forelder')).toBeInTheDocument();
    expect(screen.getByText('SØKENDE FORELDER')).toBeInTheDocument();
    expect(screen.getByText('Bor GÅEN PCs andre forelder i Norge?')).toBeInTheDocument();
    expect(screen.getAllByText('Nei')).toHaveLength(2);
    expect(screen.getByText('Har den andre forelderen samvær med GÅEN PC?')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Ja, mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Har dere skriftlig samværsavtale for GÅEN PC?')).toBeInTheDocument();
    expect(
      screen.getByText('Ja, men den beskriver ikke når barnet er sammen med hver av foreldrene')
    ).toBeInTheDocument();
    expect(screen.getByText('Hvordan praktiserer dere samværet?')).toBeInTheDocument();
    expect(screen.getByText('Ved å være sammen')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Bor du og den andre forelderen til GÅEN PC i samme hus, blokk, gårdstun, kvartal eller vei/gate?'
      )
    ).toBeInTheDocument();
    expect(screen.getAllByText('Nei')).toHaveLength(2);
    expect(
      screen.getByText('Har du bodd sammen med den andre forelderen til GÅEN PC før?')
    ).toBeInTheDocument();
    expect(screen.getByText('Ja')).toBeInTheDocument();
    expect(screen.getByText('Når flyttet dere fra hverandre?')).toBeInTheDocument();
    expect(screen.getByText('02.06.2025')).toBeInTheDocument();
    expect(
      screen.getByText('Hvor mye er du sammen med den andre forelderen til GÅEN PC?')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Vi møtes kun når barnet skal hentes eller leveres')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Endre informasjon Endre informasjon' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });
});
