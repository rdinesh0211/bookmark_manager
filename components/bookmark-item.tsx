"use client";

import { useState } from "react";
import type { Bookmark } from "@/lib/types";

type BookmarkItemProps = {
  bookmark: Bookmark;
  onDelete: (id: string) => Promise<void>;
  deletingId: string | null;
};

export function BookmarkItem({ bookmark, onDelete, deletingId }: BookmarkItemProps) {
  const isDeleting = deletingId === bookmark.id;
  const createdAt = new Date(bookmark.created_at).toLocaleString();
  const [showFallbackIcon, setShowFallbackIcon] = useState(false);

  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {bookmark.favicon_url && !showFallbackIcon ? (
              <img
                src={bookmark.favicon_url}
                alt=""
                onError={() => setShowFallbackIcon(true)}
                className="h-4 w-4 rounded-sm"
              />
            ) : (
              <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-neutral-200 text-[10px] text-neutral-600">
                •
              </div>
            )}
            <a
              href={bookmark.url}
              target="_blank"
              rel="noreferrer"
              className="truncate text-base font-semibold text-neutral-900 underline-offset-4 hover:underline"
            >
              {bookmark.title}
            </a>
          </div>
          <p className="mt-1 break-all text-xs text-neutral-500">{bookmark.url}</p>
        </div>
        <button
          type="button"
          onClick={() => onDelete(bookmark.id)}
          disabled={isDeleting}
          className="rounded-lg border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      {bookmark.description && (
        <p className="mt-3 text-sm text-neutral-700">{bookmark.description}</p>
      )}

      {bookmark.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {bookmark.tags.map((tag) => (
            <span
              key={`${bookmark.id}-${tag}`}
              className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <p className="mt-3 text-xs text-neutral-500">Saved {createdAt}</p>
    </article>
  );
}
