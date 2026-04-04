import createClient from 'openapi-fetch';
import createQueryClient from 'openapi-react-query';
import type { paths } from '../../openapi/types.js';

const client = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
});

client.use({
  onRequest({ request }) {
    const token = localStorage.getItem('idToken');
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }
    return request;
  },
});

export const $api = createQueryClient(client);

export function setTokens(accessToken: string, idToken: string, refreshToken: string) {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('idToken', idToken);
  localStorage.setItem('refreshToken', refreshToken);
}

export function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('idToken');
  localStorage.removeItem('refreshToken');
}

export default client;
