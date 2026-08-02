import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Users,
  Briefcase,
  Network,
  TrendingUp,
  Award,
  BookOpen,
  Zap
} from 'lucide-react';
import Hero from '../components/home/Hero';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  return (
    <div>
      <Hero />
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-pittDarkNavy mb-4">
              Why Join Our Network?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with a vibrant community of PittCSC alumni and unlock opportunities for growth
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users />}
              title="Alumni Directory"
              description="Browse profiles of successful alumni working at top tech companies worldwide"
              color="text-pittNavy"
              bgColor="bg-pittNavy/10"
            />
            <FeatureCard
              icon={<Briefcase />}
              title="Career Opportunities"
              description="Get referrals and discover job openings through our alumni network"
              color="text-pittGold"
              bgColor="bg-pittGold/10"
            />
            <FeatureCard
              icon={<Network />}
              title="Mentorship Program"
              description="Connect with experienced professionals for guidance and career advice"
              color="text-green-600"
              bgColor="bg-green-100"
            />
            <FeatureCard
              icon={<BookOpen />}
              title="Interview Prep"
              description="Access interview experiences and tips from alumni at your target companies"
              color="text-purple-600"
              bgColor="bg-purple-100"
            />
            <FeatureCard
              icon={<Award />}
              title="Exclusive Events"
              description="Attend alumni meetups, tech talks, and networking events"
              color="text-red-600"
              bgColor="bg-red-100"
            />
            <FeatureCard
              icon={<TrendingUp />}
              title="Career Growth"
              description="Learn from alumni experiences and accelerate your professional development"
              color="text-blue-600"
              bgColor="bg-blue-100"
            />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-pittDarkNavy mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started with the PittCSC Alumni Network in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Create Your Profile"
              description="Sign up and complete your professional profile with your experience and interests"
              icon={<Users />}
            />
            <StepCard
              number="2"
              title="Connect & Network"
              description="Browse alumni profiles, send connection requests, and build your network"
              icon={<Network />}
            />
            <StepCard
              number="3"
              title="Grow Together"
              description="Engage with the community, share opportunities, and help each other succeed"
              icon={<TrendingUp />}
            />
          </div>
          
          <div className="text-center mt-12">
            <Link to="/register">
              <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      
      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-pittGold/10 to-pittGold/5 rounded-2xl p-12 border border-pittGold/20">
            <Zap className="h-12 w-12 text-pittGold mx-auto mb-6" />
            <h2 className="text-3xl font-display font-bold text-pittDarkNavy mb-4">
              Ready to Join the Network?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with fellow PittCSC alumni and take your career to the next level. 
              Registration is free and takes less than 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" rightIcon={<ArrowRight />}>
                  Create Your Profile
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}> = ({ icon, title, description, color, bgColor }) => (
  <Card hover className="text-center group">
    <div className={`inline-flex p-4 rounded-full ${bgColor} mb-4 group-hover:scale-110 transition-transform`}>
      {React.cloneElement(icon as React.ReactElement, { className: `h-8 w-8 ${color}` })}
    </div>
    <h3 className="text-xl font-semibold text-pittDarkNavy mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </Card>
);

const StepCard: React.FC<{
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}> = ({ number, title, description, icon }) => (
  <div className="relative">
    <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center text-pittDarkNavy font-bold text-xl shadow-lg">
      {number}
    </div>
    <Card className="pt-8">
      <div className="flex justify-center mb-4 text-pittNavy">
        {React.cloneElement(icon as React.ReactElement, { className: 'h-10 w-10' })}
      </div>
      <h3 className="text-xl font-semibold text-pittDarkNavy mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Card>
  </div>
);


export default HomePage;