import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { Calendar as CalendarIcon, Clock, MapPin, Video, ChevronRight, RotateCcw } from 'lucide-react';
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
    status: 'upcoming'
  },
  {
    id: 2,
    student: 'Marcus Cole',
    time: 'Tomorrow, 10:00 AM',
    date: new Date(Date.now() + 86400000),
    topic: 'System Design Interview',
    duration: '45 min',
    status: 'upcoming'
  },
  {
    id: 3,
    student: 'Elena Rodriguez',
    time: 'Thu, 4:30 PM',
    date: new Date(Date.now() + 172800000),
    topic: 'Resume Review',
    duration: '30 min',
    status: 'upcoming'
  },
  {
    id: 4,
    student: 'James Wilson',
    time: 'Sat, 11:00 AM',
    date: new Date(Date.now() + 345600000),
    topic: 'Career Guidance',
    duration: '60 min',
    status: 'upcoming'
  },
];

export default function Sessions() {
  const { mentor } = useMentor();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notification, setNotification] = useState(null);

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
    <div className="min-h-screen bg-slate-50/50">
      {/* Custom Styles for react-calendar 
        Injecting here so it works instantly without touching your global CSS 
      */}
      <style>{`
        .custom-calendar.react-calendar {
          width: 100%;
          border: none;
          background: transparent;
          font-family: inherit;
        }

        /* Essential Grid Layout for Calendar */
        .custom-calendar .react-calendar__month-view__days {
          display: flex !important;
          flex-wrap: wrap !important;
        }
        
        /* Navigation (Month/Year Header) */
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
        
        /* Weekday Headers (Su, Mo, Tu...) */
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
          text-decoration: none; /* Removes the dotted underline */
        }
        .custom-calendar .react-calendar__month-view__weekdays__weekday {
          flex: 1;
        }

        /* Individual Day Tiles */
        .custom-calendar .react-calendar__tile {
          max-width: 100%;
          padding: 0.75rem 0.5rem;
          background: none;
          text-align: center;
          line-height: 16px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #334155;
          border-radius: 9999px; /* Perfect circles */
          transition: all 0.2s ease;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 44px;
          flex: 0 0 14.2857% !important; /* 100% / 7 days */
          overflow: hidden;
        }
        
        /* Tile Hover & Focus */
        .custom-calendar .react-calendar__tile:enabled:hover,
        .custom-calendar .react-calendar__tile:enabled:focus {
          background-color: #f1f5f9;
          color: #0f172a;
        }
        
        /* Today Tile */
        .custom-calendar .react-calendar__tile--now {
          background-color: #e2e8f0;
          color: #0f172a;
          font-weight: 700;
        }
        
        /* Selected Date Tile */
        .custom-calendar .react-calendar__tile--active,
        .custom-calendar .react-calendar__tile--active:enabled:hover,
        .custom-calendar .react-calendar__tile--active:enabled:focus {
          background-color: #2563eb !important;
          color: white !important;
          font-weight: 700;
          box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.39);
        }

        /* Adjacent Month Dates */
        .custom-calendar .react-calendar__month-view__days__day--neighboringMonth {
          color: #cbd5e1;
        }
      `}</style>

      {/* Header */}
      <header className="px-8 pt-8 pb-6 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sessions</h1>
            <p className="text-slate-500 mt-1.5 font-medium">Manage your mentoring schedule</p>
          </div>
          <button
            onClick={() => setSelectedDate(new Date())}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-4 h-4" />
            Jump to Today
          </button>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        <div className="grid gap-8 lg:grid-cols-12 flex-col-reverse lg:flex-row">

          {/* Left Side - Calendar & Stats */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* Highly Styled Calendar */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-7 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200/50">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                className="custom-calendar"
                prevLabel={<span className="text-xl">‹</span>}
                nextLabel={<span className="text-xl">›</span>}
                prev2Label={null} // Hides the "<<" double jump
                next2Label={null} // Hides the ">>" double jump
                tileClassName={({ date }) => {
                  let classes = '';
                  // If it has a session and is NOT the currently selected date, add a dot
                  if (sessionDates.includes(date.toDateString()) && date.toDateString() !== selectedDate.toDateString()) {
                    classes += ' font-bold text-blue-700 after:content-[""] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-blue-500 after:rounded-full';
                  }
                  return classes;
                }}
              />
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] shadow-lg shadow-slate-900/10 border border-slate-800 p-7 text-white relative overflow-hidden">
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

          {/* Right Side - Session Lists */}
          <div className="lg:col-span-8 space-y-8">

            {/* Spotlight: Selected Date Sessions */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                    {isToday(selectedDate) && (
                      <span className="text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md">Today</span>
                    )}
                  </h2>
                  <p className="text-sm text-slate-500 font-medium mt-1">
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100/50">
                  <CalendarIcon className="w-5 h-5 text-blue-600" />
                </div>
              </div>

              {sessionsOnSelectedDate.length > 0 ? (
                <div className="space-y-4">
                  {sessionsOnSelectedDate.map((session) => (
                    <div key={`selected-${session.id}`} className="relative flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-blue-50/50 border border-blue-100 hover:bg-blue-50 hover:border-blue-200 transition-colors">
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 text-lg">{session.student}</p>
                        <p className="text-sm text-blue-600 font-semibold mt-0.5">{session.topic}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-600 font-medium">
                          <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                            {session.time.split(', ')[1] || session.time}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            Online Video
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleJoinCall(session)}
                        className="relative mt-4 sm:mt-0 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all hover:shadow-blue-500/20 active:scale-95"
                      >
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
                  <p className="text-slate-500 text-sm mt-1 max-w-[250px]">You have a completely free schedule for this selected date.</p>
                </div>
              )}
            </div>

            {/* All Upcoming Sessions List */}
            <div>
              <div className="flex items-center justify-between mb-5 px-1">
                <h3 className="text-lg font-bold text-slate-900">All Upcoming Sessions</h3>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-200/50 px-3 py-1 rounded-full">
                  {upcomingSessionsData.length} Total
                </span>
              </div>

              <div className="space-y-3">
                {upcomingSessionsData.map((session) => (
                  <div
                    key={`all-${session.id}`}
                    className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/60 hover:border-blue-400/40 hover:shadow-md transition-all duration-300 cursor-pointer"
                  >
                    <div className="h-12 w-12 rounded-xl bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center border border-slate-100 group-hover:border-blue-100 transition-colors shrink-0">
                      <Video className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>

                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {session.student}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{session.topic}</p>
                    </div>

                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-1 mt-2 sm:mt-0">
                      <div className="text-left sm:text-right">
                        <p className="text-sm font-bold text-slate-700">{session.time}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 justify-start sm:justify-end">
                          <Clock className="w-3 h-3" /> {session.duration}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all hidden sm:block" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}