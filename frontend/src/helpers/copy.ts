export function copyValue(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
