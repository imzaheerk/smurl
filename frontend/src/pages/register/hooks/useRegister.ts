import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register as registerApi } from '../../../services/Auth/AuthService';
import { ROUTES } from '../../../constants/routes';
import { getApiErrorMessage } from '../../../utils/apiError';

export function useRegister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
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
    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await registerApi(trimmedEmail, password);
      toast.success('Account created! Sign in to get started.');
      navigate(ROUTES.LOGIN);
    } catch (err) {
      console.error(err);
      toast.error(getApiErrorMessage(err, 'Registration failed. Email may already be in use.'));
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleSubmit
  };
}
