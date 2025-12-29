import React, { useState, useMemo } from 'react';
import { CultureEntry } from '../models/types';
import { searchEngine } from '../services/search';
import { filterEngine } from '../services/filter';
import { SearchBar } from './SearchBar';
import { EmptyState } from './EmptyState';
import '../styles/CultureHub.css';

interface CultureHubProps {
  cultureData: CultureEntry[];
}

export const CultureHub: React.FC<CultureHubProps> = ({ cultureData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    return filterEngine.getUniqueCategories(cultureData);
  }, [cultureData]);

  const categoryIcons: Record<string, string> = {
    neighborhood: '🏘️',
    startup: '🚀',
    festival: '🎉',
    coffee: '☕',
    living: '🏠'
  };

  // Apply filters and search
  const filteredResults = useMemo(() => {
    let results = cultureData;

    // Apply category filter
    if (selectedCategory) {
      results = filterEngine.filterByCategory(results, selectedCategory);
    }

    // Apply search
    if (searchQuery.trim()) {
      const searchResults = searchEngine.search(
        searchQuery,
        results,
        ['title', 'description', 'category']
      );
      return searchEngine.sortByScore(searchResults).map(r => r.item);
    }

    return results;
  }, [searchQuery, selectedCategory, cultureData]);

  return (
    <div className="culture-hub">
      <div className="module-header">
        <h2 className="module-title">🌆 Local Culture Hub</h2>
        <p className="module-description">
          Neighborhoods, startup ecosystem, festivals, coffee culture, and living tips
        </p>
      </div>

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search culture topics... (e.g., 'Koramangala', 'Festivals')"
        icon="🔍"
      />

      <div className="category-filters">
        <button
          className={`category-filter ${!selectedCategory ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {categoryIcons[category] || '📌'} {category}
          </button>
        ))}
      </div>

      {filteredResults.length === 0 ? (
        <EmptyState
          icon="🗺️"
          title="No culture entries found"
          message={
            searchQuery
              ? `No entries match "${searchQuery}"${selectedCategory ? ` in ${selectedCategory}` : ''}. Try a different search or category.`
              : `No entries available for ${selectedCategory}. Try a different category.`
          }
        />
      ) : (
        <div className="culture-grid">
          {filteredResults.map((item) => (
            <CultureCard key={item.title} entry={item} />
          ))}
        </div>
      )}
    </div>
  );
};

interface CultureCardProps {
  entry: CultureEntry;
}

const CultureCard: React.FC<CultureCardProps> = ({ entry }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryIcons: Record<string, string> = {
    neighborhood: '🏘️',
    startup: '🚀',
    festival: '🎉',
    coffee: '☕',
    living: '🏠'
  };

  const categoryColors: Record<string, string> = {
    neighborhood: 'category-neighborhood',
    startup: 'category-startup',
    festival: 'category-festival',
    coffee: 'category-coffee',
    living: 'category-living'
  };

  return (
    <div className="culture-card fade-in">
      <div className="culture-header">
        <div className="culture-title-section">
          <span className="culture-icon">{categoryIcons[entry.category] || '📌'}</span>
          <h3 className="culture-title">{entry.title}</h3>
        </div>
        <span className={`culture-category ${categoryColors[entry.category]}`}>
          {entry.category}
        </span>
      </div>

      <p className="culture-description">{entry.description}</p>

      <div className="culture-details">
        <button
          className="details-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          {isExpanded ? '▼' : '▶'} {isExpanded ? 'Hide' : 'Show'} Details
        </button>

        {isExpanded && (
          <ul className="details-list">
            {entry.details.map((detail, index) => (
              <li key={index} className="detail-item">{detail}</li>
            ))}
          </ul>
        )}
      </div>

      {entry.tags && entry.tags.length > 0 && (
        <div className="culture-tags">
          {entry.tags.map((tag) => (
            <span key={tag} className="culture-tag">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
};
