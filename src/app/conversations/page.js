'use client'; 

import { useState, useEffect } from 'react';
import Link from 'next/link';
import io from 'socket.io-client';

// Connect to the Socket.IO server (ensure your server is running the Socket.IO instance)
const socket = io();  // This connects to the server by default (it will use the current domain)

export default function Conversations() {
  const [conversations, setConversations] = useState([]);

  // Fetch conversations initially
  useEffect(() => {
    async function fetchConversations() {
      const response = await fetch('/api/auth/conversations?userId=userId'); // Pass the userId dynamically
      const data = await response.json();
      setConversations(data);
    }

    fetchConversations();

    // Listen for new conversations added in real-time
    socket.on('new_conversation', (newConversation) => {
      setConversations((prevConversations) => [...prevConversations, newConversation]);
    });

    // Cleanup the socket listener when the component unmounts
    return () => {
      socket.off('new_conversation');
    };
  }, []);

  return (
    <div>
      <h1>Your Conversations</h1>
      {conversations.length > 0 ? (
        <div>
          {conversations.map((conversation) => (
            <div key={conversation.id}>
              <Link href={`/conversations/${conversation.id}`}>
                <a>
                  <h3>Conversation with {conversation.userId}</h3>
                  {/* Optionally, show the last message */}
                  <p>{conversation.messages.length > 0 ? conversation.messages[conversation.messages.length - 1].message : 'No messages yet'}</p>
                </a>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>You have no conversations yet.</p>
      )}
    </div>
  );
}
