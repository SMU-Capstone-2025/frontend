// src/hooks/useWebRTC.js
import { useEffect, useState, useRef, useCallback } from "react";
import io from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:8080";

export default function useWebRTC(roomId) {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);

  const socketRef = useRef();
  const peerConnections = useRef({});

  useEffect(() => {
    // Socket.IO 연결
    socketRef.current = io(SOCKET_SERVER_URL);
    socketRef.current.emit("join", roomId);

    // signaling 이벤트 처리
    socketRef.current.on("signal", (data) => {
      // data.sender, data.message 처리: offer, answer, candidate 등
      console.log("Received signal:", data);
      // 여기에 WebRTC 연결 로직 추가
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    // 로컬 스트림 얻기
    const initLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        // 추후: local stream을 peer connection에 추가
      } catch (err) {
        console.error("getUserMedia error:", err);
      }
    };

    initLocalStream();
  }, []);

  // 음소거 토글
  const toggleMute = useCallback(() => {
    if (!localStream) return;
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  }, [localStream]);

  // 화면 공유
  const shareScreen = useCallback(async () => {
    if (!localStream) return;

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = screenStream.getVideoTracks()[0];

      // 여기서 기존 비디오 트랙을 교체하는 로직 추가 (예: peer 연결에서 replaceTrack)
      screenTrack.onended = () => {
        // 화면 공유 종료 시 원래 트랙 복원
        // setIsSharingScreen(false);
      };

      setIsSharingScreen(true);
    } catch (err) {
      console.error("Error sharing screen:", err);
    }
  }, [localStream]);

  // 통화 종료
  const leaveCall = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    Object.values(peerConnections.current).forEach(pc => pc.close());
    setRemoteStreams([]);
    if (socketRef.current) socketRef.current.disconnect();
  }, [localStream]);

  return {
    localStream,
    remoteStreams,
    isMuted,
    isSharingScreen,
    toggleMute,
    shareScreen,
    leaveCall,
    socket: socketRef.current,
  };
}
