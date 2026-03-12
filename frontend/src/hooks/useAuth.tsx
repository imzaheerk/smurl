import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = (requireAuth: boolean) => {
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('token');
    setToken(stored);
    if (requireAuth && !stored) {
      navigate('/login');
    }
  }, [requireAuth, navigate]);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return { token, logout };
};

