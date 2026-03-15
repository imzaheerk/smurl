import { Static, Type } from '@sinclair/typebox';

// ----- Request/response schemas (API)

export const ShortenBodySchema = Type.Object({
  url: Type.String({ minLength: 1 }),
  customAlias: Type.Optional(Type.String()),
  expiresAt: Type.Optional(Type.String({ format: 'date-time' })),
  folderId: Type.Optional(Type.String())
});

export const PublicShortenBodySchema = Type.Object({
  url: Type.String(),
  customAlias: Type.Optional(Type.String()),
  expiresAt: Type.Optional(Type.String({ format: 'date-time' }))
});

const BulkRowItemSchema = Type.Object({
  url: Type.String(),
  customAlias: Type.Optional(Type.String()),
  expiresAt: Type.Optional(Type.String())
});

export const BulkBodySchema = Type.Object({
  rows: Type.Array(BulkRowItemSchema, { maxItems: 100 }),
  folderId: Type.Optional(Type.String())
});

export const MyUrlsQuerystringSchema = Type.Object({
  page: Type.Optional(Type.Number()),
  limit: Type.Optional(Type.Number()),
  folderId: Type.Optional(Type.String()),
  search: Type.Optional(Type.String()),
  from: Type.Optional(Type.String()),
  to: Type.Optional(Type.String()),
  expired: Type.Optional(Type.Boolean()),
  hasClicks: Type.Optional(Type.Boolean())
});

export const UrlIdParamsSchema = Type.Object({
  id: Type.String()
});

export const UrlPatchBodySchema = Type.Object({
  folderId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  activeFrom: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  activeTo: Type.Optional(Type.Union([Type.String(), Type.Null()]))
});

export const ShortenResponseSchema = Type.Object({
  shortUrl: Type.String(),
  id: Type.String()
});

export const BulkCreatedItemSchema = Type.Object({
  id: Type.String(),
  shortUrl: Type.String(),
  originalUrl: Type.String(),
  shortCode: Type.String()
});

export const BulkErrorItemSchema = Type.Object({
  row: Type.Number(),
  url: Type.Optional(Type.String()),
  message: Type.String()
});

export const BulkResponseSchema = Type.Object({
  created: Type.Array(BulkCreatedItemSchema),
  errors: Type.Array(BulkErrorItemSchema)
});

// ----- Usecase/internal schemas (for Static types)

export const ShortenUrlOptionsSchema = Type.Object({
  userId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  originalUrl: Type.String(),
  customAlias: Type.Optional(Type.String()),
  expiresAt: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  folderId: Type.Optional(Type.Union([Type.String(), Type.Null()]))
});

export const BulkRowSchema = Type.Object({
  url: Type.String(),
  customAlias: Type.Optional(Type.String()),
  expiresAt: Type.Optional(Type.String())
});

export const GetUserUrlsFiltersSchema = Type.Object({
  folderId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  search: Type.Optional(Type.String()),
  from: Type.Optional(Type.String()),
  to: Type.Optional(Type.String()),
  expired: Type.Optional(Type.Boolean()),
  hasClicks: Type.Optional(Type.Boolean())
});

export const ClickMetaSchema = Type.Object({
  ipAddress: Type.Optional(Type.String()),
  userAgent: Type.Optional(Type.String()),
  referrer: Type.Optional(Type.String()),
  country: Type.Optional(Type.String()),
  browser: Type.Optional(Type.String())
});

// ----- Exported types (Static)

export type ShortenBody = Static<typeof ShortenBodySchema>;
export type PublicShortenBody = Static<typeof PublicShortenBodySchema>;
export type BulkBody = Static<typeof BulkBodySchema>;
export type MyUrlsQuerystring = Static<typeof MyUrlsQuerystringSchema>;
export type UrlIdParams = Static<typeof UrlIdParamsSchema>;
export type UrlPatchBody = Static<typeof UrlPatchBodySchema>;
export type ShortenResponse = Static<typeof ShortenResponseSchema>;
export type BulkCreated = Static<typeof BulkCreatedItemSchema>;
export type BulkError = Static<typeof BulkErrorItemSchema>;
export type ShortenUrlOptions = Static<typeof ShortenUrlOptionsSchema>;
export type BulkRow = Static<typeof BulkRowSchema>;
export type GetUserUrlsFilters = Static<typeof GetUserUrlsFiltersSchema>;
export type ClickMeta = Static<typeof ClickMetaSchema>;
