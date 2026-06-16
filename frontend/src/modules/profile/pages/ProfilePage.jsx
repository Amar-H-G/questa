import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { 
  User, Mail, Phone, MapPin, Github, Linkedin, Globe, 
  Award, BookOpen, Code2, Shield, Camera, Plus, Trash2, 
  Loader2, CheckCircle2, Activity, Trophy, Sparkles, Languages,
  Briefcase, Save, Settings, Heart, Image as ImageIcon, Paintbrush
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { apiClient, getAvatarUrl } from '../../../services/api/client';

const PRESET_GRADIENTS = [
  { name: 'Indigo Dream', value: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)' },
  { name: 'Sunset Spark', value: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)' },
  { name: 'Emerald Mint', value: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
  { name: 'Deep Violet', value: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)' },
  { name: 'Ocean Wave', value: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' },
  { name: 'Midnight Tech', value: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' },
];

export const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const fileInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  // States
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'edit' | 'preferences'
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  // Form states initialized from user store (supporting nested profile structure)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    headline: '',
    bio: '',
    phone: '',
    location: '',
    github: '',
    linkedin: '',
    portfolio: '',
    preferredLang: '',
    skills: [],
    avatar: '',
    coverBanner: '',
    bannerType: 'color',
    emailNotifications: true,
    weeklyReport: true,
    anonymousStanding: false,
  });

  // Keep state updated when user store changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        headline: user.profile?.headline || 'Tech Professional & Passionate Learner',
        bio: user.profile?.bio || 'Full stack developer constantly pushing code bounds, completing quizzes, and writing code sandbox scripts.',
        phone: user.profile?.phone || '+1 (555) 019-2834',
        location: user.profile?.location || 'San Francisco, CA',
        github: user.profile?.github || '',
        linkedin: user.profile?.linkedin || '',
        portfolio: user.profile?.portfolio || '',
        preferredLang: user.profile?.preferredLang || 'javascript',
        skills: user.profile?.skills || ['JavaScript', 'React', 'Node.js', 'Python', 'TailwindCSS'],
        avatar: user.profile?.avatar || '',
        coverBanner: user.profile?.coverBanner || 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
        bannerType: user.profile?.bannerType || 'color',
        emailNotifications: user.profile?.emailNotifications ?? true,
        weeklyReport: user.profile?.weeklyReport ?? true,
        anonymousStanding: user.profile?.anonymousStanding ?? false,
      });
    }
  }, [user]);

  // Query platform statistics
  const { data: myStatsData } = useQuery({
    queryKey: ['my-stats'],
    queryFn: async () => (await apiClient.get('/analytics/my-stats')).data.data,
  });

  const stats = myStatsData || { quizzesAttempted: 0, problemsSolved: 0, averageQuizScore: 0 };

  const getGitHubLink = (val) => {
    if (!val) return '#';
    const cleanVal = val.trim();
    if (/^https?:\/\//i.test(cleanVal)) return cleanVal;
    return `https://github.com/${cleanVal.replace(/^\/+/, '')}`;
  };

  const getLinkedInLink = (val) => {
    if (!val) return '#';
    const cleanVal = val.trim();
    if (/^https?:\/\//i.test(cleanVal)) return cleanVal;
    return `https://linkedin.com/in/${cleanVal.replace(/^\/+/, '')}`;
  };

  const getPortfolioLink = (val) => {
    if (!val) return '#';
    const cleanVal = val.trim();
    if (/^https?:\/\//i.test(cleanVal)) return cleanVal;
    return `https://${cleanVal.replace(/^\/+/, '')}`;
  };

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle Photo Upload (Base64) with Auto-Save
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Str = reader.result;
      const toastId = toast.loading('Uploading profile photo...');
      try {
        const { data } = await apiClient.put('/auth/profile', { avatar: base64Str });
        useAuthStore.setState({ user: data.data.user });
        toast.success('Profile photo updated successfully!', { id: toastId });
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || 'Failed to upload profile photo.', { id: toastId });
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Banner Upload (Base64)
  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      toast.error('Banner image size must be less than 3MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ 
        ...prev, 
        coverBanner: reader.result,
        bannerType: 'image'
      }));
      toast.success('Banner loaded! Save profile to persist.');
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const triggerBannerInput = () => {
    bannerInputRef.current.click();
  };

  // Handle Skill management
  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    if (formData.skills.includes(trimmed)) {
      toast.error('Skill already exists');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, trimmed],
    }));
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // Save changes to Backend and local Zustand store
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);

    // Sanitize social links
    const sanitizedData = { ...formData };
    
    // Clean GitHub Username
    if (sanitizedData.github) {
      let gh = sanitizedData.github.trim();
      gh = gh.replace(/^(https?:\/\/)?(www\.)?github\.com\//i, '');
      gh = gh.replace(/^\/+|\/+$/g, '');
      sanitizedData.github = gh;
    }
    
    // Clean LinkedIn Handle
    if (sanitizedData.linkedin) {
      let li = sanitizedData.linkedin.trim();
      li = li.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//i, '');
      li = li.replace(/^\/+|\/+$/g, '');
      sanitizedData.linkedin = li;
    }
    
    // Clean Portfolio Link
    if (sanitizedData.portfolio) {
      let pf = sanitizedData.portfolio.trim();
      pf = pf.replace(/^\/+|\/+$/g, '');
      if (pf && !/^https?:\/\//i.test(pf)) {
        pf = `https://${pf}`;
      }
      sanitizedData.portfolio = pf;
    }

    try {
      const { data } = await apiClient.put('/auth/profile', sanitizedData);
      useAuthStore.setState({ user: data.data.user });
      
      // Update form state with the sanitized values returned by backend
      setFormData(prev => ({
        ...prev,
        github: data.data.user.profile?.github || '',
        linkedin: data.data.user.profile?.linkedin || '',
        portfolio: data.data.user.profile?.portfolio || '',
      }));

      toast.success('Profile settings updated successfully!');
      setActiveTab('overview');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update profile settings.');
    } finally {
      setSaving(false);
    }
  };

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    let score = 0;
    if (formData.name) score += 15;
    if (formData.email) score += 15;
    if (formData.avatar) score += 20;
    if (formData.headline) score += 10;
    if (formData.bio) score += 15;
    if (formData.phone) score += 10;
    if (formData.skills.length > 0) score += 15;
    return score;
  };

  const completionPercent = calculateCompletion();

  // Style helper for cover banner
  const getBannerStyle = () => {
    if (formData.bannerType === 'image' && formData.coverBanner) {
      return {
        backgroundImage: `url(${getAvatarUrl(formData.coverBanner)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    return {
      background: formData.coverBanner || 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
    };
  };

  return (
    <div className="page-shell text-[#0f172a] select-none flex flex-col gap-6 py-2 px-1">
      {/* Banner / Cover Header */}
      <div className="relative border border-slate-200 bg-white rounded-3xl overflow-hidden shadow-sm">
        <div 
          className="h-48 relative transition-all duration-300"
          style={getBannerStyle()}
        >
          {/* Decorative shapes (only show on color mode for better visibility) */}
          {formData.bannerType === 'color' && (
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          )}
          <div className="absolute -bottom-24 -left-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-12 -right-12 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* User basic details row */}
        <div className="px-6 pb-6 pt-3 flex flex-col md:flex-row md:items-end gap-6 relative z-10">
          <div className="relative group/avatar cursor-pointer self-start -mt-20 z-20" onClick={triggerFileInput}>
            <div className="h-32 w-32 rounded-3xl border-4 border-white bg-slate-100 overflow-hidden shadow-lg relative transition-all duration-300 group-hover/avatar:shadow-xl">
              {formData.avatar && formData.avatar.length > 10 ? (
                <div 
                  className="h-full w-full"
                  style={{
                    backgroundImage: `url(${getAvatarUrl(formData.avatar)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center text-slate-400 font-extrabold text-4xl uppercase">
                  {formData.name ? formData.name[0] : 'O'}
                </div>
              )}
              {/* Camera Hover Overlay */}
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1">
                <Camera className="h-6 w-6 text-white animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Change Photo</span>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div className="flex-1 space-y-2 mt-4 md:mt-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">{formData.name}</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                <Shield className="h-3 w-3" /> {user?.role || 'student'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-bold tracking-wide flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-slate-400" />
              {formData.headline}
            </p>
            <div className="flex flex-wrap gap-4 text-[11px] text-slate-400 font-semibold pt-1">
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-slate-350" /> {formData.email}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-slate-350" /> {formData.location}</span>
              <span className="flex items-center gap-1"><Languages className="h-3.5 w-3.5 text-slate-350" /> Preferred: <span className="text-blue-600 font-bold capitalize">{formData.preferredLang}</span></span>
            </div>
          </div>

          {/* Quick tab controls */}
          <div className="flex gap-2 self-start md:self-end mt-4 md:mt-0">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'edit', label: 'Edit Profile', icon: User },
              { id: 'preferences', label: 'Preferences', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`h-9 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                  activeTab === tab.id
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/10'
                    : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side: Stats & Overview Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Completion Card */}
          <div className="border border-slate-200 bg-white rounded-3xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Profile Strength</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-extrabold text-slate-700">{completionPercent}%</span>
              <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full uppercase">
                {completionPercent === 100 ? 'Complete' : 'Pending details'}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200/50 mb-3">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500" 
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <p className="text-[10.5px] leading-relaxed text-slate-400 font-semibold">
              Fill in your professional summary, add skills, and upload an avatar to complete your technical index.
            </p>
          </div>

          {/* User Stats Card */}
          <div className="border border-slate-200 bg-white rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Learning Stats</h3>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-55/40 border border-slate-100 rounded-2xl flex flex-col justify-center items-center text-center">
                <div className="h-8 w-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-2">
                  <BookOpen className="h-4 w-4" />
                </div>
                <span className="text-lg font-extrabold text-slate-800 leading-none">{stats.quizzesAttempted}</span>
                <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wide mt-1">Quizzes</span>
              </div>

              <div className="p-3 bg-slate-55/40 border border-slate-100 rounded-2xl flex flex-col justify-center items-center text-center">
                <div className="h-8 w-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-2">
                  <Code2 className="h-4 w-4" />
                </div>
                <span className="text-lg font-extrabold text-slate-800 leading-none">{stats.problemsSolved}</span>
                <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wide mt-1">Solved</span>
              </div>

              <div className="p-3 bg-slate-55/40 border border-slate-100 rounded-2xl flex flex-col justify-center items-center text-center">
                <div className="h-8 w-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-2">
                  <Trophy className="h-4 w-4" />
                </div>
                <span className="text-lg font-extrabold text-slate-800 leading-none">{stats.averageQuizScore}%</span>
                <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wide mt-1">Avg Score</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-[11px] font-semibold text-slate-500">
              <span className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5 text-blue-500" /> Platform standing</span>
              <span className="text-slate-800 font-bold bg-slate-100 px-2 py-0.5 rounded-lg">Level 4 Candidate</span>
            </div>
          </div>

          {/* Social Links Card */}
          <div className="border border-slate-200 bg-white rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Social Presence</h3>
            <div className="space-y-2.5">
              <a 
                href={getGitHubLink(formData.github)} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                    <Github className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-800">GitHub</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{formData.github || 'Not connected'}</p>
                  </div>
                </div>
                {formData.github && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              </a>

              <a 
                href={getLinkedInLink(formData.linkedin)} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-[#0077b5] flex items-center justify-center text-white">
                    <Linkedin className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-800">LinkedIn</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{formData.linkedin || 'Not connected'}</p>
                  </div>
                </div>
                {formData.linkedin && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              </a>

              <a 
                href={getPortfolioLink(formData.portfolio)} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Globe className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-800">Portfolio</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{formData.portfolio || 'Not connected'}</p>
                  </div>
                </div>
                {formData.portfolio && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Tab Contents */}
        <div className="lg:col-span-2 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* About summary block */}
              <div className="border border-slate-200 bg-white rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                <div className="space-y-2">
                  <h2 className="text-base font-extrabold text-slate-800">About Me</h2>
                  <p className="text-xs leading-relaxed text-slate-505 text-slate-500 font-semibold whitespace-pre-line">
                    {formData.bio}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-6 space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expertise & Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <span 
                        key={skill} 
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Information Grid */}
              <div className="border border-slate-200 bg-white rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                <h2 className="text-base font-extrabold text-slate-800">Detailed Information</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</span>
                    <span className="text-sm font-bold text-slate-800">{formData.name}</span>
                  </div>
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                    <span className="text-sm font-bold text-slate-800">{formData.email}</span>
                  </div>
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contact Number</span>
                    <span className="text-sm font-bold text-slate-800">{formData.phone}</span>
                  </div>
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Location</span>
                    <span className="text-sm font-bold text-slate-800">{formData.location}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EDIT PROFILE */}
          {activeTab === 'edit' && (
            <form onSubmit={handleSave} className="border border-slate-200 bg-white rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-800">Edit Profile Information</h2>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    Keep your details up-to-date. Fields marked with <span className="text-rose-500 font-bold">*</span> are required.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="h-10 px-5 rounded-xl btn-premium-gradient text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 shadow-md shadow-blue-600/10"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Changes
                </button>
              </div>

              {/* Cover Background Customization Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-l-2 border-indigo-600 pl-2">Cover Banner Style</h3>
                <div className="bg-slate-50/50 rounded-2xl border border-slate-200/80 p-5 space-y-4">
                  {/* Style selector type */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, bannerType: 'color' }))}
                      className={`h-9 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                        formData.bannerType === 'color'
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/10'
                          : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Paintbrush className="h-3.5 w-3.5" />
                      Preset Gradient
                    </button>
                    <button
                      type="button"
                      onClick={triggerBannerInput}
                      className={`h-9 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                        formData.bannerType === 'image'
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/10'
                          : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                      Upload Custom Image
                    </button>
                    <input 
                      type="file" 
                      ref={bannerInputRef} 
                      onChange={handleBannerUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>

                  {/* Rendering choices */}
                  {formData.bannerType === 'color' ? (
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Choose a Preset Gradient</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {PRESET_GRADIENTS.map((g) => (
                          <button
                            key={g.name}
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, coverBanner: g.value, bannerType: 'color' }))}
                            style={{ background: g.value }}
                            className={`h-12 rounded-xl text-white text-[10px] font-bold uppercase tracking-wider shadow-sm border-2 relative transition hover:scale-[1.02] active:scale-[0.98] ${
                              formData.coverBanner === g.value && formData.bannerType === 'color'
                                ? 'border-blue-600 ring-2 ring-blue-500/20'
                                : 'border-white/20'
                            }`}
                          >
                            <span className="bg-black/35 backdrop-blur-sm px-2 py-0.5 rounded-md text-[9px]">{g.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div 
                        className="h-14 w-28 rounded-xl border border-slate-200 shadow-sm"
                        style={getBannerStyle()}
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-800">Custom Cover Image Selected</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Recommended aspect ratio: 3:1 (less than 3MB)</p>
                        <button
                          type="button"
                          onClick={triggerBannerInput}
                          className="mt-2 text-[10px] font-extrabold text-blue-600 hover:text-blue-700 uppercase tracking-wider flex items-center gap-1"
                        >
                          <Camera className="h-3 w-3" /> Change Banner Image
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Personal Details Block */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-l-2 border-blue-650 pl-2">Personal Details</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. John Doe"
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:border-blue-650 outline-none focus:bg-white transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address <span className="text-rose-500">*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="e.g. email@example.com"
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:border-blue-650 outline-none focus:bg-white transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contact Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:border-blue-650 outline-none focus:bg-white transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, Country"
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:border-blue-650 outline-none focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              {/* Professional details */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-l-2 border-indigo-650 pl-2">Professional details</h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Professional Headline</label>
                    <input
                      type="text"
                      name="headline"
                      value={formData.headline}
                      onChange={handleChange}
                      placeholder="e.g. Senior Software Engineer"
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:border-blue-650 outline-none focus:bg-white transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Short Biography</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Introduce yourself..."
                      className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:border-blue-650 outline-none focus:bg-white transition resize-none leading-relaxed"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Preferred compiler Language</label>
                      <select
                        name="preferredLang"
                        value={formData.preferredLang}
                        onChange={handleChange}
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:border-blue-650 outline-none focus:bg-white transition"
                      >
                        <option value="javascript">JavaScript (Node.js)</option>
                        <option value="python">Python (3)</option>
                        <option value="cpp">C++ (GCC)</option>
                        <option value="java">Java (OpenJDK)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">GitHub Username</label>
                      <input
                        type="text"
                        name="github"
                        value={formData.github}
                        onChange={handleChange}
                        placeholder="github_username"
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:border-blue-650 outline-none focus:bg-white transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">LinkedIn Handle</label>
                      <input
                        type="text"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        placeholder="linkedin_username"
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:border-blue-650 outline-none focus:bg-white transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Portfolio Link</label>
                      <input
                        type="text"
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={handleChange}
                        placeholder="https://yourwebsite.com"
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:border-blue-650 outline-none focus:bg-white transition"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Tag Management */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-l-2 border-slate-650 pl-2">Skills & Technologies</h3>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-slate-400 hover:text-rose-500 transition"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 max-w-sm">
                    <input
                      type="text"
                      placeholder="Add new skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="flex-1 h-9 px-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold outline-none focus:border-blue-650 focus:bg-white transition"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="h-9 w-9 rounded-xl bg-blue-50 text-blue-650 hover:bg-blue-100 border border-blue-200 flex items-center justify-center transition"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* TAB 3: PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="border border-slate-200 bg-white rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-extrabold text-slate-800">Account Preferences</h2>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Customize notification delivery and leaderboard displays.</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-55/30">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800">Email Notifications</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Receive reminders about quiz releases and leaderboard adjustments.</p>
                  </div>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                      formData.emailNotifications ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        formData.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-55/30">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800">Weekly Performance Index</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Get a comprehensive email detailing compiler speed and accuracy metrics.</p>
                  </div>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, weeklyReport: !prev.weeklyReport }))}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                      formData.weeklyReport ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        formData.weeklyReport ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-55/30">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800">Anonymous Leaderboard Display</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Mask your name and show a randomized candidate identifier.</p>
                  </div>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, anonymousStanding: !prev.anonymousStanding }))}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                      formData.anonymousStanding ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        formData.anonymousStanding ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  onClick={handleSave}
                  className="h-10 px-6 rounded-xl btn-premium-gradient text-xs font-bold shadow-md shadow-blue-600/10"
                >
                  Apply Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
