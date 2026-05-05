export type Bookmark = {
  id: string;
  url: string;
  title: string;
  description: string;
  tags: string[];
  favicon_url: string | null;
  created_at: string;
};

export type CreateBookmarkPayload = {
  url: string;
  description: string;
  tags: string[];
};
