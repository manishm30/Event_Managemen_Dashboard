import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-lg font-bold">Event Management</Link>
        <div className="space-x-4">
          <Link to="/events" className="hover:underline">Events</Link>
          <Link to="/attendees" className="hover:underline">Attendee Management</Link>
          <Link to="/tasks" className="hover:underline">Task Tracker</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
