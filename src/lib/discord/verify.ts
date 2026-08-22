import { verifyKey } from 'discord-interactions';

/** Confirms a request actually came from Discord (Ed25519 signature over the
 * raw body + timestamp, checked against our app's public key) -- without
 * this, anyone could POST fake interactions straight at our endpoint. */
export async function verifyDiscordRequest(request: Request, rawBody: string): Promise<boolean> {
  const signature = request.headers.get('x-signature-ed25519');
  const timestamp = request.headers.get('x-signature-timestamp');
  const publicKey = process.env.DISCORD_PUBLIC_KEY;
  if (!signature || !timestamp || !publicKey) return false;
  return verifyKey(rawBody, signature, timestamp, publicKey);
}
