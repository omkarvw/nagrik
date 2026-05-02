import { useState, useRef, useEffect, useMemo, useCallback } from 'react';

interface CategoryDropdownProps {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
  placeholder?: string;
}

export function CategoryDropdown({
  categories,
  selectedCategory,
  onSelect,
  placeholder = 'Filter by category...',
}: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase().trim();
    if (!normalizedQuery) {
      return categories;
    }
    return categories.filter((cat) =>
      cat.toLowerCase().includes(normalizedQuery)
    );
  }, [categories, searchQuery]);

  // Reset highlighted index when filtered categories change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredCategories.length]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsOpen(true);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredCategories.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCategories[highlightedIndex]) {
            onSelect(filteredCategories[highlightedIndex]);
            setIsOpen(false);
            setSearchQuery('');
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSearchQuery('');
          inputRef.current?.blur();
          break;
        case 'Tab':
          setIsOpen(false);
          setSearchQuery('');
          break;
      }
    },
    [isOpen, filteredCategories, highlightedIndex, onSelect]
  );

  // Handle category selection
  const handleSelect = useCallback(
    (category: string) => {
      onSelect(category);
      setIsOpen(false);
      setSearchQuery('');
    },
    [onSelect]
  );

  // Toggle dropdown open/closed
  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => {
      const newState = !prev;
      if (newState) {
        // Opening - focus input and clear search
        setTimeout(() => inputRef.current?.focus(), 0);
        setSearchQuery('');
      } else {
        // Closing - clear search
        setSearchQuery('');
      }
      return newState;
    });
  }, []);

  // Display text - show selected category when closed, placeholder when open with empty search
  const displayText = !isOpen && selectedCategory !== 'All' ? selectedCategory : searchQuery;

  // Highlight matching text in results
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;

    const normalizedQuery = query.toLowerCase();
    const index = text.toLowerCase().indexOf(normalizedQuery);

    if (index === -1) return text;

    const before = text.slice(0, index);
    const match = text.slice(index, index + query.length);
    const after = text.slice(index + query.length);

    return (
      <>
        {before}
        <span className="text-primary font-semibold">{match}</span>
        {after}
      </>
    );
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Input Field */}
      <div
        className={`flex items-center bg-white border rounded-xl px-4 py-3 cursor-pointer transition-all duration-200 ${
          isOpen
            ? 'border-primary shadow-md'
            : 'border-outline-variant hover:border-primary/50'
        }`}
        onClick={toggleDropdown}
      >
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchQuery : displayText}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isOpen ? 'Search categories...' : placeholder}
          className="flex-1 bg-transparent outline-none font-body-md text-on-surface placeholder:text-outline/50 cursor-pointer"
          readOnly={!isOpen}
          aria-label="Select category"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-activedescendant={
            isOpen && filteredCategories[highlightedIndex]
              ? `category-${highlightedIndex}`
              : undefined
          }
        />
        <span
          className={`material-symbols-outlined text-on-surface-variant transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          expand_more
        </span>
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-elevation-3 border border-outline-variant overflow-hidden z-50 max-h-60 overflow-y-auto"
          role="listbox"
        >
          {filteredCategories.length === 0 ? (
            <div className="px-4 py-3 text-on-surface-variant font-body-sm">
              No categories found
            </div>
          ) : (
            <div className="py-2">
              {filteredCategories.map((category, index) => {
                const isSelected = category === selectedCategory;
                const isHighlighted = index === highlightedIndex;

                return (
                  <div
                    key={category}
                    id={`category-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    className={`px-4 py-3 cursor-pointer font-body-md flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-primary-container text-primary'
                        : isHighlighted
                          ? 'bg-surface-container'
                          : 'hover:bg-surface-container'
                    }`}
                    onClick={() => handleSelect(category)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <span>
                      {highlightMatch(category, searchQuery)}
                    </span>
                    {isSelected && (
                      <span className="material-symbols-outlined text-primary text-sm">
                        check
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
