/**
 * Utility to manage scroll locking on document.body.
 * Keeps track of how many active locks there are to avoid conflicts
 * when multiple overlays (like mobile menu and command palette) are open.
 */

export function lockScroll(): void {
  if (typeof document === "undefined") return;
  const body = document.body;
  const currentLocks = parseInt(body.dataset.scrollLocks || "0", 10);
  body.dataset.scrollLocks = (currentLocks + 1).toString();
  body.style.overflow = "hidden";
}

export function unlockScroll(): void {
  if (typeof document === "undefined") return;
  const body = document.body;
  const currentLocks = parseInt(body.dataset.scrollLocks || "0", 10);
  const newLocks = Math.max(0, currentLocks - 1);
  if (newLocks === 0) {
    body.style.overflow = "";
    delete body.dataset.scrollLocks;
  } else {
    body.dataset.scrollLocks = newLocks.toString();
  }
}
