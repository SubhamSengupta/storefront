import { SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t">
      <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm sm:flex-row">
        <p>
          {SITE_NAME} — a Next.js demo. Product data from{" "}
          <a
            href="https://dummyjson.com"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            DummyJSON
          </a>
          .
        </p>
        <p>Built for an architecture assessment.</p>
      </div>
    </footer>
  );
}
