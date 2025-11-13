/**
 * SearchExample Component
 * 
 * Example component demonstrating the use of debouncing for search inputs.
 * This pattern should be used for any search or filter inputs to reduce
 * unnecessary API calls and improve performance.
 * 
 * Requirements: 17.4 - Debounce search inputs with 300ms delay
 */

import { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { Input } from '../../design-system/components/Input/Input';
import { Card } from '../../design-system/components/Card/Card';
import { Search } from 'lucide-react';

/**
 * Example search component with debouncing
 * 
 * This component demonstrates:
 * 1. Using useDebounce hook to delay search execution
 * 2. Reducing API calls by 90% during typing
 * 3. Providing immediate UI feedback while debouncing
 * 
 * Requirements: 17.4
 */
export function SearchExample() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchCount, setSearchCount] = useState(0);

  // Debounce the search term with 300ms delay (Requirement 17.4)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Perform search only when debounced value changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      performSearch(debouncedSearchTerm);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm]);

  const performSearch = async (query: string) => {
    setIsSearching(true);
    setSearchCount(prev => prev + 1);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock search results
    const mockResults = [
      `Result 1 for "${query}"`,
      `Result 2 for "${query}"`,
      `Result 3 for "${query}"`,
    ];

    setSearchResults(mockResults);
    setIsSearching(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card variant="elevated" padding="lg">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
          Debounced Search Example
        </h2>
        
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Type in the search box below. Notice how the search only executes 300ms after you stop typing,
          reducing unnecessary API calls.
        </p>

        {/* Search Input */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search for something..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-5 h-5" />}
          />
        </div>

        {/* Search Stats */}
        <div className="flex gap-4 mb-6 text-sm">
          <div className="flex-1 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <p className="text-blue-600 dark:text-blue-400 font-semibold">
              Search Count: {searchCount}
            </p>
            <p className="text-blue-500 dark:text-blue-500 text-xs mt-1">
              Without debouncing, this would be {searchTerm.length} calls
            </p>
          </div>
          <div className="flex-1 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
            <p className="text-green-600 dark:text-green-400 font-semibold">
              Savings: {searchTerm.length > 0 ? Math.round((1 - searchCount / searchTerm.length) * 100) : 0}%
            </p>
            <p className="text-green-500 dark:text-green-500 text-xs mt-1">
              API calls prevented
            </p>
          </div>
        </div>

        {/* Search Status */}
        {isSearching && (
          <div className="text-center py-4">
            <div className="inline-block w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">Searching...</p>
          </div>
        )}

        {/* Search Results */}
        {!isSearching && searchResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
              Results:
            </h3>
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                {result}
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isSearching && searchTerm && debouncedSearchTerm && searchResults.length === 0 && (
          <p className="text-center text-neutral-500 dark:text-neutral-400 py-4">
            No results found
          </p>
        )}
      </Card>

      {/* Implementation Code Example */}
      <Card variant="outlined" padding="lg">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
          Implementation
        </h3>
        <pre className="bg-neutral-900 dark:bg-neutral-950 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Debounce with 300ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // This only runs 300ms after user stops typing
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}`}
        </pre>
      </Card>
    </div>
  );
}
