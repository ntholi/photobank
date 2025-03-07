export function toDateTime(value: Date) {
  if (!value) return '';
  const date = new Date(value);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();

  const day = `${dd}/${mm}/${yyyy}`;
  return `${day} ${date.toLocaleTimeString()}`;
}

export function shorten(str: string | null | undefined, length: number = 52) {
  if (!str) return '';
  return str.length > length ? str.slice(0, length) + '...' : str;
}

export function stripHtml(str: string | null | undefined) {
  if (!str) return '';
  return str.replace(/<[^>]*>?/gm, '');
}

export function variableNameToLabel(str: string) {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Sanitizes an object by replacing null values with empty strings for string fields.
 * @param values The object to sanitize.
 * @returns The sanitized object.
 */
export function sanitize<T extends {}>(values: T | undefined) {
  if (!values) return undefined;
  const result = values
    ? Object.fromEntries(
        Object.entries(values).map(([key, value]) => {
          if (value === null) {
            const isStringField =
              typeof (values as any)[key] === 'string' ||
              (values as any)[key] === null;
            if (isStringField) {
              return [key, ''];
            }
          }
          return [key, value];
        }),
      )
    : undefined;

  return result as T;
}
