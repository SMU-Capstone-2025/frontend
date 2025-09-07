import { useEffect, useRef, useMemo } from "react";
import { debounce } from "lodash";

const useDocSync = (
  editor,
  { title, status, documentId, sendMessage, titleInputRef }
) => {
  const isComposingRef = useRef(false); // 한글 조합 중 (제목+본문 공용)
  const isTypingRef = useRef(false); // 본문 입력 감지

  // stale closure란? 리액트에서 함수가 옛날 값을 계속 캡처해 쓰는 현상
  // 최신 값들을 ref에 보관해 디바운스 클로저의 stale 문제 방지
  const latest = useRef({ editor, status, documentId, title, sendMessage });
  latest.current = { editor, status, documentId, title, sendMessage };

  // 디바운스: 제목
  const debouncedTitleSend = useMemo(
    () =>
      debounce((titleText) => {
        const {
          editor: ed,
          status: st,
          documentId: id,
          sendMessage: send,
        } = latest.current;
        if (!ed || !id) return;
        if (isComposingRef.current) return; // 조합 중이면 전송 X
        const html = ed.getHTML();
        send({ documentId: id, title: titleText, content: html, status: st });
      }, 500),
    []
  );

  // 디바운스: 본문
  const debouncedSend = useMemo(
    () =>
      debounce((html) => {
        const {
          title: tt,
          status: st,
          documentId: id,
          sendMessage: send,
        } = latest.current;
        if (!id) return;
        if (isComposingRef.current) return; // 조합 중이면 전송 X
        send({ documentId: id, title: tt, content: html, status: st });
      }, 300),
    []
  );

  // 제목 변경 시 전송 (조합 중이면 skip)
  useEffect(() => {
    if (!documentId) return;
    if (isComposingRef.current) return;
    debouncedTitleSend(title);
  }, [title, documentId, debouncedTitleSend]);

  // 본문/조합 이벤트 바인딩
  useEffect(() => {
    if (!editor || !documentId) return;

    const dom = editor.view.dom;

    const handleCompStart = () => (isComposingRef.current = true);
    const handleCompEnd = () => (isComposingRef.current = false);

    dom.addEventListener("compositionstart", handleCompStart);
    dom.addEventListener("compositionend", handleCompEnd);

    // 제목 input에도 조합 이벤트 연결
    const titleEl = titleInputRef?.current;
    if (titleEl) {
      titleEl.addEventListener("compositionstart", handleCompStart);
      titleEl.addEventListener("compositionend", handleCompEnd);
    }

    editor.on("transaction", () => {
      isTypingRef.current = true;
      clearTimeout(isTypingRef.timeout);
      isTypingRef.timeout = setTimeout(() => {
        isTypingRef.current = false;
      }, 500);
    });

    editor.on("update", () => {
      if (isComposingRef.current) return;
      const html = editor.getHTML();
      debouncedSend(html);
    });

    return () => {
      dom.removeEventListener("compositionstart", handleCompStart);
      dom.removeEventListener("compositionend", handleCompEnd);
      if (titleEl) {
        titleEl.removeEventListener("compositionstart", handleCompStart);
        titleEl.removeEventListener("compositionend", handleCompEnd);
      }
      debouncedSend.cancel();
      debouncedTitleSend.cancel();
    };
  }, [editor, documentId, titleInputRef, debouncedSend, debouncedTitleSend]);

  return { isTypingRef, isComposingRef };
};

export default useDocSync;
