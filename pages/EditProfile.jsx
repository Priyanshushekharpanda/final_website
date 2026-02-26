import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  ChevronDown,
  Camera,
  Pen,
  Check,
  Share2,
  Calendar,
  Clock,
  Trash2,
  Plus,
  ArrowUpRight,
  Bell,
  Shield,
  Smartphone,
  Briefcase,
  QrCode,
  Wallet,
  MapPin,
  GraduationCap,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
// Assuming these contexts/components exist in your project structure
import { useMentor } from '../context/MentorContext';
import FadeIn from '../components/FadeIn';

// Defined outside to prevent re-rendering issues
const NotificationPopup = ({ message }) => (
  <div className="absolute top-full right-0 mt-3 w-max max-w-[240px] bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl shadow-slate-900/20 z-50 animate-in fade-in slide-in-from-top-2 border border-slate-800">
    {message}
    <div className="absolute -top-1.5 right-5 w-3 h-3 bg-slate-900 rotate-45 border-l border-t border-slate-800"></div>
  </div>
);

const SmoothWrapper = ({ children, className = "" }) => {
  const contentRef = useRef(null);
  const [height, setHeight] = useState('auto');

  useEffect(() => {
    if (!contentRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setHeight(entry.contentRect.height);
      }
    });
    resizeObserver.observe(contentRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      style={{ height }}
      className={`transition-[height] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] overflow-hidden will-change-[height] ${className}`}
    >
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  );
};

const InputGroup = ({ label, value, onChange, error, success, type = "text", icon: Icon, placeholder }) => (
  <div className="relative group">
    <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-2 ml-1">{label}</label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`block w-full pl-11 pr-4 py-3.5 bg-white border ${error ? 'border-red-300 bg-red-50/30 text-red-900 focus:border-red-500 focus:ring-red-200' : success ? 'border-indigo-500 bg-indigo-50/10 focus:border-indigo-500 focus:ring-indigo-200' : 'border-slate-200 group-hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'} 
        rounded-2xl text-[15px] font-semibold text-slate-800 placeholder:text-slate-400
        focus:ring-4 focus:outline-none transition-all duration-200 shadow-sm`}
      />
      {Icon && <Icon className={`absolute left-4 top-4 w-5 h-5 transition-colors ${error ? 'text-red-400' : 'text-slate-400 group-hover:text-slate-500 group-focus-within:text-indigo-500'}`} />}
    </div>
    {error && <p className="absolute -bottom-5 right-0 text-red-500 text-[10px] font-bold animate-in slide-in-from-top-1">{error}</p>}
  </div>
);

// Define avatar assets corresponding to the user's request
const AVATAR_ASSETS = {
  Male: "https://api.dicebear.com/9.x/toon-head/svg?seed=Vivian",
  Female: "https://api.dicebear.com/9.x/toon-head/svg?seed=Oliver",
  Transgender: "https://api.dicebear.com/9.x/avataaars/svg?seed=Jack",
  Bisexual: "https://api.dicebear.com/9.x/avataaars/svg?seed=Aiden"
};

export default function EditProfile() {
  const { mentor, setMentor, profileImageUrl, setProfileImageUrl } = useMentor();
  const [activeSection, setActiveSection] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isQRVisible, setIsQRVisible] = useState(false);
  const [notification, setNotification] = useState(null);
  const timeoutRef = useRef(null);
  const [avatarColor, setAvatarColor] = useState("b6e3f4");

  // Local state for the banner image
  const [bannerImageUrl, setBannerImageUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [successAnimations, setSuccessAnimations] = useState({});

  // Phone dropdown states
  const [isPhoneDropdownOpen, setIsPhoneDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({ code: '+966', label: 'SA' });

  // Slots State
  const [slots, setSlots] = useState(mentor?.availability || [
    { id: 1, day: 'Monday', startTime: '10:00 AM', endTime: '11:00 AM' },
    { id: 2, day: 'Wednesday', startTime: '02:00 PM', endTime: '03:00 PM' },
  ]);

  // Mock upcoming sessions
  const upcomingSessions = [
    {
      id: 1,
      student: 'Sarah Jenkins',
      time: 'Today, 2:00 PM',
      topic: 'React Performance Tuning',
      duration: '60 min',
      status: 'Confirmed',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=e0e7ff&color=4f46e5'
    },
    {
      id: 2,
      student: 'Marcus Cole',
      time: 'Tomorrow, 10:00 AM',
      topic: 'System Design Interview',
      duration: '45 min',
      status: 'Pending',
      avatar: 'https://ui-avatars.com/api/?name=Marcus+Cole&background=fef3c7&color=d97706'
    },
    {
      id: 3,
      student: 'Elena Rodriguez',
      time: 'Thu, 4:30 PM',
      topic: 'Resume Review',
      duration: '30 min',
      status: 'Confirmed',
      avatar: 'https://ui-avatars.com/api/?name=Elena+Rodriguez&background=dcfce7&color=16a34a'
    }
  ];

  const countries = [
    { code: '+966', label: 'SA' },
    { code: '+1', label: 'US' },
    { code: '+44', label: 'UK' },
    { code: '+91', label: 'IN' },
    { code: '+971', label: 'AE' },
  ];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    if (mentor?.availability) {
      setSlots(mentor.availability);
    }
  }, [mentor?.availability]);

  useEffect(() => {
    if (mentor && !mentor.availability && slots.length > 0) {
      setMentor(prev => ({ ...prev, availability: slots }));
    }
  }, [mentor, slots, setMentor]);

  useEffect(() => {
    return () => {
      if (bannerImageUrl) URL.revokeObjectURL(bannerImageUrl);
    };
  }, [bannerImageUrl]);

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setProfileImageUrl(URL.createObjectURL(file));
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    if (bannerImageUrl) URL.revokeObjectURL(bannerImageUrl);
    setBannerImageUrl(URL.createObjectURL(file));
  };

  const handleGenderSelect = (gender) => {
    updateField('gender', gender);
    setProfileImageUrl(`${AVATAR_ASSETS[gender]}&backgroundColor=${avatarColor}`);
  };

  const handleColorSelect = (color) => {
    setAvatarColor(color);
    const gender = mentor?.gender && AVATAR_ASSETS[mentor.gender] ? mentor.gender : 'Male';
    setProfileImageUrl(`${AVATAR_ASSETS[gender]}&backgroundColor=${color}`);
  };

  const validateField = (field, value) => {
    if (value === null || value === undefined) return '';
    let error = '';
    if (field === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = 'Invalid email address';
    }
    if (field === 'phone') {
      if (value && !/^\d+$/.test(value)) error = 'Digits only';
      else if (value && (value.length < 8 || value.length > 15)) error = '8-15 digits';
    }
    if (field === 'name' && !value.trim()) error = 'Required';

    // Payment Validations
    if (field === 'upiId' && value && !/^[\w.-]+@[\w.-]+$/.test(value)) {
      error = 'Invalid UPI ID format';
    }
    return error;
  };

  const updateField = (field, value) => {
    if ((field === 'phone' || field === 'accountNumber') && value) {
      if (!/^\d*$/.test(value)) return;
    }
    setMentor((prev) => ({ ...prev, [field]: value }));
    const error = validateField(field, value);

    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    } else {
      if (errors[field]) {
        setSuccessAnimations((prev) => ({ ...prev, [field]: true }));
        setTimeout(() => setSuccessAnimations((prev) => ({ ...prev, [field]: false })), 1000);
      }
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const showNotification = (id, message) => {
    setNotification({ id, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleSection = (section) => {
    if (activeSection === section) {
      if (section === 'slots') showNotification('slots', 'Availability saved!');
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

  const getCardStyle = (sectionName) => {
    const isAnySectionActive = activeSection !== null;
    const isThisSectionActive = activeSection === sectionName || (sectionName === 'personal' && activeSection === 'bio');
    const isBlurState = isAnySectionActive && !isThisSectionActive;

    const baseClasses = "rounded-[2rem] border border-slate-200/60 p-5 sm:p-6 md:p-8 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] relative overflow-hidden";

    if (isThisSectionActive) {
      return `bg-indigo-50/30 ${baseClasses} shadow-2xl shadow-indigo-900/10 ring-1 ring-indigo-500/30 scale-[1.005] z-30 translate-y-0`;
    } else if (isBlurState) {
      return `bg-white ${baseClasses} shadow-none opacity-50 blur-[1px] grayscale-[0.1] scale-[0.99] pointer-events-none translate-y-0`;
    } else {
      return `bg-white ${baseClasses} shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 hover:border-indigo-200/50 z-10`;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-24 overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">

      {/* Modern Pop-in Animation & Background */}
      <style>{`
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.96) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-pop-in { animation: popIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-50/60 to-transparent"></div>
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-blue-50/40 rounded-full blur-[120px]"></div>
        <div className="absolute top-40 -left-20 w-[400px] h-[400px] bg-purple-50/40 rounded-full blur-[100px]"></div>
      </div>

      {/* ================= TOP HEADER ================= */}
      <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between z-10 animate-pop-in gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex flex-col">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">Your Profile</h1>
            <span className="text-[15px] font-medium text-slate-500 mt-1.5">Manage your public presence and settings</span>
          </div>
          <Link to="/profile/preview" className="hidden sm:flex ml-6 items-center gap-2 text-[13px] font-bold text-indigo-600 hover:text-indigo-700 bg-white hover:bg-indigo-50 px-5 py-2.5 rounded-2xl transition-all border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5">
            Preview Profile <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </Link>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          <button onClick={() => showNotification('notifs', 'No new notifications')} className="relative group p-3.5 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all active:scale-95">
            <Bell className="w-5 h-5 text-slate-500 group-hover:text-indigo-600 transition-colors" strokeWidth={2.5} />
            <span className="absolute top-3 right-3.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            {notification?.id === 'notifs' && <NotificationPopup message={notification.message} />}
          </button>
        </div>
      </div>

      <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10 z-10 animate-pop-in" style={{ animationDelay: '0.1s' }}>

        {/* ================= HERO PROFILE CARD ================= */}
        <FadeIn delay={0.1}>
          <div className={getCardStyle('personal')}>

            {/* Banner Area */}
            <div className="h-35 sm:h-40 w-[calc(100%+2.5rem)] sm:w-[calc(100%+3rem)] md:w-[calc(100%+4rem)] -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 md:-mx-8 md:-mt-8 relative group overflow-hidden mb-0 shadow-sm bg-slate-100">
              {bannerImageUrl ? (
                <img src={bannerImageUrl} alt="Banner" className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{
                    background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
                    backgroundSize: '400% 400%',
                    animation: 'animated-gradient 3s ease infinite'
                  }}
                />
              )}
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Profile Content */}
            <div className="relative">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 sm:gap-6 mb-4 sm:mb-5 relative text-center lg:text-left">

                {/* Avatar Section (Left) */}
                <div className="relative -mt-12 sm:-mt-16 z-30 shrink-0 group/avatar">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1.5 bg-white shadow-xl shadow-slate-200/60 hover:scale-105 transition-all duration-300 ease-out">
                    <label className="block w-full h-full rounded-full overflow-hidden relative cursor-pointer bg-slate-50 ring-1 ring-slate-100">
                      <img
                        key={profileImageUrl} // Trigger animation on change
                        src={profileImageUrl || AVATAR_ASSETS.Male}
                        alt="Profile"
                        className="w-full h-full object-cover animate-in fade-in zoom-in duration-500"
                      />
                      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all duration-300">
                        <Camera className="w-6 h-6 text-white drop-shadow-md" />
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
                    </label>
                  </div>

                  {/* Share & QR Actions */}
                  <div className="absolute -bottom-3 -right-3 flex gap-2">
                    <div
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      className="relative"
                    >
                      <button onClick={handleCopyLink} className="p-3.5 bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-full shadow-lg shadow-slate-200/50 border border-slate-100 transition-all active:scale-95 hover:-translate-y-1">
                        {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Share2 className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* QR Code Popup */}
                  <div
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className={`absolute left-1/2 -translate-x-1/2 top-full mt-4 lg:mt-0 lg:top-auto lg:left-[115%] lg:bottom-0 lg:translate-x-0 z-20 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-top lg:origin-left ${isQRVisible ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-90 invisible lg:-translate-x-8'}`}
                  >
                    <div className="hidden lg:block absolute w-16 h-full -left-12 top-0" />
                    <div className="bg-white p-5 rounded-[2rem] shadow-2xl shadow-indigo-900/10 border border-slate-100 w-[180px] flex flex-col items-center">
                      <QRCodeSVG value={profileUrl} size={120} />
                      <span className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Scan to View</span>
                      <div className="absolute -left-2 bottom-6 w-4 h-4 bg-white rotate-45 border-l border-b border-slate-100"></div>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className={`flex-1 w-full lg:pt-2 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isQRVisible ? 'lg:pl-56' : ''}`}>
                  <div className="flex justify-between items-start w-full">
                    <div className="flex-1 transition-all duration-300">
                      <SmoothWrapper>
                        {activeSection === 'personal' ? (
                          <div key="edit-form" className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
                            <InputGroup label="Full Name" value={mentor?.name || ''} onChange={(e) => updateField('name', e.target.value)} error={errors.name} success={successAnimations.name} icon={User} placeholder="John Doe" />
                            <InputGroup label="Role Title" value={mentor?.title || ''} onChange={(e) => updateField('title', e.target.value)} icon={Briefcase} placeholder="Senior Developer" />
                            <InputGroup label="Email Address" value={mentor?.email || ''} onChange={(e) => updateField('email', e.target.value)} error={errors.email} success={successAnimations.email} icon={Mail} placeholder="john@example.com" />

                            <div className="relative group">
                              <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-2 ml-1">Phone</label>
                              <div className="flex bg-white border border-slate-200 rounded-2xl focus-within:ring-4 focus-within:ring-indigo-100 focus-within:border-indigo-500 transition-all shadow-sm">
                                <button
                                  onClick={() => setIsPhoneDropdownOpen(!isPhoneDropdownOpen)}
                                  className="px-4 border-r border-slate-200 flex items-center gap-2 hover:bg-slate-50 rounded-l-2xl transition-colors text-sm font-bold text-slate-700"
                                >
                                  {selectedCountry.code} <ChevronDown className="w-3 h-3 text-slate-400" />
                                </button>
                                <input
                                  type="tel"
                                  value={mentor?.phone || ''}
                                  onChange={(e) => updateField('phone', e.target.value)}
                                  className="w-full bg-transparent px-4 py-3.5 text-[15px] font-semibold outline-none placeholder:text-slate-400 rounded-r-2xl"
                                  placeholder="123 456 789"
                                />
                                <Smartphone className="absolute right-4 top-4 w-5 h-5 text-slate-400 pointer-events-none" />
                              </div>
                              {isPhoneDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-36 bg-white border border-slate-100 shadow-xl rounded-2xl overflow-hidden z-50 py-1 animate-in fade-in zoom-in-95">
                                  {countries.map(c => (
                                    <button key={c.code} onClick={() => { setSelectedCountry(c); setIsPhoneDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm font-semibold text-slate-700">
                                      {c.label} ({c.code})
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            <InputGroup label="Location" value={mentor?.location || ''} onChange={(e) => updateField('location', e.target.value)} icon={MapPin} placeholder="San Francisco, CA" />
                            <InputGroup label="Experience" value={mentor?.experience || ''} onChange={(e) => updateField('experience', e.target.value)} icon={GraduationCap} placeholder="3rd Year" />

                            {/* Gender / Avatar Selection */}
                            <div className="col-span-1 md:col-span-2 pt-2">
                              <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-3 ml-1">Select Avatar / Gender</label>
                              <div className="flex flex-wrap gap-3 mb-4">
                                {Object.keys(AVATAR_ASSETS).map((gender) => (
                                  <button
                                    key={gender}
                                    onClick={() => handleGenderSelect(gender)}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border ${mentor?.gender === gender
                                      ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105 ring-2 ring-slate-200 ring-offset-2'
                                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm'
                                      }`}
                                  >
                                    {gender}
                                  </button>
                                ))}
                              </div>

                              {/* Color Picker */}
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-slate-400">Background:</span>
                                <div className="flex items-center gap-2">
                                  {['b6e3f4', 'c0aede', 'd1d4f9', 'ffdfbf', 'ffd5dc'].map((color) => (
                                    <button
                                      key={color}
                                      type="button"
                                      onClick={() => handleColorSelect(color)}
                                      className={`w-6 h-6 rounded-full border-2 transition-all ${avatarColor === color ? 'border-slate-900 scale-110' : 'border-transparent hover:scale-110'}`}
                                      style={{ backgroundColor: `#${color}` }}
                                      title={`#${color}`}
                                    />
                                  ))}
                                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200 cursor-pointer hover:border-indigo-300 transition-colors shadow-sm">
                                    <input
                                      type="color"
                                      value={`#${avatarColor}`}
                                      onChange={(e) => handleColorSelect(e.target.value.replace('#', ''))}
                                      className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 p-0 border-0 cursor-pointer"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div key="view-info" className="space-y-1 sm:space-y-2 animate-in fade-in duration-500">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">{mentor?.name || 'Your Name'}</h2>
                            <p className="text-base sm:text-lg font-medium text-slate-500 flex items-center justify-center lg:justify-start gap-2 pb-1">
                              {mentor?.title || 'Add your role'}
                            </p>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 pt-1 text-sm font-medium text-slate-500">
                              <span className="flex items-center gap-2 hover:text-indigo-600 transition-colors cursor-default break-all"><Mail className="w-4 h-4 shrink-0 text-slate-400" /> {mentor?.email || 'No email'}</span>
                              <span className="flex items-center gap-2 hover:text-indigo-600 transition-colors cursor-default"><Smartphone className="w-4 h-4 shrink-0 text-slate-400" /> {selectedCountry.code} {mentor?.phone || 'No phone'}</span>
                              <span className="flex items-center gap-2 hover:text-indigo-600 transition-colors cursor-default"><MapPin className="w-4 h-4 shrink-0 text-slate-400" /> {mentor?.location || 'Add Location'}</span>
                              <span className="flex items-center gap-2 hover:text-indigo-600 transition-colors cursor-default"><GraduationCap className="w-4 h-4 shrink-0 text-slate-400" /> {mentor?.experience || 'Add Experience'}</span>
                              <span className="flex items-center gap-2 hover:text-indigo-600 transition-colors cursor-default"><User className="w-4 h-4 shrink-0 text-slate-400" /> {mentor?.gender || 'Add Gender'}</span>
                            </div>
                          </div>
                        )}
                      </SmoothWrapper>
                    </div>

                    <button
                      onClick={() => toggleSection('personal')}
                      className={`absolute top-0 right-0 sm:static ml-0 sm:ml-6 p-2.5 sm:p-3.5 rounded-full transition-all duration-300 shadow-sm border ${activeSection === 'personal' ? 'bg-slate-900 text-white border-slate-900 rotate-0 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md'}`}
                    >
                      {activeSection === 'personal' ? <Check className="w-5 h-5" /> : <Pen className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    About Me
                  </h3>
                  <button onClick={() => toggleSection('bio')} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 px-4 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors">
                    {activeSection === 'bio' ? 'Done' : 'Edit Bio'}
                  </button>
                </div>
                <SmoothWrapper>
                  {activeSection === 'bio' ? (
                    <textarea
                      value={mentor?.about || ''}
                      onChange={(e) => updateField('about', e.target.value)}
                      rows={5}
                      className="w-full p-5 bg-white border border-slate-200 rounded-2xl text-slate-800 text-[15px] leading-relaxed focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none resize-none transition-all shadow-sm"
                      placeholder="Tell your students a bit about yourself..."
                    />
                  ) : (
                    <p className="text-slate-600 leading-relaxed max-w-4xl text-[16px]">
                      {mentor?.about || <span className="text-slate-400 italic">No bio added yet. Click edit to introduce yourself.</span>}
                    </p>
                  )}
                </SmoothWrapper>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ================= 2-COLUMN GRID ================= */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-10">

          {/* Availability Slots */}
          <FadeIn delay={0.2} className="h-full">
            <div className={`${getCardStyle('slots')} h-full`}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Calendar className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Availability</h3>
                </div>
                <Link
                  to="/availability"
                  className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                >
                  Manage Slots
                </Link>
              </div>

              <SmoothWrapper>
                <div className="space-y-4 mb-8">
                  {slots.map((slot) => (
                    <div key={slot.id} className="group relative flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-900/5 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-1.5 h-12 rounded-full bg-indigo-200 group-hover:bg-indigo-500 transition-colors"></div>
                        <div>
                          <p className="font-bold text-slate-900 text-[15px]">{slot.day}</p>
                          <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mt-1 bg-white px-2 py-1 rounded-lg border border-slate-100 w-fit">
                            <Clock className="w-3 h-3" /> {slot.startTime} - {slot.endTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {slots.length === 0 && <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl text-slate-400 text-sm font-medium italic">No availability slots added yet.</div>}
                </div>
              </SmoothWrapper>
            </div>
          </FadeIn>

          {/* Payment (UPI) Section */}
          <FadeIn delay={0.3} className="h-full">
            <div className={`${getCardStyle('payment')} h-full`}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <Wallet className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Payments</h3>
                </div>
                <button onClick={() => toggleSection('payment')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeSection === 'payment' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                  {activeSection === 'payment' ? 'Save UPI' : 'Edit UPI'}
                </button>
              </div>

              <SmoothWrapper>
                {activeSection === 'payment' ? (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 mb-2">
                      <p className="text-emerald-800 text-sm font-medium flex items-center gap-2">
                        <QrCode className="w-4 h-4" />
                        Enter your UPI ID below. A QR code will be generated automatically.
                      </p>
                    </div>

                    <InputGroup label="UPI ID (VPA)" value={mentor?.upiId || ''} onChange={(e) => updateField('upiId', e.target.value)} error={errors.upiId} success={successAnimations.upiId} icon={Smartphone} placeholder="username@oksbi" />

                    <div className="relative py-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-slate-500 font-bold tracking-wider">Bank Details (Optional)</span>
                      </div>
                    </div>

                    <InputGroup label="Account Number" value={mentor?.accountNumber || ''} onChange={(e) => updateField('accountNumber', e.target.value)} error={errors.accountNumber} success={successAnimations.accountNumber} placeholder="0000 0000 0000" />
                    <div className="grid grid-cols-2 gap-5">
                      <InputGroup label="Bank Name" value={mentor?.bankName || ''} onChange={(e) => updateField('bankName', e.target.value)} error={errors.bankName} placeholder="Bank Name" />
                      <InputGroup label="IFSC Code" value={mentor?.ifsc || ''} onChange={(e) => updateField('ifsc', e.target.value)} error={errors.ifsc} placeholder="ABCD000" />
                    </div>
                  </div>
                ) : (
                  <div className="relative h-64 w-full rounded-[2rem] overflow-hidden shadow-2xl shadow-emerald-900/20 group transition-all hover:scale-[1.02] duration-500 bg-gradient-to-br from-emerald-600 to-teal-900 text-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-400/20 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

                    {/* Left: UPI Info */}
                    <div className="flex flex-col justify-between h-full z-10 w-full text-center md:text-left">
                      <div className="flex flex-col items-center md:items-start">
                        <div className="px-3 py-1.5 bg-white/10 backdrop-blur-md w-fit rounded-lg border border-white/20 mb-4 shadow-sm">
                          <span className="text-xs font-bold tracking-widest uppercase text-emerald-100 flex items-center gap-2">
                            Unified Payments Interface
                          </span>
                        </div>
                        <p className="text-emerald-100/60 text-[10px] font-bold tracking-wider uppercase mb-1">Payment Address</p>
                        <p className="text-2xl md:text-3xl font-mono font-bold tracking-wide text-white drop-shadow-sm truncate w-full max-w-[200px] md:max-w-none">
                          {mentor?.upiId || 'Add UPI ID'}
                        </p>
                      </div>

                      <div className="hidden md:flex items-center gap-2 text-xs font-bold text-emerald-100 bg-emerald-900/30 px-3 py-1.5 rounded-full w-fit backdrop-blur-sm border border-emerald-500/30 mt-4">
                        <Shield className="w-3.5 h-3.5" />
                        {mentor?.bankName ? `Linked: ${mentor.bankName}` : 'Secure Payment Gateway'}
                      </div>
                    </div>

                    {/* Right: QR Code */}
                    <div className="relative shrink-0">
                      <div className="bg-white p-3.5 rounded-2xl shadow-xl shadow-emerald-900/40 transform rotate-[-3deg] group-hover:rotate-0 transition-all duration-500 ease-out border-4 border-white/20">
                        {mentor?.upiId ? (
                          <QRCodeSVG
                            value={`upi://pay?pa=${mentor.upiId}&pn=${mentor.name || 'Mentor'}&cu=INR`}
                            size={130}
                            className="rounded-lg"
                          />
                        ) : (
                          <div className="w-[130px] h-[130px] bg-slate-100 rounded-lg flex items-center justify-center text-slate-300">
                            <QrCode className="w-12 h-12" />
                          </div>
                        )}
                      </div>
                      {/* Scan Me Label */}
                      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 whitespace-nowrap z-20">
                        Your QR
                      </div>
                    </div>
                  </div>
                )}
              </SmoothWrapper>
            </div>
          </FadeIn>
        </div>

        {/* ================= UPCOMING SESSIONS LIST (FULL WIDTH) ================= */}
        <FadeIn delay={0.4}>
          <div className={getCardStyle('sessions')}>
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Upcoming Sessions</h3>
              <Link to="/sessions" className="group flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-5 py-2.5 rounded-xl transition-all">
                View Schedule <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <div className="space-y-5">
              {upcomingSessions.map((session, index) => (
                <div
                  key={session.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-1 hover:border-indigo-100 transition-all duration-300 group cursor-pointer animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Left: Avatar & Info */}
                  <div className="flex items-center gap-5 mb-4 md:mb-0">
                    <img src={session.avatar} alt={session.student} className="w-14 h-14 rounded-full ring-4 ring-white shadow-sm" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{session.student}</h4>
                      <p className="text-sm text-slate-500 font-medium mt-0.5">{session.topic}</p>
                    </div>
                  </div>

                  {/* Middle: Details */}
                  <div className="flex flex-wrap items-center gap-4 md:gap-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                      <Calendar className="w-4 h-4 text-slate-400" /> {session.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                      <Clock className="w-4 h-4 text-slate-400" /> {session.duration}
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${session.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                      {session.status}
                    </span>
                    <button type="button" className="hidden md:block px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm active:scale-95">
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

      </div>
    </div>
  );
}