import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication endpoints
export const authAPI = {
  register: (userData) => api.post('/api/auth/register/', userData),
  login: (credentials) => api.post('/api/auth/login/', credentials),
  logout: () => api.post('/api/auth/logout/'),
  getProfile: () => api.get('/api/auth/profile/'),
};

// Chatroom endpoints
export const chatroomAPI = {
  create: (chatroomData) => api.post('/api/chatrooms/', chatroomData),
  join: (chatroomId) => api.post(`/api/chatrooms/${chatroomId}/join/`),
  getActive: () => api.get('/api/chatrooms/active/'),
  getOnlineUsers: (chatroomId) => api.get(`/api/chatrooms/${chatroomId}/online_users/`),
  createPublic: (chatroomData) => api.post('/api/chatrooms/create_public/', chatroomData),
  createPrivate: (chatroomData) => api.post('/api/chatrooms/create_private/', chatroomData),
  getSettings: (chatroomId) => api.get(`/api/chatrooms/${chatroomId}/chatroom_settings/`),
  updateSettings: (chatroomId, settings) => api.post(`/api/chatrooms/${chatroomId}/chatroom_settings/`, settings),
};

// Message endpoints
export const messageAPI = {
  send: (messageData) => api.post('/api/messages/', messageData),
  getMessages: (chatroomId) => api.get(`/api/messages/?chatroom=${chatroomId}`),
  removeMessage: (messageData) => api.post('/api/messages/remove_message/', messageData),
  muteUser: (muteData) => api.post('/api/messages/mute_user/', muteData),
  assignRole: (roleData) => api.post('/api/messages/assign_role/', roleData),
  pinMessage: (messageId) => api.post(`/api/messages/${messageId}/pin_message/`),
  editMessage: (messageId, content) => api.patch(`/api/messages/${messageId}/edit_message/`, { content }),
};

// Private message endpoints
export const privateMessageAPI = {
  send: (messageData) => api.post('/api/private-messages/', messageData),
  uploadFile: (formData) => api.post('/api/private-messages/upload_file/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  search: (query) => api.get(`/api/private-messages/search/?q=${query}`),
  getConversations: () => api.get('/api/private-messages/conversations/'),
  addReaction: (messageId, emoji) => api.post(`/api/private-messages/${messageId}/add_reaction/`, { emoji }),
};

// Profile endpoints
export const profileAPI = {
  get: () => api.get('/api/profile/'),
  update: (profileData) => api.post('/api/profile/update/', profileData),
};

// Notification endpoints
export const notificationAPI = {
  get: () => api.get('/api/notifications/'),
};

// Analytics endpoints
export const analyticsAPI = {
  getOverview: () => api.get('/api/analytics/overview/'),
};

export default api;
