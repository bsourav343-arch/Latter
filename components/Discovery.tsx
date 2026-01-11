
import React, { useState } from 'react';
import { User } from '../types';
import { t } from '../services/translations';

interface DiscoveryProps {
  currentUser: User;
}

const MOCK_USERS: User[] = [
  { uid: 'u1', username: 'shakib_75', displayName: 'Shakib Al Hasan', bio: 'Cricketer. Gamer. Explorer.', photoURL: 'https://picsum.photos/seed/shakib/100', friends: [] },
  { uid: 'u2', username: 'nabil_khan', displayName: 'Nabil Khan', bio: 'Tech enthusiast & Blogger 🇧🇩', photoURL: 'https://picsum.photos/seed/nabil/100', friends: [] },
  { uid: 'u3', username: 'sumaiya_r', displayName: 'Sumaiya Rahman', bio: 'Art is life. 🎨', photoURL: 'https://picsum.photos/seed/sumaiya/100', friends: [] },
  { uid: 'u4', username: 'tasrif_music', displayName: 'Tasrif Khan', bio: 'Musician. Dreamer.', photoURL: 'https://picsum.photos/seed/tasrif/100', friends: [] },
];

const Discovery: React.FC<DiscoveryProps> = ({ currentUser }) => {
  const [search, setSearch] = useState('');
  const [following, setFollowing] = useState<string[]>([]);
  const lang = currentUser.language || 'en';

  const filteredUsers = MOCK_USERS.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) || 
    u.displayName.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFollow = (uid: string) => {
    setFollowing(prev => prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="relative">
        <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('search_users', lang)} 
          className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        />
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('suggestions', lang)}</h2>
        {filteredUsers.map(user => (
          <div key={user.uid} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <img src={user.photoURL} className="w-12 h-12 rounded-full object-cover" alt={user.username} />
              <div>
                <p className="font-bold text-sm">{user.username}</p>
                <p className="text-xs text-gray-500">{user.displayName}</p>
              </div>
            </div>
            <button 
              onClick={() => toggleFollow(user.uid)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${following.includes(user.uid) ? 'bg-gray-100 text-gray-700' : 'bg-indigo-600 text-white shadow-md shadow-indigo-100'}`}
            >
              {following.includes(user.uid) ? t('following', lang) : t('follow', lang)}
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-1 mt-6">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 overflow-hidden rounded-lg">
            <img src={`https://picsum.photos/seed/grid${i}/300`} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" alt="Explore" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discovery;
