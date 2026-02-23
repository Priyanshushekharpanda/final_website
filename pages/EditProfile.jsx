import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Twitter,
  Instagram,
  Linkedin,
  X,
  ArrowUpRight,
  Lightbulb,
  MessageSquare,
  Bell,
  ChevronDown,
  Camera,
  Pen,
  Check,
  Share2,
  CreditCard,
  Calendar,
  Clock,
  Trash2,
  Plus
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
// Assuming you have this context, otherwise replace with standard useState
import { useMentor } from '../context/MentorContext';

export default function EditProfile() {
  const { mentor, setMentor, profileImageUrl, setProfileImageUrl } = useMentor();
  const [activeSection, setActiveSection] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isQRVisible, setIsQRVisible] = useState(false);
  const [notification, setNotification] = useState(null);
  const timeoutRef = useRef(null);

  // Local state for the banner image
  const [bannerImageUrl, setBannerImageUrl] = useState(null);
  const [newSkill, setNewSkill] = useState('');

  // Phone dropdown states
  const [isPhoneDropdownOpen, setIsPhoneDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({ code: '+966', label: 'SA', color: 'bg-green-600' });

  // Mock state for slots
  const [slots, setSlots] = useState(mentor?.availability || [
    { id: 1, day: 'Monday', startTime: '10:00 AM', endTime: '11:00 AM' },
    { id: 2, day: 'Wednesday', startTime: '02:00 PM', endTime: '03:00 PM' },
  ]);
  const [newSlot, setNewSlot] = useState({ day: 'Monday', startTime: '', endTime: '' });
  const [editingSlotId, setEditingSlotId] = useState(null);

  const countries = [
    { code: '+966', label: 'SA', color: 'bg-green-600' },
    { code: '+1', label: 'US', color: 'bg-blue-600' },
    { code: '+44', label: 'UK', color: 'bg-red-600' },
    { code: '+91', label: 'IN', color: 'bg-orange-500' },
    { code: '+971', label: 'AE', color: 'bg-teal-600' },
  ];

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setProfileImageUrl(URL.createObjectURL(file));
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setBannerImageUrl(URL.createObjectURL(file));
  };

  const updateField = (field, value) => {
    setMentor((prev) => ({ ...prev, [field]: value }));
  };

  const removeSkill = (indexToRemove) => {
    setMentor((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setMentor((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  const convertTo24Hour = (timeStr) => {
    if (!timeStr) return '';
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours, 10);
    if (hours === 12) hours = 0;
    if (modifier === 'PM') hours += 12;
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  const showNotification = (id, message) => {
    setNotification({ id, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const addSlot = () => {
    if (newSlot.startTime && newSlot.endTime) {
      if (newSlot.startTime >= newSlot.endTime) {
        showNotification('add-slot', 'Start time must be before end time');
        return;
      }

      const formattedStart = formatTime(newSlot.startTime);
      const formattedEnd = formatTime(newSlot.endTime);

      if (editingSlotId) {
        const updatedSlots = slots.map((s) =>
          s.id === editingSlotId
            ? { ...s, day: newSlot.day, startTime: formattedStart, endTime: formattedEnd }
            : s
        );
        setSlots(updatedSlots);
        setMentor((prev) => ({ ...prev, availability: updatedSlots }));
        setEditingSlotId(null);
        setNewSlot({ day: 'Monday', startTime: '', endTime: '' });
      } else {
        const slotToAdd = {
          id: Date.now(),
          day: newSlot.day,
          startTime: formattedStart,
          endTime: formattedEnd
        };
        const updatedSlots = [...slots, slotToAdd];
        setSlots(updatedSlots);
        setMentor((prev) => ({ ...prev, availability: updatedSlots }));
        setNewSlot({ ...newSlot, startTime: '', endTime: '' });
      }
    }
  };

  const removeSlot = (id) => {
    if (editingSlotId === id) {
      setEditingSlotId(null);
      setNewSlot({ day: 'Monday', startTime: '', endTime: '' });
    }
    const updatedSlots = slots.filter((s) => s.id !== id);
    setSlots(updatedSlots);
    setMentor((prev) => ({ ...prev, availability: updatedSlots }));
  };

  const handleEditSlot = (slot) => {
    setEditingSlotId(slot.id);
    setNewSlot({
      day: slot.day,
      startTime: convertTo24Hour(slot.startTime),
      endTime: convertTo24Hour(slot.endTime)
    });
  };

  const handleCancelEdit = () => {
    setEditingSlotId(null);
    setNewSlot({ day: 'Monday', startTime: '', endTime: '' });
  };

  const saveSlotsToBackend = () => {
    console.log('Saving slots to backend:', slots);
    showNotification('slots', 'Availability saved successfully!');
  };

  const toggleSection = (section) => {
    if (activeSection === section) {
      if (section === 'slots') {
        saveSlotsToBackend();
      }
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  const profileUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/mentor/${mentor?.id || 'preview'}`
    : 'https://mentomania.com/profile';

  const handleCopyLink = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsQRVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsQRVisible(false);
    }, 300);
  };

  const getSectionClassName = (section) => {
    const isActive = activeSection === section;
    const isBlur = activeSection && !isActive;
    return `bg-white rounded-[24px] border border-slate-200 p-8 transition-all duration-500 ease-in-out ${isActive
      ? 'shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] ring-1 ring-blue-500/30 scale-[1.02] z-30 relative'
      : isBlur
        ? 'shadow-sm opacity-40 blur-[2px] scale-[0.98] pointer-events-none grayscale-[0.5]'
        : 'shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-200/50'
      }`;
  };

  const NotificationPopup = ({ message }) => (
    <div className="absolute top-full right-0 mt-2 w-max max-w-[200px] bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xl z-50 animate-in fade-in slide-in-from-top-1">
      {message}
      <div className="absolute -top-1 right-3 w-2 h-2 bg-slate-900 rotate-45"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/80 font-sans text-slate-900 pb-16">

      {/* ================= TOP HEADER ================= */}
      <div className="max-w-7xl mx-auto px-8 py-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Edit User Profile</h1>
          <Link to="/profile/preview" className="flex items-center gap-1 text-[15px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
            Preview <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>

        <div className="flex items-center gap-6 text-slate-600">
          <button onClick={() => showNotification('tips', 'Tips feature coming soon!')} className="relative hover:text-slate-900 bg-white p-2.5 rounded-full shadow-sm border border-slate-200 transition-colors">
            <Lightbulb className="w-5 h-5" strokeWidth={2.5} />
            {notification?.id === 'tips' && <NotificationPopup message={notification.message} />}
          </button>
          <button onClick={() => showNotification('messages', 'Messages coming soon!')} className="relative hover:text-slate-900 bg-white p-2.5 rounded-full shadow-sm border border-slate-200 transition-colors">
            <MessageSquare className="w-5 h-5" strokeWidth={2.5} />
            {notification?.id === 'messages' && <NotificationPopup message={notification.message} />}
          </button>
          <button onClick={() => showNotification('notifs', 'Notifications coming soon!')} className="relative hover:text-slate-900 bg-white p-2.5 rounded-full shadow-sm border border-slate-200 transition-colors">
            <Bell className="w-5 h-5" strokeWidth={2.5} />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            {notification?.id === 'notifs' && <NotificationPopup message={notification.message} />}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 space-y-8">

        {/* ================= HORIZONTAL PROFILE CARD ================= */}
        <div className={`bg-white rounded-[24px] shadow-sm border border-slate-200 overflow-hidden transition-all duration-500 ease-out relative ${activeSection && activeSection !== 'personal'
          ? 'opacity-40 blur-[2px] scale-[0.98] pointer-events-none grayscale-[0.5] z-0'
          : isQRVisible || activeSection === 'personal' ? 'scale-[1.02] shadow-2xl ring-1 ring-slate-200 z-20' : 'z-0 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200/50'
          }`}>
          {/* Banner */}
          <div className="h-40 w-full bg-gradient-to-r from-[#f3c8f5] via-[#e2e8f0] to-[#bfdbfe] relative overflow-hidden">
            {bannerImageUrl && (
              <img src={bannerImageUrl} alt="Banner" className="absolute inset-0 w-full h-full object-cover z-0" />
            )}
            <div className="absolute top-0 right-20 w-64 h-64 bg-[#f97316] rounded-full mix-blend-multiply opacity-60 -translate-y-20 translate-x-10 filter blur-[40px] z-10"></div>
            <div className="absolute bottom-[-60px] left-10 w-56 h-56 bg-[#4ade80] rounded-full mix-blend-multiply opacity-60 filter blur-[40px] z-10"></div>

            <label className="absolute top-6 right-6 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition text-slate-700 cursor-pointer z-20">
              <Camera className="w-4 h-4" strokeWidth={2.5} />
              <input type="file" accept="image/*" className="hidden" onChange={handleBannerImageChange} />
            </label>
          </div>

          {/* Horizontal Details Area */}
          <div className="px-8 pb-8 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 relative">

            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 w-full">
              {/* Avatar Overlapping Banner */}
              <div className="relative -mt-20 shrink-0 z-20">
                <label className="block w-36 h-36 rounded-full border-[6px] border-white bg-slate-100 shadow-md overflow-hidden relative z-10 cursor-pointer">
                  <img
                    src={profileImageUrl || "https://ui-avatars.com/api/?name=Ayman+Shaltoni&background=e0e7ff&color=4f46e5"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
                </label>

                {/* Share Button */}
                <button
                  onClick={handleCopyLink}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  type="button"
                  className={`absolute bottom-2 right-2 z-30 p-2.5 rounded-full shadow-md transition-all duration-300 transform hover:scale-110 ${copied
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : isQRVisible
                      ? 'bg-blue-600 text-white shadow-lg scale-110'
                      : 'bg-white text-blue-600 hover:text-blue-700 hover:shadow-lg'
                    }`}
                >
                  {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                </button>

                {/* QR Code Popover */}
                <div
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className={`absolute left-full top-1/2 -translate-y-1/2 ml-5 transition-all duration-500 ease-out transform origin-left z-30 ${isQRVisible ? 'opacity-100 visible scale-100 translate-x-0' : 'opacity-0 invisible scale-95 -translate-x-4'}`}
                >
                  <div className="absolute w-8 h-full -left-6 top-0 pointer-events-auto" />
                  <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center gap-2 relative">
                    <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
                      <QRCodeSVG
                        value={profileUrl}
                        size={110}
                        level="M"
                        includeMargin={false}
                        fgColor="#0f172a"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      {copied ? 'Link Copied!' : 'Scan or Click'}
                    </span>
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white/95 border-l border-b border-slate-100 rotate-45" />
                  </div>
                </div>
              </div>

              <div className={`flex-1 flex flex-col w-full transition-all duration-500 ease-out ${isQRVisible ? 'md:pl-44' : ''}`}>

                <div className="flex items-start justify-between w-full mb-4">
                  {/* Name and Role Display / Edit Toggle */}
                  <div className="text-center md:text-left flex-1">
                    {activeSection === 'personal' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl">
                        <div>
                          <label className="block text-[13px] font-bold text-slate-500 mb-1.5">Full Name</label>
                          <input
                            type="text"
                            value={mentor?.name || ''}
                            onChange={(e) => updateField('name', e.target.value)}
                            className="block w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-[15px] text-slate-900 font-bold focus:ring-0 focus:border-blue-600 outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-slate-500 mb-1.5">Role</label>
                          <input
                            type="text"
                            value={mentor?.title || ''}
                            onChange={(e) => updateField('title', e.target.value)}
                            className="block w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-[15px] text-slate-900 font-bold focus:ring-0 focus:border-blue-600 outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-slate-500 mb-1.5">Email</label>
                          <input
                            type="email"
                            value={mentor?.email || ''}
                            onChange={(e) => updateField('email', e.target.value)}
                            className="block w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-[15px] text-slate-900 font-bold focus:ring-0 focus:border-blue-600 outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-slate-500 mb-1.5">Phone</label>
                          <div className="flex border-2 border-slate-200 rounded-xl focus-within:border-blue-600 transition-colors relative bg-white">
                            <div
                              className="flex items-center gap-1 px-3 border-r-2 border-slate-200 text-[14px] font-bold text-slate-700 cursor-pointer hover:bg-slate-50 rounded-l-xl"
                              onClick={() => setIsPhoneDropdownOpen(!isPhoneDropdownOpen)}
                            >
                              <span>{selectedCountry.code}</span>
                              <ChevronDown className="w-3 h-3 text-slate-400" strokeWidth={3} />
                            </div>
                            {isPhoneDropdownOpen && (
                              <div className="absolute top-[110%] left-0 w-32 bg-white border border-slate-200 shadow-lg rounded-xl overflow-hidden z-50">
                                {countries.map((country) => (
                                  <div
                                    key={country.code}
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 cursor-pointer transition-colors"
                                    onClick={() => {
                                      setSelectedCountry(country);
                                      setIsPhoneDropdownOpen(false);
                                    }}
                                  >
                                    <span className="text-[13px] font-bold text-slate-700">{country.code}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            <input
                              type="tel"
                              value={mentor?.phone || ''}
                              onChange={(e) => updateField('phone', e.target.value)}
                              className="block w-full px-4 py-2.5 text-[15px] text-slate-900 font-bold outline-none border-none bg-transparent rounded-r-xl"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{mentor?.name || 'User Name'}</h2>
                        <p className="text-[16px] font-bold text-slate-500 mt-1">{mentor?.title || 'Role Title'}</p>
                        <div className="flex flex-wrap gap-4 mt-3 text-sm font-medium text-slate-400">
                          <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {mentor?.email}</span>
                          <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {selectedCountry.code} {mentor?.phone}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Edit Button */}
                  <button
                    onClick={() => toggleSection('personal')}
                    className={`p-2.5 rounded-full transition-all duration-300 transform hover:scale-110 shrink-0 ml-4 ${activeSection === 'personal'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 rotate-0'
                      : 'bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                  >
                    {activeSection === 'personal' ? <Check className="w-5 h-5" strokeWidth={3} /> : <Pen className="w-5 h-5" strokeWidth={2.5} />}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ================= 2-COLUMN SETTINGS GRID ================= */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* --- LEFT COLUMN --- */}
          <div className="space-y-8">

            {/* Bio */}
            <div className={getSectionClassName('bio')}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-extrabold text-slate-900">Bio</h3>
                <button
                  onClick={() => toggleSection('bio')}
                  className={`p-2.5 rounded-full transition-all duration-300 transform hover:scale-110 ${activeSection === 'bio'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                >
                  {activeSection === 'bio' ? <Check className="w-4 h-4" strokeWidth={3} /> : <Pen className="w-4 h-4" strokeWidth={2.5} />}
                </button>
              </div>

              {activeSection === 'bio' ? (
                <textarea
                  value={mentor?.about || ''}
                  onChange={(e) => updateField('about', e.target.value)}
                  rows={5}
                  className="w-full p-5 border-2 border-slate-200 rounded-xl text-[15px] text-slate-800 font-semibold leading-relaxed focus:ring-0 focus:border-blue-600 outline-none resize-none transition-colors"
                />
              ) : (
                <p className="text-[15px] leading-relaxed text-slate-600 whitespace-pre-wrap">
                  {mentor?.about || 'No bio added yet.'}
                </p>
              )}
            </div>

            {/* Payment Details */}
            <div className={getSectionClassName('payment')}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-extrabold text-slate-900">Payment Details</h3>
                <button
                  onClick={() => toggleSection('payment')}
                  className={`p-2.5 rounded-full transition-all duration-300 transform hover:scale-110 ${activeSection === 'payment'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                >
                  {activeSection === 'payment' ? <Check className="w-4 h-4" strokeWidth={3} /> : <Pen className="w-4 h-4" strokeWidth={2.5} />}
                </button>
              </div>

              {activeSection === 'payment' ? (
                <div className="space-y-5">
                  <div>
                    <label className="block text-[14px] font-bold text-slate-800 mb-2">Bank Name</label>
                    <input type="text" className="block w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-[15px] text-slate-900 font-semibold focus:ring-0 focus:border-blue-600 outline-none transition-colors" placeholder="e.g. Chase Bank" />
                  </div>
                  <div>
                    <label className="block text-[14px] font-bold text-slate-800 mb-2">Account Number</label>
                    <input type="text" className="block w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-[15px] text-slate-900 font-semibold focus:ring-0 focus:border-blue-600 outline-none transition-colors" placeholder="**** **** **** 1234" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[14px] font-bold text-slate-800 mb-2">IFSC / SWIFT</label>
                      <input type="text" className="block w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-[15px] text-slate-900 font-semibold focus:ring-0 focus:border-blue-600 outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[14px] font-bold text-slate-800 mb-2">Account Holder</label>
                      <input type="text" className="block w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-[15px] text-slate-900 font-semibold focus:ring-0 focus:border-blue-600 outline-none transition-colors" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm text-blue-600">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Chase Bank</p>
                    <p className="text-xs font-semibold text-slate-500">**** **** **** 8829</p>
                  </div>
                  <div className="ml-auto px-3 py-1 bg-green-100 text-green-700 text-[11px] font-bold rounded-full">Verified</div>
                </div>
              )}
            </div>

          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="space-y-8">

            {/* Industry/Interests */}
            <div className={getSectionClassName('skills')}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-extrabold text-slate-900">Industry/Interests</h3>
                <button
                  onClick={() => toggleSection('skills')}
                  className={`p-2.5 rounded-full transition-all duration-300 transform hover:scale-110 ${activeSection === 'skills'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                >
                  {activeSection === 'skills' ? <Check className="w-4 h-4" strokeWidth={3} /> : <Pen className="w-4 h-4" strokeWidth={2.5} />}
                </button>
              </div>

              <div className="flex flex-wrap gap-3 mb-8">
                {mentor?.skills?.map((skill, i) => (
                  <div key={i} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-[14px] font-bold border border-blue-200 shadow-sm">
                    {skill}
                    {activeSection === 'skills' && (
                      <button onClick={() => removeSkill(i)} className="text-blue-500 hover:text-blue-800 bg-white rounded-full p-0.5 transition-colors">
                        <X className="w-3.5 h-3.5" strokeWidth={3} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {activeSection === 'skills' && (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                    placeholder="Type a skill..."
                    className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl text-[15px] font-bold text-slate-700 outline-none focus:border-blue-600 transition-colors"
                  />
                  <button onClick={handleAddSkill} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Add
                  </button>
                </div>
              )}
            </div>

            {/* Add Your Slot */}
            <div className={getSectionClassName('slots')}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-extrabold text-slate-900">Availability Slots</h3>
                <button
                  onClick={() => toggleSection('slots')}
                  className={`relative p-2.5 rounded-full transition-all duration-300 transform hover:scale-110 ${activeSection === 'slots'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                >
                  {activeSection === 'slots' ? <Check className="w-4 h-4" strokeWidth={3} /> : <Pen className="w-4 h-4" strokeWidth={2.5} />}
                  {notification?.id === 'slots' && <NotificationPopup message={notification.message} />}
                </button>
              </div>

              <div className="space-y-3 mb-6">
                {slots.map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{slot.day}</p>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                          <Clock className="w-3 h-3" />
                          {slot.startTime} - {slot.endTime}
                        </div>
                      </div>
                    </div>
                    {activeSection === 'slots' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleEditSlot(slot)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Pen className="w-4 h-4" />
                        </button>
                        <button onClick={() => removeSlot(slot.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {activeSection === 'slots' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <select
                      value={newSlot.day}
                      onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
                      className="col-span-1 px-3 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-600"
                    >
                      <option value="Monday">Mon</option>
                      <option value="Tuesday">Tue</option>
                      <option value="Wednesday">Wed</option>
                      <option value="Thursday">Thu</option>
                      <option value="Friday">Fri</option>
                      <option value="Saturday">Sat</option>
                      <option value="Sunday">Sun</option>
                    </select>
                    <input
                      type="time"
                      value={newSlot.startTime}
                      onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                      className="col-span-1 px-3 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-600"
                    />
                    <input
                      type="time"
                      value={newSlot.endTime}
                      onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                      className="col-span-1 px-3 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-600"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={addSlot} className="relative flex-1 py-3 border-2 border-dashed border-slate-300 rounded-xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-2">
                      {editingSlotId ? <><Check className="w-4 h-4" /> Update Slot</> : <><Plus className="w-4 h-4" /> Add New Slot</>}
                      {notification?.id === 'add-slot' && <NotificationPopup message={notification.message} />}
                    </button>
                    {editingSlotId && (
                      <button onClick={handleCancelEdit} className="px-6 py-3 border-2 border-slate-200 rounded-xl text-[14px] font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all">
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}