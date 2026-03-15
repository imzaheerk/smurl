import { Static, Type } from '@sinclair/typebox';

export const CreateApiKeyBodySchema = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 100 })
});

export const ApiKeyIdParamsSchema = Type.Object({
  id: Type.String()
});

export const CreateApiKeyResponseSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  key: Type.String(),
  keyPrefix: Type.String(),
  createdAt: Type.String({ format: 'date-time' })
});

export const ApiKeyListItemSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  keyPrefix: Type.String(),
  createdAt: Type.String({ format: 'date-time' })
});

export const ApiKeyListResponseSchema = Type.Array(ApiKeyListItemSchema);

export type CreateApiKeyBody = Static<typeof CreateApiKeyBodySchema>;
export type ApiKeyIdParams = Static<typeof ApiKeyIdParamsSchema>;
export type CreateApiKeyResult = Omit<Static<typeof CreateApiKeyResponseSchema>, 'createdAt'> & {
  createdAt: Date;
};
export type ApiKeyListItem = Static<typeof ApiKeyListItemSchema>;
