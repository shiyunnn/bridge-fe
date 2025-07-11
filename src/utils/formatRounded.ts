export function formatRounded(value: string): string {
    const number = parseFloat(value);
    return Math.ceil(number).toString();
  }