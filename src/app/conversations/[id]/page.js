'use client';  

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';

const socket = io();  // Automatically connects to the server

export default function ConversationDetail() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();
  const { id } = router.query;  // Get conversation ID from the URL

  // Fetch messages initially (for the conversation)
  useEffect(() => {

    if (id) {
      async function fetchMessages() {
        const response = await fetch(`/api/auth/messages?conversationId=${id}`);
        const data = await response.json();
        setMessages(data);
      }
      fetchMessages();
    }

    // Listen for incoming messages
    socket.on('new_message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Listen for typing indicator
    socket.on('typing', (data) => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000); // Stop typing indicator after 3 seconds
    });

    return () => {
      socket.off('new_message');
      socket.off('typing');
    };
  }, [id]);

  // Send a new message
  const sendMessage = async (e) => {
    e.preventDefault();

    const newMessage = {
      conversationId: id,
      senderId: 'userId',  // Replace with actual user ID
      message,
      isAdmin: false,  // Adjust this depending on whether the user or admin sends the message
    };

    // Emit the message to the server
    socket.emit('send_message', newMessage);

    setMessage('');  // Clear the input
  };

  // Handle typing event
  const handleTyping = () => {
    socket.emit('user_typing', { conversationId: id, senderId: 'userId' });
  };

  return (
    <div>
      <h1>Conversation {id}</h1>
      <div>
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.isAdmin ? 'Admin' : 'User'}:</strong> {msg.message}
          </div>
        ))}
      </div>

      {isTyping && <p>Someone is typing...</p>}

      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          placeholder="Type your message"
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
