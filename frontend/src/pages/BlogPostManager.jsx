import React, { useEffect, useState } from 'react';
import { Edit3, Plus, Save, Trash2, X, ChevronLeft } from 'lucide-react';
import axios from 'axios';

const BlogPostManager = () => {
  const [posts, setPosts] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem('jwt');
  const userId = localStorage.getItem('userId');

  const fetchPosts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:1337/api/blog-posts?filters[user][id][$eq]=${userId}&sort=createdAt:desc`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPosts(
        res.data.data.map((item) => ({
          id: item.id,
          title: item.attributes.title,
          content: item.attributes.content,
        }))
      );
    } catch (err) {
      console.error('Error loading posts:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAddPost = async () => {
    try {
      await axios.post(
        'http://localhost:1337/api/blog-posts',
        {
          data: {
            title: newTitle,
            content: newContent,
            user: userId, // link post to authenticated user
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewTitle('');
      setNewContent('');
      fetchPosts();
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:1337/api/blog-posts/${editingId}`,
        {
          data: {
            title: newTitle,
            content: newContent,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditingId(null);
      setNewTitle('');
      setNewContent('');
      fetchPosts();
    } catch (err) {
      console.error('Error updating post:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:1337/api/blog-posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const handleEdit = (post) => {
    setNewTitle(post.title);
    setNewContent(post.content);
    setEditingId(post.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 border-b border-indigo-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg shadow-sm">
                <Edit3 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Manage Blog Posts</h2>
            </div>
            <button
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Form */}
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Post Title</label>
              <input
                type="text"
                placeholder="Enter post title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                placeholder="Write your post content..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-40"
                rows={5}
              />
            </div>
            <div className="flex gap-3">
              {editingId ? (
                <>
                  <button
                    onClick={handleUpdate}
                    disabled={!newTitle.trim() || !newContent.trim()}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
                  >
                    <Save className="w-4 h-4" />
                    Update Post
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAddPost}
                  disabled={!newTitle.trim() || !newContent.trim()}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
                >
                  <Plus className="w-4 h-4" />
                  Add Post
                </button>
              )}
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-8 bg-indigo-50 rounded-lg">
                <p className="text-gray-500">No blog posts created yet</p>
                <p className="text-sm text-gray-400 mt-1">Add your first post above</p>
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>
                  <p className="text-gray-600 mt-2 text-sm">{post.content}</p>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostManager;
