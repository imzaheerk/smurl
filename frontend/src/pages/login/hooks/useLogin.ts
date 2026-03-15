import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login } from '../../../services/Auth/AuthService';
import { ROUTES } from '../../../constants/routes';
import { getApiErrorMessage } from '../../../utils/apiError';

export function useLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token } = await login(email, password);
      localStorage.setItem('token', token);
      toast.success('Login successful!');
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      console.error(err);
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    const demoEmail = 'demo@smurl.app';
    const demoPassword = 'demo1234';
    try {
      setEmail(demoEmail);
      setPassword(demoPassword);
      const { token } = await login(demoEmail, demoPassword);
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
    handleDemoLogin
  };
}
