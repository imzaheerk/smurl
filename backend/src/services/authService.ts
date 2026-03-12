import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';

const userRepo = () => AppDataSource.getRepository(User);

export const registerUser = async (email: string, password: string) => {
  const existing = await userRepo().findOne({ where: { email } });
  if (existing) {
    throw new Error('Email already in use');
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = userRepo().create({ email, password: hashed });
  return userRepo().save(user);
};

export const validateUser = async (email: string, password: string) => {
  const user = await userRepo().findOne({ where: { email } });
  if (!user) return null;
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;
  return user;
};

