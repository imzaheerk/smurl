import { Static, Type } from '@sinclair/typebox';

export const CreateFolderBodySchema = Type.Object({
  name: Type.String()
});

export const FolderIdParamsSchema = Type.Object({
  id: Type.String()
});

export const FolderWithStatsSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  linkCount: Type.Number(),
  totalClicks: Type.Number()
});

export const FolderListResponseSchema = Type.Array(FolderWithStatsSchema);

export const CreateFolderResponseSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  createdAt: Type.String({ format: 'date-time' })
});

export type CreateFolderBody = Static<typeof CreateFolderBodySchema>;
export type FolderIdParams = Static<typeof FolderIdParamsSchema>;
export type FolderWithStats = Omit<Static<typeof FolderWithStatsSchema>, 'createdAt'> & {
  createdAt: Date;
};
