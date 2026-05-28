import { useState, useEffect } from 'react';
import { College } from '@/types';
import collegesData from '@/data/colleges.json';

export function useCollegeById(id: string | undefined) {
  const [college, setCollege] = useState<College | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setCollege(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate API call
    const timer = setTimeout(() => {
      const found = (collegesData as College[]).find((c) => c.id === id);
      if (found) {
        setCollege(found);
        setError(null);
      } else {
        setCollege(null);
        setError('College not found');
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  return { college, isLoading, error };
}
