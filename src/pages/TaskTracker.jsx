import React, { useState, useEffect } from 'react';

const TaskTracker = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ name: '', deadline: '', status: 'Pending', assignedTo: '' });
  const [attendees, setAttendees] = useState([]);

  
  useEffect(() => {
    fetch('http://localhost:3001/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data));

    fetch('http://localhost:3001/attendees')
      .then((res) => res.json())
      .then((data) => setAttendees(data));
  }, []);

  
  const calculateCompletion = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter((task) => task.status === 'Completed').length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleAddTask = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((newTask) => {
        setTasks([...tasks, newTask]);
        setFormData({ name: '', deadline: '', status: 'Pending', assignedTo: '' });
      });
  };

  
  const handleUpdateTaskStatus = (id, newStatus) => {
    fetch(`http://localhost:3001/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTasks((prev) =>
          prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        );
      });
  };

  
  const handleDeleteTask = (id) => {
    fetch(`http://localhost:3001/tasks/${id}`, {
      method: 'DELETE',
    }).then(() => {
      setTasks(tasks.filter((task) => task.id !== id));
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Task Tracker</h1>

      
      <div className="max-w-md mx-auto my-4">
        <div className="relative w-full h-6 bg-gray-300 rounded">
          <div
            className="absolute top-0 left-0 h-full bg-blue-500 rounded"
            style={{ width: `${calculateCompletion()}%` }}
          />
        </div>
        <p className="text-center mt-2">{calculateCompletion()}% Completed</p>
      </div>

      
      <form
        onSubmit={handleAddTask}
        className="max-w-md mx-auto bg-white p-6 rounded shadow"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Task Name:</label>
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
          <label className="block text-sm font-medium mb-1">Deadline:</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Assign To:</label>
          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select Attendee</option>
            {attendees.map((attendee) => (
              <option key={attendee.id} value={attendee.name}>
                {attendee.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Add Task
        </button>
      </form>

      
      <h2 className="text-xl font-bold mt-8 mb-4">Task List</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="p-4 bg-white rounded shadow">
            <p><strong>Task:</strong> {task.name}</p>
            <p><strong>Deadline:</strong> {task.deadline}</p>
            <p><strong>Assigned To:</strong> {task.assignedTo || 'Unassigned'}</p>
            <p><strong>Status:</strong> {task.status}</p>

            
            <div className="flex space-x-4 mt-4">
              {task.status !== 'Completed' && (
                <button
                  onClick={() => handleUpdateTaskStatus(task.id, 'Completed')}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Mark as Completed
                </button>
              )}
              {task.status !== 'Pending' && (
                <button
                  onClick={() => handleUpdateTaskStatus(task.id, 'Pending')}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Mark as Pending
                </button>
              )}
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskTracker;
