import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Briefcase, 
  Calendar, 
  Coffee, 
  Users, 
  Share2,
  Linkedin,
  Globe,
  Mail,
  Building,
  FileText
} from 'lucide-react';
import { User } from '../../types';
import Card from '../ui/Card';

interface AlumniCardProps {
  alumnus: User;
  onConnect?: () => void;
  variant?: 'grid' | 'list';
}

const AlumniCard: React.FC<AlumniCardProps> = ({ 
  alumnus, 
  onConnect,
  variant = 'grid' 
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getProfileImage = () => {
    if (alumnus.profile_image) {
      return (
        <img 
          src={alumnus.profile_image} 
          alt={alumnus.full_name}
          className="w-full h-full object-cover"
        />
      );
    }
    
    return (
      <div className="w-full h-full bg-gradient-pitt flex items-center justify-center">
        <span className="text-2xl font-bold text-white">
          {getInitials(alumnus.full_name)}
        </span>
      </div>
    );
  };

  if (variant === 'list') {
    return (
      <Card hover className="mb-4">
        <div className="flex items-start space-x-4">
          {/* Profile Image */}
          <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
            {getProfileImage()}
          </div>
          
          {/* Content */}
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <Link 
                  to={`/alumni/${alumnus.id}`}
                  className="text-xl font-semibold text-pittDarkNavy hover:text-pittNavy transition-colors"
                >
                  {alumnus.full_name}
                </Link>
                
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                  {alumnus.current_role && alumnus.current_company && (
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1 text-pittGray-400" />
                      {alumnus.current_role} at {alumnus.current_company}
                    </div>
                  )}
                  
                  {alumnus.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-pittGray-400" />
                      {alumnus.location}
                    </div>
                  )}
                  
                  {alumnus.graduation_year && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-pittGray-400" />
                      Class of {alumnus.graduation_year}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Availability Badges */}
              <div className="flex gap-2">
                {alumnus.open_to_coffee_chats && (
                  <Badge icon={<Coffee className="h-3 w-3" />} tooltip="Open to Coffee Chats" />
                )}
                {alumnus.open_to_mentorship && (
                  <Badge icon={<Users className="h-3 w-3" />} tooltip="Open to Mentorship" />
                )}
                {alumnus.available_for_referrals && (
                  <Badge icon={<Share2 className="h-3 w-3" />} tooltip="Available for Referrals" />
                )}
                {alumnus.open_to_resume_review && (
                  <Badge icon={<FileText className="h-3 w-3" />} tooltip="Open to Resume Review" />
                )}
              </div>
            </div>
            
            {/* Bio */}
            {alumnus.bio && (
              <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                {alumnus.bio}
              </p>
            )}
            
            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <Link
                to={`/alumni/${alumnus.id}`}
                className="text-sm font-medium text-pittNavy hover:text-pittDeepNavy transition-colors"
              >
                View Profile →
              </Link>
              
              {onConnect && (
                <button
                  onClick={onConnect}
                  className="text-sm font-medium text-pittGold hover:text-pittDarkGold transition-colors"
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid variant (default)
  return (
    <Card hover className="h-full flex flex-col">
      {/* Profile Header */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
          {getProfileImage()}
        </div>
        <div className="flex-grow min-w-0">
          <Link 
            to={`/alumni/${alumnus.id}`}
            className="font-semibold text-lg text-pittDarkNavy hover:text-pittNavy transition-colors block truncate"
          >
            {alumnus.full_name}
          </Link>
          {alumnus.current_role && (
            <p className="text-sm text-gray-600 truncate">
              {alumnus.current_role}
            </p>
          )}
        </div>
      </div>
      
      {/* Company and Location */}
      <div className="space-y-2 mb-4 flex-grow">
        {alumnus.current_company && (
          <div className="flex items-center text-sm text-gray-600">
            <Building className="h-4 w-4 mr-2 text-pittGray-400 flex-shrink-0" />
            <span className="truncate">{alumnus.current_company}</span>
          </div>
        )}
        
        {alumnus.location && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-pittGray-400 flex-shrink-0" />
            <span className="truncate">{alumnus.location}</span>
          </div>
        )}
        
        {alumnus.graduation_year && (
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-pittGray-400 flex-shrink-0" />
            Class of {alumnus.graduation_year}
          </div>
        )}
      </div>
      
      {/* Availability Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {alumnus.open_to_coffee_chats && (
          <AvailabilityBadge icon={<Coffee />} label="Coffee Chats" />
        )}
        {alumnus.open_to_mentorship && (
          <AvailabilityBadge icon={<Users />} label="Mentorship" />
        )}
        {alumnus.available_for_referrals && (
          <AvailabilityBadge icon={<Share2 />} label="Referrals" />
        )}
        {alumnus.open_to_resume_review && (
          <AvailabilityBadge icon={<FileText />} label="Resume Review" />
        )}
      </div>
      
      {/* Social Links */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex gap-3">
          {alumnus.linkedin_url && (
            <a
              href={alumnus.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pittGray-400 hover:text-pittNavy transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          )}
          {alumnus.personal_website && (
            <a
              href={alumnus.personal_website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pittGray-400 hover:text-pittNavy transition-colors"
            >
              <Globe className="h-5 w-5" />
            </a>
          )}
          <a
            href={`mailto:${alumnus.email}`}
            className="text-pittGray-400 hover:text-pittNavy transition-colors"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>
        
        {onConnect && (
          <button
            onClick={onConnect}
            className="text-sm font-medium text-pittNavy hover:text-pittDeepNavy transition-colors"
          >
            Connect
          </button>
        )}
      </div>
    </Card>
  );
};

const Badge: React.FC<{ icon: React.ReactNode; tooltip: string }> = ({ icon, tooltip }) => (
  <div className="relative group">
    <div className="p-1.5 rounded-full bg-pittGold/20 text-pittGold">
      {icon}
    </div>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
      {tooltip}
    </div>
  </div>
);

const AvailabilityBadge: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <div className="inline-flex items-center px-2 py-1 rounded-full bg-pittGold/10 text-pittGold text-xs font-medium">
    {React.cloneElement(icon as React.ReactElement, { className: 'h-3 w-3 mr-1' })}
    {label}
  </div>
);

export default AlumniCard;