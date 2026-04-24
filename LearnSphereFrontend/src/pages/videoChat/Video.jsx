import React, { useContext } from "react";
import { socketContext } from "../../contexts/socketContext";
import {
  Phone,
  PhoneOff,
  Video as VideoIcon,
  User,
  Copy,
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
  } = useContext(socketContext);

  const copyId = () => {
    navigator.clipboard.writeText(me);
  };

  return (
    <div className="w-full h-screen bg-slate-900 text-white flex flex-col items-center p-6">

      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <VideoIcon /> Video Chat
      </h1>

      {/* Videos */}
      <div className="flex gap-6 flex-wrap justify-center">

        {stream && (
          <video
            ref={myVideo}
            autoPlay
            muted
            className="w-[300px] h-[220px] rounded-xl bg-black"
          />
        )}

        {callAccepted && !callEnded && (
          <video
            ref={userVideo}
            autoPlay
            className="w-[300px] h-[220px] rounded-xl bg-black"
          />
        )}
      </div>

      {/* Controls */}
      <div className="bg-slate-800 p-6 rounded-xl mt-6 w-full max-w-md space-y-4">

        {/* Name */}
        <div className="flex gap-2 items-center">
          <User />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="w-full p-2 rounded bg-slate-700 outline-none"
          />
        </div>

        {/* Your ID */}
        <div className="flex justify-between items-center bg-slate-700 p-2 rounded">
          <span className="text-sm">{me}</span>
          <button onClick={copyId}>
            <Copy size={18} />
          </button>
        </div>

        {/* ID to call */}
        <input
          value={idToCall}
          onChange={(e) => setIdToCall(e.target.value)}
          placeholder="Enter ID to call"
          className="w-full p-2 rounded bg-slate-700 outline-none"
        />

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          {callAccepted && !callEnded ? (
            <button
              onClick={leaveCall}
              className="bg-red-600 px-4 py-2 rounded flex gap-2 items-center"
            >
              <PhoneOff /> End
            </button>
          ) : (
            <button
              onClick={callUser}
              className="bg-green-600 px-4 py-2 rounded flex gap-2 items-center"
            >
              <Phone /> Call
            </button>
          )}
        </div>

        {/* Incoming Call */}
        {call.isReceivingCall && !callAccepted && (
          <div className="text-center">
            <p>{call.name} is calling...</p>
            <button
              onClick={answerCall}
              className="bg-blue-600 px-4 py-2 rounded mt-2"
            >
              Answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Video;