import React, { useState, useEffect } from 'react';

const AttendeeManagement = () => {
  const [attendees, setAttendees] = useState([]); 
  const [formData, setFormData] = useState({ name: '', email: '' }); 
  const [editingId, setEditingId] = useState(null); 

  useEffect(() => {
    fetch('http://localhost:3001/attendees')
      .then((res) => res.json())
      .then((data) => setAttendees(data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddOrEditAttendee = (e) => {
    e.preventDefault();

    if (editingId) {
      
      fetch(`http://localhost:3001/attendees/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((updatedAttendee) => {
          setAttendees((prev) =>
            prev.map((attendee) =>
              attendee.id === editingId ? updatedAttendee : attendee
            )
          );
          setFormData({ name: '', email: '' });
          setEditingId(null);
        });
    } else {
      
      fetch('http://localhost:3001/attendees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((newAttendee) => {
          setAttendees((prev) => [...prev, newAttendee]);
          setFormData({ name: '', email: '' });
        });
    }
  };

  const handleEditAttendee = (attendee) => {
    setFormData({ name: attendee.name, email: attendee.email });
    setEditingId(attendee.id);
  };

  const handleDeleteAttendee = (id) => {
    fetch(`http://localhost:3001/attendees/${id}`, {
      method: 'DELETE',
    }).then(() => {
      setAttendees(attendees.filter((attendee) => attendee.id !== id));
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Manage Attendees</h1>
      <form
        onSubmit={handleAddOrEditAttendee}
        className="max-w-md mx-auto bg-white p-6 rounded shadow"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {editingId ? 'Update Attendee' : 'Add Attendee'}
        </button>
      </form>

      <h2 className="text-xl font-bold mt-8 mb-4">Attendee List</h2>
      <div className="space-y-4">
        {attendees.map((attendee) => (
          <div key={attendee.id} className="p-4 bg-white rounded shadow">
            <p>
              <strong>Name:</strong> {attendee.name}
            </p>
            <p>
              <strong>Email:</strong> {attendee.email}
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => handleEditAttendee(attendee)}
                className="text-blue-500 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteAttendee(attendee.id)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendeeManagement;
