import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAdminStore } from '../store/adminStore';
import { Users, UserCheck, Eye, Trash2 } from 'lucide-react';
import Button from '../components/Button';
import Card, { CardHeader, CardBody } from '../components/Card';

const AdminPage: React.FC = () => {
  const { user } = useAuthStore();
  const { users, analytics, fetchUsers, deleteUser, isLoading, error } = useAdminStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!user.is_superuser) {
      navigate('/');
      return;
    }

    fetchUsers();
  }, [user, navigate, fetchUsers]);

  const handleDeleteUser = async (userId: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteUser(userId);
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  if (!user || !user.is_superuser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-pittLight py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-pittDeepNavy mb-8">Admin Panel</h1>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{analytics.visibleProfiles}</h3>
              <p className="text-sm text-gray-500">Visible Profiles</p>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-pittDeepNavy">Manage Users</h2>
          </CardHeader>
          <CardBody className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pittNavy"></div>
              </div>
            ) : users.length === 0 ? (
              <p className="text-gray-500 text-center py-12">No users found</p>
            ) : (
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
                        Visibility
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{u.full_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{u.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              u.is_alumni ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {u.is_alumni ? 'Alumni' : 'Student'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              u.profile_visible ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {u.profile_visible ? 'Visible' : 'Hidden'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteUser(u.id, u.full_name)}
                            className="flex items-center"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
