import React, { useState, useEffect } from 'react';
import { useDebounce } from '../utils/hooks';
import '../styles/SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: string;
  debounceMs?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  icon = '🔍',
  debounceMs = 300
}) => {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, debounceMs);

  // Update parent with debounced value
  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className="search-bar">
      <span className="search-icon" aria-hidden="true">{icon}</span>
      <input
        type="text"
        className="search-input"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
      />
      {localValue && (
        <button
          className="search-clear"
          onClick={() => {
            setLocalValue('');
            onChange('');
          }}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
};
