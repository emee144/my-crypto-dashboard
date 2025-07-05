'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';  // For accessing the dynamic route parameter

export default function ConversationDetails() {
  const [conversation, setConversation] = useState(null);
  const router = useRouter();
  const { id } = router.query;  // Get the dynamic 'id' from the URL

  useEffect(() => {
    if (id) {
      // Fetch the conversation details based on the ID
      const fetchConversationDetails = async () => {
        const response = await fetch(`/api/auth/conversations/${id}`);
        const data = await response.json();
        setConversation(data);
      };

      fetchConversationDetails();
    }
  }, [id]);  // Re-run the effect whenever the 'id' changes

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
