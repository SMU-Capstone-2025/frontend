import { useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getValidAccessToken } from "../apis/getValidAccessToken";

// 구독 경로 및 발행 경로
const SOCKET_URL = "http://3.34.91.202:8080/doc/ws";
const SUB_PATH = (id) => `/sub/document/${id}`;
const PUB_PATH = "/pub/editing";

const useDocumentSocket = ({ documentId, onMessage }) => {
  const clientRef = useRef(null);
  const subRef = useRef(null);
  const isConnectedRef = useRef(false); // 중복 연결 방지용 플래그

  const connect = async () => {
    if (!documentId) return console.warn("documentId 없음, 소켓 연결 중단");
    if (isConnectedRef.current) return;

    try {
      const token = await getValidAccessToken(); // 최신 토큰 확보
      const socket = new SockJS(SOCKET_URL); // SockJS 객체 생성

      const client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        onConnect: () => {
          console.log("✅ STOMP 연결 성공");
          isConnectedRef.current = true;
          // 특정 문서 채널 구독
          subRef.current = client.subscribe(
            SUB_PATH(documentId),
            (msg) => {
              try {
                // 굳이 이중 파싱이 필요한가 싶은데.. 일단 건드리진 않겠음
                const data = JSON.parse(JSON.parse(msg.body).message);
                onMessage?.(data); // 부모에서 받은 콜백 실행
              } catch (err) {
                console.error("메시지 파싱 오류", err);
              }
            },
            {
              Authorization: `Bearer ${token}`, // 구독 시에도 토큰 전달
            }
          );
        },
        onStompError: (frame) => {
          console.error("STOMP 오류:", frame.headers.message);
        },
        onWebSocketClose: () => {
          console.warn("❌ WebSocket 종료됨");
          isConnectedRef.current = false;
        },
        onDisconnect: () => {
          console.log("❌ STOMP 연결 종료");
          isConnectedRef.current = false;
        },
      });

      client.activate(); // 연결 시작 및 인스턴스 저장
      clientRef.current = client;
    } catch (err) {
      console.error("소켓 연결 중 예외 발생.", err);
    }
  };

  // 소켓 해제 로직
  const disconnect = () => {
    if (!isConnectedRef.current) {
      return;
    }
    try {
      subRef.current?.unsubscribe(); // 채널 구독 해제
      clientRef.current?.deactivate(); // STOMP 연결 종료
      isConnectedRef.current = false;
      console.log("소켓 정상 종료");
    } catch (err) {
      console.error("disconnect 중 오류 발생", err);
    }
  };

  // 메세지 전송 로직
  const sendMessage = async ({ title, content, status }) => {
    if (!clientRef.current?.connected || !documentId) {
      console.warn("메시지 전송 실패: 소켓 미연결 or documentId 없음");
      return;
    }

    try {
      const token = await getValidAccessToken(); // 최신 토큰 확보
      const payload = {
        documentId,
        message: JSON.stringify({
          documentId,
          title,
          content,
          status,
          logs: [],
          attachments: [],
        }),
      };

      clientRef.current.publish({
        destination: PUB_PATH,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("전송 메시지:", {
        title,
        content,
        status,
      });
    } catch (err) {
      console.error("메시지 전송 중 오류 발생", err);
    }
  };

  return { connect, disconnect, sendMessage };
};

export default useDocumentSocket;
