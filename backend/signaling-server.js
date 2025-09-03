const WebSocket = require('ws');

// WebSocket 서버 생성
const wss = new WebSocket.Server({ 
  port: 8080,
  perMessageDeflate: false
});

// 연결된 클라이언트 관리
const rooms = new Map(); // roomId -> Set of users
const users = new Map(); // userId -> { ws, roomId, userName }

console.log('🚀 WebRTC Signaling Server started on port 8080');

// WebSocket 연결 처리
wss.on('connection', (ws) => {
  console.log('✅ New client connected');
  
  let currentUserId = null;
  let currentRoomId = null;

  // 메시지 수신 처리
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('📨 Received:', data.type, data.userId || '');
      
      switch(data.type) {
        case 'join':
          handleJoin(ws, data);
          currentUserId = data.userId;
          currentRoomId = data.roomId;
          break;
          
        case 'offer':
          handleOffer(ws, data, currentUserId);
          break;
          
        case 'answer':
          handleAnswer(ws, data, currentUserId);
          break;
          
        case 'ice-candidate':
          handleIceCandidate(ws, data, currentUserId);
          break;
          
        case 'chat-message':
          handleChatMessage(ws, data, currentRoomId, currentUserId);
          break;

        case 'screen-share':
          handleScreenShare(ws, data, currentUserId);
          break;

        case 'renegotiate':
          handleRenegotiate(ws, data, currentUserId);
          break;

        case 'renegotiate-answer':
          handleRenegotiateAnswer(ws, data, currentUserId);
          break;

      }
    } catch (error) {
      console.error('❌ Error processing message:', error);
    }
  });

  // 연결 종료 처리
  ws.on('close', () => {
    console.log('👋 Client disconnected:', currentUserId);
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
  
  console.log(`🏠 ${userName} (${userId}) joining room ${roomId}`);
  
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
          userName
        }));
      }
    }
  });
  
  // 방에 사용자 추가
  room.add(userId);
  
  // 참가자 목록 업데이트
  broadcastParticipants(roomId);
  
  console.log(`✅ Room ${roomId} now has ${room.size} users`);
}

function handleScreenShare(ws, data, userId) {
  const { isSharing, roomId } = data;
  const room = rooms.get(roomId);
  
  console.log(`📺 ${userId} ${isSharing ? 'started' : 'stopped'} screen sharing`);
  
  if (room) {
    room.forEach(existingUserId => {
      if (existingUserId !== userId) {
        const existingUser = users.get(existingUserId);
        if (existingUser && existingUser.ws.readyState === WebSocket.OPEN) {
          existingUser.ws.send(JSON.stringify({
            type: 'screen-share-status',
            userId,
            isSharing
          }));
        }
      }
    });
  }
}

// Offer 전달
function handleOffer(ws, data, fromUserId) {
  const { to, offer } = data;
  const toUser = users.get(to);
  
  console.log(`📤 Forwarding offer from ${fromUserId} to ${to}`);
  
  if (toUser && toUser.ws.readyState === WebSocket.OPEN) {
    toUser.ws.send(JSON.stringify({
      type: 'offer',
      from: fromUserId,
      offer
    }));
  } else {
    console.log(`❌ User ${to} not found or disconnected`);
  }
}

// Answer 전달
function handleAnswer(ws, data, fromUserId) {
  const { to, answer } = data;
  const toUser = users.get(to);
  
  console.log(`📤 Forwarding answer from ${fromUserId} to ${to}`);
  
  if (toUser && toUser.ws.readyState === WebSocket.OPEN) {
    toUser.ws.send(JSON.stringify({
      type: 'answer',
      from: fromUserId,
      answer
    }));
  }
}

// ICE Candidate 전달
function handleIceCandidate(ws, data, fromUserId) {
  const { to, candidate } = data;
  const toUser = users.get(to);
  
  if (toUser && toUser.ws.readyState === WebSocket.OPEN) {
    toUser.ws.send(JSON.stringify({
      type: 'ice-candidate',
      from: fromUserId,
      candidate
    }));
  }
}

// 채팅 메시지 전달
function handleChatMessage(ws, data, roomId, senderId) {
  const { message, userName } = data;
  const room = rooms.get(roomId);
  
  console.log(`💬 Chat message in room ${roomId}: ${message}`);
  
  if (room) {
    room.forEach(userId => {
      if (userId !== senderId) {
        const user = users.get(userId);
        if (user && user.ws.readyState === WebSocket.OPEN) {
          user.ws.send(JSON.stringify({
            type: 'chat-message',
            message,
            userName
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
            userId
          }));
        }
      });
      
      // 참가자 목록 업데이트
      broadcastParticipants(roomId);
    }
  }
  
  users.delete(userId);
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
  
  room.forEach(userId => {
    const user = users.get(userId);
    if (user && user.ws.readyState === WebSocket.OPEN) {
      user.ws.send(JSON.stringify({
        type: 'participants-update',
        participants
      }));
    }
  });
}

// renegotiate offer 중계
function handleRenegotiate(ws, data, fromUserId) {
  const { to, offer, isScreenShare } = data;
  const toUser = users.get(to);
  console.log(`🔄 Renegotiate from ${fromUserId} to ${to}`);
  if (toUser && toUser.ws.readyState === WebSocket.OPEN) {
    toUser.ws.send(JSON.stringify({
      type: 'renegotiate',
      from: fromUserId,
      offer,
      isScreenShare
    }));
  }
}

// renegotiate-answer 중계
function handleRenegotiateAnswer(ws, data, fromUserId) {
  const { to, answer } = data;
  const toUser = users.get(to);
  console.log(`🔄 Renegotiate-answer from ${fromUserId} to ${to}`);
  if (toUser && toUser.ws.readyState === WebSocket.OPEN) {
    toUser.ws.send(JSON.stringify({
      type: 'renegotiate-answer',
      from: fromUserId,
      answer
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
}, 60000); // 1분마다

console.log('✨ Server is ready for connections!');