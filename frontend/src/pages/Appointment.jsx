import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import docImage from '../assets/doc1.png'; // Fallback image
import { assets } from '../assets/assets'; // Assuming icons are imported here
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';
import PaymentModal from "./PaymentModal.jsx";


const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const fetchDocInfo = async () => {
    if (doctors && doctors.length > 0) {
      const foundDoc = doctors.find(doc => doc._id === docId);
      if (foundDoc) {
        setDocInfo(foundDoc);
      } else {
        console.warn('Doctor not found with ID:', docId);
      }
    }
  };

  const getAvailableSlots = async () => {
    if (!docInfo) return;

    let today = new Date();
    let allSlots = [];

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = `${day}_${month}_${year}`;
        const slotTime = formattedTime;

        const isSlotAvailable =
          !docInfo.slots_booked[slotDate] ||
          !docInfo.slots_booked[slotDate].includes(slotTime);

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      allSlots.push(timeSlots);
    }

    setDocSlots(allSlots);
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Please login to book an appointment')
      return navigate('/login')

    }

    if (!selectedSlot) {
      toast.error('Please select a time slot.');
      return;
    }

    try {
      const date = docSlots[slotIndex][0].datetime

      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()

      const slotDate = `${day}_${month}_${year}`
      const slotTime = selectedSlot.time

      const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } })

      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')

      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)

    }
  }

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  if (!docInfo) {
    return <div>Loading doctor information...</div>;
  }

  const experienceText = `${docInfo.experience} ${docInfo.experience === 1 ? 'year' : 'years'}`;

  const handleTimeSlotClick = (slot) => {
    setSelectedSlot(slot);
  };

  const handleBookAppointment = () => {
    if (selectedSlot) {
      // Handle booking logic here (e.g., API call)
      alert(`Appointment booked with Dr. ${docInfo.name} on ${selectedSlot.time}`);
    } else {
      alert('Please select a time slot.');
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md max-w-4xl mx-auto">
      {/* Doctor Details */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        <img
          className="w-40 h-40 md:w-52 md:h-52 rounded-lg shadow-md object-cover"
          src={docInfo.image || docImage}
          alt={docInfo.name}
        />
        <div className="flex-1">
          <p className="text-3xl font-bold text-gray-800 flex items-center">
            {docInfo.name}
            <img className="ml-2 w-5" src={assets.verified_icon} alt="Verified" />
          </p>
          <p className="text-lg text-gray-600 mt-1">
            {docInfo.degree} - {docInfo.speciality}
          </p>
          <span className="mt-2 inline-block bg-blue-600 text-white text-sm font-semibold py-1 px-3 rounded-full">
            {experienceText}
          </span>
          <p className="mt-4 text-gray-700 leading-relaxed text-sm">{docInfo.about}</p>
          <p className="mt-2 font-medium text-gray-600">
            Appointment Fee: <span className="text-gray-800 font-bold">{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>

      {/* Booking Slots */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Booking Slots</h3>

        {/* Day Slots */}
        <div className="flex gap-4 overflow-x-auto pb-2 border-b border-gray-200">
          {docSlots.length > 0 &&
            docSlots.map((item, index) => (
              <div
                key={index}
                className={`text-center py-3 px-4 min-w-24 rounded-lg cursor-pointer shadow-md transition-all duration-300 ${slotIndex === index
                    ? 'bg-blue-600 text-white scale-105'
                    : 'bg-white text-gray-800 hover:bg-blue-50'
                  }`}
                onClick={() => setSlotIndex(index)}
              >
                <p className="text-sm font-medium uppercase tracking-wider">
                  {item[0] && daysOfWeek[item[0].datetime.getDay()]}
                </p>
                <p className="text-lg font-semibold mt-1">
                  {item[0] && item[0].datetime.getDate()}
                </p>
              </div>
            ))}
        </div>

        {/* Time Slots */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {docSlots.length > 0 &&
            docSlots[slotIndex]?.map((item, index) => (
              <div
                key={index}
                className={`text-center py-2 px-3 border border-gray-200 rounded-md text-sm font-medium text-gray-700 cursor-pointer shadow-sm transition-all duration-300 ${selectedSlot === item ? 'bg-blue-600 text-white' : 'hover:bg-blue-50 hover:text-blue-600'
                  }`}
                onClick={() => handleTimeSlotClick(item)}
              >
                {item.time}
              </div>
            ))}
        </div>

        {/* Book Appointment Button */}
        <div className="mt-8 flex justify-center">
          <button onClick={bookAppointment}

            className="px-6 py-3 bg-blue-600 text-white font-semibold text-lg rounded-md shadow-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Book Appointment
          </button>
        </div>
      </div>

      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointment;
