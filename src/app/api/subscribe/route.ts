import { NextResponse } from 'next/server'

/**
 * Newsletter endpoint. Validates the address and forwards it to
 * NEWSLETTER_WEBHOOK_URL if configured (Mailchimp, ConvertKit, a Zap …);
 * otherwise it just acknowledges so the template works out of the box.
 */
export async function POST(req: Request) {
  let email = ''
  const type = req.headers.get('content-type') || ''
  if (type.includes('application/json')) {
    email = String((await req.json().catch(() => ({})))?.email ?? '')
  } else {
    const form = await req.formData().catch(() => null)
    email = String(form?.get('email') ?? '')
  }
  email = email.trim()
  if (!/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 })
  }
  const webhook = process.env.NEWSLETTER_WEBHOOK_URL
  if (webhook) {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source: 'dog-ear-template', at: new Date().toISOString() }),
    }).catch(() => null)
    if (!res || !res.ok) return NextResponse.json({ ok: false, error: 'Subscription service unavailable.' }, { status: 502 })
  }
  const wantsJson = (req.headers.get('accept') || '').includes('application/json')
  if (!wantsJson) return NextResponse.redirect(new URL('/?subscribed=1#footer', req.url), 303)
  return NextResponse.json({ ok: true })
}
