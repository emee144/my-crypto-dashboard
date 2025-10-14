'use client';

import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io();  // Connecting to the same origin as the app

export default function LiveChat({ conversationId }) {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    // Listen for new messages in the current conversation
    socket.on('new_message', (message) => {
      if (message.conversationId === conversationId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    // Fetch initial messages for the conversation
    const fetchMessages = async () => {
      const response = await fetch(`/api/auth/conversations/${conversationId}/messages`);
      const data = await response.json();
      setMessages(data);
    };

    fetchMessages();

    // Cleanup socket listeners
    return () => {
      socket.off('new_message');
    };
  }, [conversationId]);

  const sendMessage = async () => {
    if (messageText.trim() === '') return;

    // Emit the message to the server
    socket.emit('send_message', {
      conversationId,
      message: messageText,
      senderId: 'admin-id',  // Replace with the actual admin ID
    });

    // Clear input after sending
    setMessageText('');
  };

  return (
    <div className="live-chat">
      <h2>Chat with User</h2>
      <div className="messages-list">
        {messages.map((msg, index) => (
          <div key={index} className={msg.senderId === 'admin-id' ? 'admin-message' : 'user-message'}>
            <strong>{msg.senderId}: </strong>{msg.message}
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
