import api from '../api';

export interface LoginResult {
  token: string;
}

export async function login(email: string, password: string): Promise<LoginResult> {
  const res = await api.post<{ token: string }>('/auth/login', { email, password });
  return { token: res.data.token };
}

export async function register(email: string, password: string): Promise<void> {
  await api.post('/auth/register', { email, password });
}
