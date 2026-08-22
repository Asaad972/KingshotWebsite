const DISCORD_API = 'https://discord.com/api/v10';

/** Edits the "thinking..." placeholder left by a deferred interaction
 * response with the real result. Discord authenticates this via the
 * interaction token itself, not the bot token -- no Authorization header
 * needed here (only for registering commands, which is a separate call). */
export async function editOriginalInteractionResponse(
  applicationId: string,
  interactionToken: string,
  content: string
): Promise<void> {
  await fetch(`${DISCORD_API}/webhooks/${applicationId}/${interactionToken}/messages/@original`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
}
