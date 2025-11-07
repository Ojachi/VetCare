// Simple, consistent date-time formatting utilities for display purposes
// Formats as DD/MM/YYYY HH:mm (24h)

const pad = (n: number) => String(n).padStart(2, '0');

export function formatDisplayDateTime(input: string | Date | undefined | null): string {
  if (!input) return '';
  const d = typeof input === 'string' ? new Date(input) : input;
  if (isNaN(d.getTime())) return typeof input === 'string' ? input : '';
  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function formatDisplayDate(input: string | Date | undefined | null): string {
  if (!input) return '';
  const d = typeof input === 'string' ? new Date(input) : input;
  if (isNaN(d.getTime())) return typeof input === 'string' ? input : '';
  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
