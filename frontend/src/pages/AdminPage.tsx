import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAdminStore } from '../store/adminStore';
import { Users, UserCheck, BarChart2, Settings } from 'lucide-react';
import Button from '../components/Button';
import Card, { CardHeader, CardBody } from '../components/Card';

const AdminPage: React.FC = () => {
  const { user } = useAuthStore();
  const {
    users,
    pendingAlumni,
    analytics,
    fetchUsers,
    fetchPendingAlumni,
    fetchAnalytics,
    approveAlumni,
    rejectAlumni,
    updateUserRole,
    isLoading,
  } = useAdminStore();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'pending' | 'settings'>('dashboard');
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!user?.is_superuser) {
      navigate('/');
      return;
    }
    
    fetchAnalytics();
    
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'pending') {
      fetchPendingAlumni();
    }
  }, [user, navigate, activeTab, fetchAnalytics, fetchUsers, fetchPendingAlumni]);
  
  const handleApproveAlumni = async (userId: string) => {
    await approveAlumni(userId);
  };
  
  const handleRejectAlumni = async (userId: string) => {
    await rejectAlumni(userId);
  };
  
  const handleToggleAdminRole = async (userId: string, isCurrentlyAdmin: boolean) => {
    await updateUserRole(userId, !isCurrentlyAdmin);
  };
  
  const renderDashboard = () => (
    <div>
      <h2 className="text-2xl font-bold text-pittDeepNavy mb-6">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{analytics.totalUsers}</h3>
            <p className="text-sm text-gray-500">Total Users</p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{analytics.totalAlumni}</h3>
            <p className="text-sm text-gray-500">Verified Alumni</p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <BarChart2 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{analytics.totalConnections}</h3>
            <p className="text-sm text-gray-500">Total Connections</p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <UserCheck className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{analytics.acceptanceRate.toFixed(1)}%</h3>
            <p className="text-sm text-gray-500">Connection Acceptance Rate</p>
          </CardBody>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-pittDeepNavy">Pending Alumni Approvals</h3>
          </CardHeader>
          <CardBody>
            {pendingAlumni.length === 0 ? (
              <p className="text-gray-500">No pending alumni approvals</p>
            ) : (
              <div className="space-y-4">
                {pendingAlumni.slice(0, 3).map((alumnus) => (
                  <div key={alumnus.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{alumnus.full_name}</p>
                      <p className="text-sm text-gray-500">{alumnus.email}</p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setActiveTab('pending')}
                    >
                      Review
                    </Button>
                  </div>
                ))}
                {pendingAlumni.length > 3 && (
                  <div className="text-center mt-2">
                    <button
                      className="text-pittNavy hover:text-pittDeepNavy font-medium"
                      onClick={() => setActiveTab('pending')}
                    >
                      View all ({pendingAlumni.length})
                    </button>
                  </div>
                )}
              </div>
            )}
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-pittDeepNavy">Recent Activity</h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-500">Activity log coming soon</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
  
  const renderUsers = () => (
    <div>
      <h2 className="text-2xl font-bold text-pittDeepNavy mb-6">Manage Users</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pittNavy"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.is_alumni
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.is_alumni ? 'Alumni' : 'Student'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.is_admin
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.is_admin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant={user.is_admin ? 'outline' : 'secondary'}
                        size="sm"
                        onClick={() => handleToggleAdminRole(user.id, user.is_admin)}
                      >
                        {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
  
  const renderPendingAlumni = () => (
    <div>
      <h2 className="text-2xl font-bold text-pittDeepNavy mb-6">Pending Alumni Approvals</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pittNavy"></div>
        </div>
      ) : pendingAlumni.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-xl font-semibold text-pittDeepNavy mb-2">No pending approvals</h3>
          <p className="text-gray-600">
            There are no alumni profiles waiting for approval at this time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingAlumni.map((alumnus) => (
            <Card key={alumnus.id}>
              <CardHeader>
                <h3 className="text-lg font-semibold text-pittDeepNavy">{alumnus.full_name}</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-3 mb-4">
                  <p className="text-sm text-gray-500">{alumnus.email}</p>
                  
                  {alumnus.graduation_year && (
                    <p className="text-sm">
                      <span className="font-medium">Graduation Year:</span> {alumnus.graduation_year}
                    </p>
                  )}
                  
                  {alumnus.majors && alumnus.majors.length > 0 && (
                    <p className="text-sm">
                      <span className="font-medium">Majors:</span> {alumnus.majors.join(', ')}
                    </p>
                  )}
                  
                  {alumnus.location && (
                    <p className="text-sm">
                      <span className="font-medium">Location:</span> {alumnus.location}
                    </p>
                  )}
                </div>
                
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRejectAlumni(alumnus.id)}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApproveAlumni(alumnus.id)}
                  >
                    Approve
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
  
  const renderSettings = () => (
    <div>
      <h2 className="text-2xl font-bold text-pittDeepNavy mb-6">Admin Settings</h2>
      
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-pittDeepNavy">Site Settings</h3>
        </CardHeader>
        <CardBody>
          <p className="text-gray-500">Admin settings coming soon</p>
        </CardBody>
      </Card>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-pittLight py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-pittDeepNavy mb-8">Admin Panel</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <nav className="flex flex-col">
                <button
                  className={`flex items-center px-4 py-3 text-sm font-medium ${
                    activeTab === 'dashboard'
                      ? 'bg-pittNavy text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  <BarChart2 className="h-5 w-5 mr-2" />
                  Dashboard
                </button>
                <button
                  className={`flex items-center px-4 py-3 text-sm font-medium ${
                    activeTab === 'users'
                      ? 'bg-pittNavy text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab('users')}
                >
                  <Users className="h-5 w-5 mr-2" />
                  Manage Users
                </button>
                <button
                  className={`flex items-center px-4 py-3 text-sm font-medium ${
                    activeTab === 'pending'
                      ? 'bg-pittNavy text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab('pending')}
                >
                  <UserCheck className="h-5 w-5 mr-2" />
                  Pending Approvals
                  {pendingAlumni.length > 0 && (
                    <span className="ml-auto bg-pittGold text-pittDeepNavy px-2 py-0.5 rounded-full text-xs">
                      {pendingAlumni.length}
                    </span>
                  )}
                </button>
                <button
                  className={`flex items-center px-4 py-3 text-sm font-medium ${
                    activeTab === 'settings'
                      ? 'bg-pittNavy text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Settings
                </button>
              </nav>
            </div>
          </div>
          
          <div className="flex-1">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'pending' && renderPendingAlumni()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;