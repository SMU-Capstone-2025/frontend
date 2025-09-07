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
                const parsed = JSON.parse(msg.body);
                const data = JSON.parse(parsed.message); // 파싱을 두번하는 구조
                onMessage?.(data);
              } catch (err) {
                console.error("메시지 파싱 오류", err, msg.body);
              }
            },
            { Authorization: `Bearer ${token}` } // 구독 시 토큰 전달
          );
        },

        onStompError: (frame) => {
          // 불필요한 콘솔 제거
          console.error("STOMP 오류:", frame.headers["message"]);
        },
      });

      client.activate(); // 연결 시작 및 인스턴스 저장
      clientRef.current = client;
    } catch (err) {
      console.error("소켓 연결 중 예외 발생.", err);
    }
  };

  const disconnect = () => {
    if (!isConnectedRef.current) return;
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
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      console.log("📤 전송 메시지:", payload.message); // 전송 로그 확인
    } catch (err) {
      console.error("메시지 전송 중 오류 발생", err);
    }
  };

  return { connect, disconnect, sendMessage };
};

export default useDocumentSocket;
