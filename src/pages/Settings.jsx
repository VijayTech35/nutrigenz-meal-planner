import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import { PageTransition, FadeIn } from '../components/Animations';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Toggle } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Trash2, Save, Bell, Shield, Palette, HelpCircle, LogOut } from 'lucide-react';
import api from '../services/api';

const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo'];
const CUISINES = ['Any', 'Italian', 'Mexican', 'Indian', 'Chinese', 'Japanese', 'Thai', 'French', 'Mediterranean', 'American'];

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [preferences, setPreferences] = useState({ dietary_restrictions: [], allergies: [], preferred_cuisines: [], default_servings: 4, measurement_unit: 'metric' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => { fetchUserData(); }, []);

  const fetchUserData = async () => {
    try {
      const res = await api.get('/users/profile');
      const data = res.data.data;
      setProfile({ name: data.user?.name || '', email: data.user?.email || '' });
      if (data.preferences) setPreferences({ dietary_restrictions: data.preferences.dietary_restrictions || [], allergies: data.preferences.allergies || [], preferred_cuisines: data.preferences.preferred_cuisines || [], default_servings: data.preferences.default_servings || 4, measurement_unit: data.preferences.measurement_unit || 'metric' });
    } catch (error) { console.error(error); toast.error('Failed to load profile');
    } finally { setLoading(false); }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await api.put('/users/profile', { name: profile.name }); toast.success('Profile updated!'); } catch (error) { toast.error('Failed to update');
    } finally { setSaving(false); }
  };

  const handlePreferencesUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/users/preferences', { dietaryRestrictions: preferences.dietary_restrictions, allergies: preferences.allergies, preferredCuisines: preferences.preferred_cuisines, defaultServings: preferences.default_servings, measurementUnit: preferences.measurement_unit });
      toast.success('Preferences saved!');
    } catch (error) { toast.error('Failed to save');
    } finally { setSaving(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (passwordData.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setSaving(true);
    try { await api.put('/users/password', { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword }); toast.success('Password changed!'); setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); } catch (error) { toast.error(error.response?.data?.message || 'Failed to change');
    } finally { setSaving(false); }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure? This cannot be undone.')) return;
    const confirmation = prompt('Type "DELETE" to confirm:');
    if (confirmation !== 'DELETE') { toast.error('Deletion cancelled'); return; }
    try { await api.delete('/users/account'); toast.success('Account deleted'); logout(); navigate('/login'); } catch (error) { toast.error('Failed to delete'); }
  };

  const toggleArray = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter(v => v !== value) : [...prev[field], value]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse space-y-6">
          {[1,2,3,4].map(i => <div key={i} className="h-48 bg-slate-200 dark:bg-slate-700 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account and preferences</p>
          </div>

          <div className="space-y-6">
            <FadeIn>
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar name={profile.name} size="xl" />
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{profile.name || 'User'}</h2>
                    <p className="text-slate-500">{profile.email}</p>
                  </div>
                </div>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <Input label="Full Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} required />
                  <Input label="Email" value={profile.email} disabled className="opacity-50" />
                  <Button variant="primary" type="submit" loading={saving} icon={<Save className="w-4 h-4" />}>Save Profile</Button>
                </form>
              </Card>
            </FadeIn>

            <FadeIn delay={100}>
              <Card className="p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2"><Lock className="w-5 h-5 text-blue-500" /> Change Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <Input label="Current Password" type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} required />
                  <Input label="New Password" type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} required minLength={6} />
                  <Input label="Confirm New Password" type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required minLength={6} />
                  <Button variant="primary" type="submit" loading={saving} icon={<Lock className="w-4 h-4" />}>Change Password</Button>
                </form>
              </Card>
            </FadeIn>

            <FadeIn delay={200}>
              <Card className="p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2"><Shield className="w-5 h-5 text-emerald-500" /> Dietary Preferences</h2>
                <form onSubmit={handlePreferencesUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Dietary Restrictions</label>
                    <div className="flex flex-wrap gap-2">
                      {DIETARY_OPTIONS.map(opt => (
                        <button key={opt} type="button" onClick={() => toggleArray('dietary_restrictions', opt)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${preferences.dietary_restrictions.includes(opt) ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-emerald-50'}`}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <Input label="Allergies (comma-separated)" value={preferences.allergies.join(', ')} onChange={(e) => setPreferences({ ...preferences, allergies: e.target.value.split(',').map(a => a.trim()).filter(Boolean) })} placeholder="e.g., peanuts, shellfish" />
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Preferred Cuisines</label>
                    <div className="flex flex-wrap gap-2">
                      {CUISINES.map(c => (
                        <button key={c} type="button" onClick={() => toggleArray('preferred_cuisines', c)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${preferences.preferred_cuisines.includes(c) ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-emerald-50'}`}>{c}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Default Servings: {preferences.default_servings}</label>
                    <input type="range" min="1" max="12" value={preferences.default_servings} onChange={(e) => setPreferences({ ...preferences, default_servings: parseInt(e.target.value) })}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Measurement Unit</label>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setPreferences({ ...preferences, measurement_unit: 'metric' })}
                        className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${preferences.measurement_unit === 'metric' ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-slate-600'}`}>Metric (kg, L)</button>
                      <button type="button" onClick={() => setPreferences({ ...preferences, measurement_unit: 'imperial' })}
                        className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${preferences.measurement_unit === 'imperial' ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-slate-600'}`}>Imperial (lb, gal)</button>
                    </div>
                  </div>
                  <Button variant="primary" type="submit" loading={saving} icon={<Save className="w-4 h-4" />}>Save Preferences</Button>
                </form>
              </Card>
            </FadeIn>

            <FadeIn delay={300}>
              <Card className="p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2"><Bell className="w-5 h-5 text-purple-500" /> Notifications</h2>
                <div className="space-y-4">
                  <Toggle checked defaultChecked label="Meal Plan Reminders" />
                  <Toggle checked defaultChecked label="Pantry Expiry Alerts" />
                  <Toggle label="Weekly Recipe Suggestions" />
                </div>
              </Card>
            </FadeIn>

            <FadeIn delay={400}>
              <Card className="p-6 border-red-200 dark:border-red-800/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center"><Trash2 className="w-5 h-5 text-red-600" /></div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Danger Zone</h2>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-4">Once deleted, your account and all data will be permanently removed.</p>
                <Button variant="danger" onClick={handleDeleteAccount}><Trash2 className="w-4 h-4" /> Delete Account</Button>
              </Card>
            </FadeIn>
          </div>
        </div>
        <MobileNav />
      </div>
    </PageTransition>
  );
};

export default Settings;
