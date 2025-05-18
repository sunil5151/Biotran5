import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import Header from '../components/Header';

const ChatList = () => {
  const { user } = useContext(AppContext);
  const [tab, setTab] = useState('doctors'); // default tab
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch doctors only when doctor tab is clicked
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const doctorsResponse = await axios.get('http://localhost:4000/api/doctor/all');
      const doctorsList = doctorsResponse.data?.doctors || [];
      const filteredDoctors = doctorsList.filter(d => d && d.email && d.email !== user?.email);
      setDoctors(filteredDoctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch patients only when patient tab is clicked
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersResponse = await axios.get('http://localhost:4000/api/user/getUsers');
      const usersList = usersResponse.data?.users || [];
      const filteredUsers = usersList.filter(u => u && u.email && u.email !== user?.email);
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change and fetch data if not already fetched
  const handleTabChange = (newTab) => {
    setTab(newTab);
    if (newTab === 'doctors' && doctors.length === 0) {
      fetchDoctors();
    }
    if (newTab === 'patients' && users.length === 0) {
      fetchUsers();
    }
  };

  // Filtered lists
  const filteredDoctors = doctors.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Chat with Users</h1>
          {/* Tabs */}
          <div className="flex mb-6">
            <button
              className={`px-4 py-2 rounded-l-lg ${tab === 'doctors' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => handleTabChange('doctors')}
            >
              Doctors
            </button>
            <button
              className={`px-4 py-2 rounded-r-lg ${tab === 'patients' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => handleTabChange('patients')}
            >
              Patients
            </button>
          </div>
          {/* Search input */}
          <div className="mb-6">
            <input
              type="text"
              placeholder={`Search ${tab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* List */}
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {tab === 'doctors' && (
                filteredDoctors.length > 0 ? (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                      {filteredDoctors.map((doctor) => (
                        <li key={doctor._id} className="hover:bg-gray-50">
                          <Link to={`/chat/${doctor.email}`} className="block px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                {doctor.image && doctor.image.base64 ? (
                                  <img
                                    src={`data:${doctor.image.mimeType};base64,${doctor.image.base64}`}
                                    alt={doctor.name}
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                                    <span className="text-white font-medium">
                                      {doctor.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">{doctor.name}</p>
                                <p className="text-sm text-gray-500">{doctor.email}</p>
                                {doctor.speciality && (
                                  <p className="text-xs text-blue-600">{doctor.speciality}</p>
                                )}
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No doctors found matching your search.</p>
                  </div>
                )
              )}
              {tab === 'patients' && (
                filteredUsers.length > 0 ? (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <li key={user._id} className="hover:bg-gray-50">
                          <Link to={`/chat/${user.email}`} className="block px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                {user.image && user.image.base64 ? (
                                  <img
                                    src={`data:${user.image.mimeType};base64,${user.image.base64}`}
                                    alt={user.name}
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-500 flex items-center justify-center">
                                    <span className="text-white font-medium">
                                      {user.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No patients found matching your search.</p>
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatList;