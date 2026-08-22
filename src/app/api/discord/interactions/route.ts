import { NextResponse } from 'next/server';
import { waitUntil } from '@vercel/functions';
import { verifyDiscordRequest } from '@/lib/discord/verify';
import { editOriginalInteractionResponse } from '@/lib/discord/api';
import { runRedeemCommand } from '@/lib/discord/redeemCommand';
import { checkRateLimit } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const InteractionType = { PING: 1, APPLICATION_COMMAND: 2 };
const InteractionResponseType = { PONG: 1, CHANNEL_MESSAGE_WITH_SOURCE: 4, DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE: 5 };

interface CommandOption {
  name: string;
  value: string;
}

// Discord's single webhook endpoint for every slash command this bot has --
// verified via Ed25519 signature (see verifyDiscordRequest), not auth
// headers, since Discord itself calls this directly.
export async function POST(request: Request) {
  const rawBody = await request.text();
  const valid = await verifyDiscordRequest(request, rawBody);
  if (!valid) return new NextResponse('invalid request signature', { status: 401 });

  const interaction = JSON.parse(rawBody);

  if (interaction.type === InteractionType.PING) {
    return NextResponse.json({ type: InteractionResponseType.PONG });
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND && interaction.data?.name === 'redeem') {
    const discordUserId: string | undefined = interaction.member?.user?.id ?? interaction.user?.id;
    const { allowed } = await checkRateLimit(`discord_redeem:${discordUserId ?? 'unknown'}`, 3600, 5);
    if (!allowed) {
      return NextResponse.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: "You're doing that too often -- try again in a bit." },
      });
    }

    const options: CommandOption[] = interaction.data.options ?? [];
    const fid = String(options.find((o) => o.name === 'fid')?.value ?? '').trim();
    const kid = String(options.find((o) => o.name === 'kid')?.value ?? '').trim();
    const applicationId = interaction.application_id as string;
    const token = interaction.token as string;

    // Verifying + redeeming several codes (each paced ~1s apart) can easily
    // take longer than Discord's 3-second reply deadline, so acknowledge
    // immediately with a deferred response and fill in the real result once
    // it's ready. waitUntil keeps the serverless function alive long enough
    // to finish that background work even after this response is sent.
    waitUntil(
      runRedeemCommand(fid, kid)
        .then((content) => editOriginalInteractionResponse(applicationId, token, content))
        .catch(() => editOriginalInteractionResponse(applicationId, token, 'Something went wrong -- try again in a moment.'))
    );

    return NextResponse.json({ type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE });
  }

  return NextResponse.json({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: { content: 'Unknown command.' },
  });
}
