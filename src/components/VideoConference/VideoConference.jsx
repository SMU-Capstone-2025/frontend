import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageCircle,
  Users,
  X,
  Send,
  Monitor,
  MonitorOff,
} from "lucide-react";

// WebRTC 설정
const configuration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

// [수정] https 환경에서 wss를 사용하도록 보장합니다.
const SIGNALING_SERVER =
  (window.location.protocol === 'https:' ? 'wss://' : 'ws://')
  + window.location.host
  + '/ws';

const VideoConference = () => {
  // --- 원본 코드의 모든 state와 ref를 그대로 유지합니다 ---
  const urlParams = new URLSearchParams(window.location.search);
  const [roomId] = useState(() => {
    const callParam = urlParams.get("call");
    const roomParam = urlParams.get("room");
    return callParam || roomParam || "test-room";
  });

  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [peers, setPeers] = useState({});
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenSharingUsers, setScreenSharingUsers] = useState(new Set());
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [participants, setParticipants] = useState([]);
  const [userId] = useState(() => Math.random().toString(36).substr(2, 9));
  
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const name = prompt("이름을 입력해주세요", `User_${Math.floor(Math.random() * 1000)}`);
    setUserName(name || `User_${Math.floor(Math.random() * 1000)}`);
  }, []);
  
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [showShareLink, setShowShareLink] = useState(false);
  const [focusedStream, setFocusedStream] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRefs = useRef({});
  const wsRef = useRef(null);
  const screenStreamRef = useRef(null);
  const originalStreamRef = useRef(null);
  const peersRef = useRef({});
  const videoSendersRef = useRef({});
  const isScreenSharingRef = useRef(false);
  const pendingCandidatesRef = useRef({});
  
  // [수정] 메시지 핸들러를 저장할 ref 생성 (재연결 문제 해결의 핵심)
  const messageHandlersRef = useRef({});

  // 미디어 스트림 초기화
  useEffect(() => {
    const initStream = async () => {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setIsVideoEnabled(true);
      } catch (error) {
        console.warn("Could not get media devices, creating fake stream:", error.name);
        const canvas = document.createElement('canvas');
        canvas.width = 1; canvas.height = 1;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.fillRect(0, 0, 1, 1);
        stream = canvas.captureStream();
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const destination = audioContext.createMediaStreamDestination();
            stream.addTrack(destination.stream.getAudioTracks()[0]);
        } catch(e) { console.warn("Could not create fake audio track"); }
        setIsVideoEnabled(false);
      }
      setLocalStream(stream);
      originalStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    };
    if (userName) initStream();
  }, [userName]);

  // [수정] WebRTC 및 메시지 핸들러 로직을 업데이트하는 useEffect
  useEffect(() => {
    // localStream이 준비되지 않았다면 아무것도 하지 않음
    if (!localStream) return;

    const sendMessageOverWs = (message) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify(message));
        }
    };

    const createPeerConnection = (peerId) => {
        if (peersRef.current[peerId]) return peersRef.current[peerId];
        
        pendingCandidatesRef.current[peerId] = [];
        const pc = new RTCPeerConnection(configuration);
    
        pc.onicecandidate = (event) => {
          if (event.candidate) sendMessageOverWs({ type: "ice-candidate", to: peerId, candidate: event.candidate, roomId });
        };
    
        pc.ontrack = (event) => setRemoteStreams((prev) => ({ ...prev, [peerId]: event.streams[0] }));
    
        pc.onconnectionstatechange = () => {
          console.log(`Connection state with ${peerId}: ${pc.connectionState}`);
          if (pc.connectionState === 'failed') pc.restartIce();
          setPeers(prev => ({...prev, [peerId]: pc}));
        };
    
        localStream.getTracks().forEach((track) => {
            const sender = pc.addTrack(track, localStream);
            if (track.kind === 'video') videoSendersRef.current[peerId] = sender;
        });
    
        peersRef.current[peerId] = pc;
        setPeers(prev => ({...prev, [peerId]: pc}));
        return pc;
    };

    // messageHandlersRef에 최신 핸들러 함수들을 저장 (상태 변화에 따라 항상 최신 로직을 참조하도록)
    messageHandlersRef.current = {
        handleUserJoined: (data) => {
            const pc = createPeerConnection(data.userId);
            pc.createOffer()
              .then(offer => pc.setLocalDescription(offer))
              .then(() => sendMessageOverWs({ type: "offer", to: data.userId, offer: pc.localDescription, roomId }))
              .catch(e => console.error("Create offer error", e));
        },
        handleOffer: async (data) => {
            const pc = createPeerConnection(data.from);
            await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            sendMessageOverWs({ type: "answer", to: data.from, answer: pc.localDescription, roomId });
        },
        handleAnswer: async (data) => {
            const pc = peersRef.current[data.from];
            if (pc) {
              await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
              for (const candidate of pendingCandidatesRef.current[data.from] || []) {
                await pc.addIceCandidate(candidate).catch(e => console.warn("ICE candidate add error", e));
              }
              pendingCandidatesRef.current[data.from] = [];
            }
        },
        handleIceCandidate: async (data) => {
            const pc = peersRef.current[data.from];
            const candidate = new RTCIceCandidate(data.candidate);
            if (pc && pc.remoteDescription) {
              await pc.addIceCandidate(candidate);
            } else if (pc) {
              pendingCandidatesRef.current[data.from].push(candidate);
            }
        },
        handleUserLeft: (data) => {
            if (peersRef.current[data.userId]) {
              peersRef.current[data.userId].close();
              delete peersRef.current[data.userId];
            }
            setRemoteStreams(prev => {
              const newState = { ...prev };
              delete newState[data.userId];
              return newState;
            });
            setPeers(prev => {
              const newState = { ...prev };
              delete newState[data.userId];
              return newState;
            });
            if (focusedStream === data.userId) setFocusedStream(null);
        },
        handleChatMessage: (data) => {
            setMessages(prev => [...prev, { id: Date.now(), user: data.userName, text: data.message, timestamp: new Date().toLocaleTimeString() }]);
        },
        handleScreenShareStatus: (data) => {
            setScreenSharingUsers((prev) => {
              const newSet = new Set(prev);
              data.isSharing ? newSet.add(data.userId) : newSet.delete(data.userId);
              return newSet;
            });
        },
        handleRenegotiate: async(data) => {
            const pc = peersRef.current[data.from];
            if (pc) {
              await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              sendMessageOverWs({ type: "renegotiate-answer", to: data.from, answer: pc.localDescription, roomId });
            }
        },
        handleRenegotiateAnswer: async(data) => {
            const pc = peersRef.current[data.from];
            if (pc) {
              await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
            }
        }
    };
  }, [localStream, roomId, focusedStream]); 

  // [수정] WebSocket 연결을 위한 useEffect (단 한 번만 실행되도록)
  useEffect(() => {
    if (!userName || !roomId) return;
    
    const ws = new WebSocket(SIGNALING_SERVER);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnectionStatus("connected");
      ws.send(JSON.stringify({ type: "join", roomId, userId, userName }));
    };

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      const handlerName = `handle${data.type.charAt(0).toUpperCase() + data.type.slice(1).replace(/-/g, '')}`;
      const handler = messageHandlersRef.current[handlerName];
      
      if (handler) {
        handler(data);
      } else {
         switch(data.type) {
            case "participants-update": setParticipants(data.participants); break;
            case "error": console.error("Server error:", data.message); break;
         }
      }
    };

    ws.onclose = () => setConnectionStatus("disconnected");
    ws.onerror = (error) => console.error("WebSocket error:", error);

    return () => {
      if (wsRef.current) wsRef.current.close();
      Object.values(peersRef.current).forEach(pc => pc.close());
    };
  }, [userName, roomId, userId]);

  // --- 원본 코드의 모든 UI 관련 함수들을 그대로 복원합니다 ---
  const stopScreenShare = useCallback(() => {
    if (!screenStreamRef.current) return;
    screenStreamRef.current.getTracks().forEach(track => track.stop());
    const originalVideoTrack = originalStreamRef.current?.getVideoTracks()[0] || null;
    
    Object.values(peersRef.current).forEach(pc => {
        const sender = pc.getSenders().find(s => s.track?.kind === 'video');
        if (sender) sender.replaceTrack(originalVideoTrack);
    });

    setIsScreenSharing(false);
    isScreenSharingRef.current = false;
    screenStreamRef.current = null;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "screen-share-status", isSharing: false, roomId, userId }));
    }
    setIsVideoEnabled(!!originalVideoTrack);
  }, [roomId, userId]);

  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
        stopScreenShare();
        return;
    }
    try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        screenTrack.onended = () => stopScreenShare();

        Object.values(peersRef.current).forEach(pc => {
            const sender = pc.getSenders().find(s => s.track?.kind === 'video');
            if (sender) sender.replaceTrack(screenTrack);
        });
        
        screenStreamRef.current = screenStream;
        setIsScreenSharing(true);
        isScreenSharingRef.current = true;
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: "screen-share-status", isSharing: true, roomId, userId }));
        }
    } catch (err) {
        console.error("Error sharing screen:", err);
    }
  }, [isScreenSharing, stopScreenShare, roomId, userId]);

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
        setIsAudioEnabled(track.enabled);
      });
    }
  };

  const toggleVideo = () => {
    if (originalStreamRef.current && !isScreenSharing) {
      originalStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
        setIsVideoEnabled(track.enabled);
      });
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "chat-message",
        message: newMessage,
        userName,
        roomId,
      }));
      setMessages((prev) => [...prev, { id: Date.now(), user: "나", text: newMessage, timestamp: new Date().toLocaleTimeString() }]);
      setNewMessage("");
    }
  };

  const endCall = () => {
    if (localStream) localStream.getTracks().forEach((track) => track.stop());
    Object.values(peersRef.current).forEach((pc) => pc.close());
    if (wsRef.current) {
        wsRef.current.send(JSON.stringify({ type: "leave", roomId, userId }));
        wsRef.current.close();
    }
    window.location.href = "/";
  };
  
  const getGridLayout = (count) => {
    if (count <= 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 md:grid-cols-2";
    if (count <= 4) return "grid-cols-2";
    if (count <= 6) return "grid-cols-2 lg:grid-cols-3";
    if (count <= 9) return "grid-cols-3";
    if (count <= 12) return "grid-cols-3 lg:grid-cols-4";
    return "grid-cols-4";
  };

  const remoteStreamCount = Object.keys(remoteStreams).length;
  const gridLayout = getGridLayout(remoteStreamCount || 1);

  return (
    <div className="h-screen w-full bg-gray-900 flex flex-col overflow-hidden font-[Palanquin]">
      {/* 연결 상태 및 방 정보 표시 */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center gap-2">
        <div className={`px-4 py-2 rounded-lg text-white text-sm ${connectionStatus === "connected" ? "bg-green-600" : connectionStatus === "connecting" ? "bg-yellow-600" : "bg-red-600" }`}>
            {connectionStatus === "connected" ? "✅ 연결됨" : connectionStatus === "connecting" ? "⏳ 서버 연결 중..." : "❌ 서버 연결 끊김"}
        </div>
        {connectionStatus === "connected" && (
            <div className="bg-gray-800 text-white px-3 py-1 rounded text-xs flex items-center gap-2">
                <span>방 ID: {roomId} | 참가자: {remoteStreamCount + 1}명</span>
                <button
                    onClick={() => {
                    const link = window.location.href;
                    navigator.clipboard.writeText(link);
                    setShowShareLink(true);
                    setTimeout(() => setShowShareLink(false), 3000);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 px-2 py-0.5 rounded text-xs"
                >
                    링크 복사
                </button>
            </div>
        )}
        {showShareLink && <div className="bg-green-600 text-white px-3 py-1 rounded text-xs animate-pulse">✅ 링크가 복사되었습니다!</div>}
      </div>

      {/* 메인 비디오 영역 */}
      <div className="flex-1 relative overflow-hidden bg-gray-900">
        <div className={`h-full w-full p-4 ${remoteStreamCount === 0 ? "flex items-center justify-center" : ""}`}>
          {remoteStreamCount === 0 ? (
            <div className="relative bg-gray-800 rounded-lg overflow-hidden w-full h-full max-w-4xl max-h-[80vh]">
              <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-contain" />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded text-sm">나 {isScreenSharing && "🖥️ 화면공유중"}</div>
              {!isVideoEnabled && !isScreenSharing && <div className="absolute inset-0 bg-gray-800 flex items-center justify-center"><VideoOff className="text-gray-500" size={48} /></div>}
            </div>
          ) : (
            <div className="relative w-full h-full">
              <div className={`grid ${gridLayout} gap-4 w-full h-full`}>
                {Object.entries(remoteStreams).map(([peerId, stream]) => (
                  <div key={peerId} className="relative bg-gray-800 rounded-lg overflow-hidden" onClick={() => setFocusedStream(focusedStream === peerId ? null : peerId)}>
                    <video ref={(el) => (remoteVideoRefs.current[peerId] = el)} srcObject={stream} autoPlay playsInline className={`w-full h-full ${screenSharingUsers.has(peerId) ? "object-contain bg-black" : "object-cover"}`} />
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                        <span>{participants.find((p) => p.id === peerId)?.name || `User...`}</span>
                        {screenSharingUsers.has(peerId) && <span className="text-xs">🖥️</span>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-4 right-4 w-32 h-24 sm:w-48 sm:h-36 md:w-64 md:h-48 bg-gray-800 rounded-lg overflow-hidden shadow-lg border-2 border-gray-700">
                <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white px-1.5 py-0.5 rounded text-xs">나 {isScreenSharing && "🖥️"}</div>
                {!isVideoEnabled && !isScreenSharing && <div className="absolute inset-0 bg-gray-800 flex items-center justify-center"><VideoOff className="text-gray-500" size={20} /></div>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 컨트롤 바 */}
      <div className="bg-gray-800 px-6 py-4">
        <div className="flex items-center justify-center space-x-4">
          <button onClick={toggleAudio} className={`p-3 rounded-full ${isAudioEnabled ? "bg-gray-700" : "bg-red-600"}`}>
            {isAudioEnabled ? <Mic size={20} className="text-white" /> : <MicOff size={20} className="text-white" />}
          </button>
          <button onClick={toggleVideo} className={`p-3 rounded-full ${isVideoEnabled ? "bg-gray-700" : "bg-red-600"}`} disabled={isScreenSharing}>
            {isVideoEnabled ? <Video size={20} className="text-white" /> : <VideoOff size={20} className="text-white" />}
          </button>
          <button onClick={toggleScreenShare} className={`p-3 rounded-full ${isScreenSharing ? "bg-blue-600" : "bg-gray-700"}`}>
            {isScreenSharing ? <MonitorOff size={20} className="text-white" /> : <Monitor size={20} className="text-white" />}
          </button>
          <button onClick={() => setShowChat(!showChat)} className="p-3 rounded-full bg-gray-700 relative">
            <MessageCircle size={20} className="text-white" />
          </button>
          <button onClick={() => setShowParticipants(!showParticipants)} className="p-3 rounded-full bg-gray-700">
            <Users size={20} className="text-white" />
          </button>
          <button onClick={endCall} className="p-3 rounded-full bg-red-600">
            <PhoneOff size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* 채팅 패널 */}
      {showChat && (
        <div className="fixed inset-x-4 bottom-20 sm:inset-x-auto sm:right-4 sm:bottom-20 sm:left-auto w-auto sm:w-80 h-96 bg-white text-black rounded-lg shadow-xl flex flex-col z-40">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-gray-800">채팅</h3>
            <button onClick={() => setShowChat(false)} className="text-gray-500"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((msg) => (
              <div key={msg.id}>
                <div className="flex items-baseline space-x-2"><span className="font-semibold text-sm text-gray-900">{msg.user}</span><span className="text-xs text-gray-500">{msg.timestamp}</span></div>
                <p className="text-gray-700 break-words">{msg.text}</p>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === "Enter" && sendMessage()} placeholder="메시지 입력..." className="flex-1 px-3 py-2 border rounded-lg" />
              <button onClick={sendMessage} className="p-2 bg-blue-600 text-white rounded-lg"><Send size={20} /></button>
            </div>
          </div>
        </div>
      )}

      {/* 참가자 패널 */}
      {showParticipants && (
        <div className="fixed inset-x-4 bottom-20 sm:inset-x-auto sm:left-4 sm:bottom-20 sm:right-auto w-auto sm:w-64 bg-white text-black rounded-lg shadow-xl z-40">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-gray-800">참가자 ({remoteStreamCount + 1}명)</h3>
            <button onClick={() => setShowParticipants(false)} className="text-gray-500"><X size={20} /></button>
          </div>
          <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">나</div>
              <span className="text-gray-800">{userName} (나)</span>
              {isScreenSharing && <span className="text-xs">🖥️</span>}
            </div>
            {participants.filter(p => p.id !== userId).map(p => (
              <div key={p.id} className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm">{p.name[0]}</div>
                <span className="text-gray-800">{p.name}</span>
                {screenSharingUsers.has(p.id) && <span className="text-xs">🖥️</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 디버그 버튼 */}
      <button onClick={() => console.log({peersRef, remoteStreams, participants})} className="fixed bottom-4 left-4 bg-gray-600 text-white px-2 py-1 rounded text-xs z-50">
        Debug
      </button>
    </div>
  );
};

export default VideoConference;

