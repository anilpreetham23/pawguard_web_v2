"use client";

import { useApiQuery, QUERY_KEYS } from "@/lib/api";
import { contactService } from "@/services/api/contact";
import { veterinaryPartnerToDisplay } from "@/services/api/contact/mapper";
import type { VeterinaryPartner } from "@/types";

export function useVeterinaryPartners(): {
  data: VeterinaryPartner[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
} {
  const { data, isLoading, isError, error, refetch } = useApiQuery({
    queryKey: QUERY_KEYS.contact.veterinaryNetwork,
    queryFn: () => contactService.getVeterinaryPartners(),
    select: (partners) => partners.map(veterinaryPartnerToDisplay),
  });

  return {
    data: data ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
}