import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAlumniStore } from '../store/alumniStore';
import { Grid, List, Users, Loader2, AlertCircle } from 'lucide-react';
import AlumniCard from '../components/alumni/AlumniCard';
import AlumniFilters from '../components/alumni/AlumniFilters';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const AlumniListPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { 
    alumni, 
    filteredAlumni, 
    filters, 
    fetchAlumni, 
    applyFilters, 
    searchAlumni,
    clearFilters, 
    isLoading,
    error,
    totalCount,
    currentPage,
    pageSize,
    setCurrentPage
  } = useAlumniStore();
  
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Compute unique values for filters
  const filterOptions = useMemo(() => {
    const locations = new Set<string>();
    const companies = new Set<string>();
    const years = new Set<number>();
    
    alumni.forEach(alumnus => {
      if (alumnus.location) locations.add(alumnus.location);
      if (alumnus.current_company) companies.add(alumnus.current_company);
      if (alumnus.graduation_year) years.add(alumnus.graduation_year);
    });
    
    return {
      locations: Array.from(locations).sort(),
      companies: Array.from(companies).sort(),
      years: Array.from(years).sort((a, b) => b - a)
    };
  }, [alumni]);
  
  // Pagination
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedAlumni = filteredAlumni.slice(startIndex, endIndex);
  
  useEffect(() => {
    // Check authentication (optional - can be removed for public access)
    if (!isAuthenticated) {
      // Optionally redirect to login or show a message
      // navigate('/login');
      // return;
    }

    // Fetch alumni data
    fetchAlumni(currentPage);
  }, [currentPage, isAuthenticated, fetchAlumni]);
  
  const handleConnect = (alumniId: number) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Connection functionality would be implemented here
    console.log('Connect with alumni:', alumniId);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error Loading Alumni
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => fetchAlumni(1)}>
              Try Again
            </Button>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-pittDarkNavy mb-2">
            Alumni Directory
          </h1>
          <p className="text-lg text-gray-600">
            Connect with Pitt CSC alumni from around the world
          </p>
        </div>
        
        {/* Filters */}
        <AlumniFilters
          filters={filters}
          onFiltersChange={applyFilters}
          onSearch={searchAlumni}
          totalResults={filteredAlumni.length}
          uniqueLocations={filterOptions.locations}
          uniqueCompanies={filterOptions.companies}
          uniqueYears={filterOptions.years}
        />
        
        {/* View Mode Toggle and Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-pittNavy text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label="Grid view"
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-pittNavy text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label="List view"
            >
              <List className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            Showing {startIndex + 1}-{Math.min(endIndex, filteredAlumni.length)} of {filteredAlumni.length} alumni
          </div>
        </div>
        
        {/* Alumni Grid/List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-pittNavy" />
            <span className="ml-3 text-lg text-gray-600">Loading alumni...</span>
          </div>
        ) : filteredAlumni.length === 0 ? (
          <Card className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Alumni Found
            </h2>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search criteria
            </p>
            <Button onClick={clearFilters}>
              Clear Filters
            </Button>
          </Card>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedAlumni.map((alumnus) => (
                  <AlumniCard
                    key={alumnus.id}
                    alumnus={alumnus}
                    onConnect={() => handleConnect(alumnus.id)}
                    variant="grid"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedAlumni.map((alumnus) => (
                  <AlumniCard
                    key={alumnus.id}
                    alumnus={alumnus}
                    onConnect={() => handleConnect(alumnus.id)}
                    variant="list"
                  />
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? 'bg-pittNavy text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Connection Request Modal would go here */}
    </div>
  );
};

export default AlumniListPage;