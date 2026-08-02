import React, { useState, useEffect, useMemo } from 'react';
import { Search, Briefcase, CheckCircle, XCircle, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { interviewAPI, companyAPI } from '../services/api';
import { Interview, Company } from '../types';
import Button from '../components/Button';
import Card, { CardHeader, CardBody } from '../components/Card';

interface NewInterviewFormData {
  company_name: string;
  role: string;
  internship: boolean;
  season: string; // YYYY-MM-DD, sent as ISO date string
  passed: boolean;
  note: string;
}

const emptyForm: NewInterviewFormData = {
  company_name: '',
  role: '',
  internship: true,
  season: new Date().toISOString().slice(0, 10),
  passed: true,
  note: '',
};

const CompanyProcessesPage: React.FC = () => {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newInterview, setNewInterview] = useState<NewInterviewFormData>(emptyForm);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [interviewsResponse, companiesResponse] = await Promise.all([
        interviewAPI.getInterviews(),
        companyAPI.getCompanies(),
      ]);

      setInterviews(interviewsResponse?.data || []);
      setCompanies(companiesResponse?.data || []);
    } catch (err: any) {
      console.error('Error loading interview data:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to load interview processes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Group interviews by company name
  const interviewsByCompany = useMemo(() => {
    const grouped = new Map<string, Interview[]>();

    for (const interview of interviews) {
      const key = interview.company_name;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(interview);
    }

    // Ensure companies with no interviews yet still show up if they exist
    for (const company of companies) {
      if (!grouped.has(company.name)) {
        grouped.set(company.name, []);
      }
    }

    return grouped;
  }, [interviews, companies]);

  const filteredCompanyNames = useMemo(() => {
    const names = Array.from(interviewsByCompany.keys());
    if (!searchTerm.trim()) return names;

    const term = searchTerm.toLowerCase();
    return names.filter((name) => {
      if (name.toLowerCase().includes(term)) return true;
      const companyInterviews = interviewsByCompany.get(name) || [];
      return companyInterviews.some((i) => i.role.toLowerCase().includes(term));
    });
  }, [interviewsByCompany, searchTerm]);

  const toggleCompany = (companyName: string) => {
    setExpandedCompany((prev) => (prev === companyName ? null : companyName));
  };

  const getResultColor = (passed: boolean) => (passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newInterview.company_name || !newInterview.role || !newInterview.season) {
      alert('Please fill in all required fields');
      return;
    }

    if (!user) {
      alert('You must be logged in to share an interview experience');
      return;
    }

    try {
      setIsSubmitting(true);

      await interviewAPI.createInterview({
        user_id: user.id,
        company_name: newInterview.company_name,
        role: newInterview.role,
        internship: newInterview.internship,
        season: new Date(newInterview.season).toISOString(),
        passed: newInterview.passed,
        note: newInterview.note,
        date: new Date(newInterview.season).toISOString(),
      });

      // Refetch to pick up the new interview
      await loadData();

      setNewInterview(emptyForm);
      setShowAddForm(false);
      setExpandedCompany(newInterview.company_name);
    } catch (err: any) {
      console.error('Error submitting interview:', err);
      alert(err.response?.data?.detail || err.message || 'Failed to submit interview process');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-pittLight py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-pittDeepNavy">Company Interview Processes</h1>
            <p className="text-gray-600 mt-1">
              Learn about interview processes at top tech companies from PittCSC alumni experiences
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)} className="flex items-center">
              {showAddForm ? (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Interview Process
                </>
              )}
            </Button>
          </div>
        </div>

        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-xl font-semibold text-pittDeepNavy">Share Your Interview Experience</h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name*</label>
                    <input
                      type="text"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pittNavy focus:ring focus:ring-pittNavy focus:ring-opacity-50"
                      value={newInterview.company_name}
                      onChange={(e) => setNewInterview({ ...newInterview, company_name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role*</label>
                    <input
                      type="text"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pittNavy focus:ring focus:ring-pittNavy focus:ring-opacity-50"
                      value={newInterview.role}
                      onChange={(e) => setNewInterview({ ...newInterview, role: e.target.value })}
                      placeholder="Software Engineer, Product Manager, etc."
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Season / Date*</label>
                    <input
                      type="date"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pittNavy focus:ring focus:ring-pittNavy focus:ring-opacity-50"
                      value={newInterview.season}
                      onChange={(e) => setNewInterview({ ...newInterview, season: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position Type</label>
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pittNavy focus:ring focus:ring-pittNavy focus:ring-opacity-50"
                      value={newInterview.internship ? 'internship' : 'fulltime'}
                      onChange={(e) =>
                        setNewInterview({ ...newInterview, internship: e.target.value === 'internship' })
                      }
                    >
                      <option value="internship">Internship</option>
                      <option value="fulltime">Full-Time</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Result</label>
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pittNavy focus:ring focus:ring-pittNavy focus:ring-opacity-50"
                      value={newInterview.passed ? 'passed' : 'not_passed'}
                      onChange={(e) => setNewInterview({ ...newInterview, passed: e.target.value === 'passed' })}
                    >
                      <option value="passed">Passed</option>
                      <option value="not_passed">Did Not Pass</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Tips</label>
                  <textarea
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pittNavy focus:ring focus:ring-pittNavy focus:ring-opacity-50"
                    value={newInterview.note}
                    onChange={(e) => setNewInterview({ ...newInterview, note: e.target.value })}
                    rows={4}
                    placeholder="Describe the interview rounds, format, and any tips for future candidates..."
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="mr-2"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Interview Process'}
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        )}

        <div className="mb-8">
          <form onSubmit={(e) => e.preventDefault()} className="flex w-full">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-pittNavy focus:border-pittNavy sm:text-sm"
                placeholder="Search companies or roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pittNavy"></div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-xl font-semibold text-pittDeepNavy mb-2">Error loading interview processes</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button variant="outline" onClick={loadData}>
              Try Again
            </Button>
          </div>
        ) : filteredCompanyNames.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-xl font-semibold text-pittDeepNavy mb-2">No companies found</h3>
            <p className="text-gray-600 mb-4">
              {interviews.length === 0
                ? 'No interview experiences have been shared yet. Be the first!'
                : 'No companies match your search criteria. Try a different search term.'}
            </p>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm('')}>
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCompanyNames.map((companyName) => {
              const companyInterviews = interviewsByCompany.get(companyName) || [];
              const isExpanded = expandedCompany === companyName;
              const company = companies.find((c) => c.name === companyName);

              return (
                <Card key={companyName} className="overflow-hidden">
                  <div
                    className="px-6 py-4 border-b border-gray-200 bg-white cursor-pointer"
                    onClick={() => toggleCompany(companyName)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {company?.image_url ? (
                          <img
                            src={company.image_url}
                            alt={`${companyName} logo`}
                            className="h-10 w-10 mr-4 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="h-10 w-10 mr-4 rounded-full bg-pittLight flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-pittNavy" />
                          </div>
                        )}
                        <div>
                          <h2 className="text-xl font-semibold text-pittDeepNavy">{companyName}</h2>
                          <p className="text-sm text-gray-500">
                            {companyInterviews.length} interview {companyInterviews.length === 1 ? 'report' : 'reports'}
                          </p>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <CardBody className="bg-gray-50">
                      {companyInterviews.length === 0 ? (
                        <p className="text-gray-500">No interview reports for this company yet.</p>
                      ) : (
                        <div className="space-y-4">
                          {companyInterviews.map((interview) => (
                            <div key={interview.id} className="bg-white rounded-lg shadow-sm p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="text-md font-semibold text-gray-800">{interview.role}</h4>
                                  <p className="text-sm text-gray-500">
                                    {interview.internship ? 'Internship' : 'Full-Time'} &middot;{' '}
                                    {new Date(interview.season).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                    })}
                                  </p>
                                </div>
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getResultColor(
                                    interview.passed
                                  )}`}
                                >
                                  {interview.passed ? (
                                    <>
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Passed
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="h-3 w-3 mr-1" />
                                      Did Not Pass
                                    </>
                                  )}
                                </span>
                              </div>

                              {interview.note && (
                                <div className="bg-gray-50 p-3 rounded-md mt-3">
                                  <p className="text-sm text-gray-700">{interview.note}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardBody>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-pittDeepNavy mb-4">Contribute Your Experience</h2>
          <p className="text-gray-600 mb-4">
            Help fellow PittCSC members by sharing your interview experiences at companies you've interviewed with.
          </p>
          <Button variant="primary" onClick={() => setShowAddForm(true)}>
            <Briefcase className="h-4 w-4 mr-2" />
            Share Interview Experience
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyProcessesPage;
