"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/error-state";

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      title="Couldn't load this product"
      description="Something went wrong fetching this product. This is usually temporary."
      reset={reset}
    />
  );
}
