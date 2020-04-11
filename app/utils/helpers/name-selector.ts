export default function processNameSelector(fallbackName: string, possibleName: string): string {
  if (possibleName && possibleName !== undefined && possibleName !== '') {
    return possibleName;
  }
  return fallbackName;
}
