import Fuse from 'fuse.js';
import { SearchResult } from '../models/types';

export class SearchEngine {
  private threshold: number = 0.4; // Balance between precision and recall

  /**
   * Set the fuzzy matching threshold (0.0 = exact match, 1.0 = match anything)
   */
  setThreshold(threshold: number): void {
    this.threshold = Math.max(0, Math.min(1, threshold));
  }

  /**
   * Search items using fuzzy matching
   * @param query - Search query string
   * @param items - Array of items to search
   * @param fields - Fields to search in (e.g., ['name', 'description'])
   * @returns Array of search results with scores
   */
  search<T>(query: string, items: T[], fields: string[]): SearchResult<T>[] {
    // Handle empty query
    if (!query || query.trim() === '') {
      return items.map(item => ({
        item,
        score: 1
      }));
    }

    // Configure Fuse.js for fuzzy search
    const fuse = new Fuse(items, {
      keys: fields,
      threshold: this.threshold,
      includeScore: true,
      includeMatches: true,
      ignoreLocation: true, // Search entire string, not just beginning
      minMatchCharLength: 1,
      findAllMatches: true
    });

    // Perform search
    const results = fuse.search(query);

    // Transform Fuse results to our SearchResult format
    return results.map(result => ({
      item: result.item,
      score: 1 - (result.score || 0), // Invert score (higher is better)
      matches: result.matches?.map(match => ({
        field: match.key || '',
        matchedText: match.value || ''
      }))
    }));
  }

  /**
   * Search with case-insensitive exact matching (for comparison)
   */
  exactSearch<T>(query: string, items: T[], fields: string[]): SearchResult<T>[] {
    if (!query || query.trim() === '') {
      return items.map(item => ({ item, score: 1 }));
    }

    const lowerQuery = query.toLowerCase();
    const results: SearchResult<T>[] = [];

    for (const item of items) {
      let matched = false;
      const matches: Array<{ field: string; matchedText: string }> = [];

      for (const field of fields) {
        const value = this.getNestedValue(item, field);
        if (value && typeof value === 'string') {
          const lowerValue = value.toLowerCase();
          if (lowerValue.includes(lowerQuery)) {
            matched = true;
            matches.push({ field, matchedText: value });
          }
        }
      }

      if (matched) {
        results.push({
          item,
          score: 1,
          matches
        });
      }
    }

    return results;
  }

  /**
   * Get nested value from object using dot notation
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Sort search results by score (descending)
   */
  sortByScore<T>(results: SearchResult<T>[]): SearchResult<T>[] {
    return [...results].sort((a, b) => b.score - a.score);
  }

  /**
   * Filter results by minimum score threshold
   */
  filterByScore<T>(results: SearchResult<T>[], minScore: number): SearchResult<T>[] {
    return results.filter(result => result.score >= minScore);
  }
}

// Export singleton instance
export const searchEngine = new SearchEngine();
