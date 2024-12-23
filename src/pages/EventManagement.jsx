import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
  });
  const [editEvent, setEditEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  
  useEffect(() => {
    fetch('http://localhost:3001/events')
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editEvent) {
      setEditEvent({ ...editEvent, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  
  const handleCreate = (e) => {
    e.preventDefault();
    const localDate = new Date(formData.date).toISOString().split('T')[0]; 
    fetch('http://localhost:3001/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, date: localDate }),
    })
      .then((res) => res.json())
      .then((newEvent) => {
        setEvents([...events, newEvent]);
        setFormData({ title: '', description: '', date: '', time: '', venue: '' }); 
      });
  };

  
  const handleUpdate = (e) => {
    e.preventDefault();
    const localDate = new Date(editEvent.date).toISOString().split('T')[0]; 
    fetch(`http://localhost:3001/events/${editEvent.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editEvent, date: localDate }),
    })
      .then((res) => res.json())
      .then((updatedEvent) => {
        setEvents((prev) =>
          prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
        );
        setEditEvent(null); 
      });
  };

  
  const handleDelete = (id) => {
    fetch(`http://localhost:3001/events/${id}`, {
      method: 'DELETE',
    }).then(() => {
      setEvents(events.filter((event) => event.id !== id));
    });
  };

  
  const handleEditClick = (event) => {
    setEditEvent(event);
  };

  
  const eventsOnSelectedDate = events.filter(
    (event) => event.date === selectedDate.toISOString().split('T')[0]
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-center">
        {editEvent ? 'Edit Event' : 'Create Event'}
      </h1>
      <form
        onSubmit={editEvent ? handleUpdate : handleCreate}
        className="max-w-md mx-auto bg-white p-6 rounded shadow"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title:</label>
          <input
            type="text"
            name="title"
            value={editEvent ? editEvent.title : formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description:</label>
          <textarea
            name="description"
            value={editEvent ? editEvent.description : formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Date:</label>
          <input
            type="date"
            name="date"
            value={editEvent ? editEvent.date : formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Time:</label>
          <input
            type="time"
            name="time"
            value={editEvent ? editEvent.time : formData.time}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Venue:</label>
          <input
            type="text"
            name="venue"
            value={editEvent ? editEvent.venue : formData.venue}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {editEvent ? 'Update Event' : 'Create Event'}
        </button>
        {editEvent && (
          <button
            type="button"
            className="w-full bg-gray-300 text-gray-700 py-2 mt-2 rounded hover:bg-gray-400"
            onClick={() => setEditEvent(null)}
          >
            Cancel
          </button>
        )}
      </form>

      <h2 className="text-xl font-bold mt-8 mb-4">Event Calendar</h2>
      <div className="flex flex-col items-center">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileContent={({ date }) =>
            events.some((event) => event.date === date.toISOString().split('T')[0]) ? (
              <div className="text-blue-500 font-bold">•</div>
            ) : null
          }
        />
      </div>

      <h2 className="text-xl font-bold mt-8 mb-4">Events on {selectedDate.toDateString()}</h2>
      <div className="space-y-4">
        {eventsOnSelectedDate.length > 0 ? (
          eventsOnSelectedDate.map((event) => (
            <div key={event.id} className="p-4 bg-white rounded shadow">
              <h3 className="text-lg font-bold">{event.title}</h3>
              <p>{event.description}</p>
              <p>
                <strong>Time:</strong> {event.time}
              </p>
              <p>
                <strong>Venue:</strong> {event.venue}
              </p>
              <button
                onClick={() => handleEditClick(event)}
                className="text-blue-500 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(event.id)}
                className="text-red-500 hover:underline ml-4"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No events on this date.</p>
        )}
      </div>
    </div>
  );
};

export default EventManagement;




