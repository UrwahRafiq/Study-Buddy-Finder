import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UpcomingEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const storedEvents = localStorage.getItem('userEvents');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const hasEvents = events.length > 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-all hover:shadow-md">
      <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800 p-5 border-b border-indigo-200 dark:border-indigo-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-sm">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Upcoming Events</h3>
          </div>
          <button
            onClick={() => navigate('/edit-events')}
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      <div className="p-5">
        {hasEvents ? (
          <ul className="space-y-4">
            {events.map((event, index) => (
              <li
                key={index}
                className="group bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md cursor-pointer transition-all"
                onClick={() => navigate('/edit-events')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-md font-semibold text-gray-800 dark:text-white">{event.title}</h4>
                    <div className="mt-1 flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">{formatDate(event.date)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6">
            <div className="mx-auto w-16 h-16 bg-indigo-50 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-3">
              <Calendar className="w-8 h-8 text-indigo-400" />
            </div>
            <h4 className="text-gray-600 dark:text-gray-300 font-medium mb-1">No upcoming events</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Stay organized by adding your schedule</p>
            <button
              onClick={() => navigate('/edit-events')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Add Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingEvents;
