import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';

const TOTAL_STEPS = 6;

// Step 1: Location
const LocationStep: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}> = ({ value, onChange, onNext }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-pittDeepNavy">Where are you currently located?</h2>
      <p className="text-gray-600">
        This helps students connect with alumni in their desired locations.
      </p>

      <Input
        label="Current Location (City, State, Country)"
        placeholder="Pittsburgh, PA, USA"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />

      <div className="flex justify-end">
        <Button variant="primary" onClick={onNext} disabled={!value} className="flex items-center">
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Step 2: Graduation Year
const GraduationYearStep: React.FC<{
  value: number | null;
  onChange: (value: number) => void;
  onNext: () => void;
  onPrev: () => void;
}> = ({ value, onChange, onNext, onPrev }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-pittDeepNavy">When did you graduate?</h2>
      <p className="text-gray-600">Select your graduation year from Pitt.</p>

      <Select
        label="Graduation Year"
        options={years.map((year) => ({ value: year.toString(), label: year.toString() }))}
        value={value?.toString() || ''}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        required
      />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} className="flex items-center">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>
        <Button variant="primary" onClick={onNext} disabled={!value} className="flex items-center">
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Step 3: Current Company & Role
const CompanyRoleStep: React.FC<{
  company: string;
  role: string;
  onCompanyChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
}> = ({ company, role, onCompanyChange, onRoleChange, onNext, onPrev }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-pittDeepNavy">Where do you currently work?</h2>
      <p className="text-gray-600">
        Let students know where you work now so they can find alumni at companies they're interested in.
      </p>

      <Input
        label="Current Company"
        placeholder="e.g., Google"
        value={company}
        onChange={(e) => onCompanyChange(e.target.value)}
      />

      <Input
        label="Current Role"
        placeholder="e.g., Software Engineer"
        value={role}
        onChange={(e) => onRoleChange(e.target.value)}
      />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} className="flex items-center">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>
        <Button variant="primary" onClick={onNext} className="flex items-center">
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Step 4: LinkedIn URL
const LinkedInStep: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
}> = ({ value, onChange, onNext, onPrev }) => {
  const [error, setError] = useState('');

  const validateLinkedIn = (url: string) => {
    if (!url) return true;

    const linkedInRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+\/?$/;
    return linkedInRegex.test(url);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    onChange(url);

    if (url && !validateLinkedIn(url)) {
      setError('Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username)');
    } else {
      setError('');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-pittDeepNavy">What's your LinkedIn profile?</h2>
      <p className="text-gray-600">
        Add your LinkedIn URL to help students learn more about your professional background.
      </p>

      <Input
        label="LinkedIn URL"
        placeholder="https://linkedin.com/in/username"
        value={value}
        onChange={handleChange}
        error={error}
      />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} className="flex items-center">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>
        <Button variant="primary" onClick={onNext} disabled={!!error} className="flex items-center">
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Step 5: Availability
interface AvailabilityValues {
  openToCoffeeChats: boolean;
  openToMentorship: boolean;
  availableForReferrals: boolean;
  openToResumeReview: boolean;
}

const AvailabilityStep: React.FC<{
  values: AvailabilityValues;
  onChange: (key: keyof AvailabilityValues, value: boolean) => void;
  onNext: () => void;
  onPrev: () => void;
}> = ({ values, onChange, onNext, onPrev }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-pittDeepNavy">How would you like to help students?</h2>
      <p className="text-gray-600">
        Select the ways you're willing to connect with and support current Pitt CS students.
      </p>

      <div className="space-y-4">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="coffeeChats"
              name="coffeeChats"
              type="checkbox"
              className="h-4 w-4 text-pittNavy border-gray-300 rounded focus:ring-pittNavy"
              checked={values.openToCoffeeChats}
              onChange={(e) => onChange('openToCoffeeChats', e.target.checked)}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="coffeeChats" className="font-medium text-gray-700">
              Open to Coffee Chats
            </label>
            <p className="text-gray-500">
              Willing to have informal conversations with students about your career path and experiences.
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="mentorship"
              name="mentorship"
              type="checkbox"
              className="h-4 w-4 text-pittNavy border-gray-300 rounded focus:ring-pittNavy"
              checked={values.openToMentorship}
              onChange={(e) => onChange('openToMentorship', e.target.checked)}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="mentorship" className="font-medium text-gray-700">
              Open to Mentorship
            </label>
            <p className="text-gray-500">
              Willing to provide ongoing guidance and support to students over a longer period.
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="referrals"
              name="referrals"
              type="checkbox"
              className="h-4 w-4 text-pittNavy border-gray-300 rounded focus:ring-pittNavy"
              checked={values.availableForReferrals}
              onChange={(e) => onChange('availableForReferrals', e.target.checked)}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="referrals" className="font-medium text-gray-700">
              Available for Referrals
            </label>
            <p className="text-gray-500">Willing to refer qualified students for positions at your company.</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="resumeReview"
              name="resumeReview"
              type="checkbox"
              className="h-4 w-4 text-pittNavy border-gray-300 rounded focus:ring-pittNavy"
              checked={values.openToResumeReview}
              onChange={(e) => onChange('openToResumeReview', e.target.checked)}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="resumeReview" className="font-medium text-gray-700">
              Open to Resume Review
            </label>
            <p className="text-gray-500">Willing to review student resumes and provide feedback.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} className="flex items-center">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>
        <Button variant="primary" onClick={onNext} className="flex items-center">
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Step 6: Additional Info
const AdditionalInfoStep: React.FC<{
  values: {
    personalWebsite: string;
    bio: string;
  };
  onChange: (key: 'personalWebsite' | 'bio', value: string) => void;
  onSubmit: () => void;
  onPrev: () => void;
  isSubmitting: boolean;
}> = ({ values, onChange, onSubmit, onPrev, isSubmitting }) => {
  const [websiteError, setWebsiteError] = useState('');

  const validateWebsite = (url: string) => {
    if (!url) return true;

    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    onChange('personalWebsite', url);

    if (url && !validateWebsite(url)) {
      setWebsiteError('Please enter a valid URL (e.g., https://example.com)');
    } else {
      setWebsiteError('');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-pittDeepNavy">Additional Information</h2>
      <p className="text-gray-600">Add any other details you'd like to share with students.</p>

      <Input
        label="Personal Website (Optional)"
        placeholder="https://example.com"
        value={values.personalWebsite}
        onChange={handleWebsiteChange}
        error={websiteError}
      />

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
          Bio (Optional)
        </label>
        <textarea
          id="bio"
          rows={4}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pittNavy focus:ring focus:ring-pittNavy focus:ring-opacity-50"
          placeholder="Share any other information that might be helpful for students..."
          value={values.bio}
          onChange={(e) => onChange('bio', e.target.value)}
        />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} className="flex items-center">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>
        <Button variant="primary" onClick={onSubmit} disabled={!!websiteError || isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Complete Profile'}
        </Button>
      </div>
    </div>
  );
};

const ProfileSetupPage: React.FC = () => {
  const { user, isLoading, error, fetchCurrentUser, updateProfile } = useAuthStore();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [location, setLocation] = useState('');
  const [graduationYear, setGraduationYear] = useState<number | null>(null);
  const [currentCompany, setCurrentCompany] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [personalWebsite, setPersonalWebsite] = useState('');
  const [bio, setBio] = useState('');
  const [openToCoffeeChats, setOpenToCoffeeChats] = useState(false);
  const [openToMentorship, setOpenToMentorship] = useState(false);
  const [availableForReferrals, setAvailableForReferrals] = useState(false);
  const [openToResumeReview, setOpenToResumeReview] = useState(false);

  useEffect(() => {
    if (!user) {
      fetchCurrentUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user?.profile_completed) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const handleNext = () => setCurrentStep((s) => s + 1);
  const handlePrev = () => setCurrentStep((s) => s - 1);

  const handleAvailabilityChange = (key: string, value: boolean) => {
    if (key === 'openToCoffeeChats') setOpenToCoffeeChats(value);
    if (key === 'openToMentorship') setOpenToMentorship(value);
    if (key === 'availableForReferrals') setAvailableForReferrals(value);
    if (key === 'openToResumeReview') setOpenToResumeReview(value);
  };

  const handleAdditionalInfoChange = (key: string, value: string) => {
    if (key === 'personalWebsite') setPersonalWebsite(value);
    if (key === 'bio') setBio(value);
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      setIsSubmitting(true);

      // Persist the core User profile fields via PATCH /users/me.
      await updateProfile({
        location,
        graduation_year: graduationYear ?? undefined,
        current_company: currentCompany,
        current_role: currentRole,
        linkedin_url: linkedinUrl,
        personal_website: personalWebsite,
        bio,
        open_to_coffee_chats: openToCoffeeChats,
        open_to_mentorship: openToMentorship,
        available_for_referrals: availableForReferrals,
        open_to_resume_review: openToResumeReview,
        profile_completed: true,
        profile_visible: true,
        is_alumni: true,
      });

      // TODO: Employment and interview history are not collected in this wizard
      // (they require start/end dates, seasons, roles, etc. beyond what's gathered
      // here). Once we have a UI for that, wire it to:
      //   employmentAPI.createEmployment({ user_id, company_name, role, start_date, end_date, current })
      //   interviewAPI.createInterview({ user_id, company_name, role, internship, season, passed, note })
      // For now, alumni can log interview history from the Interview Prep page
      // (CompanyProcessesPage), which is already wired to interviewAPI.

      navigate('/profile');
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-pittLight flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pittNavy mx-auto"></div>
          <p className="mt-4 text-pittDeepNavy">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-pittLight flex items-center justify-center">
        <div className="text-center">
          <p className="text-pittDeepNavy mb-4">You need to be logged in to set up your profile.</p>
          <Button variant="primary" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <LocationStep value={location} onChange={setLocation} onNext={handleNext} />;
      case 2:
        return (
          <GraduationYearStep
            value={graduationYear}
            onChange={setGraduationYear}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 3:
        return (
          <CompanyRoleStep
            company={currentCompany}
            role={currentRole}
            onCompanyChange={setCurrentCompany}
            onRoleChange={setCurrentRole}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 4:
        return (
          <LinkedInStep value={linkedinUrl} onChange={setLinkedinUrl} onNext={handleNext} onPrev={handlePrev} />
        );
      case 5:
        return (
          <AvailabilityStep
            values={{ openToCoffeeChats, openToMentorship, availableForReferrals, openToResumeReview }}
            onChange={handleAvailabilityChange}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 6:
        return (
          <AdditionalInfoStep
            values={{ personalWebsite, bio }}
            onChange={handleAdditionalInfoChange}
            onSubmit={handleSubmit}
            onPrev={handlePrev}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-pittLight py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-pittDeepNavy text-white">
            <h1 className="text-2xl font-bold">Complete Your Alumni Profile</h1>
            <p className="text-sm mt-1">
              Step {currentStep} of {TOTAL_STEPS}
            </p>
          </div>

          <div className="px-6 py-6">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div
                className="bg-pittGold h-2.5 rounded-full"
                style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
              ></div>
            </div>

            {/* Steps */}
            <div className="flex overflow-x-auto pb-4 mb-6">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
                <div
                  key={step}
                  className={`flex flex-col items-center mx-2 ${
                    step <= currentStep ? 'text-pittNavy' : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      step < currentStep
                        ? 'bg-pittGold text-white'
                        : step === currentStep
                        ? 'bg-pittNavy text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
                  </div>
                </div>
              ))}
            </div>

            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
