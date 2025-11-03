import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Calendar, Coffee, Users, Award } from 'lucide-react';
import Card, { CardBody, CardFooter } from './Card';
import Button from './Button';

interface Alumni {
  id: string;
  full_name: string;
  location: string;
  majors: string[];
  graduation_year: number;
  internships: string[];
  open_to_coffee_chats: boolean;
  open_to_mentorship: boolean;
  available_for_referrals: boolean;
  profile_image?: string;
}

interface AlumniCardProps {
  alumnus: Alumni;
  onRequestConnection: (alumnus: Alumni) => void;
}

const AlumniCard: React.FC<AlumniCardProps> = ({ alumnus, onRequestConnection }) => {
  // Get profile image or use placeholder
  const getProfileImage = () => {
    if (alumnus.profile_image) return alumnus.profile_image;

    // Use a simple placeholder with initials
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(alumnus.full_name)}&background=003594&color=fff&size=256`;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardBody className="flex-grow">
        <div className="flex items-center mb-4">
          <div className="mr-4 flex-shrink-0">
            <img 
              src={getProfileImage()} 
              alt={alumnus.full_name}
              className="h-16 w-16 rounded-full object-cover border-2 border-pittNavy"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-pittDeepNavy">{alumnus.full_name}</h3>
            {alumnus.location && (
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin className="h-3 w-3 mr-1 text-pittNavy" />
                <span>{alumnus.location}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          {alumnus.graduation_year && (
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-pittNavy" />
              <span>Class of {alumnus.graduation_year}</span>
            </div>
          )}
          
          {alumnus.majors && alumnus.majors.length > 0 && (
            <div className="flex items-center text-gray-600">
              <Award className="h-4 w-4 mr-2 text-pittNavy" />
              <span>{alumnus.majors.join(', ')}</span>
            </div>
          )}
          
          {alumnus.internships && alumnus.internships.length > 0 && (
            <div className="flex items-center text-gray-600">
              <Briefcase className="h-4 w-4 mr-2 text-pittNavy" />
              <span>{alumnus.internships.join(', ')}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {alumnus.open_to_coffee_chats && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <Coffee className="h-3 w-3 mr-1" />
              Coffee Chats
            </span>
          )}
          
          {alumnus.open_to_mentorship && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <Users className="h-3 w-3 mr-1" />
              Mentorship
            </span>
          )}
          
          {alumnus.available_for_referrals && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              <Briefcase className="h-3 w-3 mr-1" />
              Referrals
            </span>
          )}
        </div>
      </CardBody>
      
      <CardFooter className="bg-gray-50">
        <div className="flex justify-between items-center">
          <Link
            to={`/alumni/${alumnus.id}`}
            className="text-pittNavy hover:text-pittDeepNavy font-medium"
          >
            View Profile
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onRequestConnection(alumnus)}
          >
            Connect
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AlumniCard;