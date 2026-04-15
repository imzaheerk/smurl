import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login } from '../../../services/Auth/AuthService';
import { ROUTES } from '../../../constants/routes';
import { getApiErrorMessage } from '../../../utils/apiError';
import { startGuestSession } from '../../../utils/demoMode';

/** Demo login only when both are set in env (.env is gitignored). */
const demoEmail = import.meta.env.VITE_DEMO_EMAIL?.trim();
const demoPassword = import.meta.env.VITE_DEMO_PASSWORD;
export const isDemoLoginEnabled = Boolean(demoEmail && demoPassword);

export function useLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast.error('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!password) {
      toast.error('Please enter your password.');
      return;
    }
    setLoading(true);
    try {
      const { token } = await login(trimmedEmail, password);
      localStorage.setItem('token', token);
      toast.success('You’re signed in.');
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      console.error(err);
      toast.error(getApiErrorMessage(err, 'Sign-in failed. Check your email and password.'));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    if (!isDemoLoginEnabled) {
      toast.error('Demo login is not configured (set VITE_DEMO_EMAIL and VITE_DEMO_PASSWORD in .env)');
      return;
    }
    setDemoLoading(true);
    try {
      setEmail(demoEmail!);
      setPassword(demoPassword!);
      const { token } = await login(demoEmail!, demoPassword!);
      localStorage.setItem('token', token);
      toast.success('Signed in as demo user');
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      console.error(err);
      toast.error(getApiErrorMessage(err, 'Demo login failed'));
    } finally {
      setDemoLoading(false);
    }
  };

  const handleGuestLogin = () => {
    startGuestSession();
    toast.success('Guest mode enabled with demo data');
    navigate(ROUTES.DASHBOARD);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loading,
    demoLoading,
    handleSubmit,
    handleDemoLogin,
    handleGuestLogin,
    isDemoLoginEnabled
  };
}
