"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "../primitives/input";
import { cn } from "../../lib/utils";

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  href?: string;
  category?: string;
}

export interface ComponentSearchProps {
  /**
   * Placeholder text for the search input
   * @default "Search components..."
   */
  placeholder?: string;
  /**
   * Async function to fetch search results based on query
   */
  onSearch?: (query: string) => Promise<SearchResult[]>;
  /**
   * Callback when a search result is selected
   */
  onSelect?: (result: SearchResult) => void;
  /**
   * Minimum characters required before triggering search
   * @default 2
   */
  minQueryLength?: number;
  /**
   * Debounce delay in milliseconds
   * @default 300
   */
  debounceMs?: number;
  /**
   * Custom className for the container
   */
  className?: string;
  /**
   * Whether to show the component on mobile
   * @default false
   */
  showOnMobile?: boolean;
}

export default function ComponentSearch({
  placeholder = "Search components...",
  onSearch,
  onSelect,
  minQueryLength = 2,
  debounceMs = 300,
  className,
  showOnMobile = false,
}: ComponentSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search implementation
  useEffect(() => {
    const abortController = new AbortController();
    const timer = setTimeout(async () => {
      if (query.trim().length >= minQueryLength) {
        setIsLoading(true);
        setIsOpen(true);
        try {
          if (onSearch) {
            const res = await onSearch(query);
            if (!abortController.signal.aborted) {
              setResults(res || []);
              setIsLoading(false);
            }
          } else {
            // Default mock search if no onSearch provided
            setResults([]);
            setIsLoading(false);
          }
        } catch {
          if (!abortController.signal.aborted) {
            setResults([]);
            setIsLoading(false);
          }
        }
      } else {
        setResults([]);
        if (query.length === 0) setIsOpen(false);
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [query, minQueryLength, debounceMs, onSearch]);

  const handleFocus = () => {
    if (query.trim().length >= minQueryLength) {
      setIsOpen(true);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const handleSelect = (result: SearchResult) => {
    setIsOpen(false);
    if (onSelect) {
      onSelect(result);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim().length >= minQueryLength) {
      // Handle enter key - could navigate to search results page
      setIsOpen(false);
    }
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Group results by category
  const groupedResults = results.reduce(
    (acc, result) => {
      const category = result.category || "Results";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(result);
      return acc;
    },
    {} as Record<string, SearchResult[]>,
  );

  const hasResults = results.length > 0;

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full max-w-md", !showOnMobile && "hidden md:flex", className)}
    >
      <div className="relative group w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        </div>
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen && query.length >= minQueryLength}
          aria-controls="search-results-dropdown"
          className="pl-10 pr-10 h-9 w-full border-none bg-muted/50 rounded-full focus-visible:ring-1 focus-visible:bg-background focus-visible:border-border transition-all"
        />
        {query.length > 0 && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && query.length >= minQueryLength && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            id="search-results-dropdown"
            role="listbox"
            className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50 max-h-[80vh] overflow-y-auto"
          >
            {!hasResults && !isLoading && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No results found for &quot;{query}&quot;
              </div>
            )}

            {hasResults && (
              <div className="py-2">
                {Object.entries(groupedResults).map(([category, categoryResults]) => (
                  <div key={category} className="mb-2 last:mb-0">
                    <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {category}
                    </div>
                    {categoryResults.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleSelect(result)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-accent transition-colors w-full text-left"
                      >
                        {result.icon && (
                          <div className="shrink-0 text-muted-foreground">{result.icon}</div>
                        )}
                        <div className="overflow-hidden flex-1">
                          <div className="text-sm font-medium truncate text-foreground">
                            {result.title}
                          </div>
                          {result.description && (
                            <div className="text-xs text-muted-foreground truncate">
                              {result.description}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {query.length >= minQueryLength && (
              <div className="flex items-center justify-center gap-2 w-full p-4 text-sm font-medium border-t border-border hover:bg-accent transition-colors text-primary cursor-pointer">
                <Search className="h-4 w-4" />
                View all results for &quot;{query}&quot;
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
