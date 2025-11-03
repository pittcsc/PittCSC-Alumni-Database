import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useConnectionStore } from '../store/connectionStore';
import { userAPI } from '../services/api';
import { MapPin, Briefcase, Calendar, Award, Linkedin, Globe, ArrowLeft, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import ConnectionRequestModal from '../components/ConnectionRequestModal';
import { User } from '../types';

const AlumniDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { createConnectionRequest } = useConnectionStore();
  const navigate = useNavigate();

  const [alumni, setAlumni] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        setIsLoading(true);

        if (!id) {
          throw new Error('Alumni ID is required');
        }

        const alumniData = await userAPI.getUserById(parseInt(id));
        setAlumni(alumniData);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlumni();
  }, [id, navigate]);

  const handleRequestConnection = () => {
    setShowConnectionModal(true);
  };

  const handleSubmitConnectionRequest = async (message: string) => {
    if (!user || !alumni) {
      alert('You must be logged in to send connection requests');
      return;
    }

    try {
      await createConnectionRequest(user.id, alumni.id, message);
      setShowConnectionModal(false);
      alert('Connection request sent successfully!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error sending connection request: ${errorMessage}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pittLight flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pittNavy mx-auto"></div>
          <p className="mt-4 text-pittDeepNavy">Loading alumni profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-pittLight py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-pittDeepNavy mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button
              variant="primary"
              onClick={() => navigate('/alumni')}
            >
              Back to Alumni List
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!alumni) {
    return (
      <div className="min-h-screen bg-pittLight py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-pittDeepNavy mb-4">Alumni Not Found</h2>
            <p className="text-gray-600 mb-6">The alumni profile you're looking for could not be found.</p>
            <Button
              variant="primary"
              onClick={() => navigate('/alumni')}
            >
              Back to Alumni List
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pittLight py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/alumni')}
            className="flex items-center text-pittNavy hover:text-pittDeepNavy"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Alumni List
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-pittDeepNavy text-white flex justify-between items-center">
            <h1 className="text-2xl font-bold">Alumni Profile</h1>
            {user && user.id !== alumni.id && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRequestConnection}
                className="bg-white bg-opacity-10 border-white text-white"
              >
                Request Connection
              </Button>
            )}
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start">
              <div className="md:w-1/3 mb-6 md:mb-0 md:pr-6">
                <div className="flex items-center mb-4">
                  <div className="mr-4 flex-shrink-0">
                    <img
                      src={alumni.profile_image || 'https://via.placeholder.com/150'}
                      alt={alumni.full_name}
                      className="h-24 w-24 rounded-full object-cover border-2 border-pittNavy"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-pittDeepNavy">{alumni.full_name}</h2>
                    {alumni.current_role && alumni.current_company && (
                      <p className="text-gray-600">{alumni.current_role} at {alumni.current_company}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {alumni.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-2 text-pittNavy" />
                      <span>{alumni.location}</span>
                    </div>
                  )}

                  {alumni.graduation_year && (
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-2 text-pittNavy" />
                      <span>Class of {alumni.graduation_year}</span>
                    </div>
                  )}

                  {alumni.linkedin_url && (
                    <div className="flex items-center text-gray-600">
                      <Linkedin className="h-5 w-5 mr-2 text-pittNavy" />
                      <a
                        href={alumni.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pittNavy hover:underline"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}

                  {alumni.personal_website && (
                    <div className="flex items-center text-gray-600">
                      <Globe className="h-5 w-5 mr-2 text-pittNavy" />
                      <a
                        href={alumni.personal_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pittNavy hover:underline"
                      >
                        Personal Website
                      </a>
                    </div>
                  )}
                </div>

                <div className="bg-pittLight rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-pittDeepNavy mb-3">Availability</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${alumni.open_to_coffee_chats ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className={alumni.open_to_coffee_chats ? 'text-gray-800' : 'text-gray-500'}>
                        {alumni.open_to_coffee_chats ? 'Open to' : 'Not available for'} Coffee Chats
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${alumni.open_to_mentorship ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className={alumni.open_to_mentorship ? 'text-gray-800' : 'text-gray-500'}>
                        {alumni.open_to_mentorship ? 'Open to' : 'Not available for'} Mentorship
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${alumni.available_for_referrals ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className={alumni.available_for_referrals ? 'text-gray-800' : 'text-gray-500'}>
                        {alumni.available_for_referrals ? 'Available for' : 'Not available for'} Referrals
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:w-2/3">
                {alumni.current_company && alumni.current_role && (
                  <div className="bg-pittLight rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-pittDeepNavy mb-4">Current Position</h3>
                    <div className="flex items-start">
                      <Briefcase className="h-5 w-5 mr-2 text-pittNavy flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">{alumni.current_role}</p>
                        <p className="text-gray-600">{alumni.current_company}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-pittLight rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-pittDeepNavy mb-4">Education</h3>
                  <div className="space-y-2">
                    {alumni.graduation_year ? (
                      <div className="flex items-start">
                        <Award className="h-5 w-5 mr-2 text-pittNavy flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">University of Pittsburgh</p>
                          <p className="text-gray-500 text-sm">Class of {alumni.graduation_year}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">No education information available</p>
                    )}
                  </div>
                </div>

                {alumni.bio && (
                  <div className="bg-pittLight rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-pittDeepNavy mb-4">Bio</h3>
                    <p className="text-gray-600">{alumni.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConnectionModal && (
        <ConnectionRequestModal
          alumnus={alumni}
          onClose={() => setShowConnectionModal(false)}
          onSubmit={handleSubmitConnectionRequest}
        />
      )}
    </div>
  );
};

export default AlumniDetailPage;
