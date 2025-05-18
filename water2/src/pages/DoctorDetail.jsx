import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import devi from "./devi.png"; 
import { 
  Calendar, 
  Clock, 
  Award, 
  Briefcase, 
  DollarSign, 
  Info, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  Mail
} from "lucide-react";

export default function DoctorDetail() {
  const { email } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [checking, setChecking] = useState(false);
  const [booking, setBooking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const { user, token } = useContext(AppContext);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!email) {
        toast.error("Doctor email not provided");
        return;
      }
      try {
        setIsLoading(true);
        console.log("Fetching doctor with email:", email);
        const response = await axios.get(`http://localhost:4000/api/doctor/${email}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Doctor API response:", response.data);
        if (response.data && response.data.doctor) {
          setDoctor(response.data.doctor);
          console.log(doctor);
        } else {
          toast.error("Doctor not found");
          navigate('/doctors');
        }
      } catch (error) {
        console.error("Error fetching doctor:", error);
        toast.error(error.response?.data?.message || "Failed to load doctor details");
        navigate('/doctors');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctor();
  }, [email, token, navigate]);

  const handleCheckAvailability = async () => {
    if (!token) {
      toast.error("Please login first");
      navigate('/login');
      return;
    }
    if (!appointmentDate) {
      toast.warning("Please select a date");
      return;
    }
    console.log("Checking availability for date:", appointmentDate);
    setChecking(true);
    setIsAvailable(null);
    try {
      const response = await axios.get("http://localhost:4000/api/appointment/check", {
        params: { doctorEmail: email, appointmentDate },
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Availability response:", response.data);
      if (response.data.success) {
        setIsAvailable(true);
        toast.success("Time slot is available!", {
          icon: <CheckCircle className="text-green-500" />
        });
      } else {
        setIsAvailable(false);
        toast.warning(response.data.message, {
          icon: <AlertCircle className="text-yellow-500" />
        });
      }
    } catch (error) {
      console.error("Check availability error:", error);
      toast.error(error.response?.data?.message || "Error checking availability", {
        icon: <AlertCircle className="text-red-500" />
      });
      setIsAvailable(false);
    } finally {
      console.log("Finished checking availability");
      setChecking(false);
    }
  };


  const handleBookAppointment = async () => {
    if (!token) {
      toast.error("Please login first", {
        icon: <AlertCircle className="text-red-500" />
      });
      navigate('/login');
      return;
    }
    if (!appointmentDate) {
      toast.warning("Please select a date", {
        icon: <AlertCircle className="text-yellow-500" />
      });
      return;
    }

    console.log("Booking appointment for date:", appointmentDate);
    setBooking(true);
    try {
      const bookResponse = await axios.post(
        "http://localhost:4000/api/appointment/book",
        { doctorEmail: email, appointmentDate, patientEmail: user.email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Book appointment response:", bookResponse.data);
      if (bookResponse.data.success) {
        toast.success("Appointment booked successfully!", {
          icon: <CheckCircle className="text-green-500" size={24} />,
          autoClose: 5000
        });
        alert("Appointment booked successfully!");
        try {
          toast.success("Appointment booked successfully!");
        } catch (error) {
          console.log("Toast error:", error);
        }
        // Debug: Log success state
        console.log("Appointment booking successful, resetting appointment date.");
        setAppointmentDate("");
        setIsAvailable(null);
      } else {
        console.log("Booking response indicated failure:", bookResponse.data);
        toast.error(bookResponse.data.message || "Failed to book appointment", {
          icon: <AlertCircle className="text-red-500" />
        });
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.response?.data?.message || "Failed to book appointment", {
        icon: <AlertCircle className="text-red-500" />
      });
    } finally {
      console.log("Booking process complete");
      toast.success("Appointment booked successfully!");
      alert("Appointment booked successfully!");
      setBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8 transform transition-all duration-300 hover:shadow-xl">
        <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mr-4">
  {doctor.image ? (
                  <img
                    src={
                      doctor.image && doctor.image.base64
                        ? `data:${doctor.image.mimeType};base64,${doctor.image.base64}`
                        : devi
                    }
                    alt={doctor.name}
                    className="w-full h-full object-cover rounded-t-2xl"
                  />
  ) : (
    <Briefcase className="text-blue-600 w-full h-full p-3" />
  )}
</div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{doctor.name}</h2>
            <p className="text-blue-600 font-semibold">{doctor.speciality}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-center">
            <Award className="text-blue-500 mr-3" size={20} />
            <div>
              <p className="text-sm text-gray-500 font-medium">Qualification</p>
              <p className="text-gray-800 font-semibold">{doctor.degree}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Briefcase className="text-blue-500 mr-3" size={20} />
            <div>
              <p className="text-sm text-gray-500 font-medium">Experience</p>
              <p className="text-gray-800 font-semibold">{doctor.experience}</p>
            </div>
          </div>
          <div className="flex items-center">
            <DollarSign className="text-blue-500 mr-3" size={20} />
            <div>
              <p className="text-sm text-gray-500 font-medium">Consultation Fee</p>
              <p className="text-gray-800 font-semibold">${doctor.fees}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Info className="text-blue-500 mr-3" size={20} />
            <div>
              <p className="text-sm text-gray-500 font-medium">About</p>
              <p className="text-gray-800 line-clamp-2">{doctor.about}</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-gray-700 italic">{doctor.about}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
        <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <Calendar className="text-blue-500 mr-2" size={24} />
          Book an Appointment
        </h3>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="appointmentDate">
            Select Date and Time
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              id="appointmentDate"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Clock className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>
        </div>
        
        {isAvailable === true && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4 flex items-center animate-pulse">
            <CheckCircle className="text-green-500 mr-2" size={20} />
            <p className="text-green-700 font-medium">This time slot is available!</p>
          </div>
        )}
        {isAvailable === false && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 flex items-center">
            <AlertCircle className="text-red-500 mr-2" size={20} />
            <p className="text-red-700 font-medium">This time slot is not available. Please try another.</p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleCheckAvailability}
            disabled={checking}
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center transition-colors duration-300 disabled:opacity-70"
          >
            {checking ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Checking...
              </>
            ) : (
              <>
                <Clock className="mr-2" size={18} />
                Check Availability
              </>
            )}
          </button>
          
          <button
            onClick={handleBookAppointment}
            disabled={booking || isAvailable === false}
            className={`px-6 py-3 text-white rounded-md flex items-center justify-center transition-all duration-300 ${
              isAvailable === true 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-gray-400'
            } disabled:opacity-70`}
          >
            {booking ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Booking...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2" size={18} />
                Book Appointment
              </>
            )}
          </button>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p className="flex items-center">
            <ArrowRight className="text-blue-500 mr-2" size={16} />
            You can view your booked appointments in the "My Appointments" section.
          </p>
        </div>
      </div>
    </div>
  );
}
