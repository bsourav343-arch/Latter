
import React, { useState } from 'react';
import { Post, User } from '../types';
import { generateSmartCaption } from '../services/gemini';
import { t } from '../services/translations';

interface HomeFeedProps {
  posts: Post[];
  currentUser: User;
  onAddPost: (post: Post) => void;
}

const HomeFeed: React.FC<HomeFeedProps> = ({ posts, currentUser, onAddPost }) => {
  const [isPosting, setIsPosting] = useState(false);
  const [newImage, setNewImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isLoadingCaption, setIsLoadingCaption] = useState(false);
  
  const lang = currentUser.language || 'en';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMagicCaption = async () => {
    if (!newImage) return;
    setIsLoadingCaption(true);
    const result = await generateSmartCaption(newImage, lang);
    setCaption(result);
    setIsLoadingCaption(false);
  };

  const handlePost = () => {
    if (!newImage) return;
    const post: Post = {
      id: Date.now().toString(),
      userId: currentUser.uid,
      username: currentUser.username,
      userPhoto: currentUser.photoURL,
      imageUrl: newImage,
      caption: caption,
      timestamp: new Date(),
      likes: 0
    };
    onAddPost(post);
    setIsPosting(false);
    setNewImage(null);
    setCaption('');
  };

  return (
    <div className="pb-4">
      {/* Stories Placeholder */}
      <div className="flex gap-4 p-4 overflow-x-auto no-scrollbar bg-white border-b border-gray-50">
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <button onClick={() => setIsPosting(true)} className="w-16 h-16 rounded-full border-2 border-indigo-500 p-1 relative">
            <img src={currentUser.photoURL} className="w-full h-full rounded-full object-cover" alt="Me" />
            <div className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-0.5 border-2 border-white">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
            </div>
          </button>
          <span className="text-[10px] text-gray-500">{t('app_name', lang)}</span>
        </div>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="w-16 h-16 rounded-full border-2 border-pink-500 p-1">
              <img src={`https://picsum.photos/seed/story${i}/100`} className="w-full h-full rounded-full object-cover grayscale-[0.3]" alt="Friend" />
            </div>
            <span className="text-[10px] text-gray-500">friend_{i}</span>
          </div>
        ))}
      </div>

      {/* Posts */}
      <div className="flex flex-col gap-4 p-2">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-3 flex items-center gap-3">
              <img src={post.userPhoto} className="w-8 h-8 rounded-full object-cover" alt={post.username} />
              <span className="font-semibold text-sm">{post.username}</span>
              <span className="text-gray-400 text-xs ml-auto">
                {post.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <img src={post.imageUrl} className="w-full aspect-square object-cover" alt="Post" />
            <div className="p-3">
              <div className="flex gap-4 mb-2">
                <button className="hover:scale-110 transition-transform"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg></button>
                <button className="hover:scale-110 transition-transform"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg></button>
              </div>
              <p className="text-sm font-bold mb-1">{post.likes} likes</p>
              <p className="text-sm leading-relaxed">
                <span className="font-bold mr-2">{post.username}</span>
                {post.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Post Modal */}
      {isPosting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg">{t('new_post', lang)}</h3>
              <button onClick={() => setIsPosting(false)} className="text-gray-400 p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="p-4 flex flex-col gap-4">
              {!newImage ? (
                <div className="aspect-square bg-gray-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="post-upload" />
                  <label htmlFor="post-upload" className="cursor-pointer flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span className="text-sm text-gray-500 font-medium">{t('upload_photo', lang)}</span>
                  </label>
                </div>
              ) : (
                <div className="relative aspect-square">
                  <img src={newImage} className="w-full h-full object-cover rounded-xl" alt="Preview" />
                  <button onClick={() => setNewImage(null)} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-500 uppercase">{t('bio', lang)}</label>
                  <button 
                    disabled={!newImage || isLoadingCaption}
                    onClick={handleMagicCaption}
                    className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full border border-indigo-200 hover:bg-indigo-100 flex items-center gap-1 disabled:opacity-50"
                  >
                    {isLoadingCaption ? 'Thinking...' : `✨ ${t('magic_caption', lang)}`}
                  </button>
                </div>
                <textarea 
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder={t('write_something', lang)} 
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-24"
                />
              </div>

              <button 
                onClick={handlePost}
                disabled={!newImage}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold disabled:bg-gray-300 transition-colors shadow-lg shadow-indigo-100"
              >
                {t('share', lang)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeFeed;
