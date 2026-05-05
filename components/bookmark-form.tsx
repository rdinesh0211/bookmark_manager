"use client";

import { FormEvent, useState } from "react";
import { TagInput } from "@/components/tag-input";
import type { Bookmark } from "@/lib/types";

type BookmarkFormProps = {
  tagSuggestions: string[];
  onCreated: (bookmark: Bookmark) => void;
};

export function BookmarkForm({ tagSuggestions, onCreated }: BookmarkFormProps) {
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const reset = () => {
    setUrl("");
    setDescription("");
    setTags([]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          description,
          tags
        })
      });

      const payload = (await response.json()) as {
        data?: Bookmark;
        error?: string;
      };

      if (!response.ok || !payload.data) {
        setErrorMessage(payload.error ?? "Could not save bookmark.");
        return;
      }

      onCreated(payload.data);
      reset();
    } catch {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm md:p-6"
    >
      <div>
        <label htmlFor="url" className="mb-1 block text-sm font-medium text-neutral-700">
          URL
        </label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://example.com"
          required
          disabled={isSubmitting}
          className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none ring-neutral-300 placeholder:text-neutral-400 focus:ring"
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-neutral-700">
          Description
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What is this bookmark for?"
          disabled={isSubmitting}
          className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none ring-neutral-300 placeholder:text-neutral-400 focus:ring"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Tags</label>
        <TagInput
          value={tags}
          onChange={setTags}
          suggestions={tagSuggestions}
          disabled={isSubmitting}
        />
      </div>

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save bookmark"}
      </button>
    </form>
  );
}
