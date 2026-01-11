
import React, { useState, useEffect } from 'react';
import { View, User, Post, Chat, AppLanguage } from './types';
import HomeFeed from './components/HomeFeed';
import Discovery from './components/Discovery';
import ChatSystem from './components/ChatSystem';
import UserProfile from './components/UserProfile';
import Navigation from './components/Navigation';
import { t } from './services/translations';

// Mock Current User
const CURRENT_USER: User = {
  uid: 'user_123',
  username: 'joy_bangla',
  displayName: 'Joy Chowdhury',
  bio: 'Exploring life through code and camera. ✨',
  photoURL: 'https://picsum.photos/seed/joy/200',
  friends: ['user_456', 'user_789'],
  email: 'joy@example.com',
  phoneNumber: '+880 1711-223344',
  website: 'https://joy-portfolio.com',
  instagram: 'joy_insta_official',
  facebook: 'joy.chowdhury.fb',
  youtube: '@JoyVlogs',
  language: 'en',
  location: {
    latitude: 23.8103,
    longitude: 90.4125,
    address: 'Dhaka, Bangladesh'
  }
};

// Initial Data
const INITIAL_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'user_456',
    username: 'arnab_tech',
    userPhoto: 'https://picsum.photos/seed/arnab/100',
    imageUrl: 'https://picsum.photos/seed/sunset/600/600',
    caption: 'Beautiful sunset! (সুন্দর সূর্যাস্ত!)',
    timestamp: new Date(),
    likes: 124
  },
  {
    id: 'p2',
    userId: 'user_789',
    username: 'mimi_travels',
    userPhoto: 'https://picsum.photos/seed/mimi/100',
    imageUrl: 'https://picsum.photos/seed/mountains/600/600',
    caption: 'A day at the mountain peak. (পাহাড়ের চূড়ায় একদিন।)',
    timestamp: new Date(Date.now() - 3600000),
    likes: 89
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('HOME');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const lang = currentUser.language || 'en';

  const handleAddPost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
    setCurrentView('HOME');
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-xl relative overflow-hidden">
      {/* Header */}
      <header className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">
          {t('app_name', lang)}
        </h1>
        <div className="flex gap-4">
          <button onClick={() => setCurrentView('CHAT')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 bg-gray-50">
        {currentView === 'HOME' && <HomeFeed posts={posts} currentUser={currentUser} onAddPost={handleAddPost} />}
        {currentView === 'SEARCH' && <Discovery currentUser={currentUser} />}
        {currentView === 'CHAT' && <ChatSystem currentUser={currentUser} activeChatId={activeChatId} setActiveChatId={setActiveChatId} />}
        {currentView === 'PROFILE' && <UserProfile user={currentUser} posts={posts.filter(p => p.userId === currentUser.uid)} onUpdate={handleUpdateProfile} />}
      </main>

      {/* Bottom Navigation */}
      <Navigation currentView={currentView} setView={(v) => { setCurrentView(v); setActiveChatId(null); }} />
    </div>
  );
};

export default App;
