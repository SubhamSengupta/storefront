"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  /** When provided, renders a retry button wired to Next's error `reset`. */
  reset?: () => void;
}

/** Shared presentational error UI for route-level `error.tsx` boundaries. */
export function ErrorState({
  title = "Something went wrong",
  description = "Please try again in a moment.",
  reset,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <AlertTriangle className="text-destructive size-10" />
      <div>
        <p className="text-lg font-medium">{title}</p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      {reset && (
        <Button onClick={reset} variant="outline">
          Try again
        </Button>
      )}
    </div>
  );
}
