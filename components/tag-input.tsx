"use client";

import { KeyboardEvent, useMemo, useState } from "react";

type TagInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions: string[];
  disabled?: boolean;
};

export function TagInput({
  value,
  onChange,
  suggestions,
  disabled = false
}: TagInputProps) {
  const [draft, setDraft] = useState("");

  const filteredSuggestions = useMemo(() => {
    const query = draft.trim().toLowerCase();
    if (!query) {
      return [];
    }

    return suggestions
      .filter((item) => item.toLowerCase().includes(query))
      .filter((item) => !value.includes(item))
      .slice(0, 6);
  }, [draft, suggestions, value]);

  const addTag = (tag: string) => {
    const normalized = tag.trim().toLowerCase();
    if (!normalized || value.includes(normalized)) {
      return;
    }
    onChange([...value, normalized]);
    setDraft("");
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((item) => item !== tag));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag(draft);
    }

    if (event.key === "Backspace" && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 rounded-xl border border-neutral-200 bg-white p-2">
        {value.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => removeTag(tag)}
            className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700 hover:bg-neutral-200"
            disabled={disabled}
          >
            {tag} ×
          </button>
        ))}
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add tags and press Enter"
          className="min-w-[160px] flex-1 bg-transparent px-1 py-1 text-sm outline-none"
          disabled={disabled}
        />
      </div>
      {filteredSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filteredSuggestions.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => addTag(tag)}
              className="rounded-full border border-neutral-300 px-3 py-1 text-xs text-neutral-600 hover:border-neutral-500 hover:text-neutral-800"
              disabled={disabled}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
