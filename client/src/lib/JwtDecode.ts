/**
 * Decode JWT token and return its payload as an object.
 * @param token JWT string
 */
export function decodeJwtPayload<T = any>(token: string): T | null {
  if (!token) return null;
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    // Handle unicode
    const jsonPayload = decodeURIComponent(
      decoded
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload) as T;
  } catch {
    return null;
  }
}

/**
 * Get cookie value by name.
 * @param name Cookie name
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Get the 'role' from access_token cookie.
 */
export function getRoleFromAccessTokenCookie(): string | null {
  const token = getCookie("access_token");
  const payload = decodeJwtPayload<{ role?: string }>(token || "");
  return payload?.role ?? null;
}

/**
 * Get the 'name' from access_token cookie.
 */
export function getNameFromAccessTokenCookie(): string | null {
  const token = getCookie("access_token");
  const payload = decodeJwtPayload<{ username?: string }>(token || "");
  return payload?.username ?? null;
}

/**
 * Get the university name from access_token cookie.
 */
export function getUniversityFromAccessTokenCookie(): string | null {
  const token = getCookie("access_token");
  const payload = decodeJwtPayload<{ university_name?: string }>(token || "");
  return payload?.university_name ?? null;
}
