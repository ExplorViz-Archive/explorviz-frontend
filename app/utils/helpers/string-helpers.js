export function encodeStringForPopUp(toBeEncodedString) {
    return String(toBeEncodedString).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
