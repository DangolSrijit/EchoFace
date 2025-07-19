import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const REACTIONS = ['👏', '❤️', '🙂', '✋', '👍', '🎉'];

const VideoCall = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const localVideoRef = useRef(null);
  const emojiPanelRef = useRef(null);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [sharingScreen, setSharingScreen] = useState(false);
  const [stream, setStream] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);

  // Generate a secure random room ID with uppercase alphabets and digits
  const generateRoomId = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for(let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Purpose from navigation state or default
  const purpose = location.state?.purpose || 'Meeting';

  // Generate room number once
  const [roomNumber] = useState(`Room-${generateRoomId()}`);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((mediaStream) => {
      setStream(mediaStream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
      }
    });

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Close emoji panel on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPanelRef.current && !emojiPanelRef.current.contains(event.target)) {
        setShowEmojiPanel(false);
      }
    };
    if (showEmojiPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPanel]);

  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => (track.enabled = !micOn));
    }
    setMicOn(prev => !prev);
  };

  const toggleCamera = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => (track.enabled = !cameraOn));
    }
    setCameraOn(prev => !prev);
  };

  const toggleScreenShare = async () => {
    if (!sharingScreen) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const videoTrack = screenStream.getVideoTracks()[0];

        if (stream) {
          stream.getVideoTracks()[0].stop();
        }

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        videoTrack.onended = () => {
          if (stream && localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          setSharingScreen(false);
        };

        setSharingScreen(true);
      } catch (err) {
        console.error('Screen share error:', err);
      }
    } else {
      if (stream && localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setSharingScreen(false);
    }
  };

  const handleLeave = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    navigate('/');
  };

  const sendMessage = () => {
    if (inputMsg.trim()) {
      setMessages(prev => [...prev, { text: inputMsg, from: 'Me' }]);
      setInputMsg('');
    }
  };

  const handleEmojiSelect = (emoji) => {
    const id = Date.now();
    setFloatingEmojis(prev => [...prev, { id, emoji }]);
    setShowEmojiPanel(false);
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== id));
    }, 2000);
  };

  return (
    <div style={{
      ...styles.container,
      fontFeatureSettings: "'liga' 1",
      userSelect: 'none',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      backgroundColor: '#f9fafb',
    }}>
      {/* Purpose & Room */}
      <div style={{
        ...styles.roomInfo,
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color: '#3c4043',
        boxShadow: '0 8px 24px rgba(60,64,67,0.1)',
        transition: 'box-shadow 0.3s ease',
      }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 30px rgba(26,115,232,0.3)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(60,64,67,0.1)'}
      >
        <div style={{ fontSize: 14, marginBottom: 4 }}>{purpose.charAt(0).toUpperCase() + purpose.slice(1).replace('_', ' ')}</div>
        <div style={{ fontSize: 13, color: '#5f6368', fontWeight: 500 }}>{roomNumber}</div>
      </div>

      {/* Video */}
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        style={{
          ...styles.video,
          borderRadius: 12,
          boxShadow: '0 0 40px rgba(26, 115, 232, 0.25)',
          transition: 'box-shadow 0.4s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 60px rgba(26, 115, 232, 0.5)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 40px rgba(26, 115, 232, 0.25)'}
      />

      {/* Floating emojis */}
      {floatingEmojis.map(({ id, emoji }) => (
        <div
          key={id}
          style={{
            ...styles.floatingEmoji,
            left: `${Math.random() * 80 + 10}%`,
            textShadow: '0 2px 6px rgba(0,0,0,0.15)',
            filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))',
            fontWeight: 'bold',
          }}
        >
          {emoji}
        </div>
      ))}

      {/* Controls */}
      <div style={{
        ...styles.controlBar,
        backgroundColor: '#ffffffcc',
        backdropFilter: 'saturate(180%) blur(12px)',
        border: '1px solid #e8eaed',
        boxShadow: '0 12px 24px rgba(26,115,232,0.25)',
      }}>
        <div
          style={styles.controlGroup}
          tabIndex={0}
          role="button"
          aria-pressed={micOn}
          onClick={toggleMic}
          onKeyDown={e => { if(e.key === 'Enter' || e.key === ' ') toggleMic(); }}
          title={micOn ? 'Mute microphone' : 'Unmute microphone'}
          aria-label="Toggle Microphone"
          className="control-button"
        >
          <button style={{
            ...styles.activeButton,
            backgroundColor: micOn ? '#1a73e8' : '#d93025',
            boxShadow: micOn
              ? '0 6px 14px rgba(26,115,232,0.6)'
              : '0 6px 14px rgba(217,48,37,0.7)',
            transform: micOn ? 'scale(1.1)' : 'scale(0.95)',
            transition: 'all 0.25s ease',
          }}>
            {micOn ? '🎤' : '🔇'}
          </button>
          <div style={{ ...styles.buttonLabel, fontWeight: '600', color: micOn ? '#1a73e8' : '#d93025' }}>
            {micOn ? 'Mic On' : 'Mic Off'}
          </div>
        </div>

        <div
          style={styles.controlGroup}
          tabIndex={0}
          role="button"
          aria-pressed={cameraOn}
          onClick={toggleCamera}
          onKeyDown={e => { if(e.key === 'Enter' || e.key === ' ') toggleCamera(); }}
          title={cameraOn ? 'Turn off camera' : 'Turn on camera'}
          aria-label="Toggle Camera"
          className="control-button"
        >
          <button style={{
            ...styles.activeButton,
            backgroundColor: cameraOn ? '#1a73e8' : '#d93025',
            boxShadow: cameraOn
              ? '0 6px 14px rgba(26,115,232,0.6)'
              : '0 6px 14px rgba(217,48,37,0.7)',
            transform: cameraOn ? 'scale(1.1)' : 'scale(0.95)',
            transition: 'all 0.25s ease',
          }}>
            {cameraOn ? '📹' : '🚫'}
          </button>
          <div style={{ ...styles.buttonLabel, fontWeight: '600', color: cameraOn ? '#1a73e8' : '#d93025' }}>
            {cameraOn ? 'Cam On' : 'Cam Off'}
          </div>
        </div>

        <div
          style={styles.controlGroup}
          tabIndex={0}
          role="button"
          onClick={toggleScreenShare}
          onKeyDown={e => { if(e.key === 'Enter' || e.key === ' ') toggleScreenShare(); }}
          title={sharingScreen ? 'Stop sharing screen' : 'Share your screen'}
          aria-label="Toggle Screen Share"
          className="control-button"
        >
          <button style={{
            ...styles.activeButton,
            backgroundColor: '#1a73e8',
            boxShadow: '0 6px 14px rgba(26,115,232,0.6)',
            transform: sharingScreen ? 'scale(1.1)' : 'scale(1)',
            transition: 'all 0.25s ease',
          }}>
            {sharingScreen ? '🛑' : '🖥️'}
          </button>
          <div style={{ ...styles.buttonLabel, fontWeight: '600', color: '#1a73e8' }}>
            {sharingScreen ? 'Stop Share' : 'Share Screen'}
          </div>
        </div>

        <div
          style={styles.controlGroup}
          tabIndex={0}
          role="button"
          onClick={() => setShowChat(prev => !prev)}
          onKeyDown={e => { if(e.key === 'Enter' || e.key === ' ') setShowChat(prev => !prev); }}
          title={showChat ? 'Hide chat panel' : 'Open chat panel'}
          aria-label="Toggle Chat"
          className="control-button"
        >
          <button style={{
            ...styles.activeButton,
            backgroundColor: '#1a73e8',
            boxShadow: '0 6px 14px rgba(26,115,232,0.6)',
            transform: showChat ? 'scale(1.1)' : 'scale(1)',
            transition: 'all 0.25s ease',
          }}>
            💬
          </button>
          <div style={{ ...styles.buttonLabel, fontWeight: '600', color: '#1a73e8' }}>
            {showChat ? 'Hide Chat' : 'Open Chat'}
          </div>
        </div>

        {/* Emoji reaction button */}
        <div
          style={{ ...styles.controlGroup, position: 'relative', cursor: 'default' }}
          ref={emojiPanelRef}
          tabIndex={-1}
        >
          <button
            onClick={() => setShowEmojiPanel(prev => !prev)}
            style={{
              ...styles.activeButton,
              backgroundColor: '#1a73e8',
              boxShadow: '0 6px 14px rgba(26,115,232,0.6)',
              transition: 'all 0.25s ease',
              userSelect: 'none',
              transform: showEmojiPanel ? 'scale(1.1)' : 'scale(1)',
              cursor: 'pointer',
            }}
            aria-label="Open Emoji Reactions"
            aria-expanded={showEmojiPanel}
          >
            😊
          </button>
          <div style={{ ...styles.buttonLabel, fontWeight: '600', color: '#1a73e8' }}>
            Reactions
          </div>

          {showEmojiPanel && (
            <div
              style={{
                ...styles.emojiPanel,
                boxShadow: '0 10px 30px rgba(26,115,232,0.3)',
                borderColor: '#1a73e8',
              }}
            >
              {REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiSelect(emoji)}
                  style={{
                    ...styles.emojiBtn,
                    fontSize: 26,
                    transition: 'transform 0.2s ease',
                  }}
                  aria-label={`Send reaction ${emoji}`}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.4)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <div
          style={styles.controlGroup}
          tabIndex={0}
          role="button"
          onClick={handleLeave}
          onKeyDown={e => { if(e.key === 'Enter' || e.key === ' ') handleLeave(); }}
          title="Leave the call"
          aria-label="Leave Call"
          className="control-button"
        >
          <button style={{
            ...styles.hangupButton,
            boxShadow: '0 8px 20px rgba(217,48,37,0.9)',
            transform: 'scale(1)',
            transition: 'transform 0.2s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            ❌
          </button>
          <div style={{ ...styles.buttonLabel, fontWeight: '600', color: '#d93025' }}>
            Leave
          </div>
        </div>
      </div>

      {/* Chat box */}
      <div
        style={{
          ...styles.chatBox,
          right: showChat ? 0 : '-320px',
          boxShadow: '0 0 24px rgba(26,115,232,0.2)',
          transition: 'right 0.3s ease, box-shadow 0.3s ease',
          borderRadius: 12,
          backgroundColor: '#ffffffee',
          backdropFilter: 'blur(8px)',
        }}
      >
        <h3 style={{
          ...styles.chatHeader,
          fontWeight: '700',
          letterSpacing: '0.05em',
          color: '#1a73e8',
          textShadow: '0 1px 3px rgba(26,115,232,0.6)',
        }}>
          Chat
        </h3>
        <div style={{
          ...styles.chatMessages,
          fontSize: 14,
          lineHeight: 1.4,
          color: '#202124',
          scrollbarWidth: 'thin',
          scrollbarColor: '#1a73e8 #f1f3f4',
        }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              ...styles.chatMessage,
              padding: '6px 8px',
              borderRadius: 6,
              backgroundColor: '#e8f0fe',
              marginBottom: 10,
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
            }}>
              <strong style={{ color: '#1a73e8' }}>{msg.from}:</strong> {msg.text}
            </div>
          ))}
        </div>
        <div style={{
          ...styles.chatInputContainer,
          gap: 8,
        }}>
          <input
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message"
            style={{
              ...styles.chatInput,
              fontSize: 16,
              boxShadow: '0 0 6px rgba(26,115,232,0.3)',
              transition: 'box-shadow 0.3s ease',
            }}
            onFocus={e => e.currentTarget.style.boxShadow = '0 0 12px rgba(26,115,232,0.6)'}
            onBlur={e => e.currentTarget.style.boxShadow = '0 0 6px rgba(26,115,232,0.3)'}
          />
          <button
            onClick={sendMessage}
            style={{
              ...styles.chatSendButton,
              fontWeight: '700',
              letterSpacing: '0.03em',
              boxShadow: '0 4px 12px rgba(26,115,232,0.6)',
              transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#155ab6'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1a73e8'}
          >
            Send
          </button>
        </div>
      </div>

      {/* Float animation keyframe */}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-120px); opacity: 0; }
        }
        /* Scrollbar for chat */
        div::-webkit-scrollbar {
          width: 8px;
        }
        div::-webkit-scrollbar-track {
          background: #f1f3f4;
          border-radius: 6px;
        }
        div::-webkit-scrollbar-thumb {
          background-color: #1a73e8;
          border-radius: 6px;
          border: 2px solid #f1f3f4;
        }
        /* Button focus outline */
        button:focus-visible {
          outline: 3px solid #1a73e8;
          outline-offset: 3px;
        }
        /* Smooth button hover */
        button.control-button:hover {
          filter: brightness(1.1);
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    backgroundColor: '#fff',
    fontFamily: "'Google Sans', 'Roboto', sans-serif",
    color: '#202124',
    display: 'flex',
    position: 'relative',
    overflow: 'hidden',
  },
  roomInfo: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: '10px 16px',
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    zIndex: 20,
    fontSize: '1rem',
    userSelect: 'none',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    backgroundColor: '#000',
  },
  floatingEmoji: {
    position: 'absolute',
    bottom: 100,
    fontSize: '2.5rem',
    animation: 'floatUp 2s ease-out',
    pointerEvents: 'none',
    userSelect: 'none',
    zIndex: 30,
  },
  controlBar: {
    position: 'absolute',
    bottom: 24,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: 24,
    zIndex: 10,
    backgroundColor: '#fff',
    padding: '8px 16px',
    borderRadius: 32,
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
    alignItems: 'center',
  },
  controlGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: 14,
    color: '#5f6368',
    userSelect: 'none',
    cursor: 'pointer',
  },
  buttonLabel: {
    marginTop: 4,
    fontSize: 12,
  },
  activeButton: {
    padding: 12,
    fontSize: 20,
    backgroundColor: '#1a73e8',
    border: 'none',
    borderRadius: '50%',
    color: '#fff',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(26,115,232,0.6)',
    transition: 'background-color 0.3s, transform 0.3s',
    userSelect: 'none',
  },
  inactiveButton: {
    padding: 12,
    fontSize: 20,
    backgroundColor: '#d93025',
    border: 'none',
    borderRadius: '50%',
    color: '#fff',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(217,48,37,0.6)',
    transition: 'background-color 0.3s, transform 0.3s',
    userSelect: 'none',
  },
  emojiPanel: {
    position: 'absolute',
    bottom: 60,
    background: '#f1f3f4',
    border: '1px solid #dadce0',
    padding: 8,
    borderRadius: 12,
    display: 'flex',
    gap: 8,
    zIndex: 100,
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  emojiBtn: {
    fontSize: 24,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#202124',
    transition: 'transform 0.15s ease',
    userSelect: 'none',
  },
  hangupButton: {
    padding: 12,
    fontSize: 20,
    backgroundColor: '#d93025',
    border: 'none',
    borderRadius: '50%',
    color: '#fff',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(217,48,37,0.8)',
    transition: 'background-color 0.3s',
  },
  chatBox: {
    position: 'absolute',
    top: 0,
    width: 320,
    height: '100%',
    backgroundColor: '#fff',
    boxShadow: '0 0 12px rgba(0,0,0,0.15)',
    transition: 'right 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 20,
    padding: 16,
    userSelect: 'text',
  },
  chatHeader: {
    color: '#1a73e8',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 600,
    fontSize: 18,
  },
  chatMessages: {
    flex: 1,
    overflowY: 'auto',
    marginBottom: 16,
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#f8f9fa',
  },
  chatMessage: {
    marginBottom: 8,
    color: '#202124',
  },
  chatInputContainer: {
    display: 'flex',
  },
  chatInput: {
    flex: 1,
    padding: 8,
    borderRadius: '6px 0 0 6px',
    border: '1px solid #dadce0',
    outline: 'none',
    fontSize: 16,
  },
  chatSendButton: {
    padding: '0 16px',
    borderRadius: '0 6px 6px 0',
    border: 'none',
    backgroundColor: '#1a73e8',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default VideoCall;
