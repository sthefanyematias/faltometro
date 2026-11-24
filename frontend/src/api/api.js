import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://retention-midi-firefox-plastics.trycloudflare.com',
});

export function guardarToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}
