export interface Business {
  id: string;
  name: string;
  address: string;
  phoneNumber?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  category?: string;
  openStatus?: string;
  description?: string;
}

export type TabView = 'all' | 'no-website';

export interface SearchState {
  query: string;
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
}