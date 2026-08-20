import Link from "next/link";
import { PackageX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

/** Rendered when getProduct() returns null (invalid/removed id → HTTP 404). */
export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <PackageX className="text-muted-foreground size-12" />
      <div>
        <p className="text-lg font-medium">Product not found</p>
        <p className="text-muted-foreground text-sm">
          We couldn&apos;t find that product. It may have been removed.
        </p>
      </div>
      <Link href="/" className={buttonVariants({ variant: "default" })}>
        Back to catalog
      </Link>
    </div>
  );
}
