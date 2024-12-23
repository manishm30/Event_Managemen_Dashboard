const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors()); 
app.use(bodyParser.json()); 


let events = [];
let idCounter = 1;


app.get('/events', (req, res) => {
  res.status(200).json(events);
});


app.post('/events', (req, res) => {
  const { title, description, date, time, venue } = req.body;

  if (!title || !description || !date || !time || !venue) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const newEvent = { id: idCounter++, title, description, date, time, venue };
  events.push(newEvent);

  res.status(201).json(newEvent);
});


app.put('/events/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, date, time, venue } = req.body;

  const eventIndex = events.findIndex((event) => event.id === parseInt(id));
  if (eventIndex === -1) {
    return res.status(404).json({ error: 'Event not found.' });
  }

  if (!title || !description || !date || !time || !venue) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  events[eventIndex] = { id: parseInt(id), title, description, date, time, venue };
  res.status(200).json(events[eventIndex]);
});


app.delete('/events/:id', (req, res) => {
  const { id } = req.params;

  const eventIndex = events.findIndex((event) => event.id === parseInt(id));
  if (eventIndex === -1) {
    return res.status(404).json({ error: 'Event not found.' });
  }

  events.splice(eventIndex, 1);
  res.status(204).send();
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:3000`);
});
