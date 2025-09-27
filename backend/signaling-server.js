const WebSocket = require('ws');

// WebSocket 서버 생성 (포트: 8081)
const wss = new WebSocket.Server({ port: 8081 });

/**
 * @description 서버 메모리에 사용자 및 방 정보를 저장합니다.
 * - rooms: Map<roomId, Set<userId>>
 * - users: Map<userId, { ws: WebSocket, roomId: string, userName: string }>
 */
const rooms = new Map();
const users = new Map();

console.log('🚀 WebRTC Signaling Server started on port 8081');

// WebSocket 연결 이벤트 핸들러
wss.on('connection', (ws) => {
  console.log('✅ New client connected');
  // ws 객체에 직접 상태를 저장하여 관리
  ws.userId = null;
  ws.roomId = null;

  // 메시지 수신 이벤트 핸들러
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log(`📨 Received: ${data.type} from ${ws.userId || 'unknown'} in room ${ws.roomId || 'unknown'}`);

      switch(data.type) {
        case 'join':
          handleJoin(ws, data);
          break;
        // offer, answer 등 다른 메시지 타입들은 ws 객체에 저장된 ID를 사용
        case 'offer':
        case 'answer':
        case 'ice-candidate':
        case 'renegotiate':
        case 'renegotiate-answer':
          forwardMessage(ws, data);
          break;
        case 'chat-message':
        case 'screen-share-status':
          broadcastMessage(ws, data);
          break;
        case 'leave':
          handleLeave(ws);
          break;
        default:
          console.warn(`❓ Unknown message type: ${data.type}`);
      }
    } catch (error) {
      console.error('❌ Error processing message:', error);
    }
  });

  // 연결 종료 이벤트 핸들러
  ws.on('close', () => {
    console.log(`👋 Client disconnected: ${ws.userId}`);
    handleLeave(ws);
  });

  // 에러 이벤트 핸들러
  ws.on('error', (error) => {
    console.error(`❌ WebSocket error for user ${ws.userId}:`, error);
  });
});


/**
 * @description 사용자가 방에 참여할 때 호출됩니다.
 */
function handleJoin(ws, data) {
  const { roomId, userId, userName } = data;
  if (!roomId || !userId || !userName) {
    console.error('❌ Invalid join data:', data);
    return;
  }

  // 이전 방에서 사용자 제거 (재접속 등 경우 대비)
  handleLeave(ws);

  // ws 객체에 사용자 정보 바인딩
  ws.userId = userId;
  ws.roomId = roomId;

  // users, rooms 맵에 정보 저장
  users.set(userId, { ws, roomId, userName });
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  rooms.get(roomId).add(userId);

  console.log(`👍 ${userName}(${userId}) joined room ${roomId}`);

  // 방에 있는 다른 사용자들에게 새로운 사용자 참여 알림
  const room = rooms.get(roomId);
  room.forEach(uid => {
    if (uid !== userId) {
      const user = users.get(uid);
      sendMessage(user.ws, {
        type: 'user-joined',
        userId,
        userName,
        roomId
      });
    }
  });
  
  // 참가자 목록 업데이트 브로드캐스트
  broadcastParticipants(roomId);
}


/**
 * @description 사용자가 방을 나가거나 연결이 끊어졌을 때 호출됩니다.
 */
function handleLeave(ws) {
  const { userId, roomId } = ws;
  if (!userId || !roomId) {
    return;
  }

  users.delete(userId);
  const room = rooms.get(roomId);
  if (room) {
    room.delete(userId);
    console.log(`👎 ${userId} left room ${roomId}`);

    if (room.size === 0) {
      rooms.delete(roomId);
      console.log(`🗑️ Empty room ${roomId} deleted`);
    } else {
      // 방에 남은 사람들에게 퇴장 사실 알림
      room.forEach(uid => {
        const user = users.get(uid);
        sendMessage(user.ws, {
          type: 'user-left',
          userId,
          roomId
        });
      });
      broadcastParticipants(roomId);
    }
  }

  // ws 객체 정보 초기화
  ws.userId = null;
  ws.roomId = null;
}

/**
 * @description 특정 사용자(to)에게 메시지를 전달(forward)합니다. (offer, answer, ice-candidate)
 * [핵심 수정] 이 함수는 방 검증 없이 'to' 필드에 지정된 사용자에게 메시지를 전달하는 역할만 합니다.
 */
function forwardMessage(ws, data) {
  const { to, type } = data;
  const from = ws.userId;

  if (!from || !to) {
      console.warn(`⚠️ Missing 'from' or 'to' field in ${type} message.`);
      return;
  }

  const toUser = users.get(to);

  // [중요] ICE candidate는 방 검증 없이, 수신자가 온라인이기만 하면 무조건 전달합니다.
  // 이것이 NAT Traversal 성공의 핵심입니다.
  if (type === 'ice-candidate') {
    if (toUser) {
      // 원본 메시지에 'from' 필드를 추가하여 전달
      data.from = from;
      sendMessage(toUser.ws, data);
    } else {
      console.log(`🧊 Cannot forward ICE: User ${to} not found.`);
    }
    return;
  }

  // Offer, Answer 등 다른 P2P 메시지
  if (toUser) {
      // 방이 다른 경우 경고만 하고, 일단 전달은 시도합니다.
      if (toUser.roomId !== ws.roomId) {
          console.warn(`🚨 Room mismatch for ${type}: ${from} is in ${ws.roomId}, but ${to} is in ${toUser.roomId}. Forwarding anyway.`);
      }
      data.from = from;
      sendMessage(toUser.ws, data);
      console.log(`📬 Forwarded ${type} from ${from} to ${to}`);
  } else {
      console.log(`❌ Cannot forward ${type}: User ${to} not found or disconnected.`);
  }
}

/**
 * @description 자신을 제외한 방의 모든 사용자에게 메시지를 브로드캐스트합니다. (chat, screen-share)
 */
function broadcastMessage(ws, data) {
    const { userId, roomId } = ws;
    if (!userId || !roomId) return;
    
    const room = rooms.get(roomId);
    if (room) {
        data.userId = userId; // 메시지에 발신자 ID 정보 추가
        room.forEach(uid => {
            if (uid !== userId) {
                const user = users.get(uid);
                sendMessage(user.ws, data);
            }
        });
    }
}


/**
 * @description 방의 모든 사용자에게 현재 참가자 목록을 브로드캐스트합니다.
 */
function broadcastParticipants(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;

  const participants = Array.from(room).map(userId => {
    const user = users.get(userId);
    return { id: userId, name: user.userName };
  });

  console.log(`👥 Broadcasting participants for room ${roomId}:`, participants.length);

  room.forEach(uid => {
    const user = users.get(uid);
    sendMessage(user.ws, {
      type: 'participants-update',
      participants,
      roomId
    });
  });
}

/**
 * @description WebSocket으로 메시지를 안전하게 보내는 헬퍼 함수
 */
function sendMessage(ws, message) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}


// 30초마다 모든 클라이언트에게 ping을 보내 좀비 커넥션을 정리합니다.
const interval = setInterval(() => {
    wss.clients.forEach(ws => {
      // ws 객체에 isAlive 플래그가 없으면 (ping-pong 핸들러가 설정되기 전) 무시
      if (ws.isAlive === false) {
          console.log(`🔪 Terminating dead connection for ${ws.userId}`);
          return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });

    // users, rooms 맵에 남아있는 좀비 데이터 정리
    users.forEach((user, userId) => {
        if(user.ws.readyState !== WebSocket.OPEN) {
            console.log(`🧹 Cleaning up stale user data: ${userId}`);
            handleLeave(user.ws);
        }
    });

}, 30000);

wss.on('connection', ws => {
  ws.isAlive = true;
  ws.on('pong', () => {
    ws.isAlive = true;
  });
});

wss.on('close', () => {
  clearInterval(interval);
});

console.log('✨ Server is ready for connections!');
