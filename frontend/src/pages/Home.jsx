import React from 'react';
import Header from '../components/Header';
import SpecialityMenu from '../components/SpecialityMenu';
import TopDoctors from '../components/TopDoctors';
import Banner from '../components/Banner';

const Home = () => {
  return (
    <div>
      <Header />
      <SpecialityMenu />
      <TopDoctors />

      {/* ✅ Admin Panel Box (opens in new tab) */}
      <div className="my-10 flex justify-center">
        <a href="http://localhost:5174" target="_blank" rel="noopener noreferrer">
          <div className="max-w-md w-full bg-blue-100 p-6 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition-all border border-blue-300">
            <h2 className="text-2xl font-bold text-blue-700 mb-2">👨‍💼 Admin Panel</h2>
            <p className="text-gray-700">Click here to open the Admin Panel in a new window.</p>
          </div>
        </a>
      </div>

      <Banner />
    </div>
  );
};

export default Home;
