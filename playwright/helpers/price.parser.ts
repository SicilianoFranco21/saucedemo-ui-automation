export function parsePrice(text: string | null): number {
  if (!text) {
    throw new Error('Price text is null');
  }

  return Number(text.replace(/[^\d.]/g, ''));
}
