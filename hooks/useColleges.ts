import { useState, useMemo } from 'react';
import { College } from '@/types';
import collegesData from '@/data/colleges.json';
import { useDebounce } from './useDebounce';
import { useFiltersStore } from '@/store/filters';

export function useColleges() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { search, location, feesRange, ratingRange, sortBy } = useFiltersStore();
  const debouncedSearch = useDebounce(search, 300);

  const filteredAndSortedColleges = useMemo(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 300);

    let filtered = collegesData as College[];

    // Search filter
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (college) =>
          college.name.toLowerCase().includes(query) ||
          college.description.toLowerCase().includes(query) ||
          college.location.toLowerCase().includes(query)
      );
    }

    // Location filter
    if (location.length > 0) {
      filtered = filtered.filter((college) =>
        location.includes(college.state)
      );
    }

    // Fees filter
    filtered = filtered.filter(
      (college) => college.fees >= feesRange[0] && college.fees <= feesRange[1]
    );

    // Rating filter
    filtered = filtered.filter(
      (college) => college.rating >= ratingRange[0] && college.rating <= ratingRange[1]
    );

    // Sorting
    const sorted = [...filtered];
    switch (sortBy) {
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'fees-low':
        sorted.sort((a, b) => a.fees - b.fees);
        break;
      case 'fees-high':
        sorted.sort((a, b) => b.fees - a.fees);
        break;
      case 'placement':
        sorted.sort((a, b) => b.placements.avgPackage - a.placements.avgPackage);
        break;
    }

    return sorted;
  }, [debouncedSearch, location, feesRange, ratingRange, sortBy]);

  return {
    colleges: filteredAndSortedColleges,
    isLoading,
    error,
    totalCount: filteredAndSortedColleges.length,
  };
}
