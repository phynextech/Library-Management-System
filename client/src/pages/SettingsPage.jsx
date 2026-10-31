import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  User,
  Shield,
  Sliders,
  Bell,
  Save,
  CheckCircle,
  AlertCircle,
  LogOut,
  Mail,
  Building,
  DollarSign,
  Calendar,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const SettingsPage = () => {
  const { user, updateProfile, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Profile Form
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    avatar: user?.avatar || '',
    password: ''
  });

  // Library & Fine Settings
  const [settingsData, setSettingsData] = useState({
    libraryName: 'Aetheria Digital Library',
    maxBooksPerStudent: 5,
    defaultBorrowDays: 14,
    finePerDay: 2,
    currencySymbol: '$',
    contactEmail: 'admin@aetheria.library',
    systemNotification: 'Welcome to Aetheria Library Management v2.0 - All systems operational.'
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);
  const [settingsMsg, setSettingsMsg] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.success && res.settings) {
          setSettingsData(res.settings);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);

    const updates = {
      name: profileData.name,
      phone: profileData.phone,
      department: profileData.department,
      avatar: profileData.avatar
    };
    if (profileData.password) updates.password = profileData.password;

    const result = await updateProfile(updates);
    setSavingProfile(false);

    if (result.success) {
      setProfileMsg({ type: 'success', text: 'Profile details saved successfully.' });
    } else {
      setProfileMsg({ type: 'error', text: result.message || 'Failed to update profile.' });
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsMsg(null);

    try {
      const res = await api.put('/settings', settingsData);
      if (res.success) {
        setSettingsMsg({ type: 'success', text: 'Institutional rules and fine thresholds updated.' });
      }
    } catch (err) {
      setSettingsMsg({ type: 'error', text: err.message || 'Failed to update settings.' });
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl">
      <div>
        <div className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold">
          System Preferences
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
          Settings & Institutional Governance
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure personal credentials, borrowing limits, automated fine engine, and UI parameters
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Personal Profile */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-white/10 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              <User size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display">Personal Scholar Profile</h3>
              <p className="text-xs text-slate-400">Manage identity, contact, and security token</p>
            </div>
          </div>

          {profileMsg && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                profileMsg.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
              }`}
            >
              {profileMsg.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Email (Account Identifier)
              </label>
              <input
                type="email"
                disabled
                value={profileData.email}
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input opacity-60 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={profileData.department}
                  onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={profileData.avatar}
                onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Update Password (leave blank to keep current)
              </label>
              <input
                type="password"
                value={profileData.password}
                onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="px-5 py-2.5 rounded-xl glass-btn-primary font-bold text-xs text-white flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              <Save size={14} />
              <span>{savingProfile ? 'Updating...' : 'Save Profile'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Library Governance (Admin Only) & Theme Options */}
        <div className="lg:col-span-6 space-y-6">
          {isAdmin ? (
            <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                  <Sliders size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-display">Library Engine Configuration</h3>
                  <p className="text-xs text-slate-400">Circulation quotas and automated fine rules</p>
                </div>
              </div>

              {settingsMsg && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    settingsMsg.type === 'success'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                  }`}
                >
                  {settingsMsg.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                  <span>{settingsMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleSettingsSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                    Institution / Library Name
                  </label>
                  <input
                    type="text"
                    value={settingsData.libraryName}
                    onChange={(e) => setSettingsData({ ...settingsData, libraryName: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                      Max Books Per Scholar
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={settingsData.maxBooksPerStudent}
                      onChange={(e) => setSettingsData({ ...settingsData, maxBooksPerStudent: parseInt(e.target.value) || 5 })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                      Standard Borrow Days
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={settingsData.defaultBorrowDays}
                      onChange={(e) => setSettingsData({ ...settingsData, defaultBorrowDays: parseInt(e.target.value) || 14 })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                      Overdue Fine Per Day ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={settingsData.finePerDay}
                      onChange={(e) => setSettingsData({ ...settingsData, finePerDay: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                      Currency Symbol
                    </label>
                    <input
                      type="text"
                      value={settingsData.currencySymbol}
                      onChange={(e) => setSettingsData({ ...settingsData, currencySymbol: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl glass-input font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 font-bold text-xs text-white flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <Save size={14} />
                  <span>{savingSettings ? 'Saving Rules...' : 'Save Library Configuration'}</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-6 border border-white/10 text-xs text-slate-400">
              <Shield className="w-8 h-8 text-cyan-400 mb-2" />
              <div className="font-bold text-white text-sm">Scholar Access Tier</div>
              <p className="mt-1">
                Institutional configuration and fine parameters are managed by Library Systems Administrators.
              </p>
            </div>
          )}

          {/* Liquid Glass Aesthetic Notes & Sign Out */}
          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
              <Sparkles size={16} />
              <span>Apple VisionOS Liquid Glass Engine</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Powered by real-time hardware-accelerated 3D shaders, multi-layer blur filters, and specular lighting.
            </p>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut size={15} />
              <span>Sign Out of Aetheria Gateway</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
