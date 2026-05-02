import { useState, useRef, useCallback, useEffect } from 'react';
import type { Medicine, SearchSuggestion } from '../types';
import { searchMedicines } from '../utils/search';
import { logSearch } from '../utils/analytics';

interface SearchAutocompleteProps {
  medicines: Medicine[];
  onSelect: (medicine: Medicine) => void;
  placeholder?: string;
}

export function SearchAutocomplete({
  medicines,
  onSelect,
  placeholder = 'Find high-quality generic medicines...',
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        const results = searchMedicines(medicines, query, 10);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
        logSearch(query);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, medicines]);

  // Close suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (suggestion: SearchSuggestion) => {
      setQuery(suggestion.medicine.genericName);
      setShowSuggestions(false);
      onSelect(suggestion.medicine);
    },
    [onSelect]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
            handleSelect(suggestions[highlightedIndex]);
          }
          break;
        case 'Escape':
          setShowSuggestions(false);
          inputRef.current?.blur();
          break;
      }
    },
    [suggestions, highlightedIndex, handleSelect]
  );

  return (
    <div ref={containerRef} className="relative w-full max-w-3xl mx-auto">
      {/* Search Input */}
      <div className="relative group">
        <div
          className={`flex items-center bg-white border rounded-2xl p-2 shadow-sm transition-all duration-300 ${
            showSuggestions
              ? 'shadow-md border-primary'
              : 'border-outline-variant focus-within:shadow-md focus-within:border-primary'
          }`}
        >
          <div className="pl-4 pr-2 text-on-surface-variant">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlightedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            className="flex-1 border-none focus:ring-0 bg-transparent py-3 md:py-4 text-body-lg md:text-headline-md font-body-md md:font-headline-md placeholder:text-outline/50 outline-none min-w-0"
            placeholder={placeholder}
            aria-label="Search medicines"
            aria-expanded={showSuggestions}
            aria-haspopup="listbox"
            aria-activedescendant={
              highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : undefined
            }
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setShowSuggestions(false);
                inputRef.current?.focus();
              }}
              className="p-2 text-outline hover:text-primary transition-colors"
              aria-label="Clear search"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
          <button
            onClick={() => {
              if (query.trim()) {
                const results = searchMedicines(medicines, query, 10);
                if (results.length > 0) {
                  handleSelect(results[0]);
                }
              }
            }}
            className="ml-2 bg-primary hover:bg-surface-tint text-on-primary px-3 md:px-8 py-2 md:py-3 rounded-xl font-label-lg btn-press shadow-[0_2px_0_0_rgba(0,0,0,0.1)] flex items-center gap-1 flex-shrink-0"
            aria-label="Search"
          >
            <span className="material-symbols-outlined text-xl">search</span>
            <span className="hidden md:inline">Search</span>
          </button>
        </div>

        {/* Autocomplete Dropdown */}
        {showSuggestions && (
          <div
            className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-elevation-3 border border-outline-variant overflow-hidden z-40 animate-spring"
            role="listbox"
          >
            <div className="p-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion.medicine.id}-${index}`}
                  id={`suggestion-${index}`}
                  onClick={() => handleSelect(suggestion)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`flex items-center justify-between p-3 md:p-4 rounded-xl cursor-pointer transition-colors group/item ${
                    index === highlightedIndex
                      ? 'bg-surface-container'
                      : 'hover:bg-surface-container'
                  }`}
                  role="option"
                  aria-selected={index === highlightedIndex}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-surface-container-low rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                      <span className="material-symbols-outlined">pill</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-label-lg text-on-surface truncate">
                        {suggestion.matchType === 'generic'
                          ? suggestion.medicine.genericName
                          : suggestion.matchedName}
                      </h4>
                      <p className="font-label-sm text-secondary truncate">
                        {suggestion.matchType === 'branded' ? (
                          <>
                            Generic: <span className="font-semibold">{suggestion.medicine.genericName}</span>
                          </>
                        ) : (
                          <>Jan Aushadhi Price: ₹{suggestion.medicine.janAushadhiPrice}</>
                        )}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`material-symbols-outlined transition-colors flex-shrink-0 ${
                      index === highlightedIndex ? 'text-primary' : 'text-outline'
                    }`}
                  >
                    arrow_forward
                  </span>
                </div>
              ))}
            </div>
            {suggestions.length >= 10 && (
              <div className="bg-surface-container-lowest p-3 md:p-4 border-t border-outline-variant text-center">
                <span className="font-label-sm text-on-surface-variant">
                  Press{' '}
                  <kbd className="px-1.5 py-0.5 rounded border border-outline-variant bg-white shadow-sm">
                    Enter
                  </kbd>{' '}
                  to search all matches
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
