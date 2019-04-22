export function encodeStringForPopUp(toBeEncodedString) {
    return String(toBeEncodedString).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function shortenString(toBeShortenedString, desiredLength){
  let shortenedString = String(toBeShortenedString).substr(0,desiredLength) + '...';
return shortenedString;
}
