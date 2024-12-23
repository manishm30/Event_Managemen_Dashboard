import React from 'react';

const EventItem = ({ event, onEdit, onDelete }) => {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-bold">{event.title}</h3>
      <p>{event.description}</p>
      <p>
        <strong>Date:</strong> {event.date}
      </p>
      <p>
        <strong>Time:</strong> {event.time}
      </p>
      <p>
        <strong>Venue:</strong> {event.venue}
      </p>
      <div className="mt-2">
        <button
          onClick={() => onEdit(event)}
          className="text-blue-500 hover:underline mr-4"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(event.id)}
          className="text-red-500 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default EventItem;
