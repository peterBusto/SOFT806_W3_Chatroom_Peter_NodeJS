import React, { useState, useEffect, useRef } from 'react';
import { messageAPI } from '../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import { 
  MapPinIcon, 
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon,
  FaceSmileIcon
} from '@heroicons/react/24/outline';

const MessageList = ({ chatroom, currentUser, onMessageUpdate }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editContent, setEditContent] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chatroom) {
      fetchMessages();
    }
  }, [chatroom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    if (!chatroom || !chatroom.id) {
      console.warn('fetchMessages: no valid chatroom', chatroom);
      setMessages([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      console.log('Fetching messages for chatroom:', chatroom.id);
      const response = await messageAPI.getMessages(chatroom.id);
      console.log('Raw API response:', response);
      console.log('response.data:', response.data);
      const data = response.data;
      // Ensure we always set an array
      setMessages(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Failed to load messages');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditMessage = (message) => {
    setEditingMessage(message.id);
    setEditContent(message.content);
  };

  const handleSaveEdit = async (messageId) => {
    try {
      await messageAPI.editMessage(messageId, editContent);
      setEditingMessage(null);
      setEditContent('');
      fetchMessages(); // Refresh messages
      onMessageUpdate?.();
    } catch (err) {
      console.error('Error editing message:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setEditContent('');
  };

  const handlePinMessage = async (messageId) => {
    try {
      await messageAPI.pinMessage(messageId);
      fetchMessages(); // Refresh messages
      onMessageUpdate?.();
    } catch (err) {
      console.error('Error pinning message:', err);
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
    } catch {
      return timestamp;
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
            onClick={fetchMessages}
            className="mt-2 text-indigo-600 hover:text-indigo-800"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!chatroom) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <h3 className="text-lg font-medium mb-2">Welcome to Chatroom</h3>
          <p>Select a chatroom to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{chatroom.name}</h2>
            {chatroom.description && (
              <p className="text-sm text-gray-500">{chatroom.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {messages.length} messages
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender?.id === currentUser?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender?.id === currentUser?.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                } ${message.is_pinned ? 'ring-2 ring-yellow-400' : ''}`}
              >
                {message.is_pinned && (
                  <div className="flex items-center space-x-1 mb-1">
                    <MapPinIcon className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs text-yellow-600">Pinned</span>
                  </div>
                )}
                
                {message.sender?.id !== currentUser?.id && (
                  <div className="font-medium text-sm mb-1">
                    {message.sender?.display_name || message.sender?.username}
                  </div>
                )}

                {editingMessage === message.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900"
                      rows={3}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveEdit(message.id)}
                        className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {message.message_type === 'text' ? (
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div>{message.content}</div>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs ${
                        message.sender?.id === currentUser?.id
                          ? 'text-indigo-200'
                          : 'text-gray-500'
                      }`}>
                        {formatTimestamp(message.timestamp)}
                      </span>
                      
                      {message.sender?.id === currentUser?.id && (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEditMessage(message)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <PencilIcon className="h-3 w-3 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handlePinMessage(message.id)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <MapPinIcon className="h-3 w-3 text-gray-600" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {message.reactions && message.reactions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {message.reactions.map((reaction, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-200 px-2 py-1 rounded-full"
                      >
                        {reaction.emoji} {reaction.count}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
