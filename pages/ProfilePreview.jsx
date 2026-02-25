import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  GraduationCap,
  Clock,
  Instagram,
  Linkedin,
  ArrowLeft,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useMentor } from '../context/MentorContext';
import FadeIn from '../components/FadeIn';

export default function ProfilePreview() {
  const { mentor, profileImageUrl } = useMentor();
  const [copied, setCopied] = useState(false);
  const [isQRVisible, setIsQRVisible] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsQRVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsQRVisible(false);
    }, 300);
  };

  // Fallback data in case context is empty during preview
  const safeMentor = {
    id: mentor?.id || 'preview',
    name: mentor?.name || 'Evan',
    title: mentor?.title || 'Computer Science Student',
    location: mentor?.location || 'San Francisco, CA',
    experience: mentor?.experience || '3rd Year',
    responseTime: mentor?.responseTime || 'Usually responds in 2 hours',
    about: mentor?.about || "3rd-year CS student passionate about systems programming (C & Python) and computer science theory. When I'm not studying operating systems, you can find me lifting heavy at the gym, creating cinematic photography, or making content for my gaming channel.",
    skills: mentor?.skills?.length ? mentor.skills : ['Python', 'C Programming', 'CS Theory', 'Photography'],
    instagram: mentor?.instagram || '#',
    linkedin: mentor?.linkedin || '#'
  };

  const profileUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/mentor/${safeMentor.id}`
    : 'https://mentomania.com/profile';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="max-w-[850px] mx-auto pb-12 pt-4 px-4 sm:px-6 font-sans text-slate-900 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">

      {/* Top Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/profile"
          className="flex items-center gap-2 text-[14px] font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Edit
        </Link>
        <div className="px-3 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold uppercase tracking-wider rounded-full">
          Public View
        </div>
      </div>

      {/* Main Unified Profile Card */}
      <FadeIn>
        <div className={`bg-white rounded-[2rem] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative transition-all duration-500 ease-out ${isQRVisible ? 'scale-[1.05] shadow-2xl ring-1 ring-slate-200 z-20' : 'z-0'}`}>

          {/* Soft Modern Banner */}
          <div className="h-48 rounded-t-[2rem] bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-500 relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/20 rounded-full blur-3xl" />
            <div className="absolute bottom-[-50%] left-[-10%] w-64 h-64 bg-purple-500/30 rounded-full blur-3xl" />
          </div>

          <div className="px-6 sm:px-8 pb-10 relative">

            {/* Avatar & Interactive Share Group */}
            <div className="relative inline-block -mt-16 sm:-mt-20 mb-6 z-20">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white bg-slate-100 shadow-md overflow-hidden relative z-10 flex items-center justify-center">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt={safeMentor.name} className="w-full h-full object-cover" />
                ) : (
                  <img src="https://ui-avatars.com/api/?name=Ayman+Shaltoni&background=eef2ff&color=4f46e5" alt={safeMentor.name} className="w-full h-full object-cover" />
                )}
              </div>

              {/* Interactive Share Button inside Avatar bounds */}
              <button
                onClick={handleCopyLink}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={`absolute bottom-2 right-2 z-20 p-2.5 rounded-full shadow-md transition-all duration-300 transform hover:scale-110 ${copied
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : isQRVisible
                    ? 'bg-blue-600 text-white shadow-lg scale-110'
                    : 'bg-white text-blue-600 hover:text-blue-700 hover:shadow-lg'
                  }`}
              >
                {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
              </button>

              {/* Hover QR Code Popover - Now appearing on the RIGHT */}
              <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={`absolute left-1/2 -translate-x-1/2 top-full mt-4 sm:mt-0 sm:top-1/2 sm:-translate-y-1/2 sm:left-full sm:ml-5 transition-all duration-500 ease-out transform origin-top sm:origin-left z-30 ${isQRVisible ? 'opacity-100 visible scale-100 translate-x-0' : 'opacity-0 invisible scale-95 -translate-x-4'}`}
              >

                {/* Invisible hover bridge covering the gap to the left */}
                <div className="hidden sm:block absolute w-8 h-full -left-6 top-0 pointer-events-auto" />

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

                  {/* Arrow pointing to the Left */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 sm:left-auto sm:-left-2 sm:top-1/2 sm:-translate-y-1/2 w-4 h-4 bg-white/95 border-l border-t sm:border-t-0 sm:border-b border-slate-100 rotate-45" />
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className={`max-w-3xl relative z-10 transition-all duration-500 ease-out ${isQRVisible ? 'sm:translate-x-40' : ''}`}>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">
                {safeMentor.name}
              </h1>
              <h2 className="text-[16px] font-medium text-blue-600 mb-5">
                {safeMentor.title}
              </h2>

              {/* Meta Stats Row */}
              <div className="flex flex-wrap items-center gap-5 text-[14px] text-slate-500 font-medium mb-8">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {safeMentor.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                  {safeMentor.experience}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {safeMentor.responseTime}
                </div>
              </div>

              {/* Bio Section */}
              <div className="mb-8">
                <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-3">About</h3>
                <p className="text-[15px] leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {safeMentor.about}
                </p>
              </div>

              {/* Footer Row: Tags & Socials */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6 border-t border-slate-100">

                {/* Soft Skill Pills */}
                <div className="flex flex-wrap gap-2">
                  {safeMentor.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-[#EBF4FF] text-blue-700 text-[13px] font-semibold rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-2">
                  {safeMentor.instagram && (
                    <a href={safeMentor.instagram} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-[#E1306C] hover:bg-[#E1306C]/10 rounded-full transition-all">
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {safeMentor.linkedin && (
                    <a href={safeMentor.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 rounded-full transition-all">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  <button
                    onClick={handleCopyLink}
                    className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
                    title="Copy Profile Link"
                  >
                    {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}