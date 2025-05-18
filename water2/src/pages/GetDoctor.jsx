import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GetDoctor = () => {
  const [doctors, setDoctors] = useState([]); // Store all doctor data
  const [searchName, setSearchName] = useState(''); // Store the search query
  const [displayDoctors, setDisplayDoctors] = useState([]); // Store the doctors to display

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fetch all doctors from the API
  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/admin/get-doctors');
      setDoctors(response.data.doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  // Handle search by name
  const searchDoctorByName = () => {
    if (!searchName.trim()) {
      alert('Please enter a name to search.');
      return;
    }

    const doctor = doctors.find(doc => doc.name.toLowerCase() === searchName.toLowerCase());
    if (doctor) {
      setDisplayDoctors([doctor]); // Display only the searched doctor
    } else {
      alert('Doctor not found.');
      setDisplayDoctors([]);
    }
  };

  // Handle display of all doctors
  const showAllDoctors = () => {
    setDisplayDoctors(doctors); // Display all doctors
    setSearchName(''); // Clear the search input
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Doctors List</h1>
        <div className="mb-8">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Search doctor by name"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <button
            onClick={searchDoctorByName}
            className="mt-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Search
          </button>
          <button
            onClick={showAllDoctors}
            className="mt-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Show All Doctors
          </button>
        </div>
        {displayDoctors.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">{searchName ? 'Searched Doctor' : 'All Doctors'}</h2>
            <ul>
              {displayDoctors.map((doctor) => (
                <li key={doctor._id} className="mb-4">
                  <p><strong>Name:</strong> {doctor.name}</p>
                  <p><strong>Email:</strong> {doctor.email}</p>
                  <p><strong>Speciality:</strong> {doctor.speciality}</p>
                  <p><strong>Degree:</strong> {doctor.degree}</p>
                  <p><strong>Experience:</strong> {doctor.experience}</p>
                  <p><strong>About:</strong> {doctor.about}</p>
                  <p><strong>Fees:</strong> {doctor.fees}</p>
                  <p><strong>Address:</strong> {doctor.address}</p>
                  <p><strong>Available:</strong> {doctor.available ? 'Yes' : 'No'}</p>
                  <img
                    src={`data:${doctor.image.mimeType};base64,${doctor.image.base64}`}
                    alt={doctor.name}
                    className="w-32 h-32 object-cover rounded-md"
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500">No doctors to display. Use the buttons above to search or show all doctors.</p>
        )}
      </div>
    </div>
  );
};

export default GetDoctor;
