// backend/server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors({
  origin: "http://localhost:3000", // 프론트엔드 주소
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// 간단한 시그널링 이벤트 처리
io.on("connection", (socket) => {
  console.log("새 클라이언트 연결:", socket.id);

  // join 이벤트: 사용자가 방에 참여함
  socket.on("join", (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id}가 방 ${roomId}에 참여함`);
    // 참여자 목록 업데이트 등 추가 로직 구현 가능
  });

  // signaling 메시지 전달 (offer, answer, candidate 등)
  socket.on("signal", (data) => {
    // data.roomId: 대상 방, data.message: signaling 메시지
    socket.to(data.roomId).emit("signal", {
      sender: socket.id,
      message: data.message,
    });
  });

  // disconnect 이벤트 처리
  socket.on("disconnect", () => {
    console.log("클라이언트 연결 해제:", socket.id);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중`);
});
