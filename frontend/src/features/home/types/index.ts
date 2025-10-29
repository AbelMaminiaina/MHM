export interface NewsItem {
  id: string;
  type: 'communique' | 'video';
  title: string;
  author?: string;
  date: string;
  imageUrl?: string;
  videoUrl?: string;
  description?: string;
}

export interface AgendaItem {
  id: string;
  date: string;
  time: string;
  title: string;
  category: 'Medias' | 'Evenements' | 'Deplacements';
  description?: string;
  imageUrl?: string;
}

export interface ActionItem {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
}

export interface Section {
  id: string;
  title: string;
  ref: React.RefObject<HTMLDivElement>;
}
