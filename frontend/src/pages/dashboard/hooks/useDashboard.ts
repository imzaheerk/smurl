import { useEffect, useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { FolderOption, UrlItem } from '../../../services/Dashboard/DashboardService';
import {
  getFolders,
  getMyUrls,
  createFolder,
  bulkImport,
  parseCSV
} from '../../../services/Dashboard/DashboardService';
import { getApiErrorMessage } from '../../../utils/apiError';
import { BULK_IMPORT_MAX_ROWS, DEFAULT_PAGE_SIZE, SEARCH_DEBOUNCE_MS } from '../../../constants';

export interface ImportResult {
  created: { id: string; shortUrl: string; originalUrl: string; shortCode: string }[];
  errors: { row: number; url?: string; message: string }[];
}

const dashboardKeys = {
  folders: ['dashboard', 'folders'] as const,
  /** Use for invalidateQueries to invalidate all URL list queries. */
  urlsBase: ['dashboard', 'urls'] as const,
  urls: (params: {
    page: number;
    limit: number;
    folderId?: string | null;
    search?: string;
    filterExpired: string;
    filterHasClicks: string;
  }) => ['dashboard', 'urls', params] as const
};

export function useDashboard() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(DEFAULT_PAGE_SIZE);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filterExpired, setFilterExpired] = useState<'all' | 'active' | 'expired'>('all');
  const [filterHasClicks, setFilterHasClicks] = useState<'all' | 'yes' | 'no'>('all');
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchInput), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [selectedFolderId, searchQuery, filterExpired, filterHasClicks]);

  const urlParams = {
    page,
    limit,
    folderId: selectedFolderId ?? undefined,
    search: searchQuery.trim() || undefined,
    filterExpired,
    filterHasClicks
  };

  const foldersQuery = useQuery({
    queryKey: dashboardKeys.folders,
    queryFn: getFolders
  });

  const urlsQuery = useQuery({
    queryKey: dashboardKeys.urls({
      page,
      limit,
      folderId: selectedFolderId,
      search: searchQuery.trim() || undefined,
      filterExpired,
      filterHasClicks
    }),
    placeholderData: keepPreviousData,
    queryFn: () => {
      const params: {
        page: number;
        limit: number;
        folderId?: string;
        search?: string;
        expired?: boolean;
        hasClicks?: boolean;
      } = { page, limit };
      if (selectedFolderId) params.folderId = selectedFolderId;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (filterExpired === 'active') params.expired = false;
      if (filterExpired === 'expired') params.expired = true;
      if (filterHasClicks === 'yes') params.hasClicks = true;
      if (filterHasClicks === 'no') params.hasClicks = false;
      return getMyUrls(params);
    }
  });

  const createFolderMutation = useMutation({
    mutationFn: (name: string) => createFolder(name),
    onSuccess: (_, name) => {
      toast.success(`Folder "${name}" created`);
      setNewFolderName('');
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.folders });
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err, 'Failed to create folder'));
    }
  });

  const bulkImportMutation = useMutation({
    mutationFn: (rows: { url: string; customAlias?: string; expiresAt?: string }[]) =>
      bulkImport(rows),
    onSuccess: (result) => {
      setImportResult(result);
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.urlsBase });
      toast.success(`Imported ${result.created.length} link(s). ${result.errors.length} error(s).`);
    },
    onError: (err: unknown) => {
      console.error(err);
      toast.error(getApiErrorMessage(err, 'Import failed'));
    }
  });

  const folders = foldersQuery.data ?? [];
  const data: UrlItem[] = urlsQuery.data?.items ?? [];
  const total = urlsQuery.data?.total ?? 0;
  const loading = urlsQuery.isLoading;
  const initialLoad = urlsQuery.isLoading && urlsQuery.isFetching;

  useEffect(() => {
    if (urlsQuery.isError) {
      toast.error('Failed to load your links. Please try again.');
    }
  }, [urlsQuery.isError]);

  const handleAddFolder = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newFolderName.trim();
    if (!name) return;
    createFolderMutation.mutate(name);
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setImportLoading(true);
    setImportResult(null);
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      if (rows.length === 0) {
        toast.error('No valid rows in CSV. Use format: long_url[, custom_slug[, expires_at]]');
        setImportLoading(false);
        return;
      }
      if (rows.length > BULK_IMPORT_MAX_ROWS) {
        toast.error(`Maximum ${BULK_IMPORT_MAX_ROWS} rows per import. Your file has ${rows.length}`);
        setImportLoading(false);
        return;
      }
      bulkImportMutation.mutate(rows);
    } finally {
      setImportLoading(false);
    }
  };

  const fetchUrls = () => queryClient.invalidateQueries({ queryKey: dashboardKeys.urlsBase });

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const totalClicks = data.reduce((sum, u) => sum + u.clickCount, 0);

  return {
    data,
    page,
    setPage,
    limit,
    total,
    loading,
    initialLoad,
    folders,
    selectedFolderId,
    setSelectedFolderId,
    newFolderName,
    setNewFolderName,
    addingFolder: createFolderMutation.isPending,
    searchInput,
    setSearchInput,
    filterExpired,
    setFilterExpired,
    filterHasClicks,
    setFilterHasClicks,
    importResult,
    setImportResult,
    importLoading,
    fileInputRef,
    fetchUrls,
    handleAddFolder,
    handleImportCSV,
    totalPages,
    totalClicks
  };
}
