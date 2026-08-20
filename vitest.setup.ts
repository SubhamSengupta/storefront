// Extends Vitest's `expect` with jest-dom matchers (toBeInTheDocument, etc.)
// and augments the matcher types project-wide.
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Unmount and clean up the DOM between tests. Registered explicitly because the
// Vitest config runs without globals, so RTL's auto-cleanup isn't wired up.
afterEach(() => cleanup());
