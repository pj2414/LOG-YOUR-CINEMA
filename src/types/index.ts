
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin';
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
  stats?: UserStats;
}

export interface UserStats {
  watched: number;
  watching: number;
  planned: number;
  averageRating: number;
}

export interface Movie {
  id: number;
  title: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  overview?: string;
  vote_average?: number;
  genres?: Genre[];
  runtime?: number;
  credits?: Credits;
}

export interface Anime {
  id: number;
  title: {
    romaji?: string;
    english?: string;
    native?: string;
  };
  coverImage?: {
    large?: string;
    medium?: string;
  };
  bannerImage?: string;
  description?: string;
  genres?: string[];
  episodes?: number;
  duration?: number;
  status?: string;
  startDate?: {
    year?: number;
    month?: number;
    day?: number;
  };
  averageScore?: number;
  popularity?: number;
  studios?: {
    nodes: { name: string }[];
  };
}

export interface Genre {
  id: number;
  name: string;
}

export interface Credits {
  cast?: CastMember[];
  crew?: CrewMember[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path?: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  profile_path?: string;
}

export interface Log {
  _id: string;
  userId: string;
  contentType: 'movie' | 'anime';
  contentId: string;
  status: 'watched' | 'planned' | 'dropped' | 'watching';
  rating?: number;
  review?: string;
  rewatchCount: number;
  lastWatched: string;
  createdAt: string;
  updatedAt: string;
  contentDetails?: ContentDetails;
}

export interface ContentDetails {
  title: string;
  poster?: string;
  year?: number;
  genres?: string[] | Genre[];
}

export interface DiaryEntry {
  _id: string;
  userId: string;
  contentType: 'movie' | 'anime';
  contentId: string;
  notes: string;
  watchedDate: string;
  rating?: number;
  createdAt: string;
}

export interface Collection {
  _id: string;
  userId: string;
  name: string;
  description: string;
  items: CollectionItem[];
  isPublic: boolean;
  createdAt: string;
}

export interface CollectionItem {
  contentType: 'movie' | 'anime';
  contentId: string;
  addedAt: string;
}

export interface WatchlistItem {
  _id: string;
  userId: string;
  contentType: 'movie' | 'anime';
  contentId: string;
  priority: 'low' | 'medium' | 'high';
  addedAt: string;
}

export interface Activity {
  _id: string;
  userId: {
    _id: string;
    username: string;
    avatar?: string;
  };
  type: 'log' | 'diary' | 'collection' | 'follow';
  contentType?: 'movie' | 'anime';
  contentId?: string;
  description: string;
  createdAt: string;
  contentDetails?: ContentDetails;
}

export interface SearchResult {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface AnimeSearchResult {
  media: Anime[];
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}
