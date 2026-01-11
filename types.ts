
export type AppLanguage = 'en' | 'bn' | 'hi';

export interface User {
  uid: string;
  username: string;
  displayName: string;
  bio: string;
  photoURL: string;
  friends: string[];
  email?: string;
  phoneNumber?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  language?: AppLanguage;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userPhoto: string;
  imageUrl: string;
  caption: string;
  timestamp: Date;
  likes: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  imageUrl?: string;
  timestamp: Date;
}

export interface Chat {
  id: string;
  participant: User;
  messages: Message[];
  lastMessage: string;
}

export type View = 'HOME' | 'SEARCH' | 'CHAT' | 'PROFILE';
