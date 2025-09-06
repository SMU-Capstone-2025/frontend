import { Decoration, DecorationSet } from "prosemirror-view";
import { Plugin } from "prosemirror-state";
import { Extension } from "@tiptap/core";

// 사용할 색상 팔레트 (각 사용자마다 다른 색상 배정)
const COLORS = [
  "#f87171", // red-400
  "#fbbf24", // amber-400
  "#34d399", // emerald-400
  "#60a5fa", // blue-400
  "#a78bfa", // violet-400
  "#f472b6", // pink-400
  "#38bdf8", // sky-400
];

// 간단 해시 함수 (email → 숫자)
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// 사용자 이메일 기반 고유 색상 선택
function getUserColor(userEmail) {
  if (!userEmail) return "#9ca3af"; // 기본 회색
  const idx = hashCode(userEmail) % COLORS.length; // 해시값을 색상 배열 인덱스로 변환
  return COLORS[idx];
}

// 커서 표시 플러그인(Tiptap Extension)
export const cursorPlugin = (cursorsRef) =>
  Extension.create({
    name: "cursorPlugin",
    addProseMirrorPlugins() {
      return [
        new Plugin({
          props: {
            decorations(state) {
              const decorations = [];
              const cursors = cursorsRef.current || []; // 현재 다른 사용자 커서 목록

              // 각 사용자 커서에 대해 decoration 생성
              cursors.forEach(({ user, cursor }) => {
                if (!cursor?.from) return;

                // 커서 위치에 표시할 위젯 생성
                const deco = Decoration.widget(cursor.from, () => {
                  const span = document.createElement("span");
                  span.className = "cursor-widget";
                  span.style.position = "relative";

                  // 사용자 뱃지(아이콘)
                  const badge = document.createElement("div");
                  const initial = user.userName ? user.userName.charAt(0) : "?";

                  badge.textContent = initial;
                  badge.title = `${user.userName} (${user.userEmail})`;

                  // 사용자별 색상
                  badge.style.backgroundColor = getUserColor(user.userEmail);

                  // 뱃지 스타일 정의
                  badge.style.width = "25px";
                  badge.style.height = "25px";
                  badge.style.borderRadius = "50%";
                  badge.style.color = "white";
                  badge.style.display = "flex";
                  badge.style.alignItems = "center";
                  badge.style.justifyContent = "center";
                  badge.style.fontSize = "14px";
                  badge.style.fontWeight = "semibold";
                  badge.style.border = "none";
                  badge.style.position = "absolute";
                  badge.style.transform = "translate(-115%, -95%)";
                  badge.style.pointerEvents = "none";

                  span.appendChild(badge);
                  return span;
                });

                decorations.push(deco);
              });
              // 문서 전체에 데코레이션 적용
              return DecorationSet.create(state.doc, decorations);
            },
          },
        }),
      ];
    },
  });
