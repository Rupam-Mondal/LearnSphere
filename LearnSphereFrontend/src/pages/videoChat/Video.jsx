import React, { useContext, useState } from "react";
import { socketContext } from "../../contexts/socketContext";
import {
  Phone,
  PhoneOff,
  Video as VideoIcon,
  User,
  Copy,
  Mic,
  MicOff,
  Monitor,
  Pin,
  PinOff,
  Check,
  Zap,
  Globe
} from "lucide-react";

const Video = () => {
  const {
    call,
    callAccepted,
    myVideo,
    userVideo,
    stream,
    name,
    setName,
    callEnded,
    me,
    callUser,
    leaveCall,
    answerCall,
    idToCall,
    setIdToCall,
    toggleMute,
    isMuted,
    toggleScreenShare,
    isSharingScreen
  } = useContext(socketContext);

  const [pinnedUser, setPinnedUser] = useState(null);
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(me);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-screen bg-[#020617] text-slate-200 flex flex-col overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* --- DASHBOARD HEADER --- */}
      <header className="w-full p-4 lg:p-6 bg-slate-900/40 backdrop-blur-xl border-b border-white/5 flex flex-col lg:flex-row gap-4 items-center justify-between z-50">
        
        {/* Branding */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20">
            <VideoIcon size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white leading-none">learn Sphere</h1>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Doubt Solving Sessions</span>
          </div>
        </div>

        {/* Setup Controls (The UX Core) */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          
          {/* Identity Input */}
          <div className="flex items-center bg-slate-800/50 border border-white/5 p-1 rounded-2xl focus-within:border-indigo-500/50 transition-all">
            <div className="pl-3 text-slate-500"><User size={16} /></div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="bg-transparent border-none outline-none px-3 py-2 text-sm font-medium w-32 lg:w-40 placeholder:text-slate-600"
            />
            <button 
              onClick={copyId}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                copied ? 'bg-emerald-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "COPIED" : "COPY ID"}
            </button>
          </div>

          <div className="hidden lg:block h-8 w-[1px] bg-white/10 mx-2" />

          {/* Connection Input */}
          <div className="flex items-center bg-slate-800/50 border border-white/5 p-1 rounded-2xl focus-within:border-emerald-500/50 transition-all">
            <div className="pl-3 text-slate-500"><Globe size={16} /></div>
            <input
              value={idToCall}
              onChange={(e) => setIdToCall(e.target.value)}
              placeholder="Partner's ID"
              className="bg-transparent border-none outline-none px-3 py-2 text-sm font-mono w-40 lg:w-56 placeholder:text-slate-600"
            />
            {callAccepted && !callEnded ? (
              <button onClick={leaveCall} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl transition-all font-bold text-xs">
                DISCONNECT
              </button>
            ) : (
              <button onClick={callUser} className="bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2 rounded-xl transition-all font-bold text-xs flex items-center gap-2">
                <Zap size={14} fill="currentColor" /> CONNECT
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 relative p-4 lg:p-8 flex items-center justify-center h-fit-content">
        <div className={`w-full h-full max-w-7xl grid gap-6 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          pinnedUser ? 'grid-cols-1 md:grid-cols-12' : 'grid-cols-1 md:grid-cols-2'
        }`}>
          
          {stream && (
            <div className={`relative group rounded-[2rem] overflow-hidden bg-slate-900 border border-white/5 shadow-2xl transition-all duration-700 ${
              pinnedUser === 'me' ? 'md:col-span-9 h-full' : 
              pinnedUser === 'user' ? 'md:col-span-3 h-40 md:h-full order-last' : 'h-full'
            }`}>
              <video ref={myVideo} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
              
              {/* Overlay Tags */}
              <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-tighter">{name || "Local Node"}</span>
              </div>

              {/* Pin Action */}
              <button 
                onClick={() => setPinnedUser(pinnedUser === 'me' ? null : 'me')}
                className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-indigo-500 backdrop-blur-md rounded-2xl transition-all opacity-0 group-hover:opacity-100 border border-white/10"
              >
                {pinnedUser === 'me' ? <PinOff size={20} /> : <Pin size={20} />}
              </button>
            </div>
          )}

          {callAccepted && !callEnded ? (
            <div className={`relative group rounded-[2rem] overflow-hidden bg-slate-900 border border-white/5 shadow-2xl transition-all duration-700 ${
              pinnedUser === 'user' ? 'md:col-span-9 h-full' : 
              pinnedUser === 'me' ? 'md:col-span-3 h-40 md:h-full order-last' : 'h-full'
            }`}>
              <video ref={userVideo} autoPlay playsInline className="w-full h-full object-cover" />
              
              <div className="absolute top-6 left-6 flex items-center gap-2 bg-indigo-600/80 backdrop-blur-md px-4 py-1.5 rounded-full">
                <span className="text-[10px] font-black uppercase tracking-tighter">{call.name || "Remote Node"}</span>
              </div>

              <button 
                onClick={() => setPinnedUser(pinnedUser === 'user' ? null : 'user')}
                className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-indigo-500 backdrop-blur-md rounded-2xl transition-all opacity-0 group-hover:opacity-100 border border-white/10"
              >
                {pinnedUser === 'user' ? <PinOff size={20} /> : <Pin size={20} />}
              </button>
            </div>
          ) : (
            !pinnedUser && (
              <div className="flex flex-col items-center justify-center bg-slate-900/20 border-2 border-dashed border-white/5 rounded-[2rem]">
                 <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                   <Globe size={32} className="text-slate-700" />
                 </div>
                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Node Offline</span>
              </div>
            )
          )}
        </div>
      </main>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-6 w-full px-6">
        
        {/* Incoming Notification */}
        {call.isReceivingCall && !callAccepted && (
          <div className="bg-indigo-600 px-6 py-3 rounded-[2rem] flex items-center gap-6 shadow-[0_0_50px_rgba(79,70,229,0.5)] animate-in slide-in-from-bottom-10 fade-in">
             <div className="flex flex-col">
               <span className="text-[8px] font-black text-indigo-200 uppercase">Incoming Request</span>
               <p className="font-bold text-white text-sm">{call.name || "Unknown Guest"}</p>
             </div>
             <button onClick={answerCall} className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-black text-xs hover:scale-105 transition-transform">
               ACCEPT
             </button>
          </div>
        )}

        {/* Media Dock */}
        <div className="bg-slate-900/80 backdrop-blur-3xl border border-white/10 p-2.5 rounded-[2.5rem] flex items-center gap-2 shadow-2xl shadow-black">
          <button 
            onClick={toggleMute} 
            className={`p-4 rounded-3xl transition-all duration-300 ${isMuted ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
          </button>
          
          <button 
            onClick={toggleScreenShare} 
            className={`p-4 rounded-3xl transition-all duration-300 ${isSharingScreen ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/50' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <Monitor size={22} />
          </button>

          {callAccepted && !callEnded && (
            <button onClick={leaveCall} className="bg-red-500/10 text-red-500 p-4 rounded-3xl hover:bg-red-500 hover:text-white transition-all">
              <PhoneOff size={22} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Video;