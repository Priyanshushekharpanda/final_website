import React from 'react';
import { Briefcase } from 'lucide-react';

export default function CompanyProfile() {
  return (
    <>
      <header className="px-8 pt-6 pb-4 bg-white/70 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-slate-900">Company Profile</h1>
        <p className="text-slate-600 mt-1">Manage your company or organization details</p>
      </header>
      <div className="p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200/80 p-8 text-center">
          <Briefcase className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <h2 className="text-lg font-semibold text-slate-700 mb-2">Company Profile</h2>
          <p className="text-slate-500 text-sm">Add company name, logo, description, and team details here.</p>
        </div>
      </div>
    </>
  );
}
