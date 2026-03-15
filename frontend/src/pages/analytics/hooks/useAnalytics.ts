import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AnalyticsResponse } from '../../../services/Analytics/AnalyticsService';
import {
  getAnalytics,
  updateUrlSchedule
} from '../../../services/Analytics/AnalyticsService';
import toast from 'react-hot-toast';

const analyticsQueryKey = (id: string) => ['analytics', id] as const;

export function useAnalytics(id: string | undefined) {
  const queryClient = useQueryClient();
  const [scheduleActiveFrom, setScheduleActiveFrom] = useState('');
  const [scheduleActiveTo, setScheduleActiveTo] = useState('');

  const {
    data,
    isLoading: loading,
    error: queryError,
    refetch
  } = useQuery({
    queryKey: id ? analyticsQueryKey(id) : ['analytics', 'disabled'],
    queryFn: () => getAnalytics(id!),
    enabled: !!id,
  });

  const scheduleMutation = useMutation({
    mutationFn: ({
      id: urlId,
      activeFrom,
      activeTo
    }: {
      id: string;
      activeFrom: string | null;
      activeTo: string | null;
    }) => updateUrlSchedule(urlId, activeFrom, activeTo),
    onSuccess: (_, { id: urlId, activeFrom, activeTo }) => {
      queryClient.setQueryData<AnalyticsResponse>(analyticsQueryKey(urlId), (prev) =>
        prev
          ? {
              ...prev,
              url: {
                ...prev.url,
                activeFrom: activeFrom ?? null,
                activeTo: activeTo ?? null
              }
            }
          : prev
      );
      toast.success('Schedule updated');
    },
    onError: (err: unknown) => {
      console.error(err);
      toast.error('Failed to update schedule');
    }
  });

  useEffect(() => {
    if (!data?.url) return;
    setScheduleActiveFrom(
      data.url.activeFrom ? new Date(data.url.activeFrom).toISOString().slice(0, 16) : ''
    );
    setScheduleActiveTo(
      data.url.activeTo ? new Date(data.url.activeTo).toISOString().slice(0, 16) : ''
    );
  }, [data?.url?.id, data?.url?.activeFrom, data?.url?.activeTo]);

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !data) return;
    scheduleMutation.mutate({
      id,
      activeFrom: scheduleActiveFrom.trim() || null,
      activeTo: scheduleActiveTo.trim() || null
    });
  };

  const error =
    queryError != null
      ? "Could not load analytics. The link may not exist or you don't have access."
      : null;

  return {
    data: data ?? null,
    loading,
    error,
    scheduleActiveFrom,
    scheduleActiveTo,
    setScheduleActiveFrom,
    setScheduleActiveTo,
    handleSaveSchedule,
    scheduleSaving: scheduleMutation.isPending,
    refetch
  };
}
