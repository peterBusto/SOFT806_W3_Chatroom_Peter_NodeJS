import React, { useState } from 'react';
import { chatroomAPI } from '../services/api';
import { XMarkIcon } from '@heroicons/react/24/outline';

const CreateChatRoomModal = ({ onClose, onChatRoomCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    privacy: 'public',
    join_permissions: 'open',
    max_members: 50,
    require_approval_message: false,
    auto_approve_members: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;
      if (formData.privacy === 'public') {
        response = await chatroomAPI.createPublic({
          name: formData.name,
          description: formData.description,
        });
      } else {
        response = await chatroomAPI.createPrivate({
          name: formData.name,
          description: formData.description,
          join_permissions: formData.join_permissions,
          max_members: formData.max_members,
          require_approval_message: formData.require_approval_message,
          auto_approve_members: formData.auto_approve_members,
        });
      }
      
      onChatRoomCreated?.(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create chatroom');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create Chatroom</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Chatroom Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter chatroom name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="What's this chatroom about?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Privacy
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="privacy"
                  value="public"
                  checked={formData.privacy === 'public'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm">Public - Anyone can join</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="privacy"
                  value="private"
                  checked={formData.privacy === 'private'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm">Private - Invite only</span>
              </label>
            </div>
          </div>

          {formData.privacy === 'private' && (
            <>
              <div>
                <label htmlFor="join_permissions" className="block text-sm font-medium text-gray-700 mb-1">
                  Join Permissions
                </label>
                <select
                  id="join_permissions"
                  name="join_permissions"
                  value={formData.join_permissions}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="open">Open - Anyone can join</option>
                  <option value="approval_required">Approval Required</option>
                  <option value="admin_only">Admin Only</option>
                </select>
              </div>

              <div>
                <label htmlFor="max_members" className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Members
                </label>
                <input
                  type="number"
                  id="max_members"
                  name="max_members"
                  value={formData.max_members}
                  onChange={handleChange}
                  min="2"
                  max="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="require_approval_message"
                    checked={formData.require_approval_message}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm">Require approval message</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="auto_approve_members"
                    checked={formData.auto_approve_members}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm">Auto-approve members</span>
                </label>
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Chatroom'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChatRoomModal;
