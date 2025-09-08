const WebSocket = require('ws');

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
  
  // 기존 참가자들에게 새 사용자 알림
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
  
  // 참가자 목록 업데이트
  broadcastParticipants(roomId);
  
  console.log(`✅ Room ${roomId} now has ${room.size} users:`, Array.from(room));
  return { success: true };
}

// Offer 전달 - 수정: 방 검증 완화
function handleOffer(ws, data, fromUserId, currentRoomId) {
  const { to, offer, roomId } = data;
  const targetRoomId = roomId || currentRoomId;
  const toUser = users.get(to);
  
  console.log(`📤 Forwarding offer from ${fromUserId} to ${to} in room ${targetRoomId}`);
  
  // 발신자가 방에 있는지 확인
  if (!targetRoomId || !fromUserId) {
    console.log('❌ Missing room ID or user ID for offer');
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Missing room or user information'
    }));
    return;
  }
  
  // 수신자 존재 및 연결 상태만 확인 (같은 방 검증은 완화)
  if (toUser && toUser.ws.readyState === WebSocket.OPEN) {
    // 수신자가 다른 방에 있다면 경고만 출력하고 계속 진행
    if (toUser.roomId !== targetRoomId) {
      console.log(`⚠️ Room mismatch: sender in ${targetRoomId}, receiver in ${toUser.roomId}, but forwarding anyway`);
    }
    
    toUser.ws.send(JSON.stringify({
      type: 'offer',
      from: fromUserId,
      offer,
      roomId: targetRoomId
    }));
    console.log(`✅ Offer forwarded successfully`);
  } else {
    console.log(`❌ User ${to} not found or disconnected`);
    ws.send(JSON.stringify({
      type: 'error',
      message: `User ${to} is not available`
    }));
  }
}

// Answer 전달 - 수정: 방 검증 완화
function handleAnswer(ws, data, fromUserId, currentRoomId) {
  const { to, answer, roomId } = data;
  const targetRoomId = roomId || currentRoomId;
  const toUser = users.get(to);
  
  console.log(`📤 Forwarding answer from ${fromUserId} to ${to} in room ${targetRoomId}`);
  
  if (!targetRoomId || !fromUserId) {
    console.log('❌ Missing room ID or user ID for answer');
    return;
  }
  
  // 수신자 존재 및 연결 상태만 확인
  if (toUser && toUser.ws.readyState === WebSocket.OPEN) {
    if (toUser.roomId !== targetRoomId) {
      console.log(`⚠️ Room mismatch for answer, but forwarding anyway`);
    }
    
    toUser.ws.send(JSON.stringify({
      type: 'answer',
      from: fromUserId,
      answer,
      roomId: targetRoomId
    }));
    console.log(`✅ Answer forwarded successfully`);
  } else {
    console.log(`❌ User ${to} not found or disconnected`);
  }
}

// ICE Candidate 전달 - 수정: 방 검증 완화 (가장 중요!)
function handleIceCandidate(ws, data, fromUserId, currentRoomId) {
  const { to, candidate, roomId } = data;
  const targetRoomId = roomId || currentRoomId;
  const toUser = users.get(to);
  
  // ICE candidate는 연결에 매우 중요하므로 엄격한 검증 없이 전달
  if (toUser && toUser.ws.readyState === WebSocket.OPEN) {
    toUser.ws.send(JSON.stringify({
      type: 'ice-candidate',
      from: fromUserId,
      candidate,
      roomId: targetRoomId
    }));
    console.log(`🧊 ICE candidate forwarded from ${fromUserId} to ${to}`);
  } else {
    console.log(`❌ Cannot forward ICE candidate: User ${to} not available`);
  }
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
    // 같은 방의 다른 사용자들에게 전송
    room.forEach(existingUserId => {
      if (existingUserId !== userId) {
        const existingUser = users.get(existingUserId);
        if (existingUser && existingUser.ws.readyState === WebSocket.OPEN) {
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

// 채팅 메시지 전달
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
    room.forEach(userId => {
      if (userId !== senderId) {
        const user = users.get(userId);
        if (user && user.ws.readyState === WebSocket.OPEN) {
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
      // 다른 참가자들에게 퇴장 알림
      room.forEach(existingUserId => {
        const existingUser = users.get(existingUserId);
        if (existingUser && existingUser.ws.readyState === WebSocket.OPEN) {
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

// renegotiate offer 중계 - 수정: 방 검증 완화
function handleRenegotiate(ws, data, fromUserId, currentRoomId) {
  const { to, offer, isScreenShare, roomId } = data;
  const targetRoomId = roomId || currentRoomId;
  const toUser = users.get(to);
  
  console.log(`🔄 Renegotiate from ${fromUserId} to ${to} in room ${targetRoomId}`);
  
  if (toUser && toUser.ws.readyState === WebSocket.OPEN) {
    toUser.ws.send(JSON.stringify({
      type: 'renegotiate',
      from: fromUserId,
      offer,
      isScreenShare,
      roomId: targetRoomId
    }));
    console.log(`✅ Renegotiate forwarded successfully`);
  } else {
    console.log(`❌ Cannot forward renegotiate: User ${to} not available`);
  }
}

// renegotiate-answer 중계 - 수정: 방 검증 완화
function handleRenegotiateAnswer(ws, data, fromUserId, currentRoomId) {
  const { to, answer, roomId } = data;
  const targetRoomId = roomId || currentRoomId;
  const toUser = users.get(to);
  
  console.log(`🔄 Renegotiate-answer from ${fromUserId} to ${to} in room ${targetRoomId}`);
  
  if (toUser && toUser.ws.readyState === WebSocket.OPEN) {
    toUser.ws.send(JSON.stringify({
      type: 'renegotiate-answer',
      from: fromUserId,
      answer,
      roomId: targetRoomId
    }));
    console.log(`✅ Renegotiate-answer forwarded successfully`);
  } else {
    console.log(`❌ Cannot forward renegotiate-answer: User ${to} not available`);
  }
}

// 참가자 목록 브로드캐스트
function broadcastParticipants(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;
  
  const participants = [];
  room.forEach(userId => {
    const user = users.get(userId);
    if (user) {
      participants.push({
        id: user.userId,
        name: user.userName
      });
    }
  });
  
  console.log(`👥 Broadcasting participants for room ${roomId}:`, participants.map(p => p.name));
  
  room.forEach(userId => {
    const user = users.get(userId);
    if (user && user.ws.readyState === WebSocket.OPEN) {
      user.ws.send(JSON.stringify({
        type: 'participants-update',
        participants,
        roomId
      }));
    }
  });
}

// 서버 종료 처리
process.on('SIGTERM', () => {
  console.log('🛑 Server shutting down...');
  wss.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// 현재 상태 출력 (디버깅용) - 더 자세한 정보 포함
setInterval(() => {
  console.log(`📊 Status - Rooms: ${rooms.size}, Users: ${users.size}, Connections: ${wss.clients.size}`);
  
  if (rooms.size > 0) {
    console.log('🏠 Room details:');
    rooms.forEach((userSet, roomId) => {
      const userNames = Array.from(userSet).map(userId => {
        const user = users.get(userId);
        return user ? `${user.userName}(${userId.substring(0,4)})` : userId;
      });
      console.log(`  ${roomId}: ${userSet.size} users [${userNames.join(', ')}]`);
    });
  }
  
  // 연결되지 않은 WebSocket 정리
  let disconnectedCount = 0;
  wss.clients.forEach(ws => {
    if (ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING) {
      disconnectedCount++;
    }
  });
  
  if (disconnectedCount > 0) {
    console.log(`🧹 Found ${disconnectedCount} disconnected WebSocket connections`);
  }
}, 30000); // 30초마다로 변경 (더 자주 체크)

// 좀비 연결 정리 함수 추가
function cleanupZombieConnections() {
  const now = Date.now();
  let cleanedUsers = 0;
  let cleanedRooms = 0;
  
  // 연결이 끊어진 사용자 정리
  users.forEach((user, userId) => {
    if (user.ws.readyState === WebSocket.CLOSED || user.ws.readyState === WebSocket.CLOSING) {
      console.log(`🧹 Cleaning up zombie user: ${userId}`);
      handleLeave(userId, user.roomId);
      cleanedUsers++;
    }
  });
  
  // 빈 방 정리
  rooms.forEach((userSet, roomId) => {
    if (userSet.size === 0) {
      console.log(`🧹 Cleaning up empty room: ${roomId}`);
      rooms.delete(roomId);
      cleanedRooms++;
    }
  });
  
  if (cleanedUsers > 0 || cleanedRooms > 0) {
    console.log(`🧹 Cleanup completed: ${cleanedUsers} users, ${cleanedRooms} rooms`);
  }
}

// 5분마다 좀비 연결 정리
setInterval(cleanupZombieConnections, 5 * 60 * 1000);

console.log('✨ Server is ready for connections!');