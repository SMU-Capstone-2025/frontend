import React from "react";

const ControlBar = ({
  isMuted,
  isSharingScreen,
  onMuteToggle,
  onScreenShare,
  onLeave,
}) => {
  return (
    <div className="w-full h-20 bg-neutral-900 flex items-center justify-center gap-6 px-4">
      {/* 마이크 토글 버튼 */}
      <button
        onClick={onMuteToggle}
        className="w-12 h-12 rounded-full bg-neutral-700 hover:bg-neutral-600 flex items-center justify-center transition"
      >
        {isMuted ? (
          <span className="text-xl">🔇</span>
        ) : (
          <span className="text-xl">🎙️</span>
        )}
      </button>

      {/* 화면 공유 버튼 */}
      <button
        onClick={onScreenShare}
        className="w-12 h-12 rounded-full bg-neutral-700 hover:bg-neutral-600 flex items-center justify-center transition"
      >
        {isSharingScreen ? (
          <span className="text-xl">🛑</span>
        ) : (
          <span className="text-xl">🖥️</span>
        )}
      </button>

      {/* 통화 종료 버튼 */}
      <button
        onClick={onLeave}
        className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center transition"
      >
        <span className="text-xl">❌</span>
      </button>
    </div>
  );
};

export default ControlBar;
