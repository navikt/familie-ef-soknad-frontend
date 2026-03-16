import { envVar } from './envVar';

interface TokenResponse {
  access_token: string;
  token_type: string;
}

export const byttToken = async (
  brukerToken: string,
  targetApplication: string,
  identityProvider: string
): Promise<string> => {
  const url = envVar('NAIS_TOKEN_EXCHANGE_ENDPOINT');

  const respons = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identity_provider: identityProvider,
      target: targetApplication,
      user_token: brukerToken,
    }),
  });

  if (!respons.ok) {
    throw new Error(`Token-utveksling feilet: ${respons.status}`);
  }

  const data: TokenResponse = await respons.json();
  return data.access_token;
};
