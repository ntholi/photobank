export function toDateTime(value: Date) {
    if (!value) return '';
    const date = new Date(value);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();

    const day = `${dd}/${mm}/${yyyy}`;
    return `${day} ${date.toLocaleTimeString()}`;
}
