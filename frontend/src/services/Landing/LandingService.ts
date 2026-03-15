import api from '../api';

export interface ShortenResponse {
  shortUrl: string;
  id: string;
}

export async function shortenPublicUrl(url: string): Promise<ShortenResponse> {
  const res = await api.post<ShortenResponse>('/public/shorten', { url });
  return res.data;
}
