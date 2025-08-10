

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Star } from 'lucide-react';
import devi from '../pages/devi.png';

const TopDoctors = ({ darkMode }) => {
    const navigate = useNavigate();
    const { doctors } = useContext(AppContext);

    return (
        <div 
            className="flex flex-col items-center gap-4 my-16 md:mx-10"
            style={{ color: 'var(--text-color)' }}
        >
            <h1 className="text-3xl font-medium">Top Doctors to Book</h1>
            <p className="sm:w-1/3 text-center text-sm">Simply browse through our extensive list of trusted doctors.</p>
            
            <div className="w-full flex flex-wrap justify-center gap-6 pt-5 px-3 sm:px-0">
                {doctors.slice(0, 10).map((doctor, index) => (
                    <div
                        key={index}
                        className="group rounded-xl shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:shadow-2xl w-[250px] flex-shrink-0"
                        style={{ backgroundColor: 'var(--card-background)' }}
                        onClick={() => {
                            navigate(`/appointment/${doctor._id}`);
                            window.scrollTo(0, 0);
                        }}
                    >
                        {/* Image Section */}
                        <div className="relative overflow-hidden rounded-t-xl h-48">
                            <img
                                src={doctor.image}
                                alt={doctor.name}
                                className="w-full h-full object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
                        </div>
 
                        {/* Content Section */}
                        <div className="p-4 text-center">
                            {/* Availability Badge */}
                            <div className="flex items-center justify-center mb-2">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center transition-colors duration-300`}
                                    style={{
                                        backgroundColor: doctor.isAvailable ? 'var(--secondary-color)' : 'var(--accent-color)',
                                        color: 'white',
                                    }}
                                >
                                    <span 
                                        className="w-2 h-2 rounded-full mr-1" 
                                        style={{ backgroundColor: 'white' }}
                                    ></span>
                                    {doctor.isAvailable ? "Available" : "Unavailable"}
                                </span>
                            </div>
 
                            {/* Doctor Info */}
                            <div className="mb-2">
                                <p className="font-bold text-xl" style={{ color: 'var(--text-color)' }}>{doctor.name}</p>
                                <p className="text-lg" style={{ color: 'var(--primary-color)' }}>{doctor.speciality}</p>
                            </div>
 
                            {/* Rating Stars */}
                            <div className="flex items-center justify-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                        key={star}
                                        className="h-5 w-5 fill-current"
                                        style={{ color: '#FCD34D' }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button 
                onClick={() => { navigate('/doctors'); window.scrollTo(0, 0); }} 
                className="bg-blue-600 text-white font-medium px-8 py-3 rounded-full mt-10 shadow-lg hover:bg-blue-700 transition-colors"
            >
                View All Doctors
            </button>
        </div>
    );
};

export default TopDoctors;