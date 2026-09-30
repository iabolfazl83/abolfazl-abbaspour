import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { del, get, list, put } from "@vercel/blob";

export type InboxMessage = {
  id: string;
  name: string;
  email: string;
  type: string;
  budget: string;
  message: string;
  createdAt: string;
};

const PREFIX = "messages/";
const COOKIE = "inbox_session";

export async function saveMessage(msg: Omit<InboxMessage, "id" | "createdAt">) {
  const createdAt = new Date().toISOString();
  // Reverse timestamp so the store's alphabetical listing is newest-first.
  const rev = String(9_999_999_999_999 - Date.now()).padStart(13, "0");
  const id = `${rev}-${Math.random().toString(36).slice(2, 8)}`;
  const record: InboxMessage = { id, createdAt, ...msg };
  await put(`${PREFIX}${id}.json`, JSON.stringify(record), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
  });
  return record;
}

export async function listMessages(): Promise<InboxMessage[]> {
  const out: InboxMessage[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: PREFIX, cursor, limit: 1000 });
    const loaded = await Promise.all(
      page.blobs.map(async (b) => {
        const res = await get(b.pathname, { access: "private", useCache: false });
        if (!res || res.statusCode !== 200) return null;
        try {
          return JSON.parse(await new Response(res.stream).text()) as InboxMessage;
        } catch {
          return null;
        }
      }),
    );
    out.push(...loaded.filter((m): m is InboxMessage => m !== null));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function deleteMessage(id: string) {
  if (!/^[\w-]+$/.test(id)) return;
  await del(`${PREFIX}${id}.json`);
}

/* ---------------- auth: one password, stored as an env var ---------------- */

function sessionValue(password: string) {
  return createHash("sha256").update(`inbox:${password}`).digest("hex");
}

export function passwordMatches(input: string) {
  const expected = process.env.INBOX_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(sessionValue(input));
  const b = Buffer.from(sessionValue(expected));
  return timingSafeEqual(a, b);
}

export async function isAuthed() {
  const expected = process.env.INBOX_PASSWORD;
  if (!expected) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const a = Buffer.from(value);
  const b = Buffer.from(sessionValue(expected));
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function startSession() {
  const expected = process.env.INBOX_PASSWORD;
  if (!expected) return;
  (await cookies()).set(COOKIE, sessionValue(expected), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/inbox",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function endSession() {
  (await cookies()).delete({ name: COOKIE, path: "/inbox" });
}
