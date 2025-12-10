import React, { useState } from 'react';
import { Search, Loader2, Clock, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  history?: string[];
  onHistorySelect?: (query: string) => void;
  onClearHistory?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  isLoading, 
  history = [], 
  onHistorySelect,
  onClearHistory
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input);
    }
  };

  const handleHistoryClick = (item: string) => {
    setInput(item);
    if (onHistorySelect) {
      onHistorySelect(item);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-slate-400" />
          )}
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-lg transition-all"
          placeholder="Ex: Plumbers in Brooklyn, Coffee shops in Austin..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-2.5 top-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {history.length > 0 && (
        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between mb-2">
             <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
               <Clock className="w-3 h-3" /> Recent Searches
             </span>
             {onClearHistory && (
               <button 
                 onClick={onClearHistory}
                 className="text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
               >
                 <X className="w-3 h-3" /> Clear
               </button>
             )}
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map((item, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(item)}
                disabled={isLoading}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};