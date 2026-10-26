/** Wraps any integer index into 0..n-1 so the photo deck loops both ways. */
export function wrapIndex(i: number, n: number) {
  return ((i % n) + n) % n;
}
