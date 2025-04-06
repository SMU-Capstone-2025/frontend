// src/components/VideoGrid.jsx

import React, { useRef, useEffect } from "react";

// 개별 비디오 타일 컴포넌트
const VideoTile = ({ stream, isLocal }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="w-full h-full bg-gray-800 rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal} // 로컬 스트림은 항상 muted 처리
        className="w-full h-full object-cover"
      />
    </div>
  );
};

// VideoGrid 컴포넌트는 로컬 및 원격 스트림들을 그리드로 배치
const VideoGrid = ({ localStream, remoteStreams }) => {
  // 참여자 목록 생성: 로컬 스트림과 원격 스트림 합치기
  const participants = [
    ...(localStream ? [{ stream: localStream, isLocal: true }] : []),
    ...remoteStreams.map((stream) => ({ stream, isLocal: false })),
  ];

  // 참여자 수에 따라 그리드 컬럼 설정 (예시)
  const num = participants.length;
  let gridCols = "grid-cols-1";
  if (num === 2) gridCols = "grid-cols-2";
  else if (num > 2 && num <= 4) gridCols = "grid-cols-2";
  else if (num > 4 && num <= 6) gridCols = "grid-cols-3";
  else if (num > 6) gridCols = "grid-cols-4";

  return (
    <div className={`grid ${gridCols} gap-4 p-4 w-full h-full`}>
      {participants.map((p, idx) => (
        <div
          key={idx}
          className="w-full aspect-video bg-gray-800 rounded-xl overflow-hidden"
        >
          <VideoTile stream={p.stream} isLocal={p.isLocal} />
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;
