import React, { useState, useMemo, useEffect } from 'react';
import { TrafficRoute } from '../models/types';
import { searchEngine } from '../services/search';
import { timeManager } from '../services/timeManager';
import { SearchBar } from './SearchBar';
import { EmptyState } from './EmptyState';
import '../styles/TrafficEstimator.css';

interface TrafficEstimatorProps {
  trafficData: TrafficRoute[];
}

export const TrafficEstimator: React.FC<TrafficEstimatorProps> = ({ trafficData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const peakWarning = timeManager.getPeakHourWarning(currentTime);

  // Perform search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return trafficData.map(item => ({ item, score: 1 }));
    }

    const results = searchEngine.search(
      searchQuery,
      trafficData,
      ['name', 'from', 'to']
    );

    return searchEngine.sortByScore(results);
  }, [searchQuery, trafficData]);

  return (
    <div className="traffic-estimator">
      <div className="module-header">
        <h2 className="module-title">🚗 Traffic Estimator</h2>
        <p className="module-description">
          Real-time traffic predictions based on routes & time of day
        </p>
      </div>

      {peakWarning && (
        <div className="peak-warning">
          {peakWarning}
        </div>
      )}

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search routes... (e.g., 'Whitefield', 'Koramangala')"
        icon="🔍"
      />

      {searchResults.length === 0 ? (
        <EmptyState
          icon="🗺️"
          title="No routes found"
          message={`No routes match "${searchQuery}". Try searching for a different location.`}
        />
      ) : (
        <div className="traffic-grid">
          {searchResults.map(({ item }) => (
            <TrafficCard key={item.name} route={item} currentTime={currentTime} />
          ))}
        </div>
      )}
    </div>
  );
};

interface TrafficCardProps {
  route: TrafficRoute;
  currentTime: Date;
}

const TrafficCard: React.FC<TrafficCardProps> = ({ route, currentTime }) => {
  const isPeak = timeManager.isPeakHour(currentTime);
  const estimatedTime = timeManager.calculateTravelTime(
    route.baseTime,
    route.peakTimeMultiplier,
    currentTime
  );
  const multiplier = isPeak ? route.peakTimeMultiplier : 1.0;

  return (
    <div className={`traffic-card fade-in ${isPeak ? 'peak-hour' : ''}`}>
      <div className="traffic-header">
        <h3 className="traffic-route">{route.name}</h3>
        {isPeak && (
          <span className="peak-badge">Peak Hour</span>
        )}
      </div>

      <div className="traffic-route-info">
        <div className="route-point">
          <span className="route-icon">📍</span>
          <span className="route-label">From:</span>
          <span className="route-value">{route.from}</span>
        </div>
        <div className="route-arrow">→</div>
        <div className="route-point">
          <span className="route-icon">🎯</span>
          <span className="route-label">To:</span>
          <span className="route-value">{route.to}</span>
        </div>
      </div>

      <div className="traffic-time">
        <div className="time-display">
          <span className="time-value">{estimatedTime}</span>
          <span className="time-unit">minutes</span>
        </div>
        {isPeak && (
          <div className="time-comparison">
            <span className="base-time">Base: {route.baseTime} min</span>
            <span className="multiplier">×{multiplier.toFixed(1)}</span>
          </div>
        )}
      </div>

      {route.description && (
        <p className="traffic-description">{route.description}</p>
      )}

      <div className="traffic-status">
        <div className={`status-indicator ${isPeak ? 'heavy' : 'normal'}`}>
          <span className="status-dot"></span>
          <span className="status-text">
            {isPeak ? 'Heavy Traffic' : 'Normal Traffic'}
          </span>
        </div>
      </div>
    </div>
  );
};
