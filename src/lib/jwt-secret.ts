export function getJwtSecretBytes(): Uint8Array {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "JWT_SECRET missing in production — using ephemeral fallback (set JWT_SECRET!)"
      );
      return new TextEncoder().encode(
        "prod-fallback-change-me-immediately-32ch"
      );
    }
    return new TextEncoder().encode(
      "zeynep-celtek-guzellik-dev-only-not-for-production"
    );
  }
  if (process.env.NODE_ENV === "production" && secret.length < 32) {
    console.error("JWT_SECRET too short in production (need >= 32)");
  }
  return new TextEncoder().encode(secret);
}
