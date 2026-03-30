import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { TOKEN_KEY } from '../utils/demoMode';

export function useAuth(requireAuth: boolean) {
  const [token, setToken] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null
  );
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    setToken(stored);
    if (requireAuth && !stored) {
      navigate(ROUTES.LOGIN);
    }
  }, [requireAuth, navigate]);

  // Sync token across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === TOKEN_KEY) {
        setToken(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    navigate(ROUTES.LOGIN);
  }, [navigate]);

  return { token, logout };
}
