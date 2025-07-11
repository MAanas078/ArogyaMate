import React from 'react';

const AdminPanel = () => {
  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold text-center mb-4">👨‍💼 Admin Panel</h1>
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md border">
        <h2 className="text-xl font-semibold mb-2">Admin Login Credentials</h2>
        <p><strong>Email:</strong> <code>admin@arogyamate.com</code></p>
        <p><strong>Password:</strong> <code>Anas@2003</code></p>
        <p className="text-sm text-gray-500 mt-4">Note: This is a static demo. Implement authentication for production.</p>
      </div>
    </div>
  );
};

export default AdminPanel;
