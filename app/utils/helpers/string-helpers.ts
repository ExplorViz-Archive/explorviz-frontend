export function encodeStringForPopUp(text: string): string {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function shortenString(text: string, desiredLength: number): string {
  let shortenedString = String(text).substr(0, desiredLength) + '...';
  return shortenedString;
}