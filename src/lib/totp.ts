import { generateSecret, generateURI, verify } from "otplib";

const ISSUER = "Zeynep Çeltek Güzellik Admin";

export function createTotpSecret(): string {
  return generateSecret();
}

export function totpUri(email: string, secret: string): string {
  return generateURI({
    issuer: ISSUER,
    label: email,
    secret,
  });
}

export async function verifyTotpCode(
  secret: string,
  token: string
): Promise<boolean> {
  const result = await verify({ secret, token: token.replace(/\s/g, "") });
  return result.valid === true;
}
