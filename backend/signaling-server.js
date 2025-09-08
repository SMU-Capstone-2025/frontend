const WebSocket = require('ws');

// 테스트용 내용 추가 

// WebSocket 서버 생성
const wss = new WebSocket.Server({ 
  port: 8081,
  perMessageDeflate: false
});

// 연결된 클라이언트 관리
const rooms = new Map(); // roomId -> Set of users
const users = new Map(); // userId -> { ws, roomId, userName }

console.log('🚀 WebRTC Signaling Server started on port 8081');

// WebSocket 연결 처리
wss.on('connection', (ws) => {
  console.log('✅ New client connected');
  
  let currentUserId = null;
  let currentRoomId = null;

  // 메시지 수신 처리
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('📨 Received:', data.type, `User: ${data.userId || currentUserId}`, `Room: ${data.roomId || currentRoomId}`);
      
      switch(data.type) {
        case 'join':
          const joinResult = handleJoin(ws, data);
          if (joinResult.success) {
            currentUserId = data.userId;
            currentRoomId = data.roomId;
          }
          break;
          
        case 'offer':
          handleOffer(ws, data, currentUserId, currentRoomId);
          break;
          
        case 'answer':
          handleAnswer(ws, data, currentUserId, currentRoomId);
          break;
          
        case 'ice-candidate':
          handleIceCandidate(ws, data, currentUserId, currentRoomId);
          break;
          
        case 'chat-message':
          handleChatMessage(ws, data, currentRoomId, currentUserId);
          break;

        case 'screen-share-status':
          handleScreenShareStatus(ws, data, currentUserId, currentRoomId);
          break;

        case 'renegotiate':
          handleRenegotiate(ws, data, currentUserId, currentRoomId);
          break;

        case 'renegotiate-answer':
          handleRenegotiateAnswer(ws, data, currentUserId, currentRoomId);
          break;

        case 'leave':
          if (data.roomId && data.userId) {
            handleLeave(data.userId, data.roomId);
            if (data.userId === currentUserId) {
              currentUserId = null;
              currentRoomId = null;
            }
          }
          break;

        default:
          console.log('❓ Unknown message type:', data.type);
          ws.send(JSON.stringify({
            type: 'error',
            message: `Unknown message type: ${data.type}`
          }));
      }
    } catch (error) {
      console.error('❌ Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format'
      }));
    }
  });

  // 연결 종료 처리
  ws.on('close', () => {
    console.log('👋 Client disconnected:', currentUserId, 'from room:', currentRoomId);
    if (currentUserId && currentRoomId) {
      handleLeave(currentUserId, currentRoomId);
    }
  });

  // 에러 처리
  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });

  // 연결 유지를 위한 ping
  ws.isAlive = true;
  ws.on('pong', () => {
    ws.isAlive = true;
  });
});

// 주기적으로 연결 확인
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('close', () => {
  clearInterval(interval);
});

// 방 참가 처리
function handleJoin(ws, data) {
  const { roomId, userId, userName } = data;
  
  // 필수 데이터 검증
  if (!roomId || !userId || !userName) {
    console.log('❌ Invalid join data:', data);
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Missing required fields: roomId, userId, userName'
    }));
    return { success: false };
  }
  
  console.log(`🏠 ${userName} (${userId}) joining room ${roomId}`);
  
  // 이미 연결된 사용자인지 확인
  if (users.has(userId)) {
    console.log(`⚠️ User ${userId} already connected, updating connection`);
    const existingUser = users.get(userId);
    // 기존 방에서 제거
    if (existingUser.roomId && rooms.has(existingUser.roomId)) {
      const oldRoom = rooms.get(existingUser.roomId);
      oldRoom.delete(userId);
      if (oldRoom.size === 0) {
        rooms.delete(existingUser.roomId);
      }
    }
  }
  
  // 사용자 정보 저장
  users.set(userId, {
    ws,
    roomId,
    userName,
    userId
  });
  
  // 방이 없으면 생성
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
    console.log(`🆕 Created new room: ${roomId}`);
  }
  
  const room = rooms.get(roomId);
  
  // 기존 참가자들에게 새 사용자 알림 (같은 방의 사용자들에게만)
  room.forEach(existingUserId => {
    if (existingUserId !== userId) {
      const existingUser = users.get(existingUserId);
      if (existingUser && existingUser.ws.readyState === WebSocket.OPEN) {
        existingUser.ws.send(JSON.stringify({
          type: 'user-joined',
          userId,
          userName,
          roomId
        }));
        console.log(`📤 Notified ${existingUserId} about new user ${userId} in room ${roomId}`);
      }
    }
  });
  
  // 방에 사용자 추가
  room.add(userId);
  
  // 새 사용자에게 방 정보 전송
  ws.send(JSON.stringify({
    type: 'room-info',
    roomId,
    participantCount: room.size
  }));
  
  // 참가자 목록 업데이트 (같은 방에만)
  broadcastParticipants(roomId);
  
  console.log(`✅ Room ${roomId} now has ${room.size} users:`, Array.from(room));
  return { success: true };
}

// 화면공유 상태 처리
function handleScreenShareStatus(ws, data, userId, currentRoomId) {
  const { isSharing, roomId } = data;
  const targetRoomId = roomId || currentRoomId;
  
  if (!targetRoomId) {
    console.log('❌ No room ID for screen share status');
    return;
  }
  
  const room = rooms.get(targetRoomId);
  
  console.log(`📺 ${userId} ${isSharing ? 'started' : 'stopped'} screen sharing in room ${targetRoomId}`);
  
  if (room) {
    // 같은 방의 다른 사용자들에게만 전송
    room.forEach(existingUserId => {
      if (existingUserId !== userId) {
        const existingUser = users.get(existingUserId);
        if (existingUser && existingUser.roomId === targetRoomId && existingUser.ws.readyState === WebSocket.OPEN) {
          existingUser.ws.send(JSON.stringify({
            type: 'screen-share-status',
            userId,
            isSharing,
            roomId: targetRoomId
          }));
        }
      }
    });
  }
}

// Offer 전달 (방 검증 추가)
function handleOffer(ws, data, fromUserId, currentRoomId) {
  const { to, offer, roomId } = data;
  const targetRoomId = roomId || currentRoomId;
  const toUser = users.get(to);
  
  console.log(`📤 Forwarding offer from ${fromUserId} to ${to} in room ${targetRoomId}`);
  
  if (!targetRoomId) {
    console.log('❌ No room ID for offer');
    return;
  }
  
  // 수신자가 같은 방에 있는지 확인
  if (toUser && toUser.roomId === targetRoomId && toUser.ws.readyState === WebSocket.OPEN) {
    toUser.ws.send(JSON.stringify({
      type: 'offer',
      from: fromUserId,
      offer,
      roomId: targetRoomId
    }));
  } else {
    console.log(`❌ User ${to} not found, disconnected, or in different room`);
    // 발신자에게 오류 알림
    ws.send(JSON.stringify({
      type: 'error',
      message: `User ${to} is not available`
    }));
  }
}

// Answer 전달 (방 검증 추가)
function handleAnswer(ws, data, fromUserId, currentRoomId) {
  const { to, answer, roomId } = data;
  const targetRoomId = roomId || currentRoomId;
  const toUser = users.get(to);
  
  console.log(`📤 Forwarding answer from ${fromUserId} to ${to} in room ${targetRoomId}`);
  
  if (!targetRoomId) {
    console.log('❌ No room ID for answer');
    return;
  }
  
  // 수신자가 같은 방에 있는지 확인
  if (toUser && toUser.roomId === targetRoomId && toUser.ws.readyState === WebSocket.OPEN) {
    toUser.ws.send(JSON.stringify({
      type: 'answer',
      from: fromUserId,
      answer,
      roomId: targetRoomId
    }));
  } else {
    console.log(`❌ User ${to} not found, disconnected, or in different room`);
  }
}

// ICE Candidate 전달 (방 검증 추가)
function handleIceCandidate(ws, data, fromUserId, currentRoomId) {
  const { to, candidate, roomId } = data;
  const targetRoomId = roomId || currentRoomId;
  const toUser = users.get(to);
  
  if (!targetRoomId) {
    console.log('❌ No room ID for ICE candidate');
    return;
  }
  
  // 수신자가 같은 방에 있는지 확인
  if (toUser && toUser.roomId === targetRoomId && toUser.ws.readyState === WebSocket.OPEN) {
    toUser.ws.send(JSON.stringify({
      type: 'ice-candidate',
      from: fromUserId,
      candidate,
      roomId: targetRoomId
    }));
  }
}

// 채팅 메시지 전달 (방 검증 추가)
function handleChatMessage(ws, data, roomId, senderId) {
  const { message, userName, roomId: dataRoomId } = data;
  const targetRoomId = dataRoomId || roomId;
  
  if (!targetRoomId) {
    console.log('❌ No room ID for chat message');
    return;
  }
  
  const room = rooms.get(targetRoomId);
  
  console.log(`💬 Chat message in room ${targetRoomId}: ${message}`);
  
  if (room) {
    // 같은 방의 다른 사용자들에게만 전송
    room.forEach(userId => {
      if (userId !== senderId) {
        const user = users.get(userId);
        if (user && user.roomId === targetRoomId && user.ws.readyState === WebSocket.OPEN) {
          user.ws.send(JSON.stringify({
            type: 'chat-message',
            message,
            userName,
            roomId: targetRoomId
          }));
        }
      }
    });
  }
}

// 사용자 퇴장 처리
function handleLeave(userId, roomId) {
  console.log(`👋 ${userId} leaving room ${roomId}`);
  
  const room = rooms.get(roomId);
  if (room) {
    room.delete(userId);
    
    // 빈 방 삭제
    if (room.size === 0) {
      rooms.delete(roomId);
      console.log(`🗑️ Empty room ${roomId} deleted`);
    } else {
      // 같은 방의 다른 참가자들에게만 퇴장 알림
      room.forEach(existingUserId => {
        const existingUser = users.get(existingUserId);
        if (existingUser && existingUser.roomId === roomId && existingUser.ws.readyState === WebSocket.OPEN) {
          existingUser.ws.send(JSON.stringify({
            type: 'user-left',
            userId,
            roomId
          }));
        }
      });
      
      // 참가자 목록 업데이트
      broadcastParticipants(roomId);
    }
  }
  
  users.delete(userId);
}

// 참가자 목록 브로드캐스트 (특정 방에만)
function broadcastParticipants(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;
  
  const participants = [];
  room.forEach(userId => {
    const user = users.get(userId);
    if (user && user.roomId === roomId) {
      participants.push({
        id: user.userId,
        name: user.userName
      });
    }
  });
  
  console.log(`👥 Broadcasting participants for room ${roomId}:`, participants.map(p => p.name));
  
  // 같은 방의 사용자들에게만 전송
  room.forEach(userId => {
    const user = users.get(userId);
    if (user && user.roomId === roomId && user.ws.readyState === WebSocket.OPEN) {
      user.ws.send(JSON.stringify({
        type: 'participants-update',
        participants,
        roomId
      }));
    }
  });
}

// renegotiate offer 중계 (방 검증 추가)
function handleRenegotiate(ws, data, fromUserId, currentRoomId) {
  const { to, offer, isScreenShare, roomId } = data;
  const targetRoomId = roomId || currentRoomId;
  const toUser = users.get(to);
  
  console.log(`🔄 Renegotiate from ${fromUserId} to ${to} in room ${targetRoomId}`);
  
  if (!targetRoomId) {
    console.log('❌ No room ID for renegotiate');
    return;
  }
  
  // 수신자가 같은 방에 있는지 확인
  if (toUser && toUser.roomId === targetRoomId && toUser.ws.readyState === WebSocket.OPEN) {
    toUser.ws.send(JSON.stringify({
      type: 'renegotiate',
      from: fromUserId,
      offer,
      isScreenShare,
      roomId: targetRoomId
    }));
  }
}

// renegotiate-answer 중계 (방 검증 추가)
function handleRenegotiateAnswer(ws, data, fromUserId, currentRoomId) {
  const { to, answer, roomId } = data;
  const targetRoomId = roomId || currentRoomId;
  const toUser = users.get(to);
  
  console.log(`🔄 Renegotiate-answer from ${fromUserId} to ${to} in room ${targetRoomId}`);
  
  if (!targetRoomId) {
    console.log('❌ No room ID for renegotiate-answer');
    return;
  }
  
  // 수신자가 같은 방에 있는지 확인
  if (toUser && toUser.roomId === targetRoomId && toUser.ws.readyState === WebSocket.OPEN) {
    toUser.ws.send(JSON.stringify({
      type: 'renegotiate-answer',
      from: fromUserId,
      answer,
      roomId: targetRoomId
    }));
  }
}

// 서버 종료 처리
process.on('SIGTERM', () => {
  console.log('🛑 Server shutting down...');
  wss.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// 현재 상태 출력 (디버깅용)
setInterval(() => {
  console.log(`📊 Status - Rooms: ${rooms.size}, Users: ${users.size}, Connections: ${wss.clients.size}`);
  
  // 각 방의 상태 출력
  if (rooms.size > 0) {
    console.log('🏠 Room details:');
    rooms.forEach((userSet, roomId) => {
      const userNames = Array.from(userSet).map(userId => {
        const user = users.get(userId);
        return user ? user.userName : userId;
      });
      console.log(`  ${roomId}: ${userSet.size} users [${userNames.join(', ')}]`);
    });
  }
}, 60000); // 1분마다

console.log('✨ Server is ready for connections!');