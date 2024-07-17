import { cookieName } from "@functions/authorize/config";

export default function parseTokenFromCookie(cookies: string[]): string {
  const cookiePrefix = `${cookieName}=`;
  return (
    cookies
      .filter((cookie) => cookie.includes(cookiePrefix))
      .flatMap((cookie) => cookie.split(/;\s*/g))
      .filter((part) => part.startsWith(cookiePrefix))[0]
      ?.substring(cookiePrefix.length) ?? ""
  );
}
