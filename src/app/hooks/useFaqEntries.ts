"use client";

import { useApiQuery, QUERY_KEYS } from "@/lib/api";
import { contactService, type FAQEntryResponse } from "@/services/api/contact";

export function useFaqEntries(): {
  data: FAQEntryResponse[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
} {
  const { data, isLoading, isError, error, refetch } = useApiQuery({
    queryKey: QUERY_KEYS.contact.faq,
    queryFn: () => contactService.getFaqEntries(),
  });

  return {
    data: data ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
}
