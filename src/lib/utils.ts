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

export function variableNameToLabel(str: string) {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}
