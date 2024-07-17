import { createSigner, createVerifier } from "fast-jwt";

export const cookieName = "login";

const secretKey = process.env.JWT_SECRET_KEY!;

export const loginCookieExpiresIn = 7 * 24 * 60 * 60 * 1000;
export const signToken = createSigner({
  key: secretKey,
  expiresIn: loginCookieExpiresIn,
});
export const verifyToken = createVerifier({ key: secretKey });
