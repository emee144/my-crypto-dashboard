'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { io } from 'socket.io-client';

const socket = io(); // Connect to the WebSocket server (assumes it runs on localhost:3000)

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const router = useRouter();
  const { id } = router.query; // Get the conversation ID from the URL parameter

  // Fetch messages for the conversation when the page loads or when `conversationId` changes
  useEffect(() => {
    if (!id) return; // Wait until `id` (conversationId) is available

    setConversationId(id);

    const fetchMessages = async () => {
      const response = await fetch(`/api/auth/messages`);
      const data = await response.json();
      setMessages(data);
    };

    fetchMessages();

    // Listen for real-time messages via Socket.IO
    socket.on('message', (newMessage) => {
      if (newMessage.conversationId === id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    // Cleanup: remove socket listener when component unmounts
    return () => {
      socket.off('message');
    };
  }, [id]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return; // Don't send empty messages

    // Emit the message to the server (WebSocket)
    socket.emit('sendMessage', { conversationId, message: newMessage });

    // Send the message to the backend for storage in the database
    await fetch('/api/auth/admin/sendmessages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversationId,
        message: newMessage,
        isAdmin: false,
      }),
    });

    setNewMessage(''); // Clear input field
  };

  return (
    <div className="messages-container">
      <div className="messages-list">
        {messages.map((msg, index) => (
          <div key={index} className={msg.isAdmin ? 'admin-message' : 'user-message'}>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
