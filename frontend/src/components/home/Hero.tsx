import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="border-b-4 border-pittGold bg-pittNavy text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-pittGold">
          PittCSC Alumni Network
        </p>
        <h1 className="max-w-3xl font-display text-3xl font-bold leading-tight md:text-4xl">
          Find PittCSC alumni at companies you're interested in, learn about their recruiting
          experiences, and connect with them.
        </h1>

        <div className="mt-8">
          <Link
            to="/alumni"
            className="inline-flex items-center rounded-lg bg-pittGold px-6 py-3 font-semibold text-pittDarkNavy transition-colors hover:bg-pittLightGold"
          >
            Browse alumni
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
