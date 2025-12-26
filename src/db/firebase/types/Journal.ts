export type JournalType = {
  id?: string;
  user?: string;
  title: string;
  content: string;
  pinned?: boolean;
  categories?: string[];
  createdAt?: string;
};
