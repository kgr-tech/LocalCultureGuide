# Design Document

## Overview

The Local Culture Guide is a client-side web application that provides an interactive interface for exploring local culture, slang, food, traffic patterns, and lifestyle information. The application follows a RAG-like pattern using static data from a markdown knowledge base (product.md), making it highly portable and customizable for different cities without requiring backend infrastructure or API calls.

The architecture emphasizes simplicity, performance, and maintainability through clear separation of concerns: data parsing, search/filtering logic, and UI rendering are handled by distinct modules. The application uses vanilla JavaScript or a lightweight framework (React/Vue) for the frontend, with fuzzy string matching for intelligent search capabilities.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface Layer                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  Slang   │ │  Food    │ │ Traffic  │ │ Culture  │  │
│  │Translator│ │Recommender│ │Estimator │ │   Hub    │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  Application Logic Layer                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │    Search    │  │   Filtering  │  │     Time     │ │
│  │    Engine    │  │    Engine    │  │   Manager    │ │
│  │ (Fuzzy Match)│  │              │  │              │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    Data Access Layer                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │            Knowledge Base Parser                  │  │
│  │         (product.md → Structured Data)            │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
                  ┌──────────────┐
                  │  product.md  │
                  │ (Knowledge   │
                  │    Base)     │
                  └──────────────┘
```

### Component Interaction Flow

1. **Initialization**: Application loads and parses product.md into structured data objects
2. **User Interaction**: User selects a module and enters search/filter criteria
3. **Query Processing**: Search engine applies fuzzy matching and filtering logic
4. **Result Rendering**: UI layer displays formatted results with relevant metadata
5. **Time-Aware Updates**: Time manager adjusts recommendations based on current time

## Components and Interfaces

### 1. Knowledge Base Parser

**Responsibility**: Parse product.md and extract structured data for all modules

**Interface**:
```typescript
interface KnowledgeBaseParser {
  parseFile(content: string): ParsedData;
  validateData(data: ParsedData): ValidationResult;
}

interface ParsedData {
  slang: SlangEntry[];
  food: FoodEntry[];
  traffic: TrafficRoute[];
  culture: CultureEntry[];
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
```

**Key Operations**:
- Read and parse markdown content
- Extract structured sections for each module
- Validate required fields
- Handle malformed data gracefully

### 2. Search Engine

**Responsibility**: Provide fuzzy matching and ranking for user queries

**Interface**:
```typescript
interface SearchEngine {
  search<T>(query: string, items: T[], fields: string[]): SearchResult<T>[];
  setThreshold(threshold: number): void;
}

interface SearchResult<T> {
  item: T;
  score: number;
  matches: FieldMatch[];
}

interface FieldMatch {
  field: string;
  matchedText: string;
}
```

**Key Operations**:
- Fuzzy string matching using Levenshtein distance or similar algorithm
- Multi-field search across item properties
- Result ranking by relevance score
- Case-insensitive matching

### 3. Filtering Engine

**Responsibility**: Apply time-based and category-based filters

**Interface**:
```typescript
interface FilterEngine {
  filterByTime(items: FoodEntry[], timeOfDay: TimeOfDay): FoodEntry[];
  filterByCategory(items: CultureEntry[], category: string): CultureEntry[];
  filterByPeakHours(routes: TrafficRoute[], currentTime: Date): TrafficRoute[];
}

enum TimeOfDay {
  Morning = "morning",
  Afternoon = "afternoon",
  Evening = "evening"
}
```

**Key Operations**:
- Time-based filtering for food recommendations
- Category filtering for culture content
- Peak hour detection and traffic adjustment

### 4. Time Manager

**Responsibility**: Manage time-aware features and peak hour detection

**Interface**:
```typescript
interface TimeManager {
  getCurrentTimeOfDay(): TimeOfDay;
  isPeakHour(time: Date): boolean;
  getPeakHourMultiplier(): number;
}
```

**Key Operations**:
- Determine current time of day (morning/afternoon/evening)
- Detect peak hours (8-10 AM, 5:30-7:30 PM)
- Calculate traffic multipliers for peak hours

### 5. Module Components

Each module (Slang Translator, Food Recommender, Traffic Estimator, Culture Hub) follows a consistent interface:

**Interface**:
```typescript
interface Module<T> {
  search(query: string): SearchResult<T>[];
  filter(criteria: FilterCriteria): T[];
  render(results: T[]): void;
}
```

## Data Models

### SlangEntry
```typescript
interface SlangEntry {
  term: string;
  meaning: string;
  usage: string;
  category: "kannada" | "tech" | "general";
  examples?: string[];
}
```

### FoodEntry
```typescript
interface FoodEntry {
  name: string;
  description: string;
  spots: string[];
  priceRange: string;
  bestTimes: TimeOfDay[];
  category: string;
  tags?: string[];
}
```

### TrafficRoute
```typescript
interface TrafficRoute {
  name: string;
  from: string;
  to: string;
  baseTime: number; // in minutes
  peakTimeMultiplier: number;
  description?: string;
}
```

### CultureEntry
```typescript
interface CultureEntry {
  title: string;
  category: "neighborhood" | "startup" | "festival" | "coffee" | "living";
  description: string;
  details: string[];
  tags?: string[];
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After analyzing all acceptance criteria, several properties were identified as redundant:
- Multiple parsing tests (1.5, 2.5, 3.5, 4.4, 8.1) can be consolidated into a single comprehensive parsing property
- Fuzzy matching tests across modules (1.2, 2.4, 4.5, 6.2) can be unified since the behavior should be consistent
- Display field requirements (2.1, 2.3) are redundant and can be combined
- Data source properties (5.1, 5.2) test the same behavior
- Module data separation (8.2, 8.5) are redundant

The following properties represent the unique, non-redundant correctness guarantees:

### Property 1: Knowledge Base Parsing Completeness
*For any* valid product.md file containing slang, food, traffic, and culture entries, parsing should extract all entries and make them available to their respective modules with no data loss.
**Validates: Requirements 1.5, 2.5, 3.5, 4.4, 8.1, 8.2**

### Property 2: Fuzzy Search Matching
*For any* data entry (slang, food, traffic, or culture) and any partial substring of its searchable fields, the fuzzy search should return that entry in the results.
**Validates: Requirements 1.2, 2.4, 4.5, 6.2**

### Property 3: Search Result Completeness
*For any* search result returned by the system, the result should contain all required fields for its data type (term/meaning/usage for slang, name/description/spots/prices/times for food, name/from/to/time for traffic, title/category/description for culture).
**Validates: Requirements 1.4, 2.1, 3.3, 4.3**

### Property 4: Time-Based Food Filtering
*For any* time of day (morning/afternoon/evening) and any set of food entries, filtering by that time should return only food entries that include that time in their bestTimes array.
**Validates: Requirements 2.2**

### Property 5: Peak Hour Traffic Adjustment
*For any* traffic route and any time within peak hours (8-10 AM or 5:30-7:30 PM), the estimated travel time should be greater than the base time, and a peak hour warning should be displayed.
**Validates: Requirements 3.1, 3.2**

### Property 6: Search Result Ranking
*For any* search query that returns multiple results, the results should be ordered by relevance score in descending order (highest score first).
**Validates: Requirements 6.4**

### Property 7: Case-Insensitive Search
*For any* search query string, searching with different case variations (lowercase, uppercase, mixed case) should return the same set of results.
**Validates: Requirements 6.5**

### Property 8: Data Source Exclusivity
*For any* data displayed in the application, that data should originate from the product.md file, and when product.md is modified, the application should reflect those changes after reloading.
**Validates: Requirements 5.1**

### Property 9: Graceful Error Handling for Malformed Data
*For any* product.md file with missing required fields or formatting errors, the parser should not crash and should log appropriate warnings while loading valid entries.
**Validates: Requirements 5.4, 8.3**

### Property 10: Required Field Validation
*For any* data entry being parsed, if required fields are missing, the validation should flag the entry as invalid and exclude it from the loaded dataset.
**Validates: Requirements 8.4**

## Error Handling

### Parser Errors
- **Missing File**: Display clear error message if product.md cannot be found
- **Malformed Markdown**: Log warnings for unparseable sections, continue with valid data
- **Missing Required Fields**: Skip invalid entries, log warnings with line numbers
- **Invalid Data Types**: Attempt type coercion, fall back to defaults, log warnings

### Search Errors
- **Empty Query**: Return all items or display prompt to enter search term
- **No Results**: Display helpful "No results found" message with suggestions
- **Invalid Characters**: Sanitize input, continue with valid characters

### Time-Based Errors
- **Invalid Time Format**: Fall back to current system time
- **Missing Time Data**: Treat as "all day" availability

### UI Errors
- **Rendering Failures**: Display error boundary with fallback UI
- **Module Load Failures**: Show error message, allow other modules to function

## Testing Strategy

### Unit Testing

Unit tests will verify specific examples and integration points:

1. **Parser Unit Tests**:
   - Test parsing of well-formed product.md with known entries
   - Test handling of empty file
   - Test handling of file with only one module's data

2. **Search Engine Unit Tests**:
   - Test exact match returns correct item
   - Test empty query behavior
   - Test special character handling

3. **Time Manager Unit Tests**:
   - Test peak hour detection at boundary times (8:00 AM, 10:00 AM, 5:30 PM, 7:30 PM)
   - Test time of day classification at boundaries (morning/afternoon/evening transitions)

4. **Filter Engine Unit Tests**:
   - Test filtering empty array returns empty array
   - Test filtering with no matches returns empty array

### Property-Based Testing

Property-based tests will verify universal properties across all inputs using **fast-check** (for JavaScript/TypeScript). Each test will run a minimum of 100 iterations.

1. **Property 1: Knowledge Base Parsing Completeness**
   - Generate random product.md content with varying numbers of entries
   - Parse and verify all entries are extracted
   - Tag: **Feature: local-culture-guide, Property 1: Knowledge Base Parsing Completeness**

2. **Property 2: Fuzzy Search Matching**
   - Generate random data entries
   - Create partial queries from entry fields
   - Verify entries are found in search results
   - Tag: **Feature: local-culture-guide, Property 2: Fuzzy Search Matching**

3. **Property 3: Search Result Completeness**
   - Generate random search results
   - Verify all required fields are present in rendered output
   - Tag: **Feature: local-culture-guide, Property 3: Search Result Completeness**

4. **Property 4: Time-Based Food Filtering**
   - Generate random food entries with various time assignments
   - Filter by each time of day
   - Verify only matching entries are returned
   - Tag: **Feature: local-culture-guide, Property 4: Time-Based Food Filtering**

5. **Property 5: Peak Hour Traffic Adjustment**
   - Generate random traffic routes
   - Test with times inside and outside peak hours
   - Verify time adjustments and warnings
   - Tag: **Feature: local-culture-guide, Property 5: Peak Hour Traffic Adjustment**

6. **Property 6: Search Result Ranking**
   - Generate random search queries and data
   - Verify results are sorted by score descending
   - Tag: **Feature: local-culture-guide, Property 6: Search Result Ranking**

7. **Property 7: Case-Insensitive Search**
   - Generate random queries with different case variations
   - Verify identical result sets
   - Tag: **Feature: local-culture-guide, Property 7: Case-Insensitive Search**

8. **Property 8: Data Source Exclusivity**
   - Generate random product.md content
   - Parse and verify all displayed data matches source
   - Tag: **Feature: local-culture-guide, Property 8: Data Source Exclusivity**

9. **Property 9: Graceful Error Handling for Malformed Data**
   - Generate product.md with random formatting errors
   - Verify parser doesn't crash and logs warnings
   - Tag: **Feature: local-culture-guide, Property 9: Graceful Error Handling for Malformed Data**

10. **Property 10: Required Field Validation**
    - Generate data entries with randomly missing required fields
    - Verify validation catches and excludes invalid entries
    - Tag: **Feature: local-culture-guide, Property 10: Required Field Validation**

### Integration Testing

Integration tests will verify end-to-end workflows:

1. **Full Application Flow**: Load app → Parse data → Search → Display results
2. **Module Switching**: Navigate between all four modules without errors
3. **Time-Based Updates**: Verify food and traffic recommendations update based on time changes

### Test Configuration

- **Framework**: Jest for unit tests, fast-check for property-based tests
- **Coverage Target**: 80% code coverage minimum
- **Property Test Iterations**: 100 minimum per property test
- **CI Integration**: All tests run on every commit

## Implementation Notes

### Technology Stack Recommendations

- **Frontend Framework**: React or Vue.js for component-based architecture
- **Fuzzy Matching Library**: fuse.js or fuzzy-search for efficient fuzzy string matching
- **Property Testing**: fast-check for JavaScript/TypeScript property-based testing
- **Build Tool**: Vite or Webpack for fast development and optimized builds
- **Testing**: Jest + React Testing Library + fast-check

### Performance Considerations

- **Lazy Loading**: Load product.md asynchronously to avoid blocking initial render
- **Memoization**: Cache parsed data and search results to avoid redundant processing
- **Debouncing**: Debounce search input to reduce unnecessary searches
- **Virtual Scrolling**: Implement for large result sets (100+ items)

### Extensibility

The design supports easy extension for:
- **New Modules**: Add new module types by extending the Module interface
- **New Cities**: Simply replace product.md with new city data
- **New Languages**: Add language field to data models and filter by language
- **Backend Integration**: Replace file parsing with API calls without changing module logic

### Accessibility

- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliance for text and interactive elements
- **Focus Management**: Clear focus indicators and logical tab order
