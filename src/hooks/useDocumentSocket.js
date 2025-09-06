import { useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getValidAccessToken } from "../apis/getValidAccessToken";

const SOCKET_URL = "https://docktalk.co.kr/api/socket/doc/wss";
const SUB_PATH = (id) => `/sub/document/${id}`;
const PUB_PATH = "/pub/editing";

const useDocumentSocket = ({ documentId, onMessage }) => {
  const clientRef = useRef(null);
  const subRef = useRef(null);
  const isConnectedRef = useRef(false);

  const connect = async () => {
    if (!documentId) return console.warn("documentId 없음, 소켓 연결 중단");
    if (isConnectedRef.current || clientRef.current) {
      console.log("이미 연결된 상태, connect 스킵");
      return;
    }

    try {
      const token = await getValidAccessToken();
      const socket = new SockJS(SOCKET_URL);

      const client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000, // 5초후 재연결시도
        debug: () => {},
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },

        onConnect: () => {
          console.log("✅ STOMP 연결 성공");
          isConnectedRef.current = true;

          subRef.current = client.subscribe(
            SUB_PATH(documentId),
            (msg) => {
              try {
                const parsed = JSON.parse(msg.body); // 한번만 파싱
                onMessage?.(parsed.message || parsed);
                console.log("서버 수신:", parsed.message || parsed);
              } catch (err) {
                console.error("메시지 파싱 오류", err, msg.body);
              }
            },
            { Authorization: `Bearer ${token}` } // 구독 시 토큰 전달
          );
        },

        onStompError: (frame) => {
          console.error("STOMP 오류:", frame.headers["message"]);
        },
      });

      client.activate();
      clientRef.current = client;
    } catch (err) {
      console.error("소켓 연결 중 예외 발생.", err);
    }
  };

  const disconnect = () => {
    if (!isConnectedRef.current) return;
    try {
      subRef.current?.unsubscribe();
      clientRef.current?.deactivate();
      isConnectedRef.current = false;
      console.log("소켓 정상 종료");
    } catch (err) {
      console.error("disconnect 중 오류 발생", err);
    }
  };

  // 메시지 전송
  const sendMessage = async ({ title, content, status, cursor }) => {
    if (!clientRef.current?.connected || !documentId) {
      console.warn("메시지 전송 실패: 소켓 미연결 or documentId 없음");
      return;
    }

    try {
      const token = await getValidAccessToken();
      const userName = localStorage.getItem("userName");
      const userEmail = localStorage.getItem("email");
      const payload = {
        documentId,
        message: {
          documentId,
          title,
          content,
          status,
          attachments: [],
          logs: [],
          user: {
            userName,
            userEmail,
          },
          cursor: {
            from: cursor?.from ?? 0,
            to: cursor?.to ?? 0,
          },
        },
      };

      clientRef.current.publish({
        destination: PUB_PATH,
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      console.log("📤 전송 메시지:", payload.message);
    } catch (err) {
      console.error("메시지 전송 중 오류 발생", err);
    }
  };

  return { connect, disconnect, sendMessage };
};

export default useDocumentSocket;
