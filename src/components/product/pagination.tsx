import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { pageHref, getPageRange } from "@/lib/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

/**
 * URL-driven pagination. Every control is a real `<Link>` to a static/ISR page
 * (`/` or `/products/page/N`), so pages are shareable, crawlable, and the
 * browser back button works — no client-side state involved.
 */
export function Pagination({ currentPage, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageRange(currentPage, totalPages);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav
      aria-label="Catalog pagination"
      className="flex items-center justify-center gap-1"
    >
      <PageLink
        href={pageHref(currentPage - 1)}
        disabled={!hasPrev}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </PageLink>

      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="text-muted-foreground px-2"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <PageLink
            key={page}
            href={pageHref(page)}
            active={page === currentPage}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </PageLink>
        ),
      )}

      <PageLink
        href={pageHref(currentPage + 1)}
        disabled={!hasNext}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </PageLink>
    </nav>
  );
}

interface PageLinkProps {
  href: string;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  "aria-label"?: string;
  "aria-current"?: "page";
}

function PageLink({
  href,
  active = false,
  disabled = false,
  children,
  ...aria
}: PageLinkProps) {
  const className = cn(
    buttonVariants({
      variant: active ? "default" : "outline",
      size: "icon",
    }),
    "size-9",
  );

  if (disabled) {
    return (
      <span
        className={cn(className, "pointer-events-none opacity-50")}
        aria-disabled="true"
        {...aria}
      >
        {children}
      </span>
    );
  }

  return (
    <Link href={href} className={className} {...aria}>
      {children}
    </Link>
  );
}
