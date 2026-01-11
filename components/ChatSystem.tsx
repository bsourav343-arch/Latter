
import React, { useState, useEffect, useRef } from 'react';
import { User, Message, Chat, AppLanguage } from '../types';
import { getSmartReply, translateText } from '../services/gemini';
import { t } from '../services/translations';
import VideoCall from './VideoCall';

interface ChatSystemProps {
  currentUser: User;
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
}

const INITIAL_CHATS: Chat[] = [
  {
    id: 'c1',
    participant: { uid: 'u1', username: 'shakib_75', displayName: 'Shakib', bio: '', photoURL: 'https://picsum.photos/seed/shakib/100', friends: [] },
    messages: [
      { id: 'm1', senderId: 'u1', text: 'Hey bro? What\'s up?', timestamp: new Date(Date.now() - 3600000) },
      { id: 'm2', senderId: 'user_123', text: 'I am good, how about you?', timestamp: new Date(Date.now() - 3000000) },
    ],
    lastMessage: 'I am good, how about you?'
  },
  {
    id: 'c2',
    participant: { uid: 'u2', username: 'nabil_khan', displayName: 'Nabil', bio: '', photoURL: 'https://picsum.photos/seed/nabil/100', friends: [] },
    messages: [],
    lastMessage: 'Let\'s catch up later!'
  }
];

const ChatSystem: React.FC<ChatSystemProps> = ({ currentUser, activeChatId, setActiveChatId }) => {
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [input, setInput] = useState('');
  const [smartSuggestion, setSmartSuggestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVideoCalling, setIsVideoCalling] = useState(false);
  const [translationsMap, setTranslationsMap] = useState<Record<string, string>>({});
  const [translatingIds, setTranslatingIds] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const lang = currentUser.language || 'en';

  const activeChat = chats.find(c => c.id === activeChatId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChat?.messages]);

  const handleSendMessage = async (text: string = input) => {
    if (!activeChatId || !text.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.uid,
      text: text,
      timestamp: new Date()
    };

    setChats(prev => prev.map(c => 
      c.id === activeChatId 
        ? { ...c, messages: [...c.messages, newMessage], lastMessage: text }
        : c
    ));
    setInput('');
    setSmartSuggestion('');

    // Simulate AI response
    setIsTyping(true);
    setTimeout(async () => {
      const replyText = await getSmartReply(text, lang);
      const aiReply: Message = {
        id: (Date.now() + 1).toString(),
        senderId: activeChat!.participant.uid,
        text: replyText,
        timestamp: new Date()
      };
      setChats(prev => prev.map(c => 
        c.id === activeChatId 
          ? { ...c, messages: [...c.messages, aiReply], lastMessage: replyText }
          : c
      ));
      setIsTyping(false);
    }, 1500);
  };

  const handleFetchSmartReply = async () => {
    if (!activeChat) return;
    const lastMsg = activeChat.messages[activeChat.messages.length - 1];
    if (lastMsg && lastMsg.senderId !== currentUser.uid) {
      const suggestion = await getSmartReply(lastMsg.text, lang);
      setSmartSuggestion(suggestion);
    }
  };

  const handleTranslateMessage = async (msgId: string, text: string) => {
    if (translatingIds.has(msgId) || translationsMap[msgId]) return;

    setTranslatingIds(prev => new Set(prev).add(msgId));
    try {
      const translated = await translateText(text, lang);
      setTranslationsMap(prev => ({ ...prev, [msgId]: translated }));
    } finally {
      setTranslatingIds(prev => {
        const next = new Set(prev);
        next.delete(msgId);
        return next;
      });
    }
  };

  if (activeChatId && activeChat) {
    return (
      <div className="flex flex-col h-full bg-white fixed inset-0 z-40 max-w-md mx-auto">
        <header className="p-4 border-b flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveChatId(null)} className="p-1 hover:bg-gray-100 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <img src={activeChat.participant.photoURL} className="w-10 h-10 rounded-full object-cover" alt="" />
            <div>
              <p className="font-bold text-sm">{activeChat.participant.displayName}</p>
              <p className="text-[10px] text-green-500 font-medium">{isTyping ? t('typing', lang) : t('active_now', lang)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
             <button 
                onClick={() => setIsVideoCalling(true)}
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
             >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
             </button>
             <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
             </button>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {activeChat.messages.map(msg => {
            const isMe = msg.senderId === currentUser.uid;
            const hasTranslation = translationsMap[msg.id];
            const isTranslating = translatingIds.has(msg.id);

            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm relative group ${
                  isMe 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                }`}>
                  <p>{msg.text}</p>
                  
                  {hasTranslation && (
                    <div className={`mt-2 pt-2 border-t text-[13px] italic ${isMe ? 'border-indigo-400 text-indigo-100' : 'border-gray-100 text-gray-500'}`}>
                      <span className="text-[10px] uppercase font-bold not-italic block mb-0.5 opacity-70">Translated</span>
                      {hasTranslation}
                    </div>
                  )}

                  {!isMe && !hasTranslation && (
                    <button 
                      onClick={() => handleTranslateMessage(msg.id, msg.text)}
                      className={`text-[10px] font-bold uppercase mt-1 transition-opacity ${isTranslating ? 'animate-pulse text-indigo-400' : 'text-indigo-600 hover:underline'}`}
                    >
                      {isTranslating ? 'Translating...' : 'Translate'}
                    </button>
                  )}

                  <p className={`text-[9px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-500 px-4 py-2 rounded-2xl text-xs animate-pulse">•••</div>
            </div>
          )}
        </div>

        <footer className="p-4 border-t bg-white space-y-2">
          {smartSuggestion && (
            <button 
              onClick={() => handleSendMessage(smartSuggestion)}
              className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full text-xs border border-indigo-100 hover:bg-indigo-100 transition-colors"
            >
              ✨ {smartSuggestion}
            </button>
          )}
          <div className="flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={handleFetchSmartReply}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t('write_something', lang)} 
              className="flex-1 border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50"
            />
            <button 
              onClick={() => handleSendMessage()}
              className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </button>
          </div>
        </footer>

        {isVideoCalling && (
          <VideoCall 
            currentUser={currentUser} 
            remoteUser={activeChat.participant} 
            onClose={() => setIsVideoCalling(false)} 
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">{t('inbox', lang)}</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats.map(chat => (
          <div 
            key={chat.id} 
            onClick={() => setActiveChatId(chat.id)}
            className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors"
          >
            <div className="relative">
              <img src={chat.participant.photoURL} className="w-14 h-14 rounded-full object-cover border" alt="" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between items-center">
                <p className="font-bold text-sm">{chat.participant.displayName}</p>
                <span className="text-[10px] text-gray-400">2:30 PM</span>
              </div>
              <p className="text-xs text-gray-500 truncate mt-0.5">{chat.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSystem;
