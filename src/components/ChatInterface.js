import React, { useState } from 'react';
import ChatRoomList from './ChatRoomList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import CreateChatRoomModal from './CreateChatRoomModal';
import PrivateMessages from './PrivateMessages';
import Profile from './Profile';
import Navigation from './Navigation';
import { useAuth } from '../contexts/AuthContext';

const ChatInterface = () => {
  const [selectedChatroom, setSelectedChatroom] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('chatrooms');
  const { user } = useAuth();

  const handleSelectChatroom = (chatroom) => {
    setSelectedChatroom(chatroom);
  };

  const handleShowCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleChatRoomCreated = (newChatroom) => {
    setRefreshTrigger(prev => prev + 1); // Trigger refresh of chatroom list
    setSelectedChatroom(newChatroom);
  };

  const handleMessageSent = () => {
    setRefreshTrigger(prev => prev + 1); // Trigger refresh of messages
  };

  const handleMessageUpdate = () => {
    setRefreshTrigger(prev => prev + 1); // Trigger refresh of messages
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'messages':
        return <PrivateMessages />;
      case 'profile':
        return <Profile />;
      default:
        return (
          <div className="h-screen flex bg-gray-50">
            {/* Sidebar with chatroom list */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
              <ChatRoomList
                selectedChatroom={selectedChatroom}
                onSelectChatroom={handleSelectChatroom}
                onShowCreateModal={handleShowCreateModal}
                key={refreshTrigger} // Force re-render when refreshTrigger changes
              />
            </div>

            {/* Main chat area */}
            <div className="flex-1 flex flex-col">
              <MessageList
                chatroom={selectedChatroom}
                currentUser={user}
                onMessageUpdate={handleMessageUpdate}
                key={`${selectedChatroom?.id}-${refreshTrigger}`} // Force re-render when chatroom or refreshTrigger changes
              />
              <MessageInput
                chatroom={selectedChatroom}
                onMessageSent={handleMessageSent}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      {renderContent()}
      
      {/* Create Chatroom Modal */}
      {showCreateModal && (
        <CreateChatRoomModal
          onClose={handleCloseCreateModal}
          onChatRoomCreated={handleChatRoomCreated}
        />
      )}
    </div>
  );
};

export default ChatInterface;
