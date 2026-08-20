"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/error-state";

export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In a real app this would go to an error-reporting service.
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      title="Couldn't load products"
      description="The catalog failed to load. This is usually temporary."
      reset={reset}
    />
  );
}
