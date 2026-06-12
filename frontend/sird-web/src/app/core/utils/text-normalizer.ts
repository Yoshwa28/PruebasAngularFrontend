export type SearchableValue = string | number | null | undefined;

export function normalizeText(value: SearchableValue): string {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function normalizeCompact(value: SearchableValue): string {
  return normalizeText(value).replace(/[^a-z0-9]/g, '');
}

export function includesNormalized(
  source: SearchableValue,
  query: SearchableValue,
): boolean {
  const normalizedSource = normalizeText(source);
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return true;
  }

  return normalizedSource.includes(normalizedQuery);
}

export function includesFlexible(
  source: SearchableValue,
  query: SearchableValue,
): boolean {
  const normalizedSource = normalizeText(source);
  const normalizedQuery = normalizeText(query);

  const compactSource = normalizeCompact(source);
  const compactQuery = normalizeCompact(query);

  if (!normalizedQuery && !compactQuery) {
    return true;
  }

  return (
    normalizedSource.includes(normalizedQuery) ||
    compactSource.includes(compactQuery)
  );
}

export function includesAnyNormalized(
  sources: SearchableValue[],
  query: SearchableValue,
): boolean {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return true;
  }

  return sources.some((source) => includesNormalized(source, normalizedQuery));
}

export function includesAnyFlexible(
  sources: SearchableValue[],
  query: SearchableValue,
): boolean {
  const normalizedQuery = normalizeText(query);
  const compactQuery = normalizeCompact(query);

  if (!normalizedQuery && !compactQuery) {
    return true;
  }

  return sources.some((source) => includesFlexible(source, query));
}
