import { budgets, profile, projectTypes } from "@/lib/content";
import { saveMessage } from "@/lib/inbox";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: a hidden checkbox real visitors never tick. Suspected spam is still saved
  // (flagged) so a real inquiry can never be silently lost.
  const spam = body.botcheck === true || Boolean(clean(body.website, 200));

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const message = clean(body.message, 5000);
  const type = projectTypes.includes(String(body.type)) ? String(body.type) : "Other";
  const budget = budgets.includes(String(body.budget)) ? String(body.budget) : "Not sure yet";

  if (!name || !EMAIL_RE.test(email) || message.length < 5) {
    return Response.json({ ok: false, error: "Please fill in your name, a valid email and a message." }, { status: 422 });
  }

  try {
    await saveMessage({ name, email, type, budget, message, spam });
  } catch (err) {
    console.error("contact: failed to store message", err);
    return Response.json({ ok: false, error: "Couldn't send right now." }, { status: 500 });
  }

  // Best-effort email notification (FormSubmit). The message is already saved in the inbox.
  if (!spam) {
    try {
      const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://abolfazlabbaspour.vercel.app";
      await fetch(`https://formsubmit.co/ajax/${profile.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json", Origin: origin, Referer: `${origin}/` },
        body: JSON.stringify({
          _subject: `New project inquiry — ${type} — ${name}`,
          _replyto: email,
          _template: "table",
          _captcha: "false",
          Name: name,
          Email: email,
          "Project type": type,
          Budget: budget,
          Message: message,
        }),
        signal: AbortSignal.timeout(6000),
      });
    } catch (err) {
      console.error("contact: email notification failed", err);
    }
  }

  return Response.json({ ok: true });
}
