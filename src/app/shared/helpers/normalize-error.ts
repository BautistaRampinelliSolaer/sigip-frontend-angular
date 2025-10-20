export function normalizeError(e: unknown): string {
  return (e as { message?: string })?.message ?? 'Error inesperado';
}
