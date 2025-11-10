export function ensureDataUri(src?: string | null, mime: string = 'image/jpeg'): string | undefined {
  if (!src) return undefined;
  if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://') || src.startsWith('file://')) {
    return src;
  }
  // assume base64 raw
  return `data:${mime};base64,${src}`;
}
