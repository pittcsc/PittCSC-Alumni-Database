import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Calendar } from 'lucide-react';

const EventsPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Note: Events API is not yet implemented in the backend
  // This page will need to be updated once the events endpoint is available

  return (
    <div className="min-h-screen bg-pittLight py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Calendar className="h-8 w-8 text-pittGold mr-3" />
          <h1 className="text-3xl font-bold text-pittDeepNavy">PittCSC Events</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-xl font-semibold text-pittDeepNavy mb-2">Events Coming Soon</h3>
          <p className="text-gray-600">
            The events feature is currently being developed. Check back soon for upcoming PittCSC events!
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
