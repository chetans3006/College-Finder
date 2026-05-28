export interface Course {
  id: string;
  name: string;
  duration: number;
}

export interface Placements {
  avgPackage: number;
  highestPackage: number;
  placementRate: number;
}

export interface Review {
  author: string;
  rating: number;
  comment: string;
}

export interface College {
  id: string;
  name: string;
  slug: string;
  location: string;
  state: string;
  fees: number;
  rating: number;
  reviews: number;
  placements: Placements;
  description: string;
  image: string;
  courses: Course[];
  reviews_data: Review[];
}

export interface FilterState {
  search: string;
  location: string[];
  feesRange: [number, number];
  ratingRange: [number, number];
  sortBy: 'rating' | 'fees-low' | 'fees-high' | 'placement';
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  email: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface CompareCollege {
  id: string;
  name: string;
  rating: number;
  avgPackage: number;
  fees: number;
  placementRate: number;
  location: string;
}
