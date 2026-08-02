import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  MapPin,
  Calendar,
  Coffee,
  Users,
  Award,
  Linkedin,
  Globe,
  Edit,
  Briefcase,
  Save,
  X,
  FileText,
} from 'lucide-react';
import Button from '../components/Button';
import Card, { CardHeader, CardBody } from '../components/Card';
import Input from '../components/Input';

interface EditFormState {
  full_name: string;
  location: string;
  graduation_year: string;
  current_company: string;
  current_role: string;
  linkedin_url: string;
  personal_website: string;
  bio: string;
  open_to_coffee_chats: boolean;
  open_to_mentorship: boolean;
  available_for_referrals: boolean;
  open_to_resume_review: boolean;
}

const emptyForm: EditFormState = {
  full_name: '',
  location: '',
  graduation_year: '',
  current_company: '',
  current_role: '',
  linkedin_url: '',
  personal_website: '',
  bio: '',
  open_to_coffee_chats: false,
  open_to_mentorship: false,
  available_for_referrals: false,
  open_to_resume_review: false,
};

const ProfilePage: React.FC = () => {
  const { user, isLoading, error, fetchCurrentUser, updateProfile } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<EditFormState>(emptyForm);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      fetchCurrentUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      setForm({
        full_name: user.full_name || '',
        location: user.location || '',
        graduation_year: user.graduation_year?.toString() || '',
        current_company: user.current_company || '',
        current_role: user.current_role || '',
        linkedin_url: user.linkedin_url || '',
        personal_website: user.personal_website || '',
        bio: user.bio || '',
        open_to_coffee_chats: user.open_to_coffee_chats,
        open_to_mentorship: user.open_to_mentorship,
        available_for_referrals: user.available_for_referrals,
        open_to_resume_review: user.open_to_resume_review,
      });
    }
  }, [user]);

  const handleToggleVisibility = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      await updateProfile({ profile_visible: !user.profile_visible });
    } catch (err) {
      console.error('Error updating profile visibility:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateProfile({
        full_name: form.full_name,
        location: form.location,
        graduation_year: form.graduation_year ? parseInt(form.graduation_year, 10) : undefined,
        current_company: form.current_company,
        current_role: form.current_role,
        linkedin_url: form.linkedin_url,
        personal_website: form.personal_website,
        bio: form.bio,
        open_to_coffee_chats: form.open_to_coffee_chats,
        open_to_mentorship: form.open_to_mentorship,
        available_for_referrals: form.available_for_referrals,
        open_to_resume_review: form.open_to_resume_review,
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-pittLight flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pittNavy mx-auto"></div>
          <p className="mt-4 text-pittDeepNavy">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-pittLight flex items-center justify-center">
        <div className="text-center">
          <p className="text-pittDeepNavy mb-4">You need to be logged in to view your profile.</p>
          <Button variant="primary" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (!user.profile_completed) {
    return (
      <div className="min-h-screen bg-pittLight py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <h1 className="text-2xl font-bold text-pittDeepNavy">Complete Your Profile</h1>
            </CardHeader>
            <CardBody>
              <p className="text-gray-600 mb-6">
                Your profile is not yet complete. Please take a few minutes to set up your profile to connect with the PittCSC community.
              </p>
              <Button variant="primary" onClick={() => navigate('/profile-setup')}>
                Complete Profile
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pittLight py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-pittDeepNavy text-white flex justify-between items-center">
            <h1 className="text-2xl font-bold">Your Profile</h1>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                    className="bg-white bg-opacity-10 border-white text-white"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-white bg-opacity-10 border-white text-white"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="bg-white bg-opacity-10 border-white text-white"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start">
              <div className="md:w-1/3 mb-6 md:mb-0 md:pr-6">
                <div className="bg-pittLight rounded-lg p-6">
                  {isEditing ? (
                    <Input
                      label="Full Name"
                      value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-pittDeepNavy mb-2">{user.full_name}</h2>
                  )}
                  <p className="text-gray-600 mb-4">{user.email}</p>

                  {isEditing ? (
                    <div className="space-y-3 mb-6">
                      <Input
                        label="Location"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                      />
                      <Input
                        label="Graduation Year"
                        type="number"
                        value={form.graduation_year}
                        onChange={(e) => setForm({ ...form, graduation_year: e.target.value })}
                      />
                      <Input
                        label="Current Company"
                        value={form.current_company}
                        onChange={(e) => setForm({ ...form, current_company: e.target.value })}
                      />
                      <Input
                        label="Current Role"
                        value={form.current_role}
                        onChange={(e) => setForm({ ...form, current_role: e.target.value })}
                      />
                      <Input
                        label="LinkedIn URL"
                        value={form.linkedin_url}
                        onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                      />
                      <Input
                        label="Personal Website"
                        value={form.personal_website}
                        onChange={(e) => setForm({ ...form, personal_website: e.target.value })}
                      />
                    </div>
                  ) : (
                    <div className="space-y-3 mb-6">
                      {user.location && (
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-5 w-5 mr-2 text-pittNavy" />
                          <span>{user.location}</span>
                        </div>
                      )}

                      {user.graduation_year && (
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-5 w-5 mr-2 text-pittNavy" />
                          <span>Class of {user.graduation_year}</span>
                        </div>
                      )}

                      {user.current_company && (
                        <div className="flex items-center text-gray-600">
                          <Briefcase className="h-5 w-5 mr-2 text-pittNavy" />
                          <span>
                            {user.current_role ? `${user.current_role} at ` : ''}
                            {user.current_company}
                          </span>
                        </div>
                      )}

                      {user.linkedin_url && (
                        <div className="flex items-center text-gray-600">
                          <Linkedin className="h-5 w-5 mr-2 text-pittNavy" />
                          <a
                            href={user.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pittNavy hover:underline"
                          >
                            LinkedIn Profile
                          </a>
                        </div>
                      )}

                      {user.personal_website && (
                        <div className="flex items-center text-gray-600">
                          <Globe className="h-5 w-5 mr-2 text-pittNavy" />
                          <a
                            href={user.personal_website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pittNavy hover:underline"
                          >
                            Personal Website
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Profile Visibility</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={user.profile_visible}
                          onChange={handleToggleVisibility}
                          disabled={isSaving}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pittNavy/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pittNavy"></div>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      {user.profile_visible
                        ? 'Your profile is visible to PittCSC members'
                        : 'Your profile is hidden from PittCSC members'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 bg-pittLight rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-pittDeepNavy mb-4">Availability</h3>
                  {isEditing ? (
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-pittNavy border-gray-300 rounded focus:ring-pittNavy mr-2"
                          checked={form.open_to_coffee_chats}
                          onChange={(e) => setForm({ ...form, open_to_coffee_chats: e.target.checked })}
                        />
                        <Coffee className="h-4 w-4 mr-1 text-pittNavy" />
                        Open to Coffee Chats
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-pittNavy border-gray-300 rounded focus:ring-pittNavy mr-2"
                          checked={form.open_to_mentorship}
                          onChange={(e) => setForm({ ...form, open_to_mentorship: e.target.checked })}
                        />
                        <Users className="h-4 w-4 mr-1 text-pittNavy" />
                        Open to Mentorship
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-pittNavy border-gray-300 rounded focus:ring-pittNavy mr-2"
                          checked={form.available_for_referrals}
                          onChange={(e) => setForm({ ...form, available_for_referrals: e.target.checked })}
                        />
                        <Award className="h-4 w-4 mr-1 text-pittNavy" />
                        Available for Referrals
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-pittNavy border-gray-300 rounded focus:ring-pittNavy mr-2"
                          checked={form.open_to_resume_review}
                          onChange={(e) => setForm({ ...form, open_to_resume_review: e.target.checked })}
                        />
                        <FileText className="h-4 w-4 mr-1 text-pittNavy" />
                        Open to Resume Review
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${user.open_to_coffee_chats ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className={user.open_to_coffee_chats ? 'text-gray-800' : 'text-gray-500'}>
                          {user.open_to_coffee_chats ? 'Open to' : 'Not available for'} Coffee Chats
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${user.open_to_mentorship ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className={user.open_to_mentorship ? 'text-gray-800' : 'text-gray-500'}>
                          {user.open_to_mentorship ? 'Open to' : 'Not available for'} Mentorship
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${user.available_for_referrals ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className={user.available_for_referrals ? 'text-gray-800' : 'text-gray-500'}>
                          {user.available_for_referrals ? 'Available for' : 'Not available for'} Referrals
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${user.open_to_resume_review ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className={user.open_to_resume_review ? 'text-gray-800' : 'text-gray-500'}>
                          {user.open_to_resume_review ? 'Open to' : 'Not available for'} Resume Review
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:w-2/3">
                <div className="bg-pittLight rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-pittDeepNavy mb-4">About</h3>
                  {isEditing ? (
                    <textarea
                      rows={5}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pittNavy focus:ring focus:ring-pittNavy focus:ring-opacity-50"
                      placeholder="Tell students about yourself..."
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    />
                  ) : user.bio ? (
                    <p className="text-gray-600">{user.bio}</p>
                  ) : (
                    <p className="text-gray-500">No bio added yet</p>
                  )}
                </div>

                <div className="bg-pittLight rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-pittDeepNavy mb-4">Alumni Status</h3>
                  <p className="text-gray-600">
                    {user.is_alumni ? 'You are listed as a PittCSC alumnus.' : 'You are not currently listed as an alumnus.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
