import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';

// One-time (or rare) setup action: tells Discord what slash commands this
// bot has. Admin-gated the same way as /api/gift-codes/sync's manual
// trigger -- there's no ongoing schedule for this, an admin just calls it
// once after creating the bot, and again if a command's definition changes.
export async function POST() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, reason: 'unauthorized' }, { status: 401 });

  const applicationId = process.env.DISCORD_APPLICATION_ID;
  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!applicationId || !botToken) {
    return NextResponse.json({ success: false, reason: 'missing_discord_env' }, { status: 500 });
  }

  const res = await fetch(`https://discord.com/api/v10/applications/${applicationId}/commands`, {
    method: 'PUT',
    headers: { Authorization: `Bot ${botToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([
      {
        name: 'redeem',
        description: 'Redeem all active Kingshot gift codes for your governor (and auto-redeem future ones)',
        options: [
          { name: 'fid', description: 'Your Governor ID (Player ID)', type: 3, required: true },
          { name: 'kid', description: 'Your Kingdom ID', type: 3, required: true },
        ],
      },
    ]),
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    return NextResponse.json({ success: false, reason: 'discord_rejected', details: json }, { status: 502 });
  }
  return NextResponse.json({ success: true, commands: json });
}
