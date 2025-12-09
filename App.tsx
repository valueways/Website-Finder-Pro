import React, { useState, useMemo } from 'react';
import { LayoutGrid, AlertCircle, CheckCircle2, Globe, ServerCrash } from 'lucide-react';
import { Business, TabView, SearchState } from './types';
import { findBusinesses } from './services/geminiService';
import { SearchBar } from './components/SearchBar';
import { BusinessCard } from './components/BusinessCard';
import { ExportTools } from './components/ExportTools';

const App: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    isLoading: false,
    error: null,
    hasSearched: false,
  });
  const [activeTab, setActiveTab] = useState<TabView>('all');

  const handleSearch = async (query: string) => {
    setSearchState({ query, isLoading: true, error: null, hasSearched: true });
    setBusinesses([]);
    
    try {
      const results = await findBusinesses(query);
      setBusinesses(results);
      setSearchState(prev => ({ ...prev, isLoading: false }));
      // Automatically switch to 'no-website' tab if there are results
      const hasNoWebsite = results.some(b => !b.website);
      if (hasNoWebsite) {
        setActiveTab('no-website');
      } else {
        setActiveTab('all');
      }
    } catch (error) {
      setSearchState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : "An unexpected error occurred." 
      }));
    }
  };

  const filteredBusinesses = useMemo(() => {
    if (activeTab === 'no-website') {
      return businesses.filter(b => !b.website);
    }
    return businesses;
  }, [businesses, activeTab]);

  const noWebsiteCount = useMemo(() => {
    return businesses.filter(b => !b.website).length;
  }, [businesses]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Website Finder Pro</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500 hidden sm:flex">
             <span>Powered by Google Maps & Gemini</span>
          </div>
        </div>
      </header>

      {/* Hero / Search Section */}
      <div className="bg-white border-b border-slate-200 pt-16 pb-12 px-4">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
            Find Local Businesses That Need A Website
          </h2>
          <p className="text-lg text-slate-600">
            Search for any service in any city. We'll identify businesses without a digital presence so you can pitch your services.
          </p>
        </div>
        
        <SearchBar onSearch={handleSearch} isLoading={searchState.isLoading} />
        
        {/* Error Display */}
        {searchState.error && (
          <div className="max-w-2xl mx-auto mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
            <ServerCrash className="w-5 h-5 shrink-0" />
            <p>{searchState.error}</p>
          </div>
        )}
      </div>

      {/* Results Section */}
      {searchState.hasSearched && !searchState.isLoading && businesses.length > 0 && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Stats Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex gap-2">
              <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Total Found</p>
                  <p className="text-xl font-bold text-slate-900">{businesses.length}</p>
                </div>
              </div>
              <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">No Website</p>
                  <p className="text-xl font-bold text-slate-900">{noWebsiteCount}</p>
                </div>
              </div>
            </div>

            {/* Export Actions */}
            {noWebsiteCount > 0 && activeTab === 'no-website' && (
              <ExportTools businesses={filteredBusinesses} />
            )}
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('all')}
                className={`
                  pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                  ${activeTab === 'all'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                `}
              >
                <Globe className="w-4 h-4" />
                All Businesses
                <span className="bg-slate-100 text-slate-600 py-0.5 px-2.5 rounded-full text-xs ml-2">
                  {businesses.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('no-website')}
                className={`
                  pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                  ${activeTab === 'no-website'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                `}
              >
                <AlertCircle className="w-4 h-4" />
                Opportunities (No Website)
                <span className="bg-amber-100 text-amber-800 py-0.5 px-2.5 rounded-full text-xs ml-2">
                  {noWebsiteCount}
                </span>
              </button>
            </nav>
          </div>

          {/* List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>

          {filteredBusinesses.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No results found in this category</h3>
              <p className="text-slate-500 mt-1">Try switching tabs or searching for a different location.</p>
            </div>
          )}
        </main>
      )}

      {/* Empty State / Initial Load */}
      {!searchState.hasSearched && !searchState.isLoading && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm text-center">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">1. Search</h3>
              <p className="text-sm text-slate-500">Enter a business type and location (e.g., "Dentists in Seattle").</p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm text-center">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">2. Filter</h3>
              <p className="text-sm text-slate-500">We automatically identify businesses that are missing a website.</p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm text-center">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">3. Pitch</h3>
              <p className="text-sm text-slate-500">Export the list or generate AI prompts to build their site instantly.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;