import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Messages = () => {
  const { user, isAdmin } = useAuth();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (isAdmin) {
      const savedMessages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
      setMessages(savedMessages.reverse());
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return <div className="pt-32 text-center">Accès non autorisé</div>;
  }

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Messages reçus</h1>
        {messages.length === 0 ? (
          <p className="text-gray-500">Aucun message pour le moment</p>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-6">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">{msg.name}</span>
                  <span className="text-sm text-gray-500">{new Date(msg.date).toLocaleString('fr-FR')}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{msg.email}</p>
                <p className="text-gray-700">{msg.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;