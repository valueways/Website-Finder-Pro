import React from 'react';
import { Download } from 'lucide-react';
import { Business } from '../types';

interface ExportToolsProps {
  businesses: Business[];
}

export const ExportTools: React.FC<ExportToolsProps> = ({ businesses }) => {
  const exportToCSV = () => {
    const headers = ['Name', 'Category', 'Phone', 'Email', 'Address', 'Rating', 'Reviews', 'Instagram', 'Facebook'];
    const csvContent = [
      headers.join(','),
      ...businesses.map(b => [
        `"${b.name}"`,
        `"${b.category}"`,
        `"${b.phoneNumber || ''}"`,
        `"${b.email || ''}"`,
        `"${b.address}"`,
        b.rating || '',
        b.reviewCount || '',
        `"${b.socialMedia?.instagram || ''}"`,
        `"${b.socialMedia?.facebook || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'no-website-leads.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(businesses, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', 'no-website-leads.json');
    link.click();
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={exportToCSV}
        className="flex items-center px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
      >
        <Download className="w-4 h-4 mr-2" />
        Export CSV
      </button>
      <button
        onClick={exportToJSON}
        className="flex items-center px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
      >
        <Download className="w-4 h-4 mr-2" />
        Export JSON
      </button>
    </div>
  );
};