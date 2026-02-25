import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Briefcase, User, ChevronLeft, ChevronRight, Clock, Menu, X } from 'lucide-react';
import { useMentor } from '../context/MentorContext';

export default function Layout() {
  const { mentor, profileImageUrl } = useMentor();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Grouping navigation to match the structured look of the reference image
  const navItems = [
    { to: '/profile', icon: User, label: 'My Profile' },
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/sessions', icon: Calendar, label: 'Sessions' },
    { to: '/availability', icon: Clock, label: 'Availability' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200/60 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.01)] transition-all duration-300 ease-in-out
        ${isCollapsed ? 'md:w-[80px]' : 'md:w-[260px]'}
        ${isMobileMenuOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full md:translate-x-0'}
      `}>

        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-9 bg-white border border-slate-200 rounded-full p-1 shadow-sm hover:bg-slate-50 text-slate-500 z-50 hidden md:flex"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 md:hidden"
        >
          <X size={20} />
        </button>

        {/* Custom Logo Area */}
        <div className={`px-6 py-7 flex items-end gap-0 ${isCollapsed ? 'justify-center px-2' : ''}`}>
          {/* Recreated "M" People Icon in purely scalable SVG */}
          <svg
            viewBox="0 0 54 60"
            className="w-[36px] h-[40px] shrink-0"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="logo-grad" x1="0" y1="0" x2="54" y2="60" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#27272a" /> {/* Dark grey/black */}
                <stop offset="100%" stopColor="#a1a1aa" /> {/* Light grey */}
              </linearGradient>
            </defs>

            {/* Left Figure Head */}
            <circle cx="12" cy="10" r="6.5" fill="url(#logo-grad)" />
            {/* Right Figure Head */}
            <circle cx="42" cy="21" r="5" fill="url(#logo-grad)" />

            {/* Vertical Bodies/Legs */}
            <g fill="url(#logo-grad)">
              {/* Left Body */}
              <path d="M 5 24 C 5 18 19 18 19 24 L 19 60 L 5 60 Z" />
              {/* Right Body */}
              <path d="M 37 34 C 37 28 47 28 47 34 L 47 60 L 37 60 Z" />
            </g>

            {/* Connecting Arms / Middle 'V' of the M */}
            <g stroke="url(#logo-grad)" strokeLinecap="round">
              {/* Left Arm reaching down */}
              <path d="M 12 24 L 27 45" strokeWidth="11" />
              {/* Right Arm reaching down */}
              <path d="M 42 34 L 27 45" strokeWidth="9" />
            </g>
          </svg>

          {/* Typography perfectly aligned to the baseline of the SVG */}
          {!isCollapsed && (
            <span className="text-[26px] font-bold tracking-tight leading-none mb-[2px] -ml-1">
              <span className="text-slate-900">ento</span>
              <span className="text-[oklch(0.546_0.245_262.24)]">Mania</span>
            </span>
          )}
        </div>

        {/* Mini User Profile Snippet */}
        <div className={`px-5 pb-6 ${isCollapsed ? 'px-2' : ''}`}>
          <div
            onClick={() => navigate('/profile')}
            className={`flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md cursor-pointer ${isCollapsed ? 'justify-center border-transparent shadow-none hover:bg-slate-100' : ''}`}
          >
            <div className="w-9 h-9 rounded-full bg-[oklch(0.96_0.03_262.24)] overflow-hidden shrink-0">
              <img
                src={profileImageUrl || "https://ui-avatars.com/api/?name=User&background=eef2ff&color=4f46e5"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden flex-1">
                <h3 className="text-sm font-semibold text-slate-800 truncate">{mentor?.name || 'User'}</h3>
                <p className="text-xs text-slate-500 truncate">{mentor?.title || 'Mentor'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-6">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsMobileMenuOpen(false)}
              title={isCollapsed ? label : ''}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                  ? 'bg-[oklch(0.96_0.03_262.24)]/80 text-[oklch(0.546_0.245_262.24)]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                } ${isCollapsed ? 'justify-center' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-5 h-5 ${isActive ? 'text-[oklch(0.546_0.245_262.24)]' : 'text-slate-400'}`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {!isCollapsed && label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'md:ml-[80px]' : 'md:ml-[260px]'} min-h-screen flex flex-col`}>
        {/* Mobile Header */}
        <header className="h-16 flex items-center justify-between px-6 md:hidden bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
          <div className="flex items-end gap-0">
            <span className="text-xl font-bold text-slate-900 leading-none">ento</span>
            <span className="text-xl font-bold text-[oklch(0.546_0.245_262.24)] leading-none">Mania</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -mr-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}