# Bangalore Local Culture Guide

An interactive web application that helps users explore and understand Bangalore's local culture, slang, street food, traffic patterns, and lifestyle. The app learns from a custom knowledge base (product.md) and provides intelligent search, filtering, and recommendations.

## ✨ Features

### 4 Interactive Modules

- **🗣️ Slang Translator** - Understand Bangalore's Kannada slang & tech terminology
  - Fuzzy search for intuitive queries
  - Category-based organization (Kannada, Tech, General)
  - Usage examples and context

- **🍜 Street Food Recommender** - Discover authentic street foods
  - Time-aware filtering (Morning, Afternoon, Evening)
  - Location spots with prices
  - Best times to visit

- **🚗 Traffic Estimator** - Real-time traffic predictions
  - Peak hour detection (8-10 AM, 5:30-7:30 PM)
  - Dynamic travel time calculations
  - Route-specific multipliers

- **🌆 Local Culture Hub** - Explore neighborhoods, startups, festivals & more
  - Category filtering (Neighborhoods, Startups, Festivals, Coffee, Living)
  - Expandable details
  - Comprehensive cultural information

### Smart Features

- 🔍 **Fuzzy Search** - Find results even with partial or misspelled queries
- ⏰ **Time-Aware** - Recommendations adapt to current time of day
- 📱 **Responsive Design** - Works beautifully on mobile, tablet, and desktop
- 🌙 **Dark Mode** - Automatic dark mode support
- ♿ **Accessible** - WCAG AA compliant with keyboard navigation
- 🎨 **Modern UI** - Clean, professional design with smooth animations
- 🚀 **Fast Performance** - Debounced search, memoization, optimized rendering

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
```

The app will be available at `http://localhost:5173`

## 🎯 Customization

### Adapt for Any City

To customize this guide for a different city (Mumbai, Delhi, etc.):

1. Edit `public/product.md` with your city's data
2. Follow the existing markdown structure for each module
3. Reload the app - no code changes needed!

### Data Structure

The `product.md` file uses a simple markdown format:

```markdown
## Slang Translator
### Term Name
- **Category**: kannada | tech | general
- **Meaning**: Definition
- **Usage**: Example usage
- **Example**: Context example

## Street Food Recommender
### Food Name
- **Description**: Description
- **Spots**: Location 1, Location 2
- **Price Range**: ₹XX-YY
- **Best Times**: Morning, Afternoon, Evening
- **Category**: Category name
- **Tags**: Tag1, Tag2

## Traffic Estimator
### Route Name
- **From**: Starting point
- **To**: Destination
- **Base Time**: XX minutes
- **Peak Time Multiplier**: X.X
- **Description**: Route description

## Local Culture Hub
### Entry Title
- **Category**: neighborhood | startup | festival | coffee | living
- **Description**: Description
- **Details**:
  - Detail 1
  - Detail 2
- **Tags**: Tag1, Tag2
```

## 🛠️ Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Fuse.js** - Fuzzy search algorithm
- **CSS Custom Properties** - Theming & design system
- **Jest + fast-check** - Testing (unit & property-based)

## 📁 Project Structure

```
├── public/
│   └── product.md          # Knowledge base (customize this!)
├── src/
│   ├── components/         # React components
│   │   ├── SlangTranslator.tsx
│   │   ├── FoodRecommender.tsx
│   │   ├── TrafficEstimator.tsx
│   │   ├── CultureHub.tsx
│   │   ├── SearchBar.tsx
│   │   ├── EmptyState.tsx
│   │   └── ErrorBoundary.tsx
│   ├── services/           # Business logic
│   │   ├── parser.ts       # Markdown parser
│   │   ├── search.ts       # Fuzzy search engine
│   │   ├── filter.ts       # Filtering logic
│   │   └── timeManager.ts  # Time-based features
│   ├── models/             # TypeScript interfaces
│   │   └── types.ts
│   ├── utils/              # Helper functions
│   │   └── hooks.ts        # Custom React hooks
│   ├── styles/             # CSS files
│   │   ├── global.css      # Design system
│   │   └── *.css           # Component styles
│   ├── tests/              # Test files
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎨 Design System

The app uses a comprehensive CSS design system with:

- **Color Palette** - Primary, secondary, accent colors
- **Typography** - Inter font with responsive sizing
- **Spacing** - Consistent spacing scale
- **Shadows** - Elevation system
- **Border Radius** - Rounded corners
- **Transitions** - Smooth animations
- **Dark Mode** - Automatic theme switching

All design tokens are defined in `src/styles/global.css` as CSS custom properties.

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Screen reader friendly
- Color contrast compliance (WCAG AA)

## 🧪 Testing

The project includes:

- **Unit Tests** - Test specific functionality
- **Property-Based Tests** - Test universal properties with fast-check
- **Integration Tests** - Test end-to-end workflows

Run tests with:
```bash
npm test
```

## 📝 License

MIT

## 🤝 Contributing

This is a template project. Feel free to fork and customize for your city!

## 💡 Use Cases

- **City Guides** - Create guides for any city
- **Cultural Education** - Help newcomers understand local culture
- **Tourism** - Provide authentic local experiences
- **Language Learning** - Learn local slang and terminology
- **Urban Planning** - Understand traffic patterns
- **Community Building** - Share local knowledge

## 🌟 Features Roadmap

Potential enhancements:
- Multi-language support
- User contributions
- Favorites/bookmarks
- Share functionality
- Map integration
- Photos and media
- User reviews
- Backend API integration

---

Built with ❤️ for Bangalore | Powered by React + TypeScript + Vite
