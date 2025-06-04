import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const priorities = ['low', 'medium', 'high'];
const statuses = ['pending', 'in-progress', 'done'];

export default function EditProgress() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: '',
    description: '',
    goalStatus: 'pending',
    deadline: '',
    priority: 'medium',
    category: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGoals = async () => {
      const token = localStorage.getItem('jwt');
      if (!token) {
        setError('Not authenticated');
        setIsLoading(false);
        return;
      }

      try {
        const res = await axios.get('http://localhost:1337/api/progress-goals?populate=*', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const cleanData = res.data.data.map(goal => ({
          id: goal.id,
          ...goal.attributes
        }));

        setGoals(cleanData);
      } catch (err) {
        console.error('[EditProgress] Error fetching goals:', err);
        setError('Failed to load goals');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    const token = localStorage.getItem('jwt');
    if (!token) {
      alert('Please login first');
      navigate('/login');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      goalStatus: form.goalStatus,
      deadline: form.deadline || null,
      priority: form.priority,
      category: form.category
    };

    try {
      let res;
      if (form.id) {
        res = await axios.put(
          `http://localhost:1337/api/progress-goals/${form.id}`,
          { data: payload },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const updatedGoal = {
          id: res.data.data.id,
          ...res.data.data.attributes
        };

        setGoals(prev => prev.map(g => (g.id === form.id ? updatedGoal : g)));
      } else {
        res = await axios.post(
          'http://localhost:1337/api/progress-goals',
          { data: payload },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const newGoal = {
          id: res.data.data.id,
          ...res.data.data.attributes
        };

        setGoals(prev => [newGoal, ...prev]);
      }

      setForm({
        id: null,
        title: '',
        description: '',
        goalStatus: 'pending',
        deadline: '',
        priority: 'medium',
        category: ''
      });
    } catch (err) {
      console.error('[EditProgress] Submit error:', err);
      setError('Failed to save goal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (goal) => {
    setForm({
      id: goal.id,
      title: goal.title || '',
      description: goal.description || '',
      goalStatus: goal.goalStatus || 'pending',
      deadline: goal.deadline ? goal.deadline.split('T')[0] : '',
      priority: goal.priority || 'medium',
      category: goal.category || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this goal?')) return;

    const token = localStorage.getItem('jwt');
    if (!token) {
      setError('Not authenticated');
      return;
    }

    try {
      await axios.delete(
        `http://localhost:1337/api/progress-goals/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGoals(prev => prev.filter(g => g.id !== id));
      if (form.id === id) {
        setForm({
          id: null,
          title: '',
          description: '',
          goalStatus: 'pending',
          deadline: '',
          priority: 'medium',
          category: ''
        });
      }
    } catch (err) {
      console.error('[EditProgress] Delete error:', err);
      setError('Failed to delete');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white rounded-t-xl">
          <h1 className="text-2xl font-bold text-center">Progress Tracker</h1>
          {error && <p className="mt-2 text-sm text-red-200 text-center">{error}</p>}
        </div>

        <div className="p-6">
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-700">{form.id ? 'Edit Goal' : 'New Goal'}</h2>
              {form.id && (
                <button
                  onClick={() => setForm({
                    id: null,
                    title: '',
                    description: '',
                    goalStatus: 'pending',
                    deadline: '',
                    priority: 'medium',
                    category: ''
                  })}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title *"
              className="w-full px-4 py-2 border rounded-lg"
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              rows={2}
              className="w-full px-4 py-2 border rounded-lg resize-none"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                name="goalStatus"
                value={form.goalStatus}
                onChange={handleChange}
                className="px-3 py-2 border rounded-lg"
              >
                {statuses.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="px-3 py-2 border rounded-lg"
              >
                {priorities.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className="px-3 py-2 border rounded-lg"
              />
            </div>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full px-4 py-2 border rounded-lg"
            />
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !form.title.trim()}
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : form.id ? 'Update Goal' : 'Add Goal'}
            </button>
          </div>

          <hr />

          <h2 className="text-lg font-semibold text-gray-700 mt-6 mb-2">Your Goals</h2>
          {isLoading ? (
            <p>Loading goals...</p>
          ) : goals.length === 0 ? (
            <p>No goals found. Start by adding one above!</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {goals.map(goal => (
                <li key={goal.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-indigo-700">{goal.title}</p>
                    <p className="text-sm text-gray-500 truncate max-w-xs">{goal.description}</p>
                    <p className="text-xs text-gray-400">
                      Status: {goal.goalStatus} | Priority: {goal.priority} | Deadline: {goal.deadline ? goal.deadline.split('T')[0] : 'N/A'}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(goal)} title="Edit" className="p-1 hover:text-indigo-600">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(goal.id)} title="Delete" className="p-1 hover:text-red-600">
                      <X size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
