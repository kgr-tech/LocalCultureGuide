import { useState, useEffect } from 'react';
import { ParsedData, ModuleType } from './models/types';
import { parser } from './services/parser';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeToggle } from './components/ThemeToggle';
import { ParticleBackground } from './components/ParticleBackground';
import { SlangTranslator } from './components/SlangTranslator';
import { FoodRecommender } from './components/FoodRecommender';
import { TrafficEstimator } from './components/TrafficEstimator';
import { CultureHub } from './components/CultureHub';
import './styles/App.css';

function App() {
  const [data, setData] = useState<ParsedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<ModuleType>('slang');

  // Load knowledge base on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const parsedData = await parser.loadKnowledgeBase();
      setData(parsedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load knowledge base');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const modules = [
    { id: 'slang' as ModuleType, name: 'Slang Translator', icon: '🗣️' },
    { id: 'food' as ModuleType, name: 'Street Food', icon: '🍜' },
    { id: 'traffic' as ModuleType, name: 'Traffic', icon: '🚗' },
    { id: 'culture' as ModuleType, name: 'Culture Hub', icon: '🌆' }
  ];

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading Bangalore Culture Guide...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-error">
        <div className="error-icon">⚠️</div>
        <h2>Failed to Load</h2>
        <p>{error}</p>
        <button onClick={loadData} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="app-error">
        <div className="error-icon">📭</div>
        <h2>No Data Available</h2>
        <p>The knowledge base appears to be empty.</p>
      </div>
    );
  }

  return (
    <div className="app">
      <ParticleBackground />
      
      <header className="app-header">
        <div className="header-content">
          <div className="header-top">
            <h1 className="app-title">
              <span className="title-icon float">🏙️</span>
              Bangalore Local Culture Guide
            </h1>
            <ThemeToggle />
          </div>
          <p className="app-subtitle">
            Your interactive guide to Bangalore's culture, food, and lifestyle
          </p>
        </div>
      </header>

      <nav className="app-nav">
        <div className="nav-content">
          {modules.map((module) => (
            <button
              key={module.id}
              className={`nav-button ${activeModule === module.id ? 'active' : ''}`}
              onClick={() => setActiveModule(module.id)}
              aria-current={activeModule === module.id ? 'page' : undefined}
            >
              <span className="nav-icon">{module.icon}</span>
              <span className="nav-label">{module.name}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="app-main">
        <ErrorBoundary>
          {activeModule === 'slang' && <SlangTranslator slangData={data.slang} />}
          {activeModule === 'food' && <FoodRecommender foodData={data.food} />}
          {activeModule === 'traffic' && <TrafficEstimator trafficData={data.traffic} />}
          {activeModule === 'culture' && <CultureHub cultureData={data.culture} />}
        </ErrorBoundary>
      </main>

      <footer className="app-footer">
        <p>
          Built with ❤️ for Bangalore | Customize for any city by editing{' '}
          <code>product.md</code>
        </p>
      </footer>
    </div>
  );
}

export default App;
