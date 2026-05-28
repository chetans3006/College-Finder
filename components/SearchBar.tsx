'use client';

import { Search, X } from 'lucide-react';
import { useFiltersStore } from '@/store/filters';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  placeholder?: string;
}

export function SearchBar({
  placeholder = 'Search colleges, cities, courses...',
}: SearchBarProps) {
  const { search, setSearch } = useFiltersStore();

  const handleClear = () => {
    setSearch('');
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-5 w-5 text-slate-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-2 text-sm"
          aria-label="Search colleges"
        />
        {search && (
          <button
            onClick={handleClear}
            className="absolute right-3 text-slate-400 hover:text-slate-600"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
