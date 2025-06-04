import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

export default function EditEventsPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');
  const userId = localStorage.getItem('userId');

  const [date, setDate] = useState(new Date());
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // 1️⃣ Fetch events from Strapi
  useEffect(() => {
    if (!token) return;
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          `http://localhost:1337/api/events?filters[user][id][$eq]=${userId}&sort=date:asc`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Map to a uniform shape
        setEvents(
          res.data.data.map((e) => ({
            id: e.id,
            title: e.attributes.title,
            description: e.attributes.description,
            date: e.attributes.date,
          }))
        );
      } catch (err) {
        console.error('Fetch events error:', err);
      }
    };
    fetchEvents();
  }, [token, userId]);

  // 2️⃣ Add or update an event
  const handleAddOrUpdate = async () => {
    if (!eventTitle.trim()) return;
    const isoDate = date.toISOString().split('T')[0];

    const payload = {
      data: {
        title: eventTitle,
        description: eventDescription,
        date: isoDate,
        user: userId,
      }
    };

    try {
      if (editingId) {
        // update
        await axios.put(
          `http://localhost:1337/api/events/${editingId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // create
        await axios.post(
          'http://localhost:1337/api/events',
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      // refresh list
      setEditingId(null);
      setEventTitle('');
      setEventDescription('');
      // refetch:
      const res = await axios.get(
        `http://localhost:1337/api/events?filters[user][id][$eq]=${userId}&sort=date:asc`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvents(res.data.data.map((e) => ({
        id: e.id,
        title: e.attributes.title,
        description: e.attributes.description,
        date: e.attributes.date,
      })));
    } catch (err) {
      console.error('Add/update event error:', err);
      alert('Failed to save event');
    }
  };

  // 3️⃣ Prepare form for editing
  const handleEdit = (evt) => {
    setEditingId(evt.id);
    setEventTitle(evt.title);
    setEventDescription(evt.description);
    setDate(new Date(evt.date));
  };

  // 4️⃣ Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:1337/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents((prev) => prev.filter((e) => e.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setEventTitle('');
        setEventDescription('');
      }
    } catch (err) {
      console.error('Delete event error:', err);
      alert('Failed to delete event');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white rounded-t-2xl shadow-md">
          <h1 className="text-2xl md:text-3xl font-bold text-center">
            {editingId ? 'Edit Event' : 'Add New Event'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white rounded-b-2xl shadow-xl overflow-hidden">
          {/* Calendar */}
          <div className="lg:col-span-1 p-6 border-r border-gray-200">
            <div className="sticky top-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Select Date
              </h2>
              <Calendar
                onChange={setDate}
                value={date}
                className="shadow-md rounded-lg border border-gray-200 p-2 w-full"
              />
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Total Events
                  </span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                    {events.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Today's Date
                  </span>
                  <span className="text-sm text-gray-600">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-1 p-6 border-r border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              {editingId ? 'Edit Event Details' : 'Create New Event'}
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Details
                </label>
                <textarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={handleAddOrUpdate}
                disabled={!eventTitle.trim()}
                className={`w-full py-3 rounded-lg font-medium transition ${
                  !eventTitle.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {editingId ? 'Update Event' : 'Add Event'}
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="w-full text-center text-sm text-gray-600 hover:text-indigo-600 transition"
              >
                ← Back to Profile
              </button>
            </div>
          </div>

          {/* Events List */}
          <div className="lg:col-span-1 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Your Events
              </h2>
              <span className="text-sm text-gray-500">
                {events.length} {events.length === 1 ? 'event' : 'events'}
              </span>
            </div>
            {events.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No events scheduled yet.</p>
                <p className="text-sm text-gray-400 mt-1">
                  Add your first event
                </p>
              </div>
            ) : (
              <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {events.map((evt) => (
                  <li
                    key={evt.id}
                    className="group flex justify-between items-start p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition"
                  >
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className="inline-block w-3 h-3 bg-indigo-500 rounded-full mr-2" />
                        <h3 className="font-medium text-gray-800">
                          {evt.title}
                        </h3>
                      </div>
                      <div className="pl-5">
                        <p className="text-sm text-gray-600 mb-1">
                          {evt.description}
                        </p>
                        <p className="text-xs text-gray-400">{evt.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleEdit(evt)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(evt.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                        title="Delete"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
