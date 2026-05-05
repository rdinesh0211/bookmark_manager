"use client";

type SearchBarProps = {
  query: string;
  onChange: (value: string) => void;
};

export function SearchBar({ query, onChange }: SearchBarProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm md:p-4">
      <input
        type="search"
        value={query}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by title, description, or tags..."
        className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none ring-neutral-300 placeholder:text-neutral-400 focus:ring"
      />
    </div>
  );
}
