'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import io from 'socket.io-client';

// Connect to the Socket.IO server (assumes the server is running on the same domain)
const socket = io();  // This connects to the default Socket.IO server (current domain)

export default function AdminDashboard() {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    // Fetch all conversations initially
    const fetchConversations = async () => {
      const response = await fetch('/api/auth/conversations');
      const data = await response.json();
      setConversations(data);
    };

    fetchConversations();

    // Listen for new conversations in real-time
    socket.on('new_conversation', (newConversation) => {
      setConversations((prevConversations) => [...prevConversations, newConversation]);
    });

    // Listen for new messages in conversations
    socket.on('new_message', (message) => {
      setConversations((prevConversations) =>
        prevConversations.map((conversation) =>
          conversation.id === message.conversationId
            ? { ...conversation, lastMessage: message.text }
            : conversation
        )
      );
    });

    // Cleanup: Remove event listeners when the component unmounts
    return () => {
      socket.off('new_conversation');
      socket.off('new_message');
    };
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="conversations-list">
        {conversations.length === 0 ? (
          <p>No conversations yet</p>
        ) : (
          conversations.map((conversation) => (
            <div key={conversation.id} className="conversation-item">
              <Link href={`/admin/${conversation.id}`}>
                <h3>Conversation {conversation.id}</h3>
                <p>Last message: {conversation.lastMessage || 'No messages yet'}</p>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
