"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rescueService } from "@/services/api/rescue";
import type { SuccessStoryResponse, SuccessStoryUserSubmit } from "@/lib/api";

export function useSubmitStory() {
  const queryClient = useQueryClient();

  return useMutation<SuccessStoryResponse, Error, SuccessStoryUserSubmit>({
    mutationFn: (payload: SuccessStoryUserSubmit) => rescueService.submitStory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["community", "stories", "me"],
      });
    },
  });
}
