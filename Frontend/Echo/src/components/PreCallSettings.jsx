import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const PreCallSettings = () => {
  const navigate = useNavigate();
  const { roomName } = useParams();
  const location = useLocation();
  const purpose = location.state?.purpose || 'general';

  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [stream, setStream] = useState(null);

  const videoRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((mediaStream) => {
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Initially respect mic/video settings
      mediaStream.getAudioTracks().forEach(track => {
        track.enabled = micOn;
      });
      mediaStream.getVideoTracks().forEach(track => {
        track.enabled = videoOn;
      });
    });

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Toggle mic: enable/disable audio tracks
  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !micOn;
      });
    }
    setMicOn(prev => !prev);
  };

  // Toggle video: enable/disable video tracks
  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !videoOn;
      });
    }
    setVideoOn(prev => !prev);
  };

  const handleStartCall = () => {
    navigate(`/call/${roomName}`, {
      state: { purpose, micOn, videoOn },
    });
  };

  return (
    <div
      style={{
        padding: '2rem',
        color: '#00fff7',
        backgroundColor: '#0f141f',
        minHeight: '100vh',
        fontFamily: "'Share Tech Mono', monospace",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h2 style={{ marginBottom: '1rem' }}>Prepare Your Settings</h2>
      <h3 style={{ marginBottom: '2rem', textTransform: 'capitalize' }}>Purpose: {purpose.replace('_', ' ')}</h3>

      <video
        ref={videoRef}
        autoPlay
        muted
        style={{
          width: '320px',
          height: '240px',
          borderRadius: '10px',
          border: '2px solid #00fff7',
          boxShadow: '0 0 12px #00fff7',
          marginBottom: '2rem',
        }}
      />

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
        <button
          onClick={toggleMic}
          style={{
            padding: '10px 20px',
            backgroundColor: micOn ? '#00fff7' : '#b12d25',
            border: 'none',
            borderRadius: '8px',
            color: '#010a14',
            fontWeight: '700',
            boxShadow: micOn ? '0 0 10px #00fff7' : '0 0 10px #b12d25',
            cursor: 'pointer',
          }}
        >
          {micOn ? '🎤 Mic ON' : '🔇 Mic OFF'}
        </button>

        <button
          onClick={toggleVideo}
          style={{
            padding: '10px 20px',
            backgroundColor: videoOn ? '#00fff7' : '#b12d25',
            border: 'none',
            borderRadius: '8px',
            color: '#010a14',
            fontWeight: '700',
            boxShadow: videoOn ? '0 0 10px #00fff7' : '0 0 10px #b12d25',
            cursor: 'pointer',
          }}
        >
          {videoOn ? '📹 Video ON' : '🚫 Video OFF'}
        </button>
      </div>

      <button
        onClick={handleStartCall}
        style={{
          padding: '12px 24px',
          fontWeight: '700',
          fontSize: '16px',
          backgroundColor: '#00fff7',
          color: '#010a14',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          boxShadow: '0 0 15px #00fff7',
        }}
      >
        Start Call
      </button>
    </div>
  );
};

export default PreCallSettings;
