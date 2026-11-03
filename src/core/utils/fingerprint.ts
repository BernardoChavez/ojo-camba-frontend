/**
 * Generates an anonymous device/session hash (SHA-256) in browser
 * to prevent automated spam floods without collecting personally identifiable data.
 */
export async function getAnonymousFingerprint(): Promise<string> {
  const stored = localStorage.getItem('rutavecinal_anon_uid');
  if (stored) {
    return stored;
  }

  const rawSeed = `${navigator.userAgent}-${navigator.language}-${screen.width}x${screen.height}-${Date.now()}-${Math.random()}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(rawSeed);

  try {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
    const citizenUid = `vecino-${hashHex}`;
    localStorage.setItem('rutavecinal_anon_uid', citizenUid);
    return citizenUid;
  } catch {
    const fallback = `vecino-${Math.random().toString(36).substring(2, 10)}`;
    localStorage.setItem('rutavecinal_anon_uid', fallback);
    return fallback;
  }
}
