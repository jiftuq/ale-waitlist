export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, role } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Missing API key" });

  // Send confirmation email
  const emailRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "ALE <ale@chefs.video>",
      to: email,
      reply_to: "cizac2000@gmail.com",
      subject: "You're on the ALE waitlist",
      html: `<p>You're in. We'll notify you when early access opens.</p><p>You signed up as: <strong>${role}</strong></p><p>— ALE team</p>`,
    }),
  });

  const data = await emailRes.json();

  if (!emailRes.ok) {
    return res.status(emailRes.status).json({ error: data });
  }

  res.status(200).json({ ok: true, id: data.id });
}
