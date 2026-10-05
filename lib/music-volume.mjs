// Animation frame timestamps can precede the moment a fade was requested.
export function fadeVolume(elapsedMs) {
  return 0.3 * Math.max(0, Math.min(1, elapsedMs / 1200));
}
