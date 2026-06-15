export function getApiError(error: unknown) {
  const e = error as any;

  return (
    e?.error?.detail ?? e?.body?.detail ?? e?.message ?? "Something went wrong"
  );
}
