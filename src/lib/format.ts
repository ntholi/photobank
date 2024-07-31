export function formatDate(date: Date | undefined | null) {
  if (!date) return '';
  const formatter = new Intl.DateTimeFormat('en-LS', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  try {
    return formatter.format(date);
  } catch (e) {
    console.error('Error formatting date', date);
    return 'Invalid Date';
  }
}
export function dateTime(date: Date | string | undefined | null) {
  if (!date) return '';
  const formatter = new Intl.DateTimeFormat('en-LS', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
  try {
    return formatter.format(new Date(date));
  } catch (e) {
    console.error('Error formatting date', date);
    return 'Invalid Date';
  }
}

// Converts to title case even if it was in upper case latters, and also converts snake_case to Title Case
export function titleCase(str: string) {
  return str
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function asPastTense(str: string) {
  return str.endsWith('e') ? str + 'd' : str + 'ed';
}
