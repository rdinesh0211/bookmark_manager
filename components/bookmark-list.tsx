"use client";

import type { Bookmark } from "@/lib/types";
import { BookmarkItem } from "@/components/bookmark-item";

type BookmarkListProps = {
  items: Bookmark[];
  deletingId: string | null;
  onDelete: (id: string) => Promise<void>;
};

export function BookmarkList({ items, deletingId, onDelete }: BookmarkListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
        No bookmarks found.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {items.map((bookmark) => (
        <BookmarkItem
          key={bookmark.id}
          bookmark={bookmark}
          deletingId={deletingId}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
