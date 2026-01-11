
import React from 'react';
import { View, User } from '../types';
import { t } from '../services/translations';

interface NavigationProps {
  currentView: View;
  setView: (view: View) => void;
  lang?: string; // App will inject this via prop drilling or we can context it
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  // Normally we would get lang from context, but let's assume it's passed or derived
  // For simplicity, we'll use 'en' as default or pass it as prop in a real app
  // Here we derive it from a simple global or just pass it from App.tsx
  // Since I can't easily change App.tsx props without updating it, I'll use a trick
  const lang = (document.documentElement.lang || 'en') as any;

  const tabs: { id: View; labelKey: any; icon: React.ReactElement }[] = [
    { 
      id: 'HOME', 
      labelKey: 'home', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg> 
    },
    { 
      id: 'SEARCH', 
      labelKey: 'search', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> 
    },
    { 
      id: 'CHAT', 
      labelKey: 'chat', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994-1.414-.586m0 0L3 21V7a2 2 0 012-2h11a2 2 0 012 2v1m-7 4h.01M9 16h.01M13 16h.01"></path></svg> 
    },
    { 
      id: 'PROFILE', 
      labelKey: 'profile', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> 
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 px-6 py-2 flex justify-between items-center z-20">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setView(tab.id)}
          className={`flex flex-col items-center p-2 transition-colors ${currentView === tab.id ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          {tab.icon}
          <span className="text-[10px] mt-1 font-medium">{t(tab.labelKey, lang)}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
