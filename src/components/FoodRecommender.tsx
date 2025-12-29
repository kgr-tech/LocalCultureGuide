import React, { useState, useMemo } from 'react';
import { FoodEntry, TimeOfDay } from '../models/types';
import { searchEngine } from '../services/search';
import { filterEngine } from '../services/filter';
import { timeManager } from '../services/timeManager';
import { SearchBar } from './SearchBar';
import { EmptyState } from './EmptyState';
import '../styles/FoodRecommender.css';

interface FoodRecommenderProps {
  foodData: FoodEntry[];
}

export const FoodRecommender: React.FC<FoodRecommenderProps> = ({ foodData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTime, setSelectedTime] = useState<TimeOfDay | null>(null);
  const currentTime = timeManager.getCurrentTimeOfDay();

  // Apply filters and search
  const filteredResults = useMemo(() => {
    let results = foodData;

    // Apply time filter
    if (selectedTime) {
      results = filterEngine.filterByTime(results, selectedTime);
    }

    // Apply search
    if (searchQuery.trim()) {
      const searchResults = searchEngine.search(
        searchQuery,
        results,
        ['name', 'description', 'category']
      );
      return searchEngine.sortByScore(searchResults).map(r => r.item);
    }

    return results;
  }, [searchQuery, selectedTime, foodData]);

  const timeFilters = timeManager.getAllTimesOfDay();

  return (
    <div className="food-recommender">
      <div className="module-header">
        <h2 className="module-title">🍜 Street Food Recommender</h2>
        <p className="module-description">
          Discover authentic street foods with spots, prices, and best times
        </p>
      </div>

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search food items... (e.g., 'Dosa', 'Biryani')"
        icon="🔍"
      />

      <div className="time-filters">
        <button
          className={`time-filter ${!selectedTime ? 'active' : ''}`}
          onClick={() => setSelectedTime(null)}
        >
          All Times
        </button>
        {timeFilters.map((time) => (
          <button
            key={time}
            className={`time-filter ${selectedTime === time ? 'active' : ''} ${currentTime === time ? 'current' : ''}`}
            onClick={() => setSelectedTime(time)}
          >
            {timeManager.formatTimeOfDay(time)}
            {currentTime === time && <span className="current-badge">Now</span>}
          </button>
        ))}
      </div>

      {filteredResults.length === 0 ? (
        <EmptyState
          icon="🍽️"
          title="No food items found"
          message={
            searchQuery
              ? `No food items match "${searchQuery}"${selectedTime ? ` for ${selectedTime}` : ''}. Try a different search or time.`
              : `No food items available for ${selectedTime}. Try a different time.`
          }
        />
      ) : (
        <div className="food-grid">
          {filteredResults.map((item) => (
            <FoodCard key={item.name} entry={item} />
          ))}
        </div>
      )}
    </div>
  );
};

interface FoodCardProps {
  entry: FoodEntry;
}

const FoodCard: React.FC<FoodCardProps> = ({ entry }) => {
  return (
    <div className="food-card fade-in">
      <div className="food-header">
        <h3 className="food-name">{entry.name}</h3>
        <span className="food-price">{entry.priceRange}</span>
      </div>

      <p className="food-description">{entry.description}</p>

      <div className="food-times">
        {entry.bestTimes.map((time) => (
          <span key={time} className="time-badge">
            {timeManager.formatTimeOfDay(time)}
          </span>
        ))}
      </div>

      <div className="food-section">
        <span className="food-label">📍 Where to find:</span>
        <ul className="food-spots">
          {entry.spots.map((spot, index) => (
            <li key={index} className="food-spot">{spot}</li>
          ))}
        </ul>
      </div>

      {entry.tags && entry.tags.length > 0 && (
        <div className="food-tags">
          {entry.tags.map((tag) => (
            <span key={tag} className="food-tag">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
};
