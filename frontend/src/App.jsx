import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import Appointment from './pages/Appointment';
import MyAppointments from './pages/MyAppointments';
import MyProfile from './pages/MyProfile';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify';
import VoiceAssistant from './components/VoiceAssistant';
import AIChatBot from './components/AIChatBot';
import NearbyHospitals from './components/NearbyHospitals';
import LanguageRecommendation from './components/LanguageRecommendation';
import AdminPanel from './pages/AdminPanel'; // ⬅️ Add this import

const App = () => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [prevY, setPrevY] = useState(0); // Store previous mouse Y position for movement tracking
  const currentLocation = useLocation(); // Get the current route

  // Enable smooth scrolling using CSS for the entire page
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';  // Enable smooth scroll for the entire page
  }, []);

  // Detect mouse movement and simulate scrolling based on mouse movement
  useEffect(() => {
    let scrollTimeout;

    const handleMouseMove = (event) => {
      const deltaY = event.movementY; // Get the vertical movement of the mouse
      
      if (Math.abs(deltaY) > 5) { // Sensitivity threshold for scrolling
        // Throttle scroll event to make scrolling smoother
        if (scrollTimeout) clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {
          window.scrollBy(0, deltaY); // Scroll the page based on the mouse movement
        }, 20); // Throttle delay of 20ms between scroll actions for smoother performance
      }

      setPrevY(event.clientY); // Update previous Y position for next movement
    };

    // Add the mousemove event listener
    window.addEventListener('mousemove', handleMouseMove);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (scrollTimeout) clearTimeout(scrollTimeout); // Clean up timeout if component is unmounted
    };
  }, [prevY]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error('Error getting location:', error)
      );
    }
  }, []);

  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar />
      <VoiceAssistant /> {/* ✅ Voice Assistant here */}
      <AIChatBot />
      {currentLocation.pathname === '/' && <LanguageRecommendation />}

      {/* Only show NearbyHospitals on Home page */}
    {currentLocation.pathname === '/' && (
  <>
    {location.lat && location.lng ? (
      <NearbyHospitals lat={location.lat} lng={location.lng} />
    ) : (
      <p className="text-center text-gray-600 mt-4">📍 Getting your location...</p>
    )}
  </>
)}


      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/admin' element={<AdminPanel />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
