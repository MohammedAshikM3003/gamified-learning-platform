import React, { useEffect, useRef, useState } from 'react';
import {
  Eye,
  EyeOff,
  FileDown,
  LogOut,
  Link2,
  Shield,
  SlidersHorizontal,
  Settings as SettingsIcon,
  Terminal,
  Trash2,
  Trophy,
  Upload,
  User,
  X,
} from 'lucide-react';
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateProfile } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase.js';
import '../pages/dashboard.css';
import { useAuth } from '../context/AuthContext';
import { firestoreService } from '../services/firestoreService';
import progressService from '../services/progressService';

const defaultPreferences = {
  theme: 'system',
  language: 'en',
  notifications: {
    email: true,
    push: true,
    dailyChallenge: true,
  },
  privacy: {
    showOnLeaderboard: true,
    anonymizeInChallenges: false,
  },
  security: {
    twoFactorEnabled: false,
  },
  developer: {
    githubAccount: '',
  },
};

const normalizeProfile = (profile) => {
  const preferences = profile?.preferences || {};

  return {
    theme: preferences.theme || defaultPreferences.theme,
    language: preferences.language || defaultPreferences.language,
    notifications: {
      email: preferences.notifications?.email ?? defaultPreferences.notifications.email,
      push: preferences.notifications?.push ?? defaultPreferences.notifications.push,
      dailyChallenge: preferences.notifications?.dailyChallenge ?? defaultPreferences.notifications.dailyChallenge,
    },
    privacy: {
      showOnLeaderboard: preferences.privacy?.showOnLeaderboard ?? defaultPreferences.privacy.showOnLeaderboard,
      anonymizeInChallenges: preferences.privacy?.anonymizeInChallenges ?? defaultPreferences.privacy.anonymizeInChallenges,
    },
    security: {
      twoFactorEnabled: preferences.security?.twoFactorEnabled ?? defaultPreferences.security.twoFactorEnabled,
    },
    developer: {
      githubAccount: preferences.developer?.githubAccount || defaultPreferences.developer.githubAccount,
    },
  };
};

const buildInitials = (name, email) => {
  const source = (name || email || 'LC').trim();
  const parts = source.split(/\s+/).slice(0, 2);
  return parts
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2) || 'LC';
};

const ToggleSwitch = ({ checked, onChange, label, note, disabled = false }) => (
  <label className={`settings-toggle ${disabled ? 'opacity-60' : ''}`}>
    <span className="settings-toggle-copy">
      <span className="settings-toggle-title">{label}</span>
      {note ? <span className="settings-toggle-note">{note}</span> : null}
    </span>
    <span className="settings-switch">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="settings-switch-track" />
      <span className="settings-switch-thumb" />
    </span>
  </label>
);

const Card = ({ icon: Icon, title, subtitle, children, className = '' }) => (
  <section className={`settings-card ${className}`}>
    <header className="settings-card-header">
      <div className="settings-card-icon">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="settings-card-title">{title}</h3>
        {subtitle ? <p className="settings-card-copy">{subtitle}</p> : null}
      </div>
    </header>
    {children}
  </section>
);

const fieldBase = 'settings-input';
const labelBase = 'settings-label';
const buttonBase = 'settings-btn';

export default function SettingsPage() {
  const { user, userProfile, logout } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFileName, setAvatarFileName] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [prefs, setPrefs] = useState(defaultPreferences);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [updatingSecurity, setUpdatingSecurity] = useState(false);
  const [exportingData, setExportingData] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [connectingGitHub, setConnectingGitHub] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);
  const feedbackTimeoutRef = useRef(null);

  useEffect(() => {
    setFullName(userProfile?.fullName || user?.displayName || '');
    setEmail(userProfile?.email || user?.email || '');
    setAvatarUrl(userProfile?.avatarUrl || user?.photoURL || '');
    setAvatarFileName('');
    setPrefs(normalizeProfile(userProfile));
  }, [userProfile, user]);

  useEffect(() => () => {
    if (feedbackTimeoutRef.current) {
      window.clearTimeout(feedbackTimeoutRef.current);
    }
  }, []);

  const providerHasPassword = user?.providerData?.some((provider) => provider.providerId === 'password');
  const initials = buildInitials(fullName, email);

  const showToast = (type, text) => {
    setMessage({ type, text });
    if (feedbackTimeoutRef.current) {
      window.clearTimeout(feedbackTimeoutRef.current);
    }
    feedbackTimeoutRef.current = window.setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3200);
  };

  const updatePref = (path, value) => {
    setPrefs((current) => {
      const next = structuredClone(current);

      if (path === 'theme' || path === 'language') {
        next[path] = value;
      }

      if (path === 'notifications.email') next.notifications.email = value;
      if (path === 'notifications.push') next.notifications.push = value;
      if (path === 'notifications.dailyChallenge') next.notifications.dailyChallenge = value;
      if (path === 'privacy.showOnLeaderboard') next.privacy.showOnLeaderboard = value;
      if (path === 'privacy.anonymizeInChallenges') next.privacy.anonymizeInChallenges = value;
      if (path === 'security.twoFactorEnabled') next.security.twoFactorEnabled = value;
      if (path === 'developer.githubAccount') next.developer.githubAccount = value;

      return next;
    });
  };

  const handleAvatarSelect = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(typeof reader.result === 'string' ? reader.result : '');
      setAvatarFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl('');
    setAvatarFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const persistProfile = async (nextProfile = {}) => {
    if (!user) return;
    await firestoreService.updateUserProfile(user.uid, nextProfile);
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSavingProfile(true);
    try {
      await persistProfile({
        fullName,
        email,
        avatarUrl,
        preferences: prefs,
      });

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: fullName,
          photoURL: avatarUrl || null,
        });
      }

      showToast('success', 'Profile saved successfully.');
    } catch (error) {
      console.error(error);
      showToast('error', 'Unable to save profile changes.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!user) return;

    setSavingPreferences(true);
    try {
      await persistProfile({
        fullName,
        email,
        avatarUrl,
        preferences: prefs,
      });

      showToast('success', 'Preferences updated.');
    } catch (error) {
      console.error(error);
      showToast('error', 'Unable to save preferences.');
    } finally {
      setSavingPreferences(false);
    }
  };

  const handleResetPreferences = () => {
    setPrefs(defaultPreferences);
    showToast('info', 'Preferences reset to defaults.');
  };

  const handleUpdatePassword = async () => {
    if (!user || !auth.currentUser) return;
    if (!providerHasPassword) {
      showToast('error', 'Password updates are only available for email/password accounts.');
      return;
    }
    if (!currentPassword || !newPassword) {
      showToast('error', 'Enter your current and new password.');
      return;
    }

    setUpdatingSecurity(true);
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      showToast('success', 'Password updated successfully.');
    } catch (error) {
      console.error(error);
      showToast('error', 'Unable to update password. Re-check your current password and try again.');
    } finally {
      setUpdatingSecurity(false);
    }
  };

  const handleConnectGithub = async () => {
    if (!user) return;

    setConnectingGitHub(true);
    try {
      const nextAccount = prefs.developer.githubAccount.trim();

      await persistProfile({
        fullName,
        email,
        avatarUrl,
        preferences: {
          ...prefs,
          developer: {
            ...prefs.developer,
            githubAccount: nextAccount,
          },
        },
      });

      showToast('success', nextAccount ? 'GitHub account connected.' : 'GitHub account disconnected.');
    } catch (error) {
      console.error(error);
      showToast('error', 'Unable to update the GitHub connection.');
    } finally {
      setConnectingGitHub(false);
    }
  };

  const handleExportData = async () => {
    if (!user) return;

    setExportingData(true);
    try {
      const progressData = await progressService.getUserProgress(user.uid);
      const exportPayload = {
        exportedAt: new Date().toISOString(),
        profile: {
          fullName,
          email,
          avatarUrl,
          preferences: prefs,
        },
        progress: progressData,
      };

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `learncraft-progress-${user.uid}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      showToast('success', 'Progress export downloaded.');
    } catch (error) {
      console.error(error);
      showToast('error', 'Unable to export your data right now.');
    } finally {
      setExportingData(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !auth.currentUser) return;

    const confirmed = window.confirm('Delete your LearnCraft account? This removes your profile and authentication access.');
    if (!confirmed) return;

    if (providerHasPassword && !currentPassword) {
      showToast('error', 'Enter your current password in the Security section before deleting your account.');
      return;
    }

    setDeletingAccount(true);
    try {
      if (providerHasPassword) {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
      }

      if (db) {
        await deleteDoc(doc(db, 'users', user.uid));
        await deleteDoc(doc(db, 'userProgress', user.uid));
      }

      await deleteUser(auth.currentUser);
      showToast('success', 'Account deleted.');
    } catch (error) {
      console.error(error);
      showToast('error', 'Unable to delete the account. Re-authenticate and try again.');
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <div className="settings-shell">
      <div className="settings-content">
        <header className="settings-header">
          <div className="settings-header-main">
            <div className="settings-header-icon">
              <SettingsIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="settings-header-kicker">LearnCraft</div>
              <h2 className="settings-header-title">Settings</h2>
              <p className="settings-header-copy">Manage your profile, security, preferences, lab tools, and account data in one focused workspace.</p>
            </div>
          </div>
          <div className="settings-hero-badge">Deep Dark Glass UI</div>
        </header>

        {message.text ? <div className={`settings-alert ${message.type === 'error' ? 'text-red-200' : message.type === 'success' ? 'text-emerald-200' : ''}`}>{message.text}</div> : null}

        <div className="settings-grid">
          <div className="settings-stack">
            <Card icon={User} title="Profile" subtitle="Update your visible identity and avatar for LearnCraft.">
              <div className="settings-profile-row">
                <div className="settings-avatar-wrap">
                  <div className="settings-avatar">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Profile avatar" />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleAvatarSelect}
                    className="settings-avatar-action"
                    aria-label="Upload avatar"
                  >
                    <Upload className="h-4 w-4" />
                  </button>
                </div>

                <div className="settings-profile-meta">
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  <div>
                    <p className={labelBase}>Avatar</p>
                    <div className="settings-actions" style={{ marginTop: 0 }}>
                      <button type="button" onClick={handleAvatarSelect} className={`${buttonBase} settings-btn-secondary`}>
                        Change Picture
                      </button>
                      <button type="button" onClick={handleRemoveAvatar} className={`${buttonBase} settings-btn-outline`}>
                        <X className="h-4 w-4" />
                        Remove
                      </button>
                      {avatarFileName ? <span className="settings-muted">Selected: {avatarFileName}</span> : <span className="settings-muted">PNG, JPG, or WebP supported</span>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="settings-field-grid">
                <div className="settings-field">
                  <label className={labelBase}>Full Name</label>
                  <input className={fieldBase} value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Your full name" />
                </div>
                <div className="settings-field">
                  <label className={labelBase}>Email Address</label>
                  <input className={fieldBase} value={email} readOnly />
                </div>
              </div>

              <div className="settings-actions">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className={`${buttonBase} settings-btn-primary`}
                >
                  {savingProfile ? 'Saving Changes...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className={`${buttonBase} settings-btn-outline`}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </Card>

            <Card icon={Shield} title="Security" subtitle="Protect access to your account and identity.">
              <div className="settings-field-grid">
                <div className="settings-field">
                  <label className={labelBase}>Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      className={`${fieldBase} pr-12`}
                      value={currentPassword}
                      onChange={(event) => setCurrentPassword(event.target.value)}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((visible) => !visible)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                      aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="settings-field">
                  <label className={labelBase}>New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      className={`${fieldBase} pr-12`}
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((visible) => !visible)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                      aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <ToggleSwitch
                  checked={prefs.security.twoFactorEnabled}
                  onChange={(checked) => updatePref('security.twoFactorEnabled', checked)}
                  label="Enable Two-Factor Authentication (2FA)"
                  note="Adds an extra verification step when signing in."
                />
              </div>

              {!providerHasPassword ? (
                <p className="settings-note-banner">
                  Password updates are available for email/password accounts only.
                </p>
              ) : null}

              <div className="settings-actions">
                <button
                  type="button"
                  onClick={handleUpdatePassword}
                  disabled={updatingSecurity}
                  className={`${buttonBase} settings-btn-secondary`}
                >
                  <Shield className="h-4 w-4" />
                  {updatingSecurity ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </Card>
          </div>

          <div className="settings-stack">
            <Card icon={SlidersHorizontal} title="Preferences" subtitle="Tune the app experience, language, and notifications.">
              <div className="settings-stack" style={{ gap: 18 }}>
                <div className="settings-field">
                  <label className={labelBase}>Theme</label>
                  <select className={fieldBase} value={prefs.theme} onChange={(event) => updatePref('theme', event.target.value)}>
                    <option value="system">System</option>
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </div>

                <div className="settings-field">
                  <label className={labelBase}>Language</label>
                  <select className={fieldBase} value={prefs.language} onChange={(event) => updatePref('language', event.target.value)}>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="ta">Tamil</option>
                    <option value="fr">French</option>
                  </select>
                </div>

                <div className="settings-toggle-list">
                  <ToggleSwitch checked={prefs.notifications.email} onChange={(checked) => updatePref('notifications.email', checked)} label="Email Notifications" />
                  <ToggleSwitch checked={prefs.notifications.push} onChange={(checked) => updatePref('notifications.push', checked)} label="Push Notifications" />
                  <ToggleSwitch checked={prefs.notifications.dailyChallenge} onChange={(checked) => updatePref('notifications.dailyChallenge', checked)} label="Daily Challenge Reminders" note="Remind me when the daily challenge refreshes." />
                </div>
              </div>

              <div className="settings-actions">
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  disabled={savingPreferences}
                  className={`${buttonBase} settings-btn-primary`}
                >
                  {savingPreferences ? 'Saving Preferences...' : 'Save Preferences'}
                </button>
                <button
                  type="button"
                  onClick={handleResetPreferences}
                  className={`${buttonBase} settings-btn-secondary`}
                >
                  Reset
                </button>
              </div>
            </Card>

            <Card icon={Trophy} title="Leaderboard & Privacy" subtitle="Control how your progress is displayed to the community.">
              <div className="settings-toggle-list">
                <ToggleSwitch
                  checked={prefs.privacy.showOnLeaderboard}
                  onChange={(checked) => updatePref('privacy.showOnLeaderboard', checked)}
                  label="Show my profile on the public Leaderboard"
                  note={prefs.privacy.showOnLeaderboard ? 'Your progress can appear in rankings.' : 'You will be hidden from rankings'}
                />
                <ToggleSwitch
                  checked={prefs.privacy.anonymizeInChallenges}
                  onChange={(checked) => updatePref('privacy.anonymizeInChallenges', checked)}
                  label="Anonymize my name in Daily Challenges"
                  note="Uses a neutral display name when competing in daily events."
                />
              </div>
            </Card>

            <Card icon={Terminal} title="Developer & Lab Settings" subtitle="Keep practice environments fresh and connect external tooling.">
              <div className="settings-stack" style={{ gap: 18 }}>
                <div className="settings-field">
                  <p className={labelBase}>Connected GitHub Account</p>
                  <div className="settings-footer-row">
                    <input
                      className={`${fieldBase} flex-1`}
                      value={prefs.developer.githubAccount}
                      onChange={(event) => updatePref('developer.githubAccount', event.target.value)}
                      placeholder="github-username"
                    />
                    <button
                      type="button"
                      onClick={handleConnectGithub}
                      disabled={connectingGitHub}
                      className={`${buttonBase} settings-btn-secondary settings-btn-inline`}
                    >
                      <Link2 className="h-4 w-4" />
                      {prefs.developer.githubAccount ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                </div>

                <div className="settings-card" style={{ padding: '18px' }}>
                  <div className="flex items-start gap-3">
                    <div className="settings-card-icon" style={{ width: 40, height: 40, color: '#fca5a5', borderColor: 'rgba(239,68,68,0.18)', background: 'rgba(239,68,68,0.10)' }}>
                      <Trash2 className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="settings-toggle-title">Reset Practice Lab Environments</h4>
                      <p className="settings-toggle-note" style={{ fontSize: 13 }}>Clears all temporary data in your Practice Labs.</p>
                      <button
                        type="button"
                        className={`${buttonBase} settings-btn-danger settings-btn-inline`}
                        onClick={() => showToast('info', 'Practice Lab reset is ready to wire to your lab backend.')}
                      >
                        Reset Practice Lab Environments
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="xl:col-span-12">
            <Card
              icon={Trash2}
              title="Account Management"
              subtitle="Manage your account status and data portability."
            >
              <div className="settings-footer-row">
                <div style={{ maxWidth: '780px' }}>
                  <p className="settings-muted" style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>Export your progress when you want a local copy of your learning journey, or remove the account entirely when you are done with LearnCraft.</p>
                  <p className="settings-muted" style={{ marginTop: 8 }}>If your account uses a password, keep the current password filled in above before deleting.</p>
                </div>

                <div className="settings-actions" style={{ marginTop: 0 }}>
                  <button
                    type="button"
                    onClick={handleExportData}
                    disabled={exportingData}
                    className={`${buttonBase} settings-btn-outline`}
                  >
                    <FileDown className="h-4 w-4" />
                    {exportingData ? 'Exporting...' : 'Export My Progress Data'}
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={deletingAccount}
                    className={`${buttonBase} settings-btn-danger`}
                  >
                    <Trash2 className="h-4 w-4" />
                    {deletingAccount ? 'Deleting...' : 'Delete Account'}
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
