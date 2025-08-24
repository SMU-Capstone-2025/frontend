import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, MessageCircle, Share, Users, X, Send, Monitor, MonitorOff } from 'lucide-react';

// WebRTC 설정
const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ]
};

// 시그널링 서버 URL
const SIGNALING_SERVER = 'ws://localhost:8080';

const VideoConference = () => {
  // URL에서 방 ID 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const [roomId] = useState(urlParams.get('room') || 'test-room');
  
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [peers, setPeers] = useState({});
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenSharingUsers, setScreenSharingUsers] = useState(new Set()); // 화면공유 중인 사용자들
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState([]);
  const [userId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [userName] = useState(`User_${Math.floor(Math.random() * 1000)}`);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [showShareLink, setShowShareLink] = useState(false);
  const [focusedStream, setFocusedStream] = useState(null); // 포커스된 화면
  
  const localVideoRef = useRef(null);
  const remoteVideoRefs = useRef({});
  const wsRef = useRef(null);
  const screenStreamRef = useRef(null);
  const originalStreamRef = useRef(null);
  const peersRef = useRef({});
  const isScreenSharingRef = useRef(false); // 화면공유 상태 추적

  // WebSocket 연결
  useEffect(() => {
    try {
      wsRef.current = new WebSocket(SIGNALING_SERVER);
      
      wsRef.current.onopen = () => {
        console.log('Connected to signaling server');
        setConnectionStatus('connected');
        wsRef.current.send(JSON.stringify({
          type: 'join',
          roomId,
          userId,
          userName
        }));
      };

      wsRef.current.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        
        switch(data.type) {
          case 'user-joined':
            handleUserJoined(data);
            break;
          case 'offer':
            await handleOffer(data);
            break;
          case 'answer':
            await handleAnswer(data);
            break;
          case 'ice-candidate':
            await handleIceCandidate(data);
            break;
          case 'user-left':
            handleUserLeft(data);
            break;
          case 'chat-message':
            handleChatMessage(data);
            break;
          case 'participants-update':
            setParticipants(data.participants);
            break;
          case 'screen-share-status':
            handleScreenShareStatus(data);
            break;
          case 'renegotiate':
            handleRenegotiate(data);
            break;
          case 'renegotiate-answer':
            handleRenegotiateAnswer(data);
            break;
        }
      };

      wsRef.current.onclose = () => {
        console.log('Disconnected from signaling server');
        setConnectionStatus('disconnected');
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket connection error:', error);
        console.log('시그널링 서버에 연결할 수 없습니다. 로컬에서 서버를 실행하거나 AWS에 배포해주세요.');
        setConnectionStatus('disconnected');
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      console.log('WebSocket URL을 확인해주세요:', SIGNALING_SERVER);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [roomId, userId, userName]);

  // 미디어 스트림 초기화
  useEffect(() => {
    const initStream = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideo = devices.some(device => device.kind === 'videoinput');
        const hasAudio = devices.some(device => device.kind === 'audioinput');
        
        console.log('Available devices:', { hasVideo, hasAudio });
        
        if (hasVideo || hasAudio) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: hasVideo,
            audio: hasAudio
          });
          setLocalStream(stream);
          originalStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        } else {
          // 디바이스가 없을 때 가짜 스트림 생성
          console.log('No media devices found, creating fake stream');
          const canvas = document.createElement('canvas');
          canvas.width = 640;
          canvas.height = 480;
          const ctx = canvas.getContext('2d');
          
          // 애니메이션
          let hue = 0;
          const animate = () => {
            hue = (hue + 1) % 360;
            
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, `hsl(${hue}, 50%, 20%)`);
            gradient.addColorStop(1, `hsl(${(hue + 60) % 360}, 50%, 30%)`);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#4b5563';
            ctx.beginPath();
            ctx.arc(canvas.width/2, canvas.height/2 - 20, 50, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.fillStyle = '#e5e7eb';
            ctx.font = 'bold 18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(userName, canvas.width/2, canvas.height/2 + 50);
            ctx.font = '14px Arial';
            ctx.fillText('카메라 없음', canvas.width/2, canvas.height/2 + 75);
            
            requestAnimationFrame(animate);
          };
          animate();
          
          const stream = canvas.captureStream(30);
          
          try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const destination = audioContext.createMediaStreamDestination();
            oscillator.frequency.value = 0;
            oscillator.connect(destination);
            oscillator.start();
            
            const audioTrack = destination.stream.getAudioTracks()[0];
            if (audioTrack) {
              stream.addTrack(audioTrack);
            }
          } catch (audioError) {
            console.log('Could not create audio track:', audioError);
          }
          
          setLocalStream(stream);
          originalStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        
        if (error.name === 'NotReadableError' || error.name === 'NotFoundError') {
          console.log('Camera not available, creating fake stream');
          
          const canvas = document.createElement('canvas');
          canvas.width = 640;
          canvas.height = 480;
          const ctx = canvas.getContext('2d');
          
          let hue = 0;
          const animate = () => {
            hue = (hue + 1) % 360;
            
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, `hsl(${hue}, 50%, 20%)`);
            gradient.addColorStop(1, `hsl(${(hue + 60) % 360}, 50%, 30%)`);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#4b5563';
            ctx.beginPath();
            ctx.arc(canvas.width/2, canvas.height/2 - 20, 50, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.strokeStyle = '#9ca3af';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(canvas.width/2 - 15, canvas.height/2 - 30, 5, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(canvas.width/2 + 15, canvas.height/2 - 30, 5, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(canvas.width/2, canvas.height/2 - 20, 30, 0, Math.PI);
            ctx.stroke();
            
            ctx.fillStyle = '#e5e7eb';
            ctx.font = 'bold 18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(userName, canvas.width/2, canvas.height/2 + 50);
            ctx.font = '14px Arial';
            ctx.fillText('카메라 없음', canvas.width/2, canvas.height/2 + 75);
            
            requestAnimationFrame(animate);
          };
          animate();
          
          const stream = canvas.captureStream(30);
          
          try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const destination = audioContext.createMediaStreamDestination();
            oscillator.frequency.value = 0;
            oscillator.connect(destination);
            oscillator.start();
            
            const audioTrack = destination.stream.getAudioTracks()[0];
            if (audioTrack) {
              stream.addTrack(audioTrack);
            }
          } catch (audioError) {
            console.log('Could not create audio track:', audioError);
          }
          
          setLocalStream(stream);
          originalStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        } else {
          alert('카메라/마이크 접근 오류: ' + error.message);
        }
      }
    };
    
    initStream();
    
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [userName]); // userName 의존성 추가

  // Remote streams 변경 감지
  useEffect(() => {
    console.log('RemoteStreams updated:', Object.keys(remoteStreams).length, Object.keys(remoteStreams));
  }, [remoteStreams]);

  // 화면공유 상태 변경 감지
  useEffect(() => {
    console.log('Screen sharing users changed:', Array.from(screenSharingUsers));
  }, [screenSharingUsers]);

  // Peer Connection 생성
  const createPeerConnection = (peerId) => {
    console.log(`Creating peer connection for ${peerId}`);
    const pc = new RTCPeerConnection(configuration);
    
    // ICE candidates 버퍼링
    pc.pendingCandidates = [];
    
    // 데이터 채널 생성 (화면공유 상태 등 메타데이터 전송용)
    const dataChannel = pc.createDataChannel('metadata', { ordered: true });
    pc.dataChannel = dataChannel;
    
    dataChannel.onopen = () => {
      console.log(`Data channel opened with ${peerId}`);
    };
    
    dataChannel.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(`📨 Data channel message from ${peerId}:`, data);
        
        if (data.type === 'screen-share-status') {
          handleScreenShareStatus({
            userId: peerId,
            isSharing: data.isSharing
          });
        }
      } catch (error) {
        console.error('Error parsing data channel message:', error);
      }
    };
    
    pc.ondatachannel = (event) => {
      const channel = event.channel;
      console.log(`Received data channel from ${peerId}`);
      
      channel.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log(`📨 Incoming data channel message from ${peerId}:`, data);
          
          if (data.type === 'screen-share-status') {
            handleScreenShareStatus({
              userId: peerId,
              isSharing: data.isSharing
            });
          }
        } catch (error) {
          console.error('Error parsing incoming data channel message:', error);
        }
      };
    };
    
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log(`Sending ICE candidate to ${peerId}`);
        wsRef.current.send(JSON.stringify({
          type: 'ice-candidate',
          to: peerId,
          candidate: event.candidate
        }));
      }
    };
    
    pc.ontrack = (event) => {
      console.log(`Received track from ${peerId}:`, {
        kind: event.track.kind,
        id: event.track.id,
        enabled: event.track.enabled,
        readyState: event.track.readyState,
        muted: event.track.muted
      });
      
      if (event.streams && event.streams[0]) {
        console.log(`Setting remote stream for ${peerId}, stream active:`, event.streams[0].active);
        
        // 스트림을 즉시 설정
        setRemoteStreams(prev => {
          const updated = {
            ...prev,
            [peerId]: event.streams[0]
          };
          console.log('Updated remote streams:', Object.keys(updated));
          return updated;
        });
        
        // 비디오 엘리먼트에 직접 설정 (백업)
        const setupVideo = () => {
          if (remoteVideoRefs.current[peerId]) {
            remoteVideoRefs.current[peerId].srcObject = event.streams[0];
            console.log(`Video element updated for ${peerId}`);
          } else {
            // 비디오 엘리먼트가 아직 없으면 재시도
            setTimeout(setupVideo, 100);
          }
        };
        setupVideo();
      }
    };
    
    pc.onconnectionstatechange = () => {
      console.log(`Connection state with ${peerId}: ${pc.connectionState}`);
      if (pc.connectionState === 'failed') {
        // 연결 실패 시 재시도
        console.log(`Connection failed with ${peerId}, attempting to restart ICE`);
        pc.restartIce();
      }
    };
    
    pc.oniceconnectionstatechange = () => {
      console.log(`ICE connection state with ${peerId}: ${pc.iceConnectionState}`);
    };
    
    // 현재 localStream의 모든 트랙 추가
    if (localStream) {
      localStream.getTracks().forEach(track => {
        console.log(`Adding ${track.kind} track to peer ${peerId}:`, track.enabled);
        pc.addTrack(track, localStream);
      });
    } else if (originalStreamRef.current) {
      // localStream이 아직 설정되지 않았다면 originalStream 사용
      originalStreamRef.current.getTracks().forEach(track => {
        console.log(`Adding original ${track.kind} track to peer ${peerId}:`, track.enabled);
        pc.addTrack(track, originalStreamRef.current);
      });
    }
    
    peersRef.current[peerId] = pc;
    setPeers(prev => ({ ...prev, [peerId]: pc }));
    
    return pc;
  };

  // 새 사용자 참가 처리
  const handleUserJoined = async (data) => {
    console.log(`User ${data.userName} joined, creating peer connection`);
    
    // localStream이 준비될 때까지 잠시 대기
    let retries = 0;
    while ((!localStream && !originalStreamRef.current) && retries < 10) {
      console.log('Waiting for local stream...');
      await new Promise(resolve => setTimeout(resolve, 200));
      retries++;
    }
    
    if (!localStream && !originalStreamRef.current) {
      console.error('Failed to get local stream after waiting');
      return;
    }
    
    const pc = createPeerConnection(data.userId);
    
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      wsRef.current.send(JSON.stringify({
        type: 'offer',
        to: data.userId,
        offer
      }));
      
      console.log(`Sent offer to ${data.userId}`);
    } catch (error) {
      console.error(`Error creating offer for ${data.userId}:`, error);
    }
  };

  // Offer 처리
  const handleOffer = async (data) => {
    console.log(`Received offer from ${data.from}`);
    
    // localStream이 준비될 때까지 대기
    let retries = 0;
    while ((!localStream && !originalStreamRef.current) && retries < 10) {
      console.log('Waiting for local stream before handling offer...');
      await new Promise(resolve => setTimeout(resolve, 200));
      retries++;
    }
    
    if (!localStream && !originalStreamRef.current) {
      console.error('Failed to get local stream after waiting');
      return;
    }
    
    const pc = createPeerConnection(data.from);
    
    try {
      await pc.setRemoteDescription(data.offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      // 버퍼링된 ICE candidates 처리
      if (pc.pendingCandidates && pc.pendingCandidates.length > 0) {
        console.log(`Processing ${pc.pendingCandidates.length} buffered ICE candidates for ${data.from}`);
        for (const candidate of pc.pendingCandidates) {
          await pc.addIceCandidate(candidate);
        }
        pc.pendingCandidates = [];
      }
      
      wsRef.current.send(JSON.stringify({
        type: 'answer',
        to: data.from,
        answer
      }));
      
      console.log(`Sent answer to ${data.from}`);
    } catch (error) {
      console.error(`Error handling offer from ${data.from}:`, error);
    }
  };

  // Answer 처리
  const handleAnswer = async (data) => {
    const pc = peersRef.current[data.from];
    if (pc) {
      try {
        console.log(`Setting remote description (answer) from ${data.from}`);
        await pc.setRemoteDescription(data.answer);
        
        // 버퍼링된 ICE candidates 처리
        if (pc.pendingCandidates && pc.pendingCandidates.length > 0) {
          console.log(`Processing ${pc.pendingCandidates.length} buffered ICE candidates for ${data.from}`);
          for (const candidate of pc.pendingCandidates) {
            await pc.addIceCandidate(candidate);
          }
          pc.pendingCandidates = [];
        }
        
        console.log(`Answer processed successfully for ${data.from}`);
      } catch (error) {
        console.error(`Error handling answer from ${data.from}:`, error);
      }
    }
  };

  // ICE Candidate 처리
  const handleIceCandidate = async (data) => {
    const pc = peersRef.current[data.from];
    if (pc) {
      try {
        console.log(`Adding ICE candidate from ${data.from}`);
        
        // 연결이 안정적일 때까지 대기
        if (pc.remoteDescription) {
          await pc.addIceCandidate(data.candidate);
          console.log(`ICE candidate added successfully for ${data.from}`);
        } else {
          // remote description이 설정될 때까지 버퍼링
          if (!pc.pendingCandidates) {
            pc.pendingCandidates = [];
          }
          pc.pendingCandidates.push(data.candidate);
          console.log(`Buffering ICE candidate for ${data.from}`);
        }
      } catch (error) {
        console.error(`Error adding ICE candidate for ${data.from}:`, error);
      }
    }
  };

  // 사용자 퇴장 처리
  const handleUserLeft = (data) => {
    if (peersRef.current[data.userId]) {
      peersRef.current[data.userId].close();
      delete peersRef.current[data.userId];
      setPeers(prev => {
        const newPeers = { ...prev };
        delete newPeers[data.userId];
        return newPeers;
      });
    }
    
    setRemoteStreams(prev => {
      const newStreams = { ...prev };
      delete newStreams[data.userId];
      return newStreams;
    });
    
    // 화면공유 상태도 제거
    setScreenSharingUsers(prev => {
      const newSet = new Set(prev);
      newSet.delete(data.userId);
      return newSet;
    });
    
    // 포커스된 스트림이 퇴장한 사용자의 것이면 초기화
    if (focusedStream === data.userId) {
      setFocusedStream(null);
    }
  };

  // 채팅 메시지 처리
  const handleChatMessage = (data) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      user: data.userName,
      text: data.message,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  // 화면공유 상태 처리
  const handleScreenShareStatus = (data) => {
    console.log(`🖥️ Screen share status update:`, {
      userId: data.userId,
      isSharing: data.isSharing,
      currentUsers: Array.from(screenSharingUsers),
      willUpdate: data.isSharing ? 'ADD' : 'REMOVE'
    });
    
    setScreenSharingUsers(prev => {
      const newSet = new Set(prev);
      if (data.isSharing) {
        newSet.add(data.userId);
      } else {
        newSet.delete(data.userId);
      }
      console.log('Updated screen sharing users:', Array.from(newSet));
      return newSet;
    });
  };

  // Renegotiation 처리 (화면공유용)
  const handleRenegotiate = async (data) => {
    console.log(`Received renegotiation offer from ${data.from}`);
    const pc = peersRef.current[data.from];
    
    if (pc) {
      try {
        await pc.setRemoteDescription(data.offer);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        
        wsRef.current.send(JSON.stringify({
          type: 'renegotiate-answer',
          to: data.from,
          answer
        }));
        
        if (data.isScreenShare) {
          handleScreenShareStatus({
            userId: data.from,
            isSharing: true
          });
        } else {
          // 화면공유 종료
          handleScreenShareStatus({
            userId: data.from,
            isSharing: false
          });
        }
        
        console.log(`Sent renegotiation answer to ${data.from}`);
      } catch (error) {
        console.error(`Error handling renegotiation from ${data.from}:`, error);
      }
    }
  };

  // Renegotiation answer 처리
  const handleRenegotiateAnswer = async (data) => {
    console.log(`Received renegotiation answer from ${data.from}`);
    const pc = peersRef.current[data.from];
    
    if (pc) {
      try {
        await pc.setRemoteDescription(data.answer);
        console.log(`Renegotiation completed with ${data.from}`);
      } catch (error) {
        console.error(`Error handling renegotiation answer from ${data.from}:`, error);
      }
    }
  };

  // 오디오 토글
  const toggleAudio = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks.forEach(track => {
          track.enabled = !track.enabled;
        });
        setIsAudioEnabled(audioTracks[0].enabled);
      } else {
        console.log('No audio tracks available');
        setIsAudioEnabled(false);
      }
    }
  };

  // 비디오 토글
  const toggleVideo = () => {
    if (originalStreamRef.current && !isScreenSharing) {
      const videoTracks = originalStreamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks.forEach(track => {
          track.enabled = !track.enabled;
        });
        setIsVideoEnabled(videoTracks[0].enabled);
      } else {
        console.log('No video tracks available');
        setIsVideoEnabled(false);
      }
    }
  };

  // 화면 공유 토글
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            cursor: 'always',
            displaySurface: 'monitor'
          },
          audio: false
        });
        
        screenStreamRef.current = screenStream;
        isScreenSharingRef.current = true;
        const screenVideoTrack = screenStream.getVideoTracks()[0];
        
        // ② 모든 PeerConnection에 화면 트랙 추가
        console.log('Adding screen track to all peers');
        Object.values(peersRef.current).forEach(pc => {
          screenStream.getTracks().forEach(track => {
            pc.addTrack(track, screenStream);
          });
        });

        // ② renegotiation 요청: 새 offer 생성해서 상대에 전송
        Object.entries(peersRef.current).forEach(async ([peerId, pc]) => {
          try {
            const offer = await pc.createOffer({ iceRestart: true });
            await pc.setLocalDescription(offer);
            wsRef.current.send(JSON.stringify({
              type: 'renegotiate',
              to: peerId,
              offer,
              isScreenShare: true
            }));
          } catch (e) {
            console.error('Failed renegotiation for', peerId, e);
          }
        });
        
        // 화면공유 종료 이벤트
        screenVideoTrack.onended = () => {
          stopScreenShare();
        };
        
        setIsScreenSharing(true);
        
        // 로컬 비디오는 원본 유지 (PIP에서 보여줄 용도)
        // 화면공유 상태만 UI로 표시
        
        // Data Channel로 직접 전송
        console.log('Sending screen share status via data channels');
        Object.entries(peersRef.current).forEach(([peerId, pc]) => {
          if (pc.dataChannel && pc.dataChannel.readyState === 'open') {
            const message = JSON.stringify({
              type: 'screen-share-status',
              isSharing: true
            });
            pc.dataChannel.send(message);
            console.log(`Sent screen share status to ${peerId} via data channel`);
          }
        });
        
        console.log('Screen sharing started successfully');
      } catch (error) {
        console.error('Error sharing screen:', error);
        if (error.name === 'NotAllowedError') {
          alert('화면 공유 권한이 거부되었습니다. 다시 시도해주세요.');
        }
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      isScreenSharingRef.current = false;

      Object.values(peersRef.current).forEach(pc => {
        pc.getSenders().forEach(sender => {
          if (sender.track && sender.track.kind === 'video' && sender.track !== originalStreamRef.current.getVideoTracks()[0]) {
            pc.removeTrack(sender);
          }
        });
      });
      
      // 원래 비디오 트랙으로 복원
      if (originalStreamRef.current) {
        const videoTrack = originalStreamRef.current.getVideoTracks()[0];
        if (videoTrack) {
          console.log('Restoring original video track for all peers');
          
          Object.entries(peersRef.current).forEach(([peerId, pc]) => {
            const sender = pc.getSenders().find(s => 
              s.track && s.track.kind === 'video'
            );
            if (sender) {
              console.log(`Restoring video track for peer ${peerId}`);
              sender.replaceTrack(videoTrack);
            }
          });
        }
      }
      
      // 화면공유 종료 알림
      console.log('Sending screen share stop status');
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'screen-share-status',
          isSharing: false,
          userId,
          roomId
        }));
        console.log('Screen share stop status sent');
      }
      
      screenStreamRef.current = null;
      setIsScreenSharing(false);
              // Data Channel로도 종료 상태 전송
        console.log('Sending screen share stop via data channels');
        Object.entries(peersRef.current).forEach(([peerId, pc]) => {
          if (pc.dataChannel && pc.dataChannel.readyState === 'open') {
            const message = JSON.stringify({
              type: 'screen-share-status',
              isSharing: false
            });
            pc.dataChannel.send(message);
            console.log(`Sent screen share stop to ${peerId} via data channel`);
          }
        });
        
        console.log('Screen sharing stopped');
    }
  };

  // 채팅 메시지 전송
  const sendMessage = () => {
    if (newMessage.trim()) {
      wsRef.current.send(JSON.stringify({
        type: 'chat-message',
        message: newMessage,
        userName
      }));
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        user: '나',
        text: newMessage,
        timestamp: new Date().toLocaleTimeString()
      }]);
      
      setNewMessage('');
    }
  };

  // 통화 종료
  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    Object.values(peersRef.current).forEach(pc => pc.close());
    
    if (wsRef.current) {
      wsRef.current.close();
    }
    
    window.location.href = '/';
  };

  // 그리드 레이아웃 계산
  const getGridLayout = (count) => {
    if (count <= 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2';
    if (count <= 4) return 'grid-cols-2';
    if (count <= 6) return 'grid-cols-2 lg:grid-cols-3';
    if (count <= 9) return 'grid-cols-3';
    if (count <= 12) return 'grid-cols-3 lg:grid-cols-4';
    return 'grid-cols-4';
  };

  const remoteStreamCount = Object.keys(remoteStreams).length;
  const gridLayout = getGridLayout(remoteStreamCount || 1);
  
  // 디버깅 정보
  console.log('Render:', {
    remoteStreamsCount: remoteStreamCount,
    remoteStreamIds: Object.keys(remoteStreams),
    isScreenSharing,
    screenSharingUsers: Array.from(screenSharingUsers)
  });

  return (
    <div className="h-screen w-full bg-gray-900 flex flex-col overflow-hidden">
      {/* 연결 상태 및 방 정보 표시 */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center gap-2">
        <div className={`px-4 py-2 rounded-lg text-white text-sm ${
          connectionStatus === 'connected' ? 'bg-green-600' : 
          connectionStatus === 'connecting' ? 'bg-yellow-600' : 'bg-red-600'
        }`}>
          {connectionStatus === 'connected' ? '✅ 연결됨' : 
           connectionStatus === 'connecting' ? '⏳ 서버 연결 중...' : '❌ 서버 연결 끊김'}
        </div>
        {connectionStatus === 'connected' && (
          <div className="bg-gray-800 text-white px-3 py-1 rounded text-xs flex items-center gap-2">
            <span>방 ID: {roomId} | 참가자: {remoteStreamCount + 1}명</span>
            <button
              onClick={() => {
                const link = `${window.location.origin}/video-call?room=${roomId}`;
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
        {showShareLink && (
          <div className="bg-green-600 text-white px-3 py-1 rounded text-xs animate-pulse">
            ✅ 링크가 복사되었습니다!
          </div>
        )}
      </div>

      {/* 메인 비디오 영역 */}
      <div className="flex-1 relative overflow-hidden bg-gray-900">
        <div className={`h-full w-full p-4 ${remoteStreamCount === 0 ? 'flex items-center justify-center' : ''}`}>
          {remoteStreamCount === 0 ? (
            // 다른 참가자가 없을 때 - 내 화면을 크게
            <div className="relative bg-gray-800 rounded-lg overflow-hidden w-full h-full max-w-4xl max-h-[80vh]">
              <div className="w-full h-full flex items-center justify-center">
                <video
                  ref={el => {
                    if (el) {
                      localVideoRef.current = el;
                      if (originalStreamRef.current && el.srcObject !== originalStreamRef.current) {
                        el.srcObject = originalStreamRef.current;
                      }
                    }
                  }}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded text-sm">
                나 {isScreenSharing && '🖥️ 화면공유중'}
              </div>
              {!isVideoEnabled && !isScreenSharing && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <VideoOff className="text-gray-500" size={48} />
                </div>
              )}
            </div>
          ) : (
            // 다른 참가자가 있을 때 - 그리드 레이아웃
            <div className="relative w-full h-full">
              <div className={`grid ${gridLayout} gap-4 w-full h-full`}>
                {Object.entries(remoteStreams).map(([peerId, stream]) => {
                  console.log(`Rendering video for ${peerId}`, stream);
                  return (
                    <div 
                      key={peerId} 
                      className="relative bg-gray-800 rounded-lg overflow-hidden"
                      onClick={() => setFocusedStream(focusedStream === peerId ? null : peerId)}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <video
                          ref={el => {
                            if (el) {
                              remoteVideoRefs.current[peerId] = el;
                              if (stream && el.srcObject !== stream) {
                                el.srcObject = stream;
                                console.log(`Video element connected for ${peerId}`);
                              }
                            }
                          }}
                          autoPlay
                          playsInline
                          className={`w-full h-full ${screenSharingUsers.has(peerId) ? 'object-contain bg-black' : 'object-cover'}`}
                          onLoadedMetadata={(e) => {
                            console.log(`Video loaded for ${peerId}:`, {
                              width: e.target.videoWidth,
                              height: e.target.videoHeight,
                              isScreenShare: screenSharingUsers.has(peerId)
                            });
                          }}
                        />
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                        <span>{participants.find(p => p.id === peerId)?.name || `User ${peerId.substring(0, 4)}`}</span>
                        {screenSharingUsers.has(peerId) && <span className="text-xs">🖥️</span>}
                      </div>
                      {focusedStream === peerId && (
                        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                          포커스
                        </div>
                      )}
                      {screenSharingUsers.has(peerId) && (
                        <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs animate-pulse">
                          화면공유 중
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 로컬 비디오 (PIP 스타일) - 항상 원본 스트림 표시 */}
              <div className="absolute bottom-4 right-4 w-32 h-24 sm:w-48 sm:h-36 md:w-64 md:h-48 bg-gray-800 rounded-lg overflow-hidden shadow-lg border-2 border-gray-700 hover:border-gray-600 transition-all">
                <video
                  ref={el => {
                    if (el) {
                      localVideoRef.current = el;
                      // 항상 원본 스트림을 표시 (화면공유 중에도)
                      if (originalStreamRef.current && el.srcObject !== originalStreamRef.current) {
                        el.srcObject = originalStreamRef.current;
                      }
                    }
                  }}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white px-1.5 py-0.5 rounded text-xs">
                  나 {isScreenSharing && '🖥️'}
                </div>
                {!isVideoEnabled && !isScreenSharing && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <VideoOff className="text-gray-500" size={20} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 컨트롤 바 */}
      <div className="bg-gray-800 px-6 py-4">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full transition-colors ${
              isAudioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isAudioEnabled ? <Mic size={20} className="text-white" /> : <MicOff size={20} className="text-white" />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full transition-colors ${
              isVideoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
            }`}
            disabled={isScreenSharing}
          >
            {isVideoEnabled ? <Video size={20} className="text-white" /> : <VideoOff size={20} className="text-white" />}
          </button>

          <button
            onClick={toggleScreenShare}
            className={`p-3 rounded-full transition-colors ${
              isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isScreenSharing ? <MonitorOff size={20} className="text-white" /> : <Monitor size={20} className="text-white" />}
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors relative"
          >
            <MessageCircle size={20} className="text-white" />
            {messages.length > 0 && !showChat && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {messages.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <Users size={20} className="text-white" />
          </button>

          <button
            onClick={endCall}
            className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
          >
            <PhoneOff size={20} className="text-white" />
          </button>
        </div>
        
        {/* 디버그 정보 (개발용) */}
        <div className="text-xs text-gray-500 text-center mt-2">
          Peers: {Object.keys(peers).length} | Streams: {Object.keys(remoteStreams).length}
        </div>
      </div>

      {/* 채팅 패널 */}
      {showChat && (
        <div className="fixed inset-x-4 bottom-20 sm:inset-x-auto sm:right-4 sm:bottom-20 sm:left-auto w-auto sm:w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col z-40">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">채팅</h3>
            <button onClick={() => setShowChat(false)} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map(msg => (
              <div key={msg.id} className="flex flex-col">
                <div className="flex items-baseline space-x-2">
                  <span className="font-semibold text-sm">{msg.user}</span>
                  <span className="text-xs text-gray-500">{msg.timestamp}</span>
                </div>
                <p className="text-gray-700 break-words">{msg.text}</p>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="메시지 입력..."
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 참가자 패널 */}
      {showParticipants && (
        <div className="fixed inset-x-4 bottom-20 sm:inset-x-auto sm:left-4 sm:bottom-20 sm:right-auto w-auto sm:w-64 bg-white rounded-lg shadow-xl z-40">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">참가자 ({remoteStreamCount + 1}명)</h3>
            <button onClick={() => setShowParticipants(false)} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                나
              </div>
              <span className="text-gray-700">{userName} (나)</span>
              {isScreenSharing && <span className="text-xs">🖥️</span>}
            </div>
            
            {participants.filter(p => p.id !== userId).map(participant => (
              <div key={participant.id} className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm">
                  {participant.name[0]}
                </div>
                <span className="text-gray-700">{participant.name}</span>
                {screenSharingUsers.has(participant.id) && <span className="text-xs">🖥️</span>}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 디버그 버튼 (개발용) */}
      <button
        onClick={() => {
          console.log('=== Debug Info ===');
          console.log('Remote Streams:', remoteStreams);
          console.log('Peers:', peers);
          console.log('Local Stream:', localStream);
          console.log('Original Stream:', originalStreamRef.current);
          console.log('Screen Stream:', screenStreamRef.current);
          console.log('Is Screen Sharing:', isScreenSharing);
          console.log('Screen Sharing Users:', Array.from(screenSharingUsers));
          console.log('Room ID:', roomId);
          console.log('User ID:', userId);
          console.log('Data Channels:');
          Object.entries(peersRef.current).forEach(([peerId, pc]) => {
            console.log(`  ${peerId}: ${pc.dataChannel?.readyState || 'no channel'}`);
          });
          console.log('Video Elements:');
          document.querySelectorAll('video').forEach((v, i) => {
            console.log(`Video ${i}:`, v.srcObject);
          });
        }}
        className="fixed bottom-4 left-4 bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs z-50"
      >
        Debug
      </button>
    </div>
  );
};

export default VideoConference;