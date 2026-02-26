import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Calendar,
  IndianRupee,
  Users,
  Clock,
  ArrowUpRight,
  MoreVertical,
  Wallet
} from 'lucide-react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useMentor } from '../context/MentorContext';
import FadeIn from '../components/FadeIn';

// Mock data
const earningData = [
  { name: 'Jan', earnings: 1200 },
  { name: 'Feb', earnings: 1900 },
  { name: 'Mar', earnings: 1500 },
  { name: 'Apr', earnings: 2200 },
  { name: 'May', earnings: 2800 },
  { name: 'Jun', earnings: 3400 },
];

const upcomingSessions = [
  { id: 1, student: 'Sarah Jenkins', time: 'Today, 2:00 PM', topic: 'React Performance Tuning' },
  { id: 2, student: 'Marcus Cole', time: 'Tomorrow, 10:00 AM', topic: 'System Design Interview' },
  { id: 3, student: 'Elena Rodriguez', time: 'Thu, 4:30 PM', topic: 'Resume Review' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xl border border-slate-800">
        <p className="text-sm font-medium text-slate-400 mb-1">{label}</p>
        <p className="text-2xl font-bold">₹{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { mentor } = useMentor();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [chartVisible, setChartVisible] = useState(false);

  // Fallback values
  const totalEarnings = mentor?.totalEarnings || "13,000";
  const walletBalance = mentor?.walletBalance || "2,850.00";
  const activeStudents = mentor?.activeStudents || 24;

  const showNotification = (id, message) => {
    setNotification({ id, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleShareProfile = () => {
    const url = `${window.location.origin}/profile/preview`;
    navigator.clipboard.writeText(url).then(() => {
      showNotification('share', 'Link copied to clipboard!');
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-10">
        <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-6 max-w-[1800px] mx-auto flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-slate-500 mt-1 font-medium">Welcome back, {mentor?.name}! Here is your latest activity.</p>
          </div>
          <button
            onClick={handleShareProfile}
            className="relative bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-blue-200"
          >
            Share Profile
            {notification?.id === 'share' && (
              <div className="absolute top-full right-0 mt-2 w-max bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xl z-50 animate-in fade-in slide-in-from-top-1">
                {notification.message}
                <div className="absolute -top-1 right-3 w-2 h-2 bg-slate-900 rotate-45"></div>
              </div>
            )}
          </button>
        </div>
      </header>

      <div className="p-4 sm:p-8 max-w-[1800px] mx-auto space-y-6 sm:space-y-8">

        {/* Top Stats Row */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {/* Wallet Card */}
          <FadeIn delay={0.05}>
            <div className="bg-gradient-to-br from-yellow-500 via-amber-500 to-yellow-600 rounded-3xl shadow-lg border border-yellow-400/50 p-6 hover:shadow-2xl hover:shadow-yellow-500/30 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
              {/* Shine Effect */}
              <div className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 z-0 pointer-events-none" />

              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wallet className="w-24 h-24 text-white mix-blend-overlay" />
              </div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/10 shadow-inner">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm font-bold text-amber-100 uppercase tracking-wider relative z-10">Wallet Balance</p>
              <p className="text-3xl font-black text-white mt-1 relative z-10 drop-shadow-sm">₹{walletBalance}</p>
            </div>
          </FadeIn>

          {/* Earnings Card */}
          <FadeIn delay={0.1}>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200/50 transition-all duration-300 relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-emerald-600" />
                </div>
                <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +14%
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Earnings</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">₹{totalEarnings}</p>
            </div>
          </FadeIn>

          {/* Sessions Card */}
          <FadeIn delay={0.2}>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200/50 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Completed Sessions</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{mentor?.sessionsCompleted || 0}</p>
            </div>
          </FadeIn>

          {/* Active Students Card */}
          <FadeIn delay={0.3}>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200/50 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="h-12 w-12 rounded-2xl bg-violet-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-violet-600" />
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Students</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{activeStudents}</p>
            </div>
          </FadeIn>

          {/* Rating & Response Card */}
          <FadeIn delay={0.4}>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200/50 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Average Rating</p>
              <div className="flex items-end gap-2 mt-1">
                <p className="text-3xl font-bold text-slate-900">{mentor?.rating || "0.0"}</p>
                <p className="text-sm text-slate-500 mb-1 border-l border-slate-200 pl-2 ml-1">
                  {mentor?.responseTime || "2h"} avg response
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Main Content Split */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Chart Section */}
          <FadeIn delay={0.5} className="lg:col-span-2" onComplete={() => setChartVisible(true)}>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 sm:p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Revenue Overview</h2>
                  <p className="text-sm text-slate-500 mt-1">Your earnings over the last 6 months</p>
                </div>
                <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none font-medium">
                  <option>Last 6 months</option>
                  <option>This Year</option>
                  <option>All Time</option>
                </select>
              </div>
              <div className="h-[300px] w-full">
                {chartVisible && (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={earningData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                      <defs>
                        {/* 1. Main Line Gradient: Blue -> Purple -> Pink */}
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />   {/* Blue */}
                          <stop offset="50%" stopColor="#8b5cf6" stopOpacity={1} />   {/* Purple */}
                          <stop offset="100%" stopColor="#ec4899" stopOpacity={1} />  {/* Pink */}
                        </linearGradient>

                        {/* 2. Area Fill Gradient: Soft purple to transparent */}
                        <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>

                        {/* 3. Shadow for the line to give it depth */}
                        <filter id="shadow" height="200%">
                          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#8b5cf6" floodOpacity="0.3" />
                        </filter>
                      </defs>

                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        dy={10}
                      />

                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        tickFormatter={(value) => `₹${value}`}
                      />

                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '4 4' }}
                      />

                      <Area
                        type="monotone"
                        dataKey="earnings"
                        stroke="none"
                        fill="url(#fillGradient)"
                      />

                      <Line
                        type="monotone"
                        dataKey="earnings"
                        stroke="url(#colorGradient)"
                        strokeWidth={5}
                        filter="url(#shadow)"
                        dot={{
                          fill: '#fff',
                          stroke: '#a78bfa',
                          strokeWidth: 3,
                          r: 6
                        }}
                        activeDot={{
                          fill: '#fff',
                          stroke: '#ec4899',
                          strokeWidth: 4,
                          r: 8
                        }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </FadeIn>

          {/* Upcoming Sessions Section */}
          <FadeIn delay={0.6}>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 sm:p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-900">Upcoming Sessions</h2>
                <button
                  onClick={() => showNotification('session-opts', 'Options menu coming soon')}
                  className="relative text-blue-600 hover:bg-blue-50 p-2 rounded-xl transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                  {notification?.id === 'session-opts' && (
                    <div className="absolute top-full right-0 mt-2 w-max bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xl z-50 animate-in fade-in slide-in-from-top-1">
                      {notification.message}
                      <div className="absolute -top-1 right-3 w-2 h-2 bg-slate-900 rotate-45"></div>
                    </div>
                  )}
                </button>
              </div>

              <div className="space-y-6">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="flex gap-4 group">
                    <div className="flex flex-col items-center mt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-50"></div>
                      <div className="w-px h-full bg-slate-100 my-1 group-last:hidden"></div>
                    </div>
                    <div className="flex-1 pb-2">
                      <p className="text-base font-bold text-slate-900">{session.student}</p>
                      <p className="text-sm font-medium text-blue-600 mt-0.5">{session.topic}</p>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mt-2 bg-slate-50 w-fit px-2 py-1 rounded-md">
                        <Clock className="w-3.5 h-3.5" />
                        {session.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/sessions')}
                className="w-full mt-6 py-3 px-4 border-2 border-slate-100 hover:border-slate-200 text-slate-600 font-bold rounded-2xl transition-all"
              >
                View Calendar
              </button>
            </div>
          </FadeIn>

        </div>
      </div>
    </div>
  );
}