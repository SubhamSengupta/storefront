"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Returns to the previous page — e.g. the exact catalog page the user came
 * from — falling back to the catalog home when there's no in-app history to go
 * back to (direct link or a fresh tab).
 */
export function BackButton() {
  const router = useRouter();

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className="text-muted-foreground -ml-2"
    >
      <ArrowLeft className="size-4" /> Back
    </Button>
  );
}
