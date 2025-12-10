import React, { useState } from 'react';
import { 
  MapPin, Phone, Globe, Star, Copy, Check, Terminal, AlertCircle,
  Mail, Instagram, Facebook, Linkedin, Twitter, MessageSquare
} from 'lucide-react';
import { Business } from '../types';
import { generateLeadPrompt, generateOutreachMessage } from '../services/geminiService';

interface BusinessCardProps {
  business: Business;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  const hasWebsite = !!business.website;
  const [activeTool, setActiveTool] = useState<'none' | 'prompt' | 'outreach'>('none');
  const [copied, setCopied] = useState(false);

  const promptText = generateLeadPrompt(business);
  const outreachText = generateOutreachMessage(business);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialIconClass = "w-4 h-4 text-slate-400 hover:text-blue-600 transition-colors";

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${hasWebsite ? 'border-slate-100' : 'border-amber-200 ring-1 ring-amber-50'} p-6 transition-all hover:shadow-md flex flex-col h-full`}>
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

      <div className="space-y-3 mb-6 flex-grow">
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

        {/* Contact & Socials */}
        {(business.email || (business.socialMedia && Object.values(business.socialMedia).some(v => v))) && (
          <div className="pt-3 border-t border-slate-100 mt-2">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Contact & Socials</p>
            <div className="flex flex-wrap gap-3 items-center">
              {business.email && (
                <a href={`mailto:${business.email}`} title="Email" className="flex items-center text-sm text-slate-600 hover:text-blue-600">
                  <Mail className="w-4 h-4 mr-1.5" />
                  <span className="truncate max-w-[150px]">{business.email}</span>
                </a>
              )}
              
              {business.socialMedia?.instagram && (
                <a href={business.socialMedia.instagram} target="_blank" rel="noopener noreferrer" title="Instagram">
                  <Instagram className={socialIconClass} />
                </a>
              )}
              {business.socialMedia?.facebook && (
                <a href={business.socialMedia.facebook} target="_blank" rel="noopener noreferrer" title="Facebook">
                  <Facebook className={socialIconClass} />
                </a>
              )}
              {business.socialMedia?.twitter && (
                <a href={business.socialMedia.twitter} target="_blank" rel="noopener noreferrer" title="Twitter/X">
                  <Twitter className={socialIconClass} />
                </a>
              )}
              {business.socialMedia?.linkedin && (
                <a href={business.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                  <Linkedin className={socialIconClass} />
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {!hasWebsite && (
        <div className="mt-auto pt-4 border-t border-slate-100">
          <div className="flex gap-2 mb-3">
             <button 
              onClick={() => setActiveTool(activeTool === 'prompt' ? 'none' : 'prompt')}
              className={`flex-1 flex items-center justify-center py-2 px-3 text-xs font-medium rounded-lg transition-colors ${activeTool === 'prompt' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              <Terminal className="w-3.5 h-3.5 mr-2" />
              Build Prompt
            </button>
            <button 
              onClick={() => setActiveTool(activeTool === 'outreach' ? 'none' : 'outreach')}
              className={`flex-1 flex items-center justify-center py-2 px-3 text-xs font-medium rounded-lg transition-colors ${activeTool === 'outreach' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
            >
              <MessageSquare className="w-3.5 h-3.5 mr-2" />
              Outreach Msg
            </button>
          </div>
          
          {activeTool !== 'none' && (
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {activeTool === 'prompt' ? 'AI Builder Prompt' : 'Persuasive Message'}
                </span>
                <button 
                  onClick={() => handleCopy(activeTool === 'prompt' ? promptText : outreachText)}
                  className="text-slate-500 hover:text-blue-600 transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-700 font-mono bg-white p-2 rounded border border-slate-200 break-words whitespace-pre-wrap max-h-48 overflow-y-auto">
                {activeTool === 'prompt' ? promptText : outreachText}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};