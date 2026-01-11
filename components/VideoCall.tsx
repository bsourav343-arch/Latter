
import React, { useEffect, useRef, useState } from 'react';
import { User } from '../types';

interface VideoCallProps {
  currentUser: User;
  remoteUser: User;
  onClose: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ currentUser, remoteUser, onClose }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let interval: any;
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        // For demonstration purposes, we'll pipe the local stream to remote view
        // to simulate a connected state without a real signaling server.
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }

        interval = setInterval(() => {
          setCallDuration(prev => prev + 1);
        }, 1000);
      } catch (err) {
        console.error("Error accessing media devices:", err);
        alert("Could not access camera or microphone.");
        onClose();
      }
    }

    setupCamera();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      clearInterval(interval);
    };
  }, []);

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
      setIsVideoOff(!isVideoOff);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900 flex flex-col items-center justify-center text-white overflow-hidden">
      {/* Remote Video (Full Screen) */}
      <div className="absolute inset-0 bg-black">
        <video 
          ref={remoteVideoRef} 
          autoPlay 
          playsInline 
          className={`w-full h-full object-cover ${isVideoOff ? 'opacity-0' : 'opacity-100'}`}
        />
        {/* Remote User Placeholder if video off or loading */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center bg-gray-800 ${!isVideoOff && localStream ? 'hidden' : 'flex'}`}>
          <img src={remoteUser.photoURL} className="w-32 h-32 rounded-full border-4 border-gray-700 shadow-2xl animate-pulse" alt="" />
          <h2 className="mt-4 text-xl font-bold">{remoteUser.displayName}</h2>
          <p className="text-gray-400">Calling...</p>
        </div>
      </div>

      {/* Local Video (Floating) */}
      <div className="absolute top-6 right-6 w-32 h-44 bg-gray-800 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl z-20 transition-all hover:scale-105">
        <video 
          ref={localVideoRef} 
          autoPlay 
          muted 
          playsInline 
          className="w-full h-full object-cover mirror"
        />
        {isVideoOff && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
          </div>
        )}
      </div>

      {/* Info Overlay */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10">
         <p className="text-sm font-medium opacity-80">{remoteUser.displayName}</p>
         <p className="text-xs font-mono mt-1 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">{formatTime(callDuration)}</p>
      </div>

      {/* Controls */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-6 z-30">
        <button 
          onClick={toggleMute}
          className={`p-4 rounded-full transition-all ${isMuted ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'}`}
        >
          {isMuted ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2"></line></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
          )}
        </button>

        <button 
          onClick={onClose}
          className="p-5 bg-red-600 rounded-full text-white shadow-xl hover:bg-red-700 transition-all hover:scale-110 active:scale-95"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.59 11l-3.59 3.59V13H8v-2h5V7.41l3.59 3.59c.39.39.39 1.02 0 1.41z"/></svg>
        </button>

        <button 
          onClick={toggleVideo}
          className={`p-4 rounded-full transition-all ${isVideoOff ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'}`}
        >
          {isVideoOff ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2"></line></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          )}
        </button>
      </div>

      <style>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
};

export default VideoCall;
