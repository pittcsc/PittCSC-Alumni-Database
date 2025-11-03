import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { MapPin, Briefcase, Calendar, Award, Linkedin, Globe, Edit } from 'lucide-react';
import Button from '../components/Button';
import Card, { CardHeader, CardBody } from '../components/Card';

const ProfilePage: React.FC = () => {
  const { user, updateProfile, fetchCurrentUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current user data when the page loads
    const loadUserData = async () => {
      await fetchCurrentUser();

      // If no user after fetching, redirect to login
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) {
        navigate('/login');
      }
    };

    loadUserData();
  }, [fetchCurrentUser, navigate]);

  const handleEditProfile = () => {
    setIsEditing(true);
    // Navigate to edit profile page or open modal
  };

  const handleToggleVisibility = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      await updateProfile({ profile_visible: !user.profile_visible });
    } catch (error) {
      console.error('Error updating profile visibility:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-pittLight flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pittNavy mx-auto"></div>
          <p className="mt-4 text-pittDeepNavy">Loading profile...</p>
        </div>
      </div>
    );
  }

  const isProfileIncomplete = user.profile_completed === false;

  if (isProfileIncomplete) {
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
              <Button
                variant="primary"
                onClick={() => navigate('/profile-setup')}
              >
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
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-pittDeepNavy text-white flex justify-between items-center">
            <h1 className="text-2xl font-bold">Your Profile</h1>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditProfile}
                className="bg-white bg-opacity-10 border-white text-white"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start">
              <div className="md:w-1/3 mb-6 md:mb-0 md:pr-6">
                <div className="bg-pittLight rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-pittDeepNavy mb-2">{user.full_name}</h2>
                  <p className="text-gray-600 mb-4">{user.email}</p>

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

                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Profile Visibility</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={user.profile_visible}
                          onChange={handleToggleVisibility}
                          disabled={isLoading}
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
                  </div>
                </div>
              </div>

              <div className="md:w-2/3">
                <div className="bg-pittLight rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-pittDeepNavy mb-4">Current Position</h3>
                  {user.current_company && user.current_role ? (
                    <div className="flex items-start">
                      <Briefcase className="h-5 w-5 mr-2 text-pittNavy flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">{user.current_role}</p>
                        <p className="text-gray-600">{user.current_company}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No current position added</p>
                  )}
                </div>

                <div className="bg-pittLight rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-pittDeepNavy mb-4">Education</h3>
                  <div className="space-y-2">
                    {user.graduation_year ? (
                      <div className="flex items-start">
                        <Award className="h-5 w-5 mr-2 text-pittNavy flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">University of Pittsburgh</p>
                          {user.graduation_year && (
                            <p className="text-gray-500 text-sm">Class of {user.graduation_year}</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">No education information added</p>
                    )}
                  </div>
                </div>

                {user.bio && (
                  <div className="bg-pittLight rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-pittDeepNavy mb-4">Bio</h3>
                    <p className="text-gray-600">{user.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
