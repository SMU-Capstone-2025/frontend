import { useEffect, useRef } from "react";
import { debounce } from "lodash";

// 문서 동기화(실시간 협업 편집)
const useDocSync = (editor, { title, status, documentId, sendMessage }) => {
  const isComposingRef = useRef(false); // 한글 조합 중 상태값
  const isTypingRef = useRef(false); // 지금 입력중인지 체크하는 상태값

  // title 디바운스
  const debouncedTitleSend = useRef(
    debounce((titleText) => {
      const html = editor.getHTML();
      sendMessage({ documentId, title: titleText, content: html, status });
    }, 150)
  ).current;

  // content 디바운스
  const debouncedSend = useRef(
    debounce((html) => {
      sendMessage({ documentId, title, content: html, status });
    }, 150)
  ).current;

  // title이 변경될 때 debounce로 전송
  useEffect(() => {
    if (!editor || !documentId || isComposingRef.current) return;
    debouncedTitleSend(title);
  }, [title]);

  useEffect(() => {
    if (!editor || !documentId) return;
    // 한글 조합 중인지 아닌지 체크 -> 조합 중에는 메시지 전송 방지
    const handleCompositionStart = () => {
      isComposingRef.current = true;
    };
    const handleCompositionEnd = () => {
      isComposingRef.current = false;
    };

    const dom = editor.view.dom;
    dom.addEventListener("compositionstart", handleCompositionStart);
    dom.addEventListener("compositionend", handleCompositionEnd);

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
      dom.removeEventListener("compositionstart", handleCompositionStart);
      dom.removeEventListener("compositionend", handleCompositionEnd);
    };
  }, [editor, documentId, title, status, sendMessage]);

  return { isTypingRef };
};

export default useDocSync;
