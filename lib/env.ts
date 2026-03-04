/**
 * Environment safety: fail in production if API base URL is missing
 */
export function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!url) {
    if (typeof window !== "undefined" && window.location?.hostname !== "localhost" && window.location?.hostname !== "127.0.0.1") {
      throw new Error("NEXT_PUBLIC_API_BASE_URL is required in production");
    }
    return "http://127.0.0.1:3000/api/v1";
  }
  return url;
}
