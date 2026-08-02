import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { giftName, arabicName, xpCost, userId } = await request.json();

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.NOTIFY_EMAIL;

    if (!apiKey || !toEmail) {
      // Silently skip if not configured — app still works
      return NextResponse.json({ ok: true, skipped: true });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'i-Teach <onboarding@resend.dev>',
        to: toEmail,
        subject: `🎁 New Gift Redemption — ${giftName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
            <h2>🎁 New Gift Redemption</h2>
            <table style="border-collapse: collapse; width: 100%;">
              <tr>
                <td style="padding: 8px; color: #555;">Gift</td>
                <td style="padding: 8px; font-weight: bold;">${giftName} (${arabicName})</td>
              </tr>
              <tr style="background: #f9f9f9;">
                <td style="padding: 8px; color: #555;">XP Cost</td>
                <td style="padding: 8px; font-weight: bold;">⚡ ${xpCost} XP</td>
              </tr>
              <tr>
                <td style="padding: 8px; color: #555;">User ID</td>
                <td style="padding: 8px; font-family: monospace; font-size: 12px;">${userId ?? 'guest'}</td>
              </tr>
              <tr style="background: #f9f9f9;">
                <td style="padding: 8px; color: #555;">Status</td>
                <td style="padding: 8px; color: #e67e22; font-weight: bold;">Pending delivery</td>
              </tr>
            </table>
            <p style="color: #888; font-size: 12px; margin-top: 24px;">
              Check your Supabase <strong>redemptions</strong> table for the full list.
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend error:', err);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('notify-redemption error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
