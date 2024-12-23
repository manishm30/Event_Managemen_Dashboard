import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-6">Welcome to Event Management</h1>
      <div className="space-y-4">
        <Link to="/events">
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Manage Events
          </button>
        </Link>
        <Link to="/attendees">
          <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
            Manage Attendees
          </button>
        </Link>
        <Link to="/tasks">
          <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
            Track Tasks
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
