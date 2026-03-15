import bcrypt from 'bcryptjs';
import { getDemoUserSeed } from '../../../config/seed-data';
import { getUserRepository } from '../repositories/userRepository';

export async function registerUser(email: string, password: string) {
  const userRepo = getUserRepository();
  const existing = await userRepo.findOne({ where: { email } });
  if (existing) {
    throw new Error('Email already in use');
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = userRepo.create({ email, password: hashed });
  return userRepo.save(user);
}

export async function validateUser(email: string, password: string) {
  const userRepo = getUserRepository();
  const user = await userRepo.findOne({ where: { email } });
  if (!user) return null;
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;
  return user;
}

export async function getOrCreateDemoUser() {
  const seed = getDemoUserSeed();
  if (!seed) {
    throw new Error(
      'Demo user seed is not configured. Set DEMO_USER_EMAIL and DEMO_USER_PASSWORD in .env (in production use a strong password).'
    );
  }

  const userRepo = getUserRepository();
  let user = await userRepo.findOne({ where: { email: seed.email } });
  if (user) return user;

  const hashed = await bcrypt.hash(seed.password, 10);
  user = userRepo.create({ email: seed.email, password: hashed });
  return userRepo.save(user);
}
