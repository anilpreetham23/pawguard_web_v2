"use client";

import { useEffect, useRef } from "react";
import { Alert, Button } from "@/components/ui/pawguard";
import { MatchesPanel } from "@/features/lost-found/MatchesPanel";
import { useApiMutation, useApiErrorMessage } from "@/lib/api/hooks";
import { lostFoundService } from "@/services/api/lost-found";
import { useAuth } from "@/app/providers/auth-provider";
import type { LostFoundCase } from "@/types";

export function BroadcastPanelIsland({ caseItem }: { caseItem: LostFoundCase }) {
  const broadcast = useApiMutation({
    mutationFn: () => lostFoundService.broadcastLostPetAlert(caseItem.id),
  });
  const { user, isAuthenticated, openAuthDialog } = useAuth();
  const isRateLimited = broadcast.error?.status === 429;
  const hasBroadcastedRef = useRef(false);

  useEffect(() => {
    if (!broadcast.isPending) {
      hasBroadcastedRef.current = false;
    }
  }, [broadcast.isPending]);

  useEffect(() => {
    if (broadcast.isError && broadcast.error?.isUnauthorized && isAuthenticated) {
      broadcast.mutate();
    }
  }, [isAuthenticated, broadcast.isError]);

  const errorText = useApiErrorMessage(isRateLimited ? null : broadcast.error);

  const isOwner = Boolean(
    isAuthenticated && user?.id && caseItem.userId && user.id === caseItem.userId
  );

  if (caseItem.kind !== "lost" || !isOwner) return null;

  const isDisabled = broadcast.isPending || broadcast.isSuccess || isRateLimited;

  const handleBroadcast = () => {
    if (hasBroadcastedRef.current) return;
    if (broadcast.isPending || broadcast.isSuccess || isRateLimited) return;
    hasBroadcastedRef.current = true;
    broadcast.mutate();
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-card border border-border rounded-card p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8">
        <div className="flex-1 flex flex-col gap-1.5">
          <h2 className="text-foreground font-bold text-lg">Broadcast a missing-dog alert</h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-[520px]">
            Push this lost report to nearby PawGuard members for faster sightings. Sign-in is required.
          </p>
        </div>
        <Button
          variant="destructive"
          size="md"
          isLoading={broadcast.isPending}
          context="broadcast"
          disabled={isDisabled}
          onClick={handleBroadcast}
          className="shrink-0"
        >
          {broadcast.isSuccess ? "Alert Broadcast" : "Broadcast Alert"}
        </Button>
      </div>
      {broadcast.isSuccess && (
        <Alert variant="success" title="Alert sent">
          Neighbours in the report area have been notified about {caseItem.petName}.
        </Alert>
      )}
      {isRateLimited && (
        <Alert variant="info" title="Alert already sent">
          You recently broadcast this missing-pet alert. Please wait before sending another alert.
        </Alert>
      )}
      {broadcast.isError && !isRateLimited && (
        <Alert variant="error" title={broadcast.error?.isUnauthorized ? "Sign in required" : "Couldn't broadcast the alert"}>
          {broadcast.error?.isUnauthorized ? (
            <>
              Broadcasting requires a PawGuard account.{" "}
              <button
                onClick={() => openAuthDialog("sign-in")}
                className="font-semibold text-destructive underline underline-offset-2 hover:opacity-80 transition-opacity"
              >
                Sign in now
              </button>{" "}
              and we&apos;ll retry automatically.
            </>
          ) : (
            errorText
          )}
        </Alert>
      )}
    </div>
  );
}

export function MatchesPanelIsland({
  reportId,
  kind,
  petName,
}: {
  reportId: string;
  kind: "lost" | "found";
  petName: string;
}) {
  return (
    <div className="border-t border-border">
      <MatchesPanel reportId={reportId} kind={kind} petName={petName} />
    </div>
  );
}
