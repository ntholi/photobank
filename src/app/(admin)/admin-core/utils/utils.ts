export function variableToLabel(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

export function slugify(title: string) {
  return encodeURIComponent(title.toLowerCase().replace(/\s/g, '-'));
}
