import { useRef, useState, useEffect, createContext } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

const socketContext = createContext();
const socket = io("http://localhost:4000");

const SocketProvider = ({ children }) => {
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState("");
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [idToCall, setIdToCall] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const streamRef = useRef(null);

  const startLocalStream = async () => {
    if (streamRef.current) return streamRef.current;

    const currentStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    streamRef.current = currentStream;
    setStream(currentStream);
    if (myVideo.current) {
      myVideo.current.srcObject = currentStream;
    }

    return currentStream;
  };

  const stopLocalStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStream(null);
    setIsMuted(false);
    setIsSharingScreen(false);

    if (myVideo.current) {
      myVideo.current.srcObject = null;
    }
    if (userVideo.current) {
      userVideo.current.srcObject = null;
    }
  };

  const startCall = (targetId) => {
    if (!targetId || !stream) return;

    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: targetId,
        signalData: data,
        from: me,
        name,
      });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.once("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  useEffect(() => {
    socket.on("me", setMe);

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({
        isReceivingCall: true,
        from,
        name: callerName,
        signal,
      });
    });

    return () => {
      socket.off("me");
      socket.off("callUser");
    };
  }, []);

  useEffect(() => {
    const handleRoomPeerJoined = ({ peerId }) => {
      setIdToCall(peerId);
      startCall(peerId);
    };

    socket.on("roomPeerJoined", handleRoomPeerJoined);

    return () => {
      socket.off("roomPeerJoined", handleRoomPeerJoined);
    };
  }, [stream, me, name]);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  const callUser = () => {
    startCall(idToCall);
  };

  const joinVideoRoom = (roomId) => {
    if (!roomId) return;
    socket.emit("joinVideoRoom", roomId);
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current?.destroy();
    stopLocalStream();
    window.location.reload();
  };
  const toggleMute = () => {
    if (!stream) return;

    stream.getAudioTracks().forEach((track) => {
      track.enabled = isMuted; // toggle
    });

    setIsMuted((prev) => !prev);
  };

  const toggleScreenShare = async () => {
    if (!connectionRef.current) return;

    if (!isSharingScreen) {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      const screenTrack = screenStream.getVideoTracks()[0];

      const sender = connectionRef.current._pc
        .getSenders()
        .find((s) => s.track.kind === "video");

      sender.replaceTrack(screenTrack);

      screenTrack.onended = () => {
        stopScreenShare();
      };

      setIsSharingScreen(true);
    } else {
      stopScreenShare();
    }
  };
  const stopScreenShare = () => {
    const videoTrack = stream.getVideoTracks()[0];

    const sender = connectionRef.current._pc
      .getSenders()
      .find((s) => s.track.kind === "video");

    sender.replaceTrack(videoTrack);

    setIsSharingScreen(false);
  };

  return (
    <socketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        startLocalStream,
        stopLocalStream,
        name,
        setName,
        idToCall,
        setIdToCall,
        callEnded,
        me,
        callUser,
        joinVideoRoom,
        leaveCall,
        answerCall,
        toggleMute,
        isMuted,
        toggleScreenShare,
        isSharingScreen,
      }}
    >
      {children}
    </socketContext.Provider>
  );
};

export { socketContext, SocketProvider };
