import { Static, Type } from '@sinclair/typebox';

export const AddDomainBodySchema = Type.Object({
  domain: Type.String()
});

export const CustomDomainIdParamsSchema = Type.Object({
  id: Type.String()
});

export const CustomDomainItemSchema = Type.Object({
  id: Type.String(),
  domain: Type.String(),
  verified: Type.Boolean(),
  createdAt: Type.String({ format: 'date-time' })
});

export const CustomDomainListResponseSchema = Type.Array(CustomDomainItemSchema);

export const CreateCustomDomainResponseSchema = Type.Object({
  id: Type.String(),
  domain: Type.String(),
  verified: Type.Boolean(),
  createdAt: Type.String({ format: 'date-time' })
});

export type AddDomainBody = Static<typeof AddDomainBodySchema>;
export type CustomDomainIdParams = Static<typeof CustomDomainIdParamsSchema>;
