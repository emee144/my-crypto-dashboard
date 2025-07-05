// /src/app/chat/page.js
'use client';

import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io(); // Default connection to localhost:3000

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [conversationId] = useState(1); // Example: Assume one conversation for the user

  useEffect(() => {
    // Fetch message history when the page loads
    const fetchMessages = async () => {
      const response = await fetch(`/api/auth/conversations/${conversationId}/messages`);
      const data = await response.json();
      setMessages(data);
    };
    fetchMessages();

    // Listen for new messages in the current conversation
    socket.on('message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('message');
    };
  }, [conversationId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    
    // Send message to the WebSocket server
    socket.emit('sendMessage', { conversationId, message });

    // Store message in DB (via API)
    await fetch('/api/auth/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversationId, message, senderId: 'userId', isAdmin: false }), // Replace 'user-id' with actual user ID
    });

    // Clear input field
    setMessage('');
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.isAdmin ? 'admin-message' : 'user-message'}>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="message-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
