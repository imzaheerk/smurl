import { Static, Type } from '@sinclair/typebox';

export const RegisterBodySchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 })
});

export const LoginBodySchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 })
});

export const AuthUserResponseSchema = Type.Object({
  id: Type.String(),
  email: Type.String(),
  createdAt: Type.Optional(Type.String({ format: 'date-time' }))
});

export const TokenResponseSchema = Type.Object({
  token: Type.String()
});

export const DemoResponseSchema = Type.Object({
  token: Type.String(),
  email: Type.String()
});

export type RegisterBody = Static<typeof RegisterBodySchema>;
export type LoginBody = Static<typeof LoginBodySchema>;
