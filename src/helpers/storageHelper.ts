export interface StorageToken {
  payload: string | null;
  loanId?: string | null;
  expiresAt?: number | null; 
}

export function loadToken(storageKey: string): StorageToken | null {
  const data = localStorage.getItem(storageKey);
  if (!data) return null;

  try {
    const token: StorageToken = JSON.parse(data);
    if ((token?.expiresAt ?? 0) < Date.now()) {
      clearToken(storageKey); // token expired
      return null;
    }
    return token;
  } catch {
    clearToken(storageKey); // corrupted or malformed
    return null;
  }
}

export function clearToken(storageKey: string) {
  localStorage.removeItem(storageKey);
}

export function saveToken(storageKey: string, token: StorageToken) {
  localStorage.setItem(storageKey, JSON.stringify(token));
}