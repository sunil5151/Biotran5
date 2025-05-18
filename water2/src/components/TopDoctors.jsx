import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {
    
    const navigate = useNavigate()
    const { doctors } = useContext(AppContext)

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
            <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
            <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>
            <div className='w-full flex flex-wrap justify-center gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                {doctors.slice(0, 10).map((doctor, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-2 transform transition duration-300 cursor-pointer outline outline-2 outline-blue-300 w-[250px] h-[350px] flex-shrink-0"
                        onClick={() => {
                            navigate(`/appointment/${doctor._id}`);
                            window.scrollTo(0, 0)
                        }}
                    >
                        <div className="relative bg-blue-100 h-[200px] rounded-t-2xl flex items-center justify-center overflow-hidden">
                            <img
                                src={doctor.image}
                                alt={doctor.name}
                                className="w-full h-full object-cover rounded-t-2xl"
                            />
                        </div>
                        <div className="p-4 text-center">
                            <p
                                className={`font-semibold text-xl flex items-center justify-center ${
                                    doctor.isAvailable ? 'text-red-500' : 'text-green-500'
                                } mb-2`}
                            >
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                Available
                            </p>
                            <p className="font-bold text-xl">{doctor.name}</p>
                            <p className="text-lg text-gray-500">{doctor.speciality}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => { navigate('/doctors'); scrollTo(0, 0) }} className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10'>more</button>
        </div>
    )
}

export default TopDoctors