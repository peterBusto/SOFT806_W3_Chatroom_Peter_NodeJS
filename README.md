# Chatroom UI Application

A modern React-based chatroom application built with Axios to interact with the chatroom API endpoints defined in the Postman collection.

## Features

### Core Functionality
- **Authentication**: User registration and login system
- **Chatrooms**: Create, join, and participate in chatrooms (public and private)
- **Real-time Messaging**: Send and receive messages in chatrooms
- **Private Messages**: Direct messaging between users
- **User Profiles**: Manage user information and settings

### Advanced Features
- **Message Formatting**: Support for markdown in messages
- **Message Reactions**: Add emoji reactions to messages
- **Message Pinning**: Pin important messages in chatrooms
- **File Attachments**: Upload and share files (UI ready)
- **Search**: Search through private messages
- **Notifications**: Notification system (UI ready)
- **Admin Tools**: Moderator features for managing chatrooms

## Technology Stack

- **Frontend**: React 18 with functional components and hooks
- **Styling**: Tailwind CSS for modern, responsive design
- **HTTP Client**: Axios for API communication
- **Routing**: React Router for navigation
- **Icons**: Heroicons for consistent iconography
- **Markdown**: React-markdown with remark-gfm for message formatting
- **Date Handling**: date-fns for timestamp formatting
- **Notifications**: react-hot-toast for user feedback

## API Integration

The application integrates with all endpoints from the Postman collection:

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout

### Chatrooms
- `POST /api/chatrooms/` - Create chatroom
- `POST /api/chatrooms/{id}/join/` - Join chatroom
- `GET /api/chatrooms/active/` - List active chatrooms
- `GET /api/chatrooms/{id}/online_users/` - Get online users
- `POST /api/chatrooms/create_public/` - Create public chatroom
- `POST /api/chatrooms/create_private/` - Create private chatroom
- `GET /api/chatrooms/{id}/chatroom_settings/` - Get chatroom settings
- `POST /api/chatrooms/{id}/chatroom_settings/` - Update chatroom settings

### Messages
- `POST /api/messages/` - Send message
- `GET /api/messages/?chatroom={id}` - Get chatroom messages
- `POST /api/messages/remove_message/` - Remove message
- `POST /api/messages/mute_user/` - Mute user
- `POST /api/messages/assign_role/` - Assign user role
- `POST /api/messages/{id}/pin_message/` - Pin message
- `PATCH /api/messages/{id}/edit_message/` - Edit message

### Private Messages
- `POST /api/private-messages/` - Send private message
- `POST /api/private-messages/upload_file/` - Upload file
- `GET /api/private-messages/search/?q={query}` - Search messages
- `GET /api/private-messages/conversations/` - Get conversations
- `POST /api/private-messages/{id}/add_reaction/` - Add reaction

### Profile
- `GET /api/profile/` - Get user profile
- `POST /api/profile/update/` - Update profile

### Notifications
- `GET /api/notifications/` - Get notifications

### Analytics
- `GET /api/analytics/overview/` - Get analytics overview

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chatroom
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Configuration

The API base URL is configured in `src/services/api.js`:
```javascript
const BASE_URL = 'http://127.0.0.1:8000';
```

Make sure your backend server is running at this address.

## Project Structure

```
src/
├── components/           # React components
│   ├── AuthWrapper.js   # Authentication wrapper
│   ├── Login.js         # Login component
│   ├── Register.js      # Registration component
│   ├── ChatInterface.js # Main chat interface
│   ├── ChatRoomList.js  # Chatroom list sidebar
│   ├── MessageList.js   # Message display
│   ├── MessageInput.js  # Message input
│   ├── PrivateMessages.js # Private messaging
│   ├── Profile.js       # User profile
│   ├── Navigation.js    # Navigation bar
│   └── CreateChatRoomModal.js # Create chatroom modal
├── contexts/            # React contexts
│   └── AuthContext.js   # Authentication context
├── services/            # API services
│   └── api.js          # Axios configuration and API endpoints
├── App.js              # Main App component
├── index.js            # Application entry point
└── index.css           # Global styles
```

## Usage

1. **Registration**: Create a new account with username, email, password, and display name
2. **Login**: Sign in with your credentials
3. **Chatrooms**: Browse and join existing chatrooms or create new ones
4. **Messaging**: Send messages in chatrooms with markdown support
5. **Private Messages**: Have direct conversations with other users
6. **Profile**: Manage your profile information and settings

## Features in Detail

### Authentication
- Secure token-based authentication
- Automatic token management
- Protected routes
- Logout functionality

### Chatrooms
- Create public and private chatrooms
- Join existing chatrooms
- View online users
- Chatroom settings management

### Messaging
- Real-time message sending
- Markdown support for rich text
- Message editing and deletion
- Message pinning
- Emoji reactions
- File attachment support (UI ready)

### Private Messaging
- Direct user conversations
- Message search functionality
- Conversation history
- File sharing capabilities

### User Management
- Profile customization
- Status management
- Avatar support
- Contact information

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
