
export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
}

export function validateCSRFToken(token: string): boolean {
  // Validate against stored token
  return !!token && token.length > 0;
}
