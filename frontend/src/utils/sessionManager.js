// ChatbotWidget/sessionManager.js
export const sessionManager = {
    createSession: () => {
      const sessionId = Math.random().toString(36).substring(2);
      localStorage.setItem('chat_session_id', sessionId);
      return sessionId;
    },
  
    getSession: () => {
      return localStorage.getItem('chat_session_id');
    },
  
    updateSession: (messages) => {
      localStorage.setItem('chat_messages', JSON.stringify(messages));
    }
  };