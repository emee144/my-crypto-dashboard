'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // ✅ CORRECT import for App Router

export default function ConversationDetails() {
  const [conversation, setConversation] = useState(null);
  const params = useParams(); // ✅ useParams() gives an object with route params
  const id = params.id; // ✅ extract `id`

 useEffect(() => {
  if (id) {
    const fetchConversationDetails = async () => {
      try {
        const res = await fetch(`/api/auth/conversations/${id}`);
        console.log('Fetching from:', `/api/auth/conversations/${id}`);

        const data = await res.json();
        console.log('Fetched conversation:', data);

        if (res.ok) {
          setConversation(data);
        } else {
          console.error('Failed to fetch:', data);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchConversationDetails();
  }
}, [id]);

  return (
    <div>
      {conversation ? (
        <div>
          <h1>Conversation {conversation.id}</h1>
          <h3>Messages:</h3>
          <ul>
            {conversation.messages.map((msg) => (
              <li key={msg.id}>
                <strong>{msg.senderId}</strong>: {msg.message}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading conversation...</p>
      )}
    </div>
  );
}
