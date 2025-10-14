export function generateId(): string {
  const timestamp = Date.now().toString(36);
  let randomPart = '';

  // Use crypto API if available for better randomness
  if (window.crypto && window.crypto.getRandomValues) {
    const buffer = new Uint8Array(8);
    window.crypto.getRandomValues(buffer);
    randomPart = Array.from(buffer)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  } else {
    // Fallback to Math.random if crypto API is not available
    randomPart =
      Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
  }

  // Add some browser fingerprinting data
  const browserData = (
    navigator.userAgent +
    navigator.language +
    screen.width +
    screen.height +
    new Date().getTimezoneOffset()
  )
    .split('')
    .reduce((a, b) => {
      return ((a << 5) - a + b.charCodeAt(0)) | 0;
    }, 0)
    .toString(36);

  // Combine all parts
  return `${timestamp}-${randomPart}-${browserData}`;
}
