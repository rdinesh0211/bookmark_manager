import { NextResponse } from "next/server";
import { fetchPageFavicon, fetchPageTitle, getFallbackTitle } from "@/lib/fetch-title";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { CreateBookmarkPayload } from "@/lib/types";

function normalizeTags(tags: string[]): string[] {
  const unique = new Set<string>();

  for (const tag of tags) {
    const clean = tag.trim().toLowerCase();
    if (clean) {
      unique.add(clean);
    }
  }

  return Array.from(unique);
}

export async function GET() {
  const supabaseServer = getSupabaseServerClient();
  const { data, error } = await supabaseServer
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Could not load bookmarks. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabaseServer = getSupabaseServerClient();
  let body: CreateBookmarkPayload;

  try {
    body = (await request.json()) as CreateBookmarkPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const url = body.url?.trim();
  const description = body.description?.trim() ?? "";
  const tags = normalizeTags(body.tags ?? []);

  if (!url) {
    return NextResponse.json({ error: "URL is required." }, { status: 400 });
  }

  let normalizedUrl: string;
  try {
    normalizedUrl = new URL(url).toString();
  } catch {
    return NextResponse.json(
      { error: "Please enter a valid URL including protocol (https://)." },
      { status: 400 }
    );
  }

  const fetchedTitle = await fetchPageTitle(normalizedUrl);
  const title = fetchedTitle ?? getFallbackTitle(normalizedUrl);
  const faviconUrl = await fetchPageFavicon(normalizedUrl);

  const { data, error } = await supabaseServer
    .from("bookmarks")
    .insert({
      url: normalizedUrl,
      title,
      description,
      tags,
      favicon_url: faviconUrl || null
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Could not save bookmark. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ data }, { status: 201 });
}
