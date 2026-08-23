"use client";

import { useApiQuery, QUERY_KEYS } from "@/lib/api";
import { contactService, type ContactLocationResponse } from "@/services/api/contact";

export function useContactLocations(): {
  data: ContactLocationResponse[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
} {
  const { data, isLoading, isError, error, refetch } = useApiQuery({
    queryKey: QUERY_KEYS.contact.locations,
    queryFn: () => contactService.getContactLocations(),
  });

  return {
    data: data ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
}
