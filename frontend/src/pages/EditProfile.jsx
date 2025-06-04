import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    degree: '',
    university: '',
    courses: '',
    interests: '',
    profilePicture: null,
    bio: '',
    password: '',
    confirmPassword: ''
  });

  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) throw new Error('No token found');

        const res = await axios.get('http://localhost:1337/api/users/me?populate=profilePicture', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = res.data;
        setFormData(prev => ({
          ...prev,
          fullName: data.fullName || '',
          degree: data.degree || '',
          university: data.university || '',
          courses: (data.courses || []).join(', '),
          interests: (data.interests || []).join(', '),
          profilePicture: data.profilePicture || null,
          bio: data.bio || ''
        }));

        if (data.id) {
          localStorage.setItem('userId', data.id);
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setErrorMessage('Failed to fetch user data. Please try again later.');
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const token = localStorage.getItem('jwt');
      if (!token) throw new Error('No token found');

      const form = new FormData();
      form.append('files', file);

      const res = await axios.post('http://localhost:1337/api/upload', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const uploadedImage = res.data[0];
      setFormData(prev => ({
        ...prev,
        profilePicture: uploadedImage
      }));

    } catch (err) {
      console.error('Failed to upload image:', err);
      setErrorMessage('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords don't match");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('jwt');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) throw new Error('No token or userId found');

      const payload = {
        fullName: formData.fullName,
        degree: formData.degree,
        university: formData.university,
        courses: formData.courses.split(',').map(c => c.trim()).filter(c => c),
        interests: formData.interests.split(',').map(i => i.trim()).filter(i => i),
        bio: formData.bio || '',
        profilePicture: formData.profilePicture?.id || null
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      await axios.put(`http://localhost:1337/api/users/${userId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccessMessage("Profile updated successfully!");
    } catch (err) {
      console.error('Failed to update profile:', err);
      setErrorMessage('There was an error updating your profile. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProfileImageSrc = (imageData) => {
    if (!imageData) return '/default-profile.jpeg';
    const url = imageData.url || '';
    return url.startsWith('http') ? url : `http://localhost:1337${url}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-indigo-600 p-6 text-white rounded-t-2xl shadow-md">
          <h1 className="text-2xl md:text-3xl font-bold text-center">
            Profile Settings
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white rounded-b-2xl shadow-xl overflow-hidden">
          {/* Left Column - Profile Picture */}
          <div className="lg:col-span-1 p-6 border-r border-gray-200">
            <div className="sticky top-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Profile Photo</h2>
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <img
                    src={getProfileImageSrc(formData.profilePicture)}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full shadow-sm">
                    <div className="bg-indigo-600 p-1 rounded-full">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                <label className="w-full cursor-pointer">
                  <div className={`flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium ${uploading ? 'bg-gray-100 text-gray-500' : 'bg-white text-gray-700 hover:bg-gray-50'} transition`}>
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Change Photo'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="sr-only"
                      disabled={uploading}
                    />
                  </div>
                </label>
                <p className="mt-2 text-xs text-gray-500 text-center">
                  JPG, GIF or PNG. Max size of 2MB
                </p>

                {/* Profile Stats */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Account Created</span>
                    <span className="text-sm text-gray-600 ml-2">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Last Updated</span>
                    <span className="text-sm text-gray-600">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Profile Form */}
          <div className="lg:col-span-1 p-6 border-r border-gray-200">
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-700">
                Personal Information
              </h2>

              {successMessage && (
                <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                <input
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Courses (comma separated)</label>
                <input
                  type="text"
                  name="courses"
                  value={formData.courses}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="lg:col-span-1 p-6">
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-700">Additional Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interests (comma separated)</label>
                <input
                  type="text"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Change Password</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => navigate('/profile')}
                  className="mr-4 px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`px-6 py-2 rounded-lg font-medium transition ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg'}`}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;