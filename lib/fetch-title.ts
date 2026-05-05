const TITLE_REGEX = /<title[^>]*>([\s\S]*?)<\/title>/i;
const FAVICON_REGEX =
  /<link[^>]*rel=["'][^"']*(?:icon|shortcut icon|apple-touch-icon)[^"']*["'][^>]*>/gi;
const HREF_REGEX = /href=["']([^"']+)["']/i;

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export async function fetchPageTitle(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "bookmark-manager/1.0" },
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    const match = html.match(TITLE_REGEX);
    if (!match?.[1]) {
      return null;
    }

    const title = decodeHtmlEntities(match[1].replace(/\s+/g, " ").trim());
    return title.length > 0 ? title : null;
  } catch {
    return null;
  }
}

export function getFallbackTitle(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function extractFaviconFromHtml(html: string, pageUrl: string): string | null {
  const matches = html.match(FAVICON_REGEX);
  if (!matches || matches.length === 0) {
    return null;
  }

  for (const linkTag of matches) {
    const hrefMatch = linkTag.match(HREF_REGEX);
    const rawHref = hrefMatch?.[1]?.trim();
    if (!rawHref) {
      continue;
    }

    try {
      return new URL(rawHref, pageUrl).toString();
    } catch {
      continue;
    }
  }

  return null;
}

export async function fetchPageFavicon(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "bookmark-manager/1.0" },
      next: { revalidate: 0 }
    });

    if (response.ok) {
      const html = await response.text();
      const extracted = extractFaviconFromHtml(html, url);
      if (extracted) {
        return extracted;
      }
    }
  } catch {
    // fallback below
  }

  try {
    const parsed = new URL(url);
    return `${parsed.origin}/favicon.ico`;
  } catch {
    return "";
  }
}
