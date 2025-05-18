import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ShowData = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/user/get-users');
        setUsers(response.data.users);
      } catch (error) {
        setError('Error fetching users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Registered Users', 14, 15);

    const tableColumn = [
      'Name', 'Email', 'Gender', 'Date of Birth', 'Phone', 'Blood Group', 'Age', 'Emergency Contact', 'Allergies', 'Vaccination History', 'Health Insurance', 'Doctor Assigned', 'Password'
    ];

    const tableRows = users.map(user => [
      user.name, user.email, user.gender, user.dob, user.phone, user.bloodGroup, user.age, user.emergencyContact, user.allergies, user.vaccinationHistory, user.healthInsurancePolicy, user.doctorAssigned, user.password
    ]);

    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.save('users_data.pdf');
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Registered Users</h1>
      <button onClick={generatePDF} className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4">Download PDF</button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <div key={user._id} className="bg-white rounded-lg shadow-md overflow-hidden p-4">
            <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
            <p className="text-gray-600"><strong>Email:</strong> {user.email}</p>
            <p className="text-gray-600"><strong>Gender:</strong> {user.gender}</p>
            <p className="text-gray-600"><strong>Date of Birth:</strong> {user.dob}</p>
            <p className="text-gray-600"><strong>Phone:</strong> {user.phone}</p>
            <p className="text-gray-600"><strong>Blood Group:</strong> {user.bloodGroup}</p>
            <p className="text-gray-600"><strong>Age:</strong> {user.age}</p>
            <p className="text-gray-600"><strong>Emergency Contact:</strong> {user.emergencyContact}</p>
            <p className="text-gray-600"><strong>Allergies:</strong> {user.allergies}</p>
            <p className="text-gray-600"><strong>Vaccination History:</strong> {user.vaccinationHistory}</p>
            <p className="text-gray-600"><strong>Health Insurance:</strong> {user.healthInsurancePolicy}</p>
            <p className="text-gray-600"><strong>Doctor Assigned:</strong> {user.doctorAssigned}</p>
            <p className="text-gray-600"><strong>Password:</strong> {user.password}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowData;
