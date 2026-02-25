import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, MapPin, Video, ChevronRight, ChevronLeft, RotateCcw, User } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useMentor } from '../context/MentorContext';

// Mock upcoming sessions data
const upcomingSessionsData = [
  {
    id: 1,
    student: 'Sarah Jenkins',
    time: 'Today, 2:00 PM',
    date: new Date(),
    topic: 'React Performance Tuning',
    duration: '60 min',
    status: 'In progress',
    progress: 84
  },
  {
    id: 2,
    student: 'Marcus Cole',
    time: 'Tomorrow, 10:00 AM',
    date: new Date(Date.now() + 86400000),
    topic: 'System Design Interview',
    duration: '45 min',
    status: 'Upcoming',
    progress: 0
  },
  {
    id: 3,
    student: 'Elena Rodriguez',
    time: 'Thu, 4:30 PM',
    date: new Date(Date.now() + 172800000),
    topic: 'Resume Review',
    duration: '30 min',
    status: 'Upcoming',
    progress: 0
  },
  {
    id: 4,
    student: 'James Wilson',
    time: 'Sat, 11:00 AM',
    date: new Date(Date.now() + 345600000),
    topic: 'Career Guidance',
    duration: '60 min',
    status: 'Upcoming',
    progress: 0
  },
];

const mentoringHoursData = [
  { name: 'Mon', hours: 2.5 },
  { name: 'Tue', hours: 3.0 },
  { name: 'Wed', hours: 4.5 },
  { name: 'Thu', hours: 2.0 },
  { name: 'Fri', hours: 5.0 },
  { name: 'Sat', hours: 6.5 },
  { name: 'Sun', hours: 1.5 },
];

export default function Sessions() {
  const { mentor } = useMentor();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notification, setNotification] = useState(null);

  // Get availability for selected date
  const selectedDayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
  const availableSlots = mentor?.availability?.filter(slot => slot.day === selectedDayName) || [];

  // Get sessions for selected date
  const sessionsOnSelectedDate = upcomingSessionsData.filter(
    session => session.date.toDateString() === selectedDate.toDateString()
  );

  // Get all session dates for calendar marking
  const sessionDates = upcomingSessionsData.map(session => session.date.toDateString());

  // Helper to check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const showNotification = (id, message) => {
    setNotification({ id, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleJoinCall = (session) => {
    showNotification(`join-${session.id}`, `Joining call with ${session.student}...`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Custom Styles for react-calendar */}
      <style>{`
        .custom-calendar.react-calendar {
          width: 100%;
          border: none;
          background: transparent;
          font-family: inherit;
        }
        .custom-calendar .react-calendar__month-view__days {
          display: flex !important;
          flex-wrap: wrap !important;
        }
        .custom-calendar .react-calendar__navigation {
          display: flex;
          height: 48px;
          margin-bottom: 1rem;
          align-items: center;
        }
        .custom-calendar .react-calendar__navigation button {
          min-width: 44px;
          background: transparent;
          border-radius: 12px;
          color: #0f172a;
          font-weight: 700;
          font-size: 1rem;
          transition: all 0.2s ease;
        }
        .custom-calendar .react-calendar__navigation button:enabled:hover,
        .custom-calendar .react-calendar__navigation button:enabled:focus {
          background-color: #f1f5f9;
        }
        .custom-calendar .react-calendar__navigation button[disabled] {
          background-color: transparent;
          color: #cbd5e1;
        }
        .custom-calendar .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: 700;
          font-size: 0.75rem;
          color: #64748b;
          margin-bottom: 0.75rem;
          display: flex !important;
        }
        .custom-calendar .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
        }
        .custom-calendar .react-calendar__month-view__weekdays__weekday {
          flex: 1;
        }
        .custom-calendar .react-calendar__tile {
          max-width: 100%;
          padding: 0.75rem 0.5rem;
          background: none;
          text-align: center;
          line-height: 16px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #334155;
          border-radius: 9999px;
          transition: all 0.2s ease;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 44px;
          flex: 0 0 14.2857% !important;
          overflow: hidden;
        }
        .custom-calendar .react-calendar__tile:enabled:hover,
        .custom-calendar .react-calendar__tile:enabled:focus {
          background-color: #f1f5f9;
          color: #0f172a;
        }
        .custom-calendar .react-calendar__tile--now {
          background-color: #e2e8f0;
          color: #0f172a;
          font-weight: 700;
        }
        .custom-calendar .react-calendar__tile--active,
        .custom-calendar .react-calendar__tile--active:enabled:hover,
        .custom-calendar .react-calendar__tile--active:enabled:focus {
          background-color: #2563eb !important;
          color: white !important;
          font-weight: 700;
          box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.39);
        }
        .custom-calendar .react-calendar__month-view__days__day--neighboringMonth {
          color: #cbd5e1;
        }
      `}</style>

      {/* Header */}
      <header className="px-8 py-6 bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 tracking-tight">Sessions</h1>
            <p className="text-slate-500 mt-2 text-lg font-medium">Manage your mentoring schedule and upcoming calls</p>
          </div>
          <button
            onClick={() => setSelectedDate(new Date())}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 shadow-sm rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-95 self-start sm:self-auto"
          >
            <RotateCcw className="w-4 h-4" />
            Jump to Today
          </button>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto space-y-8">

        {/* Top Section: Grid with Lists and Calendar */}
        <div className="grid gap-8 lg:grid-cols-12 flex-col-reverse lg:flex-row">

          {/* Left Side - Session Lists */}
          <div className="lg:col-span-8 space-y-8">

            {/* Spotlight: Selected Date Sessions */}
            <div className="bg-white rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-slate-200 p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                    {isToday(selectedDate) ? (
                      <span className="text-xs font-bold uppercase tracking-wider bg-blue-600 text-white px-2.5 py-1 rounded-full shadow-sm shadow-blue-200">Today</span>
                    ) : (
                      <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">Selected</span>
                    )}
                  </h2>
                  <p className="text-sm text-slate-500 font-medium mt-1">
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {sessionsOnSelectedDate.length > 0 ? (
                <div className="space-y-4">
                  {sessionsOnSelectedDate.map((session) => (
                    <div key={`selected-${session.id}`} className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                      <div className="absolute left-0 top-6 bottom-6 w-1 bg-blue-500 rounded-r-full"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-slate-900 text-lg">{session.student}</h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${session.status === 'In progress' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-50 text-blue-700'
                            }`}>
                            {session.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium mb-4 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                          {session.topic}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-600 font-bold">
                          <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-100 transition-colors">
                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                            {session.time.split(', ')[1] || session.time}
                          </span>
                          <span className="flex items-center gap-1.5 px-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            Online Video
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleJoinCall(session)}
                        className="relative mt-5 sm:mt-0 px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-slate-200 hover:shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
                      >
                        <Video className="w-4 h-4" />
                        Join Call
                        {notification?.id === `join-${session.id}` && (
                          <div className="absolute bottom-full right-0 mb-2 w-max bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xl z-50 animate-in fade-in slide-in-from-bottom-1">
                            {notification.message}
                            <div className="absolute -bottom-1 right-5 w-2 h-2 bg-slate-900 rotate-45"></div>
                          </div>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-10 px-4 rounded-2xl bg-slate-50 border border-slate-200 border-dashed">
                  <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <CalendarIcon className="w-7 h-7 text-slate-400" />
                  </div>
                  <p className="text-slate-900 font-semibold">No sessions scheduled</p>
                  <p className="text-slate-500 text-sm mt-1 max-w-[250px]">
                    {availableSlots.length > 0
                      ? `You have ${availableSlots.length} open slot${availableSlots.length === 1 ? '' : 's'} for this date.`
                      : "You have no availability set for this date."}
                  </p>
                </div>
              )}
            </div>

            {/* Mentoring Activity Graph */}
            <div className="bg-white rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-slate-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Mentoring Activity</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">Hours spent mentoring this week</p>
                </div>
                <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none font-bold cursor-pointer hover:bg-slate-100 transition-colors">
                  <option>This Week</option>
                  <option>Last Week</option>
                  <option>Last Month</option>
                </select>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mentoringHoursData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                        <stop offset="100%" stopColor="#4338ca" stopOpacity={1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                      tickFormatter={(value) => `${value}h`}
                    />
                    <Tooltip
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{
                        borderRadius: '16px',
                        border: 'none',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        padding: '12px 16px',
                        fontWeight: 'bold',
                        color: '#1e293b'
                      }}
                      formatter={(value) => [`${value} hours`, 'Mentored']}
                    />
                    <Bar
                      dataKey="hours"
                      fill="url(#barGradient)"
                      radius={[6, 6, 6, 6]}
                      barSize={40}
                      activeBar={{ fill: '#312e81' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Redesigned Table View: Your Availability */}
            {availableSlots.length > 0 && (
              <div className="bg-white rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-slate-200 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900">Your Availability</h3>
                  <Link to="/availability" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                    Manage Slots &rarr;
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50">
                      <tr className="border-b border-slate-100">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">DAY</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">TIME SLOT</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">TYPE</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {availableSlots.map((slot, index) => (
                        <tr key={index} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-4 text-sm font-medium text-slate-700">{slot.day}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{slot.startTime} - {slot.endTime}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">Online</td>
                          <td className="px-6 py-4">
                            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                              Open
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

          {/* Right Side - Calendar & Stats */}
          <div className="lg:col-span-4 flex flex-col gap-8">

            {/* Highly Styled Calendar */}
            <div className="bg-white rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-slate-200 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200/50">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                className="custom-calendar"
                prevLabel={<span className="text-xl">‹</span>}
                nextLabel={<span className="text-xl">›</span>}
                prev2Label={null}
                next2Label={null}
                tileClassName={({ date }) => {
                  let classes = '';
                  if (sessionDates.includes(date.toDateString()) && date.toDateString() !== selectedDate.toDateString()) {
                    classes += ' font-bold text-blue-700 after:content-[""] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-blue-500 after:rounded-full';
                  }
                  return classes;
                }}
              />
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-lg shadow-slate-900/10 border border-slate-800 p-7 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <CalendarIcon className="w-24 h-24" />
              </div>
              <p className="text-slate-300 text-sm font-medium mb-1 relative z-10">Total Mentoring Impact</p>
              <div className="flex items-end gap-3 relative z-10">
                <span className="text-4xl font-extrabold">{mentor?.sessionsCompleted || 0}</span>
                <span className="text-slate-400 text-sm mb-1">completed sessions</span>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Section: All Upcoming Sessions Table */}
        <div className="bg-white rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-900">All Upcoming Sessions</h3>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">
              {upcomingSessionsData.length} Total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50">
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">TOPIC</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">STUDENT</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">PROGRESS</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">DATE</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">DURATION</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {upcomingSessionsData.map((session) => (
                  <tr key={`all-${session.id}`} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-medium text-blue-500 hover:text-blue-600 cursor-pointer">
                      {session.topic}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold text-slate-700">{session.student}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          {/* Mocking the progress bar to match visual request */}
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${session.progress || 84}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-slate-600">{session.progress || 84}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {session.date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {session.duration}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${session.status === 'In progress'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-blue-50 text-blue-600'
                        }`}>
                        {session.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-4 text-sm text-slate-500 bg-slate-50/30">
            <span className="font-medium">1-{upcomingSessionsData.length} of {upcomingSessionsData.length}</span>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-slate-400 cursor-not-allowed flex items-center gap-1 font-medium hover:bg-slate-50 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-blue-600 hover:bg-blue-50 flex items-center gap-1 font-medium transition-colors">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}