import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Clock,
  ArrowUpRight,
  MoreVertical
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useMentor } from '../context/MentorContext';

// Mock data for the chart and upcoming sessions (Replace with actual backend data)
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

export default function Dashboard() {
  const { mentor } = useMentor();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);

  // Fallback values in case mentor object doesn't have these yet
  const totalEarnings = mentor?.totalEarnings || "13,000";
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
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Header */}
      <header className="px-8 pt-8 pb-6 bg-white/70 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-10 flex justify-between items-center">
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
      </header>

      <div className="p-8 max-w-7xl mx-auto space-y-8">

        {/* Top Stats Row */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Earnings Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200/50 transition-all duration-300 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +14%
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Earnings</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">${totalEarnings}</p>
          </div>

          {/* Sessions Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200/50 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Completed Sessions</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{mentor?.sessionsCompleted || 0}</p>
          </div>

          {/* Active Students Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200/50 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="h-12 w-12 rounded-2xl bg-violet-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-violet-600" />
              </div>
            </div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Students</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{activeStudents}</p>
          </div>

          {/* Rating & Response Card */}
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
        </div>

        {/* Main Content Split */}
        <div className="grid gap-6 lg:grid-cols-4">

          {/* Chart Section */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
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
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={earningData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 14 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 14 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="#2563eb"
                    strokeWidth={4}
                    dot={{ fill: '#2563eb', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Availability Slots Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-900">Availability</h2>
              <button onClick={() => navigate('/availability')} className="text-slate-400 hover:text-blue-600 transition-colors">
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 flex-1">
              {(mentor?.availability || [
                { day: 'Mon', startTime: '10:00 AM', endTime: '11:00 AM' },
                { day: 'Wed', startTime: '02:00 PM', endTime: '03:00 PM' },
                { day: 'Fri', startTime: '04:00 PM', endTime: '05:00 PM' },
              ]).slice(0, 3).map((slot, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-xs font-bold text-blue-600 uppercase shrink-0">
                    {slot.day.substring(0, 3)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{slot.startTime}</p>
                    <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                      <Clock className="w-3 h-3" />
                      {slot.endTime}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/availability')}
              className="w-full mt-6 py-3 px-4 border-2 border-slate-100 hover:border-slate-200 text-slate-600 font-bold rounded-2xl transition-all"
            >
              Manage Slots
            </button>
          </div>

          {/* Upcoming Sessions Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
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

        </div>
      </div>
    </div>
  );
}
