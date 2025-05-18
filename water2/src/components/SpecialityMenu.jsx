import { specialityData } from '../assets/assets';
import { Link } from 'react-router-dom';

const SpecialityMenu = () => {
  return (
    <div id="ram" className="mt-16 p-8 bg-white shadow-md rounded-lg text-lg font-large text-center">
        <h1 className="invisible">.   </h1>
        <h1 className="invisible">.</h1>
        <h1 className="invisible">.</h1>
        <h1 className="text-5xl font-bold text-lg mb-4">Find by Speciality</h1>
        {/* Centered Subheading */}
        <p className="text-gray-600 text-xl mb-8">
          Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
        </p>
        {/* Hidden element to occupy space */}
   
        {/* Speciality Icons */}
      <div className="flex justify-center gap-8">
        {specialityData.map((item, index) => (
          <Link
            key={index}
            to={`/doctors/${item.speciality}`}
            className="flex flex-col items-center group"
            style={{ scrollMarginTop: '80px' }} // Added padding to the top of the sections
          >
            {/* Icon with hover effect */}
            <img
              src={item.image}
              alt={item.speciality}
              className="w-20 h-20 mb-2 transition-transform duration-300 group-hover:-translate-y-2"
            />
            {/* Speciality name */}
            <p className="text-sm font-medium">{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;