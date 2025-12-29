import React, { useState, useMemo } from 'react';
import { SlangEntry } from '../models/types';
import { searchEngine } from '../services/search';
import { SearchBar } from './SearchBar';
import { EmptyState } from './EmptyState';
import '../styles/SlangTranslator.css';

interface SlangTranslatorProps {
  slangData: SlangEntry[];
}

export const SlangTranslator: React.FC<SlangTranslatorProps> = ({ slangData }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Perform search with fuzzy matching
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return slangData.map(item => ({ item, score: 1 }));
    }

    const results = searchEngine.search(
      searchQuery,
      slangData,
      ['term', 'meaning', 'usage', 'category']
    );

    return searchEngine.sortByScore(results);
  }, [searchQuery, slangData]);

  return (
    <div className="slang-translator">
      <div className="module-header">
        <h2 className="module-title">🗣️ Slang Translator</h2>
        <p className="module-description">
          Understand Bangalore's Kannada slang and tech terminology
        </p>
      </div>

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search slang terms... (e.g., 'Maga', 'MVP')"
        icon="🔍"
      />

      {searchResults.length === 0 ? (
        <EmptyState
          icon="🤷"
          title="No results found"
          message={`No slang terms match "${searchQuery}". Try a different search term.`}
        />
      ) : (
        <div className="slang-grid">
          {searchResults.map(({ item }) => (
            <SlangCard key={item.term} entry={item} />
          ))}
        </div>
      )}
    </div>
  );
};

interface SlangCardProps {
  entry: SlangEntry;
}

const SlangCard: React.FC<SlangCardProps> = ({ entry }) => {
  const categoryEmoji = {
    kannada: '🇮🇳',
    tech: '💻',
    general: '💬'
  };

  const categoryColor = {
    kannada: 'category-kannada',
    tech: 'category-tech',
    general: 'category-general'
  };

  return (
    <div className="slang-card fade-in">
      <div className="slang-header">
        <h3 className="slang-term">{entry.term}</h3>
        <span className={`slang-category ${categoryColor[entry.category]}`}>
          {categoryEmoji[entry.category]} {entry.category}
        </span>
      </div>

      <div className="slang-content">
        <div className="slang-section">
          <span className="slang-label">Meaning:</span>
          <p className="slang-meaning">{entry.meaning}</p>
        </div>

        <div className="slang-section">
          <span className="slang-label">Usage:</span>
          <p className="slang-usage">"{entry.usage}"</p>
        </div>

        {entry.examples && entry.examples.length > 0 && (
          <div className="slang-section">
            <span className="slang-label">Example:</span>
            <p className="slang-example">{entry.examples[0]}</p>
          </div>
        )}
      </div>
    </div>
  );
};
