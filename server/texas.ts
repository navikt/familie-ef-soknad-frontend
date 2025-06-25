import axios from 'axios';
import { envVar } from './envVar';

interface SuksessResponse {
  access_token: string;
  token_type: string;
}

export class TexasClient {
  async exchangeToken(
    token: string,
    target: string,
    identityProvider: string
  ): Promise<SuksessResponse> {
    const exchangeTokenUrl = envVar('NAIS_TOKEN_EXCHANGE_ENDPOINT');

    const requestBody = {
      identity_provider: identityProvider,
      target: target,
      user_token: token,
    };

    const response = await axios.post<SuksessResponse>(exchangeTokenUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  }
}
