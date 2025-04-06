// src/pages/VideoCallPage.jsx
import React from "react";
import useWebRTC from "../../hooks/useWebRTC";
import VideoGrid from "../../components/videoroom-element/VideoGrid";
import ControlBar from "../../components/videoroom-element/ControlBar";

const VideoRoom = () => {
  // roomId는 필요에 따라 설정 (여기선 "test-room")
  const {
    localStream,
    remoteStreams,
    isMuted,
    isSharingScreen,
    toggleMute,
    shareScreen,
    leaveCall,
  } = useWebRTC("test-room");

  return (
    <div className="flex flex-col w-full h-screen bg-black">
      <div className="flex-1 overflow-hidden">
        <VideoGrid localStream={localStream} remoteStreams={remoteStreams} />
      </div>
      <ControlBar
        isMuted={isMuted}
        isSharingScreen={isSharingScreen}
        onMuteToggle={toggleMute}
        onScreenShare={shareScreen}
        onLeave={leaveCall}
      />
    </div>
  );
};

export default VideoRoom;
