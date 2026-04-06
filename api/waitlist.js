export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, role } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  // Add to audience
  await fetch("https://api.resend.com/audiences/YOUR_AUDIENCE_ID/contacts", {
    method: "POST",
    headers: {
      Authorization: "Bearer YOUR_RESEND_API_KEY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      first_name: role || "unknown",
      unsubscribed: false,
    }),
  });

  // Send confirmation
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: "Bearer YOUR_RESEND_API_KEY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "ALE <onboarding@resend.dev>",
      reply_to: "cizac2000@gmail.com",
      subject: "You're on the ALE waitlist",
      html: `<p>You're in. We'll notify you when early access opens.</p><p>You signed up as: <strong>${role}</strong></p><p>— ALE team</p>`,
    }),
  });

  res.status(200).json({ ok: true });
}
