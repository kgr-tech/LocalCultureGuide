import { FoodEntry, CultureEntry, TrafficRoute, TimeOfDay } from '../models/types';

export class FilterEngine {
  /**
   * Filter food entries by time of day
   */
  filterByTime(items: FoodEntry[], timeOfDay: TimeOfDay): FoodEntry[] {
    return items.filter(item => item.bestTimes.includes(timeOfDay));
  }

  /**
   * Filter culture entries by category
   */
  filterByCategory(items: CultureEntry[], category: string): CultureEntry[] {
    if (!category) {
      return items;
    }
    return items.filter(item => item.category === category.toLowerCase());
  }

  /**
   * Filter by tags (for food or culture entries)
   */
  filterByTags<T extends { tags?: string[] }>(items: T[], tags: string[]): T[] {
    if (!tags || tags.length === 0) {
      return items;
    }

    return items.filter(item => {
      if (!item.tags) return false;
      return tags.some(tag => 
        item.tags!.some(itemTag => 
          itemTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
    });
  }

  /**
   * Enhance traffic routes with peak hour information
   */
  filterByPeakHours(routes: TrafficRoute[], _currentTime: Date = new Date()): TrafficRoute[] {
    // This doesn't filter, but enhances routes with current time info
    // The actual filtering/adjustment happens in the component
    return routes;
  }

  /**
   * Get unique categories from culture entries
   */
  getUniqueCategories(items: CultureEntry[]): string[] {
    const categories = new Set(items.map(item => item.category));
    return Array.from(categories).sort();
  }

  /**
   * Get unique tags from items
   */
  getUniqueTags<T extends { tags?: string[] }>(items: T[]): string[] {
    const tags = new Set<string>();
    items.forEach(item => {
      item.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }

  /**
   * Filter items by multiple criteria
   */
  filterByCriteria<T extends { tags?: string[] }>(
    items: T[],
    criteria: {
      timeOfDay?: TimeOfDay;
      category?: string;
      tags?: string[];
      searchQuery?: string;
    }
  ): T[] {
    let filtered = items;

    // Apply time filter for food entries
    if (criteria.timeOfDay && this.isFoodEntry(filtered[0])) {
      filtered = this.filterByTime(filtered as unknown as FoodEntry[], criteria.timeOfDay) as unknown as T[];
    }

    // Apply category filter for culture entries
    if (criteria.category && this.isCultureEntry(filtered[0])) {
      filtered = this.filterByCategory(filtered as unknown as CultureEntry[], criteria.category) as unknown as T[];
    }

    // Apply tags filter
    if (criteria.tags && criteria.tags.length > 0) {
      filtered = this.filterByTags(filtered, criteria.tags);
    }

    return filtered;
  }

  /**
   * Type guard for FoodEntry
   */
  private isFoodEntry(item: any): item is FoodEntry {
    return item && 'bestTimes' in item && 'spots' in item;
  }

  /**
   * Type guard for CultureEntry
   */
  private isCultureEntry(item: any): item is CultureEntry {
    return item && 'category' in item && 'details' in item;
  }
}

// Export singleton instance
export const filterEngine = new FilterEngine();
