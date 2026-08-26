/**
 * Waitlist intake. Runs as a Vercel serverless function so RESEND_API_KEY
 * stays server-side — anything in the React bundle is public.
 *
 * Contacts in Resend are global (keyed by email), so no audience or segment
 * id is needed. Set RESEND_API_KEY in the Vercel project's env vars; the key
 * needs Full access, since "sending access" covers only sending email.
 */

const RESEND_CONTACTS = 'https://api.resend.com/contacts';

// Deliberately loose. This catches obvious typos without trying to out-guess
// the RFC; Resend does the authoritative validation on its side.
const looksLikeEmail = (v) =>
  typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const GENERIC_FAILURE = "We couldn't save that just now. Try again in a moment.";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('waitlist: RESEND_API_KEY is not set');
    return res.status(500).json({ error: GENERIC_FAILURE });
  }

  const { email, brand } = req.body ?? {};

  if (!looksLikeEmail(email)) {
    return res.status(400).json({ error: "That doesn't look like an email address." });
  }

  const contact = { email: email.trim().toLowerCase(), unsubscribed: false };

  // Only the hero form asks for a brand, and its placeholder option is not a
  // real answer.
  if (typeof brand === 'string' && brand.trim() && brand !== 'Your main brand') {
    contact.properties = { brand: brand.trim() };
  }

  const createContact = (body) =>
    fetch(RESEND_CONTACTS, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

  try {
    let response = await createContact(contact);

    // Resend rejects the whole request if a custom property is not already
    // defined on the account. Brand is a nice-to-have; the email address is
    // the point. Drop the property and retry rather than lose the signup.
    if (!response.ok && contact.properties) {
      console.error(
        `waitlist: create with properties failed (${response.status}), retrying without`,
        await response.text(),
      );
      const { properties, ...withoutProperties } = contact;
      response = await createContact(withoutProperties);
    }

    if (response.ok) {
      return res.status(200).json({ ok: true });
    }

    const detail = await response.text();

    // Signing up twice is not an error worth showing anyone.
    if (response.status === 409 || /already exists|duplicate/i.test(detail)) {
      return res.status(200).json({ ok: true });
    }

    // Logged server-side only — the upstream body can echo request detail that
    // shouldn't go back to the browser. Read it in the Vercel function logs.
    console.error(`waitlist: resend responded ${response.status}`, detail);
    return res.status(502).json({ error: GENERIC_FAILURE });
  } catch (err) {
    console.error('waitlist: request to resend failed', err);
    return res.status(502).json({ error: GENERIC_FAILURE });
  }
}
