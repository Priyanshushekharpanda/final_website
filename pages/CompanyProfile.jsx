import React, { useState } from 'react';
import { Briefcase, Globe, MapPin, Users, Building, Save, Check } from 'lucide-react';
import FadeIn from '../components/FadeIn';

export default function CompanyProfile() {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
      <header className="px-8 pt-6 pb-4 bg-white/70 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-slate-900">Company Profile</h1>
        <p className="text-slate-600 mt-1">Manage your company or organization details</p>
      </header>

      <div className="p-8 max-w-4xl mx-auto">
        <FadeIn delay={0.1}>
          <form onSubmit={handleSave} className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-8">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-300 text-slate-400 hover:bg-slate-50 hover:border-blue-400 hover:text-blue-500 transition-all cursor-pointer">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Company Logo</h3>
                <p className="text-sm text-slate-500">Upload your organization's logo (JPG, PNG)</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-400" /> Company Name
                </label>
                <input type="text" placeholder="e.g. Acme Corp" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-400" /> Website
                </label>
                <input type="url" placeholder="https://acme.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" /> Company Size
                </label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                  <option>1-10 employees</option>
                  <option>11-50 employees</option>
                  <option>51-200 employees</option>
                  <option>201-500 employees</option>
                  <option>500+ employees</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" /> Headquarters
                </label>
                <input type="text" placeholder="e.g. San Francisco, CA" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-2 mb-8">
              <label className="text-sm font-bold text-slate-700">About the Company</label>
              <textarea rows="4" placeholder="Tell us about your company's mission and culture..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"></textarea>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSaving || saved}
                className={`
                  flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all active:scale-95
                  ${saved ? 'bg-green-500 hover:bg-green-600' : 'bg-slate-900 hover:bg-blue-600'}
                  ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}
                `}
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : saved ? (
                  <>
                    <Check className="w-5 h-5" /> Saved
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" /> Save Details
                  </>
                )}
              </button>
            </div>
          </form>
        </FadeIn>
      </div>
    </div>
  );
}
