import React, { useState } from 'react';
import { MapPin, Phone, Globe, Star, Copy, Check, Terminal, AlertCircle } from 'lucide-react';
import { Business } from '../types';
import { generateLeadPrompt } from '../services/geminiService';

interface BusinessCardProps {
  business: Business;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  const hasWebsite = !!business.website;
  const [showPrompt, setShowPrompt] = useState(false);
  const [copied, setCopied] = useState(false);

  const promptText = generateLeadPrompt(business);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${hasWebsite ? 'border-slate-100' : 'border-amber-200 ring-1 ring-amber-50'} p-6 transition-all hover:shadow-md`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-slate-900">{business.name}</h3>
            {!hasWebsite && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                <AlertCircle className="w-3 h-3 mr-1" />
                No Website
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 font-medium">{business.category}</p>
        </div>
        {business.rating && (
          <div className="flex items-center bg-slate-50 px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
            <span className="font-bold text-slate-700">{business.rating}</span>
            <span className="text-slate-400 text-sm ml-1">({business.reviewCount})</span>
          </div>
        )}
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-start text-slate-600">
          <MapPin className="w-5 h-5 mr-3 text-slate-400 shrink-0 mt-0.5" />
          <span className="text-sm">{business.address}</span>
        </div>
        
        <div className="flex items-center text-slate-600">
          <Phone className="w-5 h-5 mr-3 text-slate-400 shrink-0" />
          {business.phoneNumber ? (
             <a href={`tel:${business.phoneNumber}`} className="text-sm hover:text-blue-600 transition-colors">
               {business.phoneNumber}
             </a>
          ) : (
            <span className="text-sm text-slate-400 italic">No phone number</span>
          )}
        </div>

        <div className="flex items-center text-slate-600">
          <Globe className="w-5 h-5 mr-3 text-slate-400 shrink-0" />
          {hasWebsite ? (
            <a 
              href={business.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-blue-600 hover:underline truncate max-w-xs"
            >
              {business.website}
            </a>
          ) : (
            <span className="text-sm text-amber-600 font-medium">Opportunity: Pitch a website!</span>
          )}
        </div>
      </div>

      {!hasWebsite && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <button 
            onClick={() => setShowPrompt(!showPrompt)}
            className="flex items-center justify-center w-full py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors mb-2"
          >
            <Terminal className="w-4 h-4 mr-2" />
            {showPrompt ? 'Hide Prompt' : 'Generate AI Builder Prompt'}
          </button>
          
          {showPrompt && (
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Prompt (for V0, Lovable, etc.)</span>
                <button 
                  onClick={handleCopy}
                  className="text-slate-500 hover:text-blue-600 transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-sm text-slate-700 font-mono bg-white p-2 rounded border border-slate-200 break-words whitespace-pre-wrap">
                {promptText}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};