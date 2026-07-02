// Edge Function: email a notification when a new contact message is inserted.
//
// Triggered by a Supabase Database Webhook on INSERT into public.messages
// (Dashboard → Database → Webhooks). Secrets come from the function ENV — the
// Resend API key is NEVER hardcoded or committed. Set them with:
//   supabase secrets set RESEND_API_KEY=... CONTACT_NOTIFY_TO=... \
//     CONTACT_NOTIFY_FROM=onboarding@resend.dev CONTACT_WEBHOOK_SECRET=...
//
// Deploy: supabase functions deploy notify-contact
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const NOTIFY_TO = Deno.env.get('CONTACT_NOTIFY_TO')
const NOTIFY_FROM = Deno.env.get('CONTACT_NOTIFY_FROM') ?? 'onboarding@resend.dev'
const WEBHOOK_SECRET = Deno.env.get('CONTACT_WEBHOOK_SECRET')

const escapeHtml = (s = '') =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  )

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  // Only the database webhook (which knows the shared secret) may trigger this.
  if (!WEBHOOK_SECRET || req.headers.get('x-webhook-secret') !== WEBHOOK_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!RESEND_API_KEY || !NOTIFY_TO) {
    return new Response('Server not configured', { status: 500 })
  }

  const payload = await req.json().catch(() => null)
  const row = payload?.record
  if (!row) {
    return new Response('No record in payload', { status: 400 })
  }

  const { name, email, message } = row

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: NOTIFY_FROM,
      to: NOTIFY_TO,
      reply_to: email, // reply goes straight to the sender
      subject: `New portfolio message from ${name}`,
      html: `
        <p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      `,
    }),
  })

  if (!res.ok) {
    console.error('Resend error', res.status, await res.text())
    return new Response('Email send failed', { status: 502 })
  }

  return new Response('OK', { status: 200 })
})
