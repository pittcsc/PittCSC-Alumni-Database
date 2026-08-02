import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { userAPI } from '../services/api';
import { AlumniPreview } from '../types';
import Hero from '../components/home/Hero';

// Real employers from the directory — shown as evidence, not decoration.
const COMPANIES = [
  'Anthropic', 'Google', 'Netflix', 'Roblox', 'AWS', 'Plaid',
  'Descope', 'Sol Browser', 'Fragile', 'University of Maryland', 'Harvard',
];

const initials = (name: string | null) =>
  (name || 'AL')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const helpsFor = (a: AlumniPreview) =>
  [
    a.open_to_coffee_chats && 'Coffee chats',
    a.open_to_mentorship && 'Mentorship',
    a.available_for_referrals && 'Referrals',
    a.open_to_resume_review && 'Resume review',
  ].filter(Boolean) as string[];

const AlumCard: React.FC<{ alum: AlumniPreview }> = ({ alum }) => {
  const helps = helpsFor(alum);
  return (
    <Link
      to={`/alumni/${alum.id}`}
      className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-pittNavy text-sm font-bold text-white">
          {initials(alum.full_name)}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-pittDarkNavy">{alum.full_name}</p>
          <p className="truncate text-sm text-gray-600">
            {alum.current_role}
            {alum.current_company ? ` · ${alum.current_company}` : ''}
          </p>
        </div>
      </div>

      <p className="mt-3 flex items-center gap-1 text-sm text-gray-500">
        {alum.location && (
          <>
            <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} />
            {alum.location}
          </>
        )}
        {alum.location && alum.graduation_year ? ' · ' : ''}
        {alum.graduation_year && <span>Class of {alum.graduation_year}</span>}
      </p>

      {helps.length > 0 && (
        <p className="mt-3 border-t border-gray-100 pt-3 text-sm">
          <span className="text-gray-500">Can help with: </span>
          <span className="text-pittNavy">{helps.join(' · ')}</span>
        </p>
      )}
    </Link>
  );
};

const HomePage: React.FC = () => {
  const [alumni, setAlumni] = useState<AlumniPreview[]>([]);

  useEffect(() => {
    userAPI
      .getPreview(12)
      .then((data) => setAlumni(data))
      .catch(() => setAlumni([]));
  }, []);

  return (
    <div>
      <Hero />

      {/* Alumni directory */}
      <section className="bg-pittLight py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-bold text-pittDarkNavy">Alumni directory</h2>
            <Link
              to="/alumni"
              className="inline-flex items-center font-medium text-pittNavy hover:text-pittDeepNavy"
            >
              See all alumni
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {alumni.length === 0 ? (
            <p className="text-gray-500">Loading alumni…</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {alumni.map((a) => (
                <AlumCard key={a.id} alum={a} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Where alumni work */}
      <section className="border-y border-gray-100 bg-white py-14">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-pittDarkNavy">
            Where PittCSC alumni work
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-gray-600">
            Browse the directory by company, role, or graduation year to find alumni who've been
            through the recruiting process at companies you're interested in.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {COMPANIES.map((c) => (
              <span key={c} className="font-medium text-gray-700">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Connect with alumni */}
      <section className="bg-pittNavy py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold">Connect with alumni</h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-300">
            Sign in with your Pitt email to message alumni, ask questions, get recruiting advice, or
            request a referral.
          </p>
          <Link
            to="/login"
            className="mt-8 inline-flex items-center rounded-lg bg-pittGold px-6 py-3 font-semibold text-pittDarkNavy transition-colors hover:bg-pittLightGold"
          >
            Sign in
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
