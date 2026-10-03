import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  deleteMessage,
  endSession,
  isAuthed,
  listMessages,
  passwordMatches,
  startSession,
  type InboxMessage,
} from "@/lib/inbox";

export const metadata: Metadata = {
  title: "Inbox",
  robots: { index: false, follow: false },
};

async function login(formData: FormData) {
  "use server";
  if (passwordMatches(String(formData.get("password") ?? ""))) {
    await startSession();
    redirect("/inbox");
  }
  redirect("/inbox?error=1");
}

async function logout() {
  "use server";
  await endSession();
  redirect("/inbox");
}

async function remove(formData: FormData) {
  "use server";
  if (!(await isAuthed())) redirect("/inbox");
  await deleteMessage(String(formData.get("id") ?? ""));
  revalidatePath("/inbox");
}

const fmt = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Tehran",
});

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-5 py-16 md:py-24">
      <a href="/" className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)] hover:text-[var(--fg)]">
        ← Back to site
      </a>
      {children}
    </main>
  );
}

export default async function InboxPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  if (!process.env.INBOX_PASSWORD) {
    return (
      <Shell>
        <h1 className="mt-10 font-display text-4xl font-semibold tracking-[-0.04em]">Inbox not configured</h1>
        <p className="mt-4 text-[var(--muted)]">Set the INBOX_PASSWORD environment variable in Vercel to enable it.</p>
      </Shell>
    );
  }

  if (!(await isAuthed())) {
    return (
      <Shell>
        <h1 className="mt-10 font-display text-5xl font-semibold tracking-[-0.05em]">Inbox</h1>
        <p className="mt-3 text-[var(--muted)]">Private — enter your password to read project inquiries.</p>
        <form action={login} className="glass mt-10 max-w-md rounded-3xl p-7">
          <label className="field">
            <span>Password</span>
            <input name="password" type="password" required autoComplete="current-password" autoFocus />
          </label>
          {error && <p className="mt-4 text-sm text-rose-300">Wrong password — try again.</p>}
          <button type="submit" className="btn-primary mt-8">
            Unlock
          </button>
        </form>
      </Shell>
    );
  }

  let messages: InboxMessage[] = [];
  let loadError = false;
  try {
    messages = await listMessages();
  } catch (e) {
    console.error("inbox: failed to list messages", e);
    loadError = true;
  }

  return (
    <Shell>
      <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-5xl font-semibold tracking-[-0.05em]">Inbox</h1>
          <p className="mt-3 text-[var(--muted)]">
            {messages.length} {messages.length === 1 ? "inquiry" : "inquiries"} from your portfolio
          </p>
        </div>
        <form action={logout}>
          <button type="submit" className="btn-ghost">
            Log out
          </button>
        </form>
      </div>

      {loadError && <p className="mt-10 text-rose-300">Couldn&apos;t load messages. Refresh to try again.</p>}
      {!loadError && messages.length === 0 && (
        <p className="glass mt-10 rounded-3xl p-8 text-[var(--muted)]">No messages yet. New inquiries will appear here.</p>
      )}

      <ul className="mt-10 space-y-4">
        {messages.map((m) => (
          <li key={m.id} className="glass rounded-3xl p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="font-display text-2xl font-semibold tracking-[-0.03em]">{m.name}</div>
                <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: your ${m.type} project`)}`} className="text-[var(--cyan)] hover:underline">
                  {m.email}
                </a>
              </div>
              <time className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]" dateTime={m.createdAt}>
                {fmt.format(new Date(m.createdAt))}
              </time>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {m.spam && <span className="tag border-amber-300/50 text-amber-200">Possible spam</span>}
              <span className="tag">{m.type}</span>
              <span className="tag">{m.budget}</span>
            </div>
            <p className="mt-5 whitespace-pre-wrap leading-relaxed text-[var(--fg)]/90">{m.message}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: your ${m.type} project`)}`} className="btn-primary">
                Reply by email
              </a>
              <form action={remove}>
                <input type="hidden" name="id" value={m.id} />
                <button type="submit" className="btn-ghost">
                  Delete
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
