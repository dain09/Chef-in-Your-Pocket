// This utility converts a base64 data URL into a Blob object URL.
// Browsers handle Blob URLs more efficiently and with fewer length restrictions than long data URLs,
// resolving rendering issues on mobile and some desktop browsers.

export const dataUrlToBlobUrl = (dataUrl: string): string => {
  // 1. Split metadata from data
  const arr = dataUrl.split(',');
  if (arr.length < 2) return dataUrl; // Not a valid data URL, return as is.
  
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) return dataUrl;
  const mime = mimeMatch[1];
  
  // 2. Decode base64 string
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  // 3. Convert decoded string to a byte array
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  // 4. Create a Blob and generate an object URL
  const blob = new Blob([u8arr], {type: mime});
  return URL.createObjectURL(blob);
};
