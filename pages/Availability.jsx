import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import {
    Clock,
    Plus,
    Trash2,
    Calendar as CalendarIcon,
    Save,
    Check,
    ChevronRight,
    ChevronDown,
    AlertCircle,
    Repeat,
    X,
    Ban
} from 'lucide-react';
import { useMentor } from '../context/MentorContext';
import FadeIn from '../components/FadeIn';

// --- Time Helper Functions ---

// Convert "14:30" -> { hour: 2, minute: "30", period: "PM" }
const parseTime = (time24) => {
    if (!time24) return { hour: 9, minute: "00", period: "AM" };
    const [h, m] = time24.split(':');
    let hourInt = parseInt(h, 10);
    const period = hourInt >= 12 ? 'PM' : 'AM';

    // Convert 0 -> 12, 13 -> 1, etc.
    hourInt = hourInt % 12;
    if (hourInt === 0) hourInt = 12;

    return { hour: hourInt, minute: m, period };
};

// Convert { hour: 2, minute: "30", period: "PM" } -> "14:30"
const formatTime = (hour, minute, period) => {
    let hourInt = parseInt(hour, 10);

    if (period === 'PM' && hourInt !== 12) {
        hourInt += 12;
    } else if (period === 'AM' && hourInt === 12) {
        hourInt = 0;
    }

    const h = hourInt.toString().padStart(2, '0');
    return `${h}:${minute}`;
};

// --- New Visual Clock Picker Component ---
const TimePicker = ({ value, onChange, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Parse current value to control internal state
    const { hour, minute, period } = parseTime(value);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleUpdate = (newHour, newMinute, newPeriod) => {
        const timeString = formatTime(newHour, newMinute, newPeriod);
        onChange(timeString);
    };

    return (
        <div className="relative" ref={containerRef}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 outline-none transition-all duration-200 hover:bg-slate-100 rounded-md px-2 py-1 ${className}`}
            >
                <span className="font-bold text-slate-700 tabular-nums">
                    {hour}:{minute} <span className="text-xs text-slate-500 ml-0.5">{period}</span>
                </span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Visual Clock/Grid Popover */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 w-[280px] animate-in fade-in zoom-in-95 duration-150">

                    {/* Header Display */}
                    <div className="flex justify-center mb-4 pb-4 border-b border-slate-100">
                        <div className="flex items-baseline gap-1 text-3xl font-black text-slate-800 tracking-tight">
                            {hour}:{minute}
                            <span className="text-sm font-bold text-slate-400 ml-1">{period}</span>
                        </div>
                    </div>

                    <div className="flex gap-4 h-48">
                        {/* Hours Column */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                            <div className="text-xs font-bold text-slate-400 uppercase mb-2 text-center">Hour</div>
                            <div className="grid grid-cols-1 gap-1">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => (
                                    <button
                                        key={h}
                                        onClick={() => handleUpdate(h, minute, period)}
                                        className={`py-1.5 rounded-lg text-sm font-bold transition-colors ${hour === h
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                            : 'text-slate-600 hover:bg-slate-100'
                                            }`}
                                    >
                                        {h}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="w-px bg-slate-100 h-full"></div>

                        {/* Minutes Column */}
                        <div className="flex-1">
                            <div className="text-xs font-bold text-slate-400 uppercase mb-2 text-center">Min</div>
                            <div className="flex flex-col gap-1">
                                {['00', '15', '30', '45'].map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => handleUpdate(hour, m, period)}
                                        className={`py-2 rounded-lg text-sm font-bold transition-colors ${minute === m
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                            : 'text-slate-600 hover:bg-slate-100'
                                            }`}
                                    >
                                        :{m}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="w-px bg-slate-100 h-full"></div>

                        {/* AM/PM Column */}
                        <div className="flex-1 flex flex-col justify-center gap-2">
                            {['AM', 'PM'].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => handleUpdate(hour, minute, p)}
                                    className={`py-3 rounded-xl text-xs font-bold transition-colors border ${period === p
                                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                        : 'border-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function Availability() {
    const { mentor, setMentor } = useMentor();
    const [notification, setNotification] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Initialize state from context
    const [weeklySlots, setWeeklySlots] = useState(mentor?.availability || []);
    const [dateSpecificSlots, setDateSpecificSlots] = useState(mentor?.dateAvailability || {});

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Helper to show notifications
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // --- Weekly Logic ---
    const addWeeklySlot = (day) => {
        setWeeklySlots([...weeklySlots, { day, startTime: '09:00', endTime: '17:00' }]);
    };

    const removeWeeklySlot = (index) => {
        const newSlots = [...weeklySlots];
        newSlots.splice(index, 1);
        setWeeklySlots(newSlots);
    };

    const updateWeeklySlot = (index, field, value) => {
        const newSlots = [...weeklySlots];
        newSlots[index][field] = value;
        setWeeklySlots(newSlots);
    };

    // --- Date Specific Logic ---
    const formatDateKey = (date) => {
        return date.toLocaleDateString('en-CA'); // YYYY-MM-DD
    };

    const getSlotsForDate = (date) => {
        const key = formatDateKey(date);
        return dateSpecificSlots[key] || [];
    };

    const addDateSlot = () => {
        const key = formatDateKey(selectedDate);
        const currentSlots = dateSpecificSlots[key] || [];
        const newSlots = {
            ...dateSpecificSlots,
            [key]: [...currentSlots, { startTime: '09:00', endTime: '17:00' }]
        };
        setDateSpecificSlots(newSlots);
    };

    const removeDateSlot = (date, index) => {
        const key = formatDateKey(date);
        const currentSlots = [...(dateSpecificSlots[key] || [])];
        currentSlots.splice(index, 1);

        const newSlots = { ...dateSpecificSlots };
        if (currentSlots.length === 0) {
            delete newSlots[key];
        } else {
            newSlots[key] = currentSlots;
        }
        setDateSpecificSlots(newSlots);
    };

    const updateDateSlot = (date, index, field, value) => {
        const key = formatDateKey(date);
        const currentSlots = [...(dateSpecificSlots[key] || [])];
        currentSlots[index][field] = value;

        setDateSpecificSlots({
            ...dateSpecificSlots,
            [key]: currentSlots
        });
    };

    // --- Save Logic ---
    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setMentor(prev => ({
                ...prev,
                availability: weeklySlots,
                dateAvailability: dateSpecificSlots
            }));
            setIsSaving(false);
            showNotification('Availability settings saved successfully!');
        }, 800);
    };

    return (
        <div className="min-h-screen bg-slate-50/80 font-sans text-slate-900 pb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
            {/* Reuse Calendar Styles from Sessions page */}
            <style>{`
        .custom-calendar.react-calendar { width: 100%; border: none; background: transparent; font-family: inherit; }
        .custom-calendar .react-calendar__navigation { display: flex; height: 48px; margin-bottom: 1rem; align-items: center; }
        .custom-calendar .react-calendar__navigation button { min-width: 44px; background: transparent; border-radius: 12px; font-weight: 700; font-size: 1rem; }
        .custom-calendar .react-calendar__navigation button:enabled:hover { background-color: #f1f5f9; }
        .custom-calendar .react-calendar__month-view__weekdays { text-align: center; text-transform: uppercase; font-weight: 700; font-size: 0.75rem; color: #64748b; margin-bottom: 0.75rem; }
        .custom-calendar .react-calendar__month-view__weekdays__weekday abbr { text-decoration: none; }
        .custom-calendar .react-calendar__tile { padding: 0.75rem 0.5rem; background: none; font-size: 0.875rem; font-weight: 500; color: #334155; border-radius: 9999px; height: 44px; display: flex; align-items: center; justify-content: center; }
        .custom-calendar .react-calendar__tile:enabled:hover { background-color: #f1f5f9; color: #0f172a; }
        .custom-calendar .react-calendar__tile--now { background-color: #e2e8f0; color: #0f172a; font-weight: 700; }
        .custom-calendar .react-calendar__tile--active { background-color: #4f46e5 !important; color: white !important; font-weight: 700; box-shadow: 0 4px 14px 0 rgba(79, 70, 229, 0.39); }
        .has-slots { position: relative; }
        .has-slots::after { content: ''; position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; background-color: #4f46e5; border-radius: 50%; }
        
        /* Custom Scrollbar for Time Picker */
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
      `}</style>

            {/* Header */}
            <header className="px-8 py-8 bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Availability</h1>
                    <p className="text-slate-500 mt-2 text-lg font-medium">Manage your weekly schedule and specific date overrides</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="hidden md:flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-slate-200 hover:shadow-indigo-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSaving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Save className="w-5 h-5" />
                    )}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </header>

            {/* Notification Toast */}
            {notification && (
                <div className="fixed bottom-8 right-8 z-50 animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3">
                        <div className="bg-green-500/20 p-1 rounded-full">
                            <Check className="w-4 h-4 text-green-400" />
                        </div>
                        <p className="text-sm font-bold">{notification.message}</p>
                    </div>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-8 py-8">

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Left: Weekly Schedule */}
                    <FadeIn delay={0.1} className="lg:col-span-7">
                        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-8">
                            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
                                <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Weekly Recurring Schedule</h2>
                                    <p className="text-slate-500 text-sm font-medium">Set your standard availability for each day of the week.</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {daysOfWeek.map((day) => {
                                    const daySlots = weeklySlots.filter(s => s.day === day);
                                    const hasSlots = daySlots.length > 0;

                                    return (
                                        <div key={day} className={`group flex flex-col md:flex-row md:items-start gap-6 p-5 rounded-2xl border transition-all ${hasSlots ? 'bg-white border-slate-200' : 'bg-slate-50/50 border-slate-100'}`}>

                                            {/* Day Label */}
                                            <div className="w-32 pt-2 flex flex-col gap-1">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-3 h-3 rounded-full ${hasSlots ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                                    <span className={`font-bold ${hasSlots ? 'text-slate-900' : 'text-slate-400'}`}>{day}</span>
                                                </div>
                                            </div>

                                            {/* Slots Area */}
                                            <div className="flex-1 space-y-3">
                                                {hasSlots ? (
                                                    daySlots.map((slot, idx) => {
                                                        const realIndex = weeklySlots.indexOf(slot);
                                                        return (
                                                            <div key={idx} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2">
                                                                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 pl-3 shadow-sm hover:border-indigo-300 transition-colors focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/20">
                                                                    <TimePicker
                                                                        value={slot.startTime}
                                                                        onChange={(val) => updateWeeklySlot(realIndex, 'startTime', val)}
                                                                    />
                                                                    <span className="text-slate-300 font-light">|</span>
                                                                    <TimePicker
                                                                        value={slot.endTime}
                                                                        onChange={(val) => updateWeeklySlot(realIndex, 'endTime', val)}
                                                                    />
                                                                </div>
                                                                <button
                                                                    onClick={() => removeWeeklySlot(realIndex)}
                                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="pt-2 text-sm text-slate-400 italic">Unavailable</div>
                                                )}
                                            </div>

                                            {/* Add Button */}
                                            <button
                                                onClick={() => addWeeklySlot(day)}
                                                className="self-start md:self-center p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                title="Add time slot"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </FadeIn>

                    {/* Right: Calendar & Specific Dates */}
                    <div className="lg:col-span-5 space-y-8">
                        {/* Calendar Card */}
                        <FadeIn delay={0.2}>
                            <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-8">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-slate-900">Specific Dates</h2>
                                    <p className="text-slate-500 text-sm font-medium mt-1">Select a date to override your weekly schedule.</p>
                                </div>

                                <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
                                    <Calendar
                                        onChange={setSelectedDate}
                                        value={selectedDate}
                                        className="custom-calendar"
                                        tileClassName={({ date }) => {
                                            const key = formatDateKey(date);
                                            return dateSpecificSlots[key] ? 'has-slots' : '';
                                        }}
                                    />
                                </div>
                            </div>
                        </FadeIn>

                        {/* Selected Date Slots Card */}
                        <FadeIn delay={0.3}>
                            <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                            {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            <span className="text-slate-400 font-normal">
                                                {selectedDate.toLocaleDateString('en-US', { year: 'numeric' })}
                                            </span>
                                        </h2>
                                        <p className="text-slate-500 text-xs font-medium mt-0.5">
                                            {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                                        </p>
                                    </div>
                                    <button
                                        onClick={addDateSlot}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-indigo-600 transition-colors shadow-sm"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Add Override
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {dateSpecificSlots[formatDateKey(selectedDate)]?.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-red-100 rounded-2xl bg-red-50/30">
                                            <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 text-red-500">
                                                <Ban className="w-5 h-5" />
                                            </div>
                                            <h3 className="text-sm font-bold text-slate-900">Unavailable</h3>
                                            <button
                                                onClick={() => {
                                                    const newSlots = { ...dateSpecificSlots };
                                                    delete newSlots[formatDateKey(selectedDate)];
                                                    setDateSpecificSlots(newSlots);
                                                }}
                                                className="mt-2 text-slate-600 font-bold text-xs hover:text-slate-900 underline"
                                            >
                                                Clear override
                                            </button>
                                        </div>
                                    ) : getSlotsForDate(selectedDate).length > 0 ? (
                                        getSlotsForDate(selectedDate).map((slot, idx) => (
                                            <div key={idx} className="group flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all bg-white">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <TimePicker
                                                            value={slot.startTime}
                                                            onChange={(val) => updateDateSlot(selectedDate, idx, 'startTime', val)}
                                                            className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm text-slate-900 focus:border-indigo-500 min-w-[80px]"
                                                        />
                                                        <ChevronRight className="w-3 h-3 text-slate-300" />
                                                        <TimePicker
                                                            value={slot.endTime}
                                                            onChange={(val) => updateDateSlot(selectedDate, idx, 'endTime', val)}
                                                            className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm text-slate-900 focus:border-indigo-500 min-w-[80px]"
                                                        />
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => removeDateSlot(selectedDate, idx)}
                                                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                                            <p className="text-slate-400 text-xs max-w-[200px]">
                                                Using weekly schedule for <span className="font-bold">{selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}</span>.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </main>

            {/* Mobile Floating Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 md:hidden z-30 pb-safe">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSaving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Save className="w-5 h-5" />
                    )}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
}