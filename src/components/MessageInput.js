import React, { useState } from 'react';
import { messageAPI } from '../services/api';
import { 
  PaperAirplaneIcon,
  PaperClipIcon,
  FaceSmileIcon
} from '@heroicons/react/24/outline';

const MessageInput = ({ chatroom, onMessageSent }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    try {
      console.log('handleSubmit called');
      if (!message.trim() || !chatroom || sending) {
        console.log('Early return:', { message: message.trim(), chatroom, sending });
        return;
      }

      try {
        setSending(true);
        const payload = {
          content: message.trim(),
          chatroom: chatroom.id,
          message_type: 'text'
        };
        console.log('Sending message payload:', payload);
        const response = await messageAPI.send(payload);
        console.log('Message send response:', response);
        setMessage('');
        onMessageSent?.();
      } catch (error) {
        console.error('Error sending message:', error);
        if (error.response) {
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
        }
      } finally {
        setSending(false);
      }
    } catch (err) {
      console.error('Unexpected error in handleSubmit:', err);
    }
  };

  if (!chatroom) {
    return (
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-center text-gray-500 text-sm">
          Select a chatroom to start messaging
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="flex items-end space-x-2" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Message ${chatroom.name}...`}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={1}
            disabled={sending}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit();
              }
            }}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Attach file"
          >
            <PaperClipIcon className="h-5 w-5" />
          </button>
          
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Add emoji"
          >
            <FaceSmileIcon className="h-5 w-5" />
          </button>
          
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); handleSubmit(); }}
            disabled={!message.trim() || sending}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
