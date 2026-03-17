import React, { useState, useEffect } from 'react';
import { chatroomAPI } from '../services/api';
import { 
  PlusIcon, 
  UserGroupIcon, 
  LockClosedIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const ChatRoomList = ({ selectedChatroom, onSelectChatroom, onShowCreateModal }) => {
  const [chatrooms, setChatrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChatrooms();
  }, []);

  const fetchChatrooms = async () => {
    try {
      setLoading(true);
      const response = await chatroomAPI.getActive();
      setChatrooms(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load chatrooms');
      console.error('Error fetching chatrooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinChatroom = async (chatroomId) => {
    try {
      await chatroomAPI.join(chatroomId);
      await fetchChatrooms(); // Refresh the list
    } catch (err) {
      console.error('Error joining chatroom:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p>{error}</p>
          <button 
            onClick={fetchChatrooms}
            className="mt-2 text-indigo-600 hover:text-indigo-800"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Chatrooms</h2>
          <button
            onClick={onShowCreateModal}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chatrooms.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No chatrooms available</p>
            <p className="text-sm">Create one to get started!</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {chatrooms.map((chatroom) => (
              <div
                key={chatroom.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedChatroom?.id === chatroom.id
                    ? 'bg-indigo-50 border-l-4 border-indigo-600'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onSelectChatroom(chatroom)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      {chatroom.privacy === 'private' ? (
                        <LockClosedIcon className="h-4 w-4 text-gray-400" />
                      ) : (
                        <UserGroupIcon className="h-4 w-4 text-gray-400" />
                      )}
                      <h3 className="font-medium text-gray-900 truncate">
                        {chatroom.name}
                      </h3>
                    </div>
                    {chatroom.description && (
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {chatroom.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <UserGroupIcon className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {chatroom.member_count || 0} members
                        </span>
                      </div>
                      {chatroom.online_users_count > 0 && (
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-xs text-gray-500">
                            {chatroom.online_users_count} online
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {!chatroom.is_member && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoinChatroom(chatroom.id);
                      }}
                      className="ml-2 px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors"
                    >
                      Join
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoomList;
