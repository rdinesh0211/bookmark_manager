"use client";

import { useMemo, useState } from "react";
import { BookmarkForm } from "@/components/bookmark-form";
import { BookmarkList } from "@/components/bookmark-list";
import { SearchBar } from "@/components/search-bar";
import type { Bookmark } from "@/lib/types";
import { useEffect } from "react";

export default function HomePage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadBookmarks = async () => {
      setIsLoading(true);
      setLoadingError("");

      try {
        const response = await fetch("/api/bookmarks", { method: "GET" });
        const payload = (await response.json()) as {
          data?: Bookmark[];
          error?: string;
        };

        if (!response.ok || !payload.data) {
          setLoadingError(payload.error ?? "Could not load bookmarks.");
          return;
        }

        setBookmarks(payload.data);
      } catch {
        setLoadingError("Network error while loading bookmarks.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadBookmarks();
  }, []);

  const handleCreated = (bookmark: Bookmark) => {
    setBookmarks((current) => [bookmark, ...current]);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);

    try {
      const response = await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setLoadingError(payload.error ?? "Could not delete bookmark.");
        return;
      }

      setBookmarks((current) => current.filter((item) => item.id !== id));
    } catch {
      setLoadingError("Network error while deleting bookmark.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredBookmarks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return bookmarks;
    }

    return bookmarks.filter((bookmark) => {
      const searchText = [bookmark.title, bookmark.description, ...bookmark.tags]
        .join(" ")
        .toLowerCase();
      return searchText.includes(query);
    });
  }, [bookmarks, searchQuery]);

  const tagSuggestions = useMemo(() => {
    const unique = new Set<string>();
    bookmarks.forEach((bookmark) => {
      bookmark.tags.forEach((tag) => unique.add(tag));
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [bookmarks]);

  return (
    <main className="mx-auto w-full max-w-3xl space-y-4 px-4 py-6 md:py-10">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Bookmark Manager
        </h1>
        <p className="text-sm text-neutral-500">
          Save links, tag them, and search everything instantly.
        </p>
      </header>

      <BookmarkForm tagSuggestions={tagSuggestions} onCreated={handleCreated} />
      <SearchBar query={searchQuery} onChange={setSearchQuery} />

      {loadingError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {loadingError}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
          Loading bookmarks...
        </div>
      ) : (
        <BookmarkList items={filteredBookmarks} deletingId={deletingId} onDelete={handleDelete} />
      )}
    </main>
  );
}
