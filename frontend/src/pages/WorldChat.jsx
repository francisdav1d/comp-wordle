import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const WorldChat = () => {
  const { userProfile } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, username: 'System', text: 'Welcome to the World Chat, Operative. Keep it professional.', timestamp: '09:00', isSystem: true },
    { id: 2, username: 'Alex_Master', text: 'Anyone up for a Trio match?', timestamp: '12:45', avatar: 'https://ui-avatars.com/api/?name=Alex&background=random' },
    { id: 3, username: 'WordlePro_99', text: 'The daily word today was intense!', timestamp: '12:46', avatar: 'https://ui-avatars.com/api/?name=WP&background=random' },
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      username: userProfile?.username || 'Guest',
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: userProfile?.avatar_url
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  return (
    <main className="w-full px-4 md:px-8 h-[calc(100vh-100px)] flex flex-col max-w-full">
      <header className="py-4">
        <span className="text-primary font-bold text-[10px] uppercase tracking-[0.3em] mb-2 block text-center md:text-left">Global Comms Channel</span>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase text-center md:text-left">World Chat</h1>
      </header>

      {/* Chat Container */}
      <section className="flex-1 bg-[#1c1c1d] border border-[#3a3a3c] rounded-xl flex flex-col overflow-hidden shadow-2xl mb-4">
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.username === userProfile?.username ? 'flex-row-reverse' : ''}`}>
              {!msg.isSystem && (
                <img src={msg.avatar} alt="avatar" className="w-8 h-8 rounded-md border border-[#3a3a3c]" />
              )}
              <div className={`max-w-[80%] ${msg.username === userProfile?.username ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9px] font-black uppercase tracking-wider ${msg.isSystem ? 'text-primary' : 'text-[#818384]'}`}>
                    {msg.username}
                  </span>
                  <span className="text-[9px] text-[#3a3a3c] font-bold">{msg.timestamp}</span>
                </div>
                <div className={`p-3 md:p-4 rounded-xl text-sm font-medium leading-relaxed ${
                  msg.isSystem ? 'bg-primary/10 border border-primary/20 text-primary italic' : 
                  msg.username === userProfile?.username ? 'bg-primary text-black rounded-tr-none' : 'bg-[#131111] border border-[#3a3a3c] text-white rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 bg-[#131314] border-t border-[#3a3a3c] flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Broadcast a message..."
            className="flex-1 bg-[#1c1c1d] border border-[#3a3a3c] text-white px-4 py-3 rounded-md focus:outline-none focus:border-primary text-sm tracking-wide"
          />
          <button 
            type="submit"
            className="bg-primary text-black font-black uppercase text-[10px] px-6 py-3 rounded-md hover:bg-primary/90 transition-all flex items-center gap-2"
          >
            Send <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </form>
      </section>
    </main>
  );
};

export default WorldChat;
