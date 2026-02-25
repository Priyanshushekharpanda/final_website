import React, { useState } from 'react';
import { BookOpen, Clock, TrendingUp, Mail, Users } from 'lucide-react';

// Mock data: replace this with your actual API data later
const studentsData = [
  {
    id: 1,
    name: "Aarav Patel",
    focus: "Python Programming",
    hoursMentored: 42,
    progress: 75,
    lastActive: "2 hours ago",
    status: "Excellent"
  },
  {
    id: 2,
    name: "Priya Sharma",
    focus: "Operating Systems",
    hoursMentored: 28,
    progress: 45,
    lastActive: "1 day ago",
    status: "Needs Attention"
  },
  {
    id: 3,
    name: "Rohan Kumar",
    focus: "C Programming",
    hoursMentored: 65,
    progress: 90,
    lastActive: "Just now",
    status: "On Track"
  }
];

export default function MyStudents() {
  const [notification, setNotification] = useState(null);

  const showNotification = (id, message) => {
    setNotification({ id, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleMessage = (id, name) => {
    showNotification(`msg-${id}`, `Opening chat with ${name}...`);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
      <header className="px-8 pt-6 pb-4 bg-white/70 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-600" />
          My Students
        </h1>
        <p className="text-slate-600 mt-1">Monitor the progress and activity of your assigned students</p>
      </header>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentsData.map((student) => (
            <div key={student.id} className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200/50 transition-all duration-300">

              {/* Header: Name & Status */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">{student.name}</h2>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${student.status === 'Excellent' ? 'bg-green-100 text-green-700' :
                      student.status === 'On Track' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                      {student.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Focus Area */}
              <div className="flex items-center gap-2 text-slate-600 mb-5 text-sm font-medium">
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span>{student.focus}</span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                    <Clock className="w-3.5 h-3.5" /> Mentored
                  </div>
                  <div className="text-xl font-bold text-slate-700">{student.hoursMentored}h</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                    <TrendingUp className="w-3.5 h-3.5" /> Progress
                  </div>
                  <div className="text-xl font-bold text-slate-700">{student.progress}%</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 mb-5">
                <div
                  className={`h-2 rounded-full ${student.progress > 80 ? 'bg-green-500' :
                    student.progress > 50 ? 'bg-indigo-500' :
                      'bg-amber-500'
                    }`}
                  style={{ width: `${student.progress}%` }}
                ></div>
              </div>

              {/* Footer: Last Active & Action Button */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-400">Last active: {student.lastActive}</span>
                <button
                  onClick={() => handleMessage(student.id, student.name)}
                  className="relative text-indigo-600 hover:text-indigo-700 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                  title="Message Student"
                >
                  <Mail className="w-4 h-4" />
                  {notification?.id === `msg-${student.id}` && (
                    <div className="absolute bottom-full right-0 mb-2 w-max bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xl z-50 animate-in fade-in slide-in-from-bottom-1">
                      {notification.message}
                      <div className="absolute -bottom-1 right-3 w-2 h-2 bg-slate-900 rotate-45"></div>
                    </div>
                  )}
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}