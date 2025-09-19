import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getValidAccessToken } from "../apis/getValidAccessToken";

const SOCKET_URL = "https://docktalk.co.kr/api/socket/notification/wss";
const SUB_PATH = (email) => `/sub/notification/${email}`;

const useNotificationSocket = ({ userEmail, onMessage }) => {
  const clientRef = useRef(null);

  useEffect(() => {
    if (!userEmail) return;

    const connect = async () => {
      const token = await getValidAccessToken();
      const socket = new SockJS(SOCKET_URL);

      const client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: { Authorization: `Bearer ${token}` },
        reconnectDelay: 5000, // 소켓 자동 재연결
        onConnect: () => {
          console.log("✅ 알림 소켓 연결 성공");
          client.subscribe(
            SUB_PATH(userEmail),
            (msg) => {
              try {
                // 1차 파싱
                const data = JSON.parse(msg.body);

                // message 파싱
                const raw = msg.body;
                const titleMatch = raw.match(/제목:\s*([^,]+)/);
                const editorMatch = raw.match(/최근 편집자:\s*(.+)$/);

                const clean = (str) => str.trim().replace(/[}"]/g, "");

                // 2차 파싱
                const parsed = {
                  message: "문서에 변동사항이 있습니다.",
                  title: titleMatch ? clean(titleMatch[1]) : "",
                  editor: editorMatch ? clean(editorMatch[1]) : "",
                  redirectionUrl: data.redirectionUrl,
                  receivedAt: new Date(),
                };

                onMessage?.(parsed); // UI용 객체 전달
              } catch (err) {
                console.error("알림 파싱 오류:", err, msg.body);
                onMessage?.({
                  message: msg.body,
                  title: "",
                  editor: "",
                  receivedAt: new Date(),
                });
              }
            },
            { Authorization: `Bearer ${token}` }
          );
        },
      });

      client.activate();
      clientRef.current = client;
    };

    connect();

    return () => {
      if (clientRef.current?.active) {
        console.log("✅ 알림 소켓 해제");
        clientRef.current.deactivate();
      }
      clientRef.current = null;
    };
  }, [userEmail, onMessage]);
};

export default useNotificationSocket;
