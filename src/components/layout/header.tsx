import Link from "next/link";
import { Store } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";
import { CartSheet } from "@/components/cart/cart-sheet";

/**
 * Site header: brand, primary nav, and the cart drawer trigger (with count).
 * Server component; the interactive cart lives in the <CartSheet/> client island.
 */
export function Header() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight"
        >
          <Store className="size-5" />
          {SITE_NAME}
        </Link>
        <nav className="flex items-center gap-1" aria-label="Primary">
          <Link
            href="/"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Home
          </Link>
          <CartSheet />
        </nav>
      </div>
    </header>
  );
}
