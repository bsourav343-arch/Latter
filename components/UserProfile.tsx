
import React, { useState, useEffect } from 'react';
import { User, Post, AppLanguage } from '../types';
import { t } from '../services/translations';

interface UserProfileProps {
  user: User;
  posts: Post[];
  onUpdate: (user: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, posts, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const lang = user.language || 'en';

  const [formData, setFormData] = useState({
    bio: user.bio,
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    website: user.website || '',
    instagram: user.instagram || '',
    facebook: user.facebook || '',
    youtube: user.youtube || '',
    language: user.language || 'en' as AppLanguage,
    location: user.location
  });
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    // Sync document lang for other components to read if needed
    document.documentElement.lang = formData.language;
  }, [formData.language]);

  const handleSave = () => {
    onUpdate({ 
      ...user, 
      bio: formData.bio,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      website: formData.website,
      instagram: formData.instagram,
      facebook: formData.facebook,
      youtube: formData.youtube,
      language: formData.language,
      location: formData.location
    });
    setIsEditing(false);
  };

  const fetchLiveLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: `Lat: ${position.coords.latitude.toFixed(2)}, Lng: ${position.coords.longitude.toFixed(2)}`
          }
        }));
        setIsLocating(false);
      },
      (error) => {
        console.error("Error fetching location:", error);
        alert("Unable to retrieve your location");
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="bg-white min-h-full">
      <div className="p-6 flex flex-col items-center gap-4">
        <div className="relative">
          <img src={user.photoURL} className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-50 shadow-xl" alt="Profile" />
          <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md border border-gray-100">
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </button>
        </div>
        
        <div className="text-center">
          <h2 className="text-xl font-bold">@{user.username}</h2>
          <p className="text-gray-500 text-sm mt-0.5">{user.displayName}</p>
        </div>

        <div className="flex gap-8 py-2">
          <div className="text-center">
            <p className="font-bold text-lg">{posts.length}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">{t('posts', lang)}</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">2.4k</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">{t('followers', lang)}</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">{user.friends.length}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">{t('friends', lang)}</p>
          </div>
        </div>

        <div className="w-full">
          {isEditing ? (
            <div className="space-y-4 pb-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">{t('language', lang)}</label>
                <select 
                  value={formData.language}
                  onChange={(e) => setFormData({...formData, language: e.target.value as AppLanguage})}
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50"
                >
                  <option value="en">English</option>
                  <option value="bn">বাংলা (Bengali)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">{t('bio', lang)}</label>
                <textarea 
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 h-20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">{t('email', lang)}</label>
                  <input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">{t('phone', lang)}</label>
                  <input 
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    className="w-full border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">{t('website', lang)}</label>
                <input 
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="w-full border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50"
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Instagram</label>
                <input 
                  value={formData.instagram}
                  onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                  className="w-full border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Facebook</label>
                <input 
                  value={formData.facebook}
                  onChange={(e) => setFormData({...formData, facebook: e.target.value})}
                  className="w-full border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">YouTube</label>
                <input 
                  value={formData.youtube}
                  onChange={(e) => setFormData({...formData, youtube: e.target.value})}
                  className="w-full border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">{t('live_location', lang)}</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    readOnly
                    value={formData.location?.address || t('not_shared', lang)}
                    className="flex-1 border rounded-xl px-3 py-2 text-xs bg-gray-100 text-gray-500"
                  />
                  <button 
                    onClick={fetchLiveLocation}
                    disabled={isLocating}
                    className="bg-indigo-50 text-indigo-600 p-2 rounded-xl border border-indigo-100"
                  >
                    {isLocating ? (
                      <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={handleSave} className="flex-1 bg-indigo-600 text-white py-2 rounded-xl font-bold text-sm">{t('save_changes', lang)}</button>
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded-xl text-sm">{t('cancel', lang)}</button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-center text-gray-700 leading-relaxed px-4">{user.bio}</p>
              
              <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                {/* Contact Section */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('contact_info', lang)}</p>
                  <div className="grid grid-cols-1 gap-2">
                    {user.email && (
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        <span>{user.email}</span>
                      </div>
                    )}
                    {user.phoneNumber && (
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        <span>{user.phoneNumber}</span>
                      </div>
                    )}
                    {user.location && (
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <span>{user.location.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Social Section */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-t border-gray-100 pt-3">{t('social_media', lang)}</p>
                  <div className="flex flex-wrap gap-3">
                    {user.website && (
                      <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm hover:border-indigo-200 transition-colors">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9h18"></path></svg>
                        <span className="text-indigo-600 font-medium truncate max-w-[100px]">{user.website.replace(/^https?:\/\//, '')}</span>
                      </a>
                    )}
                    {user.instagram && (
                      <a href={`https://instagram.com/${user.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm hover:border-pink-200 transition-colors">
                        <svg className="w-3.5 h-3.5 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        <span className="font-medium">Instagram</span>
                      </a>
                    )}
                    {user.facebook && (
                      <a href={user.facebook.startsWith('http') ? user.facebook : `https://facebook.com/${user.facebook}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm hover:border-blue-200 transition-colors">
                        <svg className="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                        <span className="font-medium">Facebook</span>
                      </a>
                    )}
                    {user.youtube && (
                      <a href={user.youtube.startsWith('http') ? user.youtube : `https://youtube.com/${user.youtube}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm hover:border-red-200 transition-colors">
                        <svg className="w-3.5 h-3.5 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        <span className="font-medium">YouTube</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <button onClick={() => setIsEditing(true)} className="w-full py-2.5 border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm">
                {t('edit_profile', lang)}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Post Grid */}
      <div className="grid grid-cols-3 gap-0.5 mt-4">
        {posts.map(post => (
          <div key={post.id} className="aspect-square bg-gray-100 relative group cursor-pointer overflow-hidden">
            <img src={post.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
              ❤️ {post.likes}
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="col-span-3 py-20 text-center text-gray-400 space-y-2">
            <svg className="w-12 h-12 mx-auto opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <p className="text-sm">{t('no_posts', lang)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
