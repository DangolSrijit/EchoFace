import React, { useRef, useEffect, useState } from 'react';
import Peer from 'simple-peer';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

export default function VideoCall() {
  const { roomName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const initialMicOn = location.state?.micOn ?? true;
  const initialVideoOn = location.state?.videoOn ?? true;
  const purpose = location.state?.purpose || 'general';

  const currentUser = JSON.parse(localStorage.getItem("user"))?.username || "You";

  const [micOn, setMicOn] = useState(initialMicOn);
  const [videoOn, setVideoOn] = useState(initialVideoOn);
  const [peers, setPeers] = useState([]);
  const [stream, setStream] = useState(null);
  const [adminUsername, setAdminUsername] = useState(currentUser);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [screenSharing, setScreenSharing] = useState(false);
  const [selfId, setSelfId] = useState(null);  // <-- store own ID here

  const userVideo = useRef();
  const socketRef = useRef();
  const peersRef = useRef([]);

  useEffect(() => {
    socketRef.current = new WebSocket(`ws://localhost:8000/ws/call/${roomName}/`);

    navigator.mediaDevices.getUserMedia({
      video: initialVideoOn,
      audio: initialMicOn,
    }).then((mediaStream) => {
      setStream(mediaStream);
      if (userVideo.current) {
        userVideo.current.srcObject = mediaStream;
        userVideo.current.style.transform = 'scaleX(-1)';
      }

      socketRef.current.onopen = () => {
        console.log("WebSocket connected");
        // You can send a "join" after receiving selfId, or send immediately if server generates on join
        // We'll assume server assigns selfId after join
        socketRef.current.send(JSON.stringify({
          type: "join",
          username: currentUser,
        }));
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'your_id') {
          // Server sends your unique ID after join
          setSelfId(data.id);
          console.log("Assigned selfId:", data.id);
        }

        if (data.type === 'all_users') {
          if (data.users.length > 0 && !adminUsername) {
            setAdminUsername(data.users[0].username);
          }
          const peersArr = [];
          data.users.forEach(user => {
            if (user.id === selfId) return; // Don't create peer for self
            const peer = createPeer(user.id, selfId, mediaStream);
            peersRef.current.push({
              peerID: user.id,
              peer,
              username: user.username,
              mic: true,
              video: true,
            });
            peersArr.push({ peer, username: user.username, mic: true, video: true });
          });
          setPeers(peersArr);
        }

        if (data.type === 'user_joined') {
          if (data.userId === selfId) return; // Ignore self
          const peer = addPeer(data.signal, data.userId, mediaStream);
          peersRef.current.push({
            peerID: data.userId,
            peer,
            username: data.username,
            mic: true,
            video: true,
          });
          setPeers(users => [...users, { peer, username: data.username, mic: true, video: true }]);
        }

        if (data.type === 'signal') {
          const item = peersRef.current.find(p => p.peerID === data.from);
          if (item) item.peer.signal(data.signal);
        }

        if (data.type === 'update_status') {
          peersRef.current = peersRef.current.map(p => {
            if (p.peerID === data.userId) {
              return { ...p, mic: data.mic, video: data.video };
            }
            return p;
          });
          setPeers(peersRef.current.map(({peer, username, mic, video}) => ({peer, username, mic, video})));
        }

        if (data.type === 'user_left') {
          peersRef.current = peersRef.current.filter(p => p.peerID !== data.userId);
          setPeers(peersRef.current.map(({peer, username, mic, video}) => ({peer, username, mic, video})));
        }

        if (data.type === 'chat_message') {
          setChatMessages(messages => [...messages, { username: data.username, message: data.message }]);
        }

        if (data.type === 'kicked') {
          if (data.userId === selfId) {
            alert('You have been kicked from the meeting.');
            window.location.href = '/';
          }
        }
      };

      socketRef.current.onclose = () => {
        console.log("WebSocket disconnected");
      };
    });

    return () => {
      peersRef.current.forEach(({ peer }) => peer.destroy());
      if (socketRef.current) socketRef.current.close();
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [roomName, selfId]);  // added selfId to deps

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', signal => {
      socketRef.current.send(JSON.stringify({
        type: 'signal',
        target: userToSignal,
        caller: callerID,
        signal,
      }));
    });

    peer.on('connect', () => {
      console.log(`Peer connected with ${userToSignal}`);
    });

    peer.on('error', err => {
      console.error('Peer error:', err);
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', signal => {
      socketRef.current.send(JSON.stringify({
        type: 'signal',
        target: callerID,
        caller: selfId,
        signal,
      }));
    });

    peer.signal(incomingSignal);

    peer.on('connect', () => {
      console.log(`Peer connected with ${callerID}`);
    });

    peer.on('error', err => {
      console.error('Peer error:', err);
    });

    return peer;
  }

  const toggleMic = () => {
    if (!stream) return;
    const enabled = !micOn;
    stream.getAudioTracks().forEach(track => (track.enabled = enabled));
    setMicOn(enabled);
    sendStatusUpdate(enabled, videoOn);
  };

  const toggleVideo = () => {
    if (!stream) return;
    const enabled = !videoOn;
    stream.getVideoTracks().forEach(track => (track.enabled = enabled));
    setVideoOn(enabled);
    sendStatusUpdate(micOn, enabled);
  };

  const sendStatusUpdate = (mic, video) => {
    if (!socketRef.current || !selfId) return;
    socketRef.current.send(JSON.stringify({
      type: 'update_status',
      userId: selfId,
      mic,
      video,
    }));
  };

  const adminToggleMute = (peerID, mute) => {
    socketRef.current.send(JSON.stringify({
      type: 'admin_mute',
      target: peerID,
      mute,
    }));
  };

  const adminKickUser = (peerID) => {
    if(window.confirm('Are you sure you want to kick this user?')) {
      socketRef.current.send(JSON.stringify({
        type: 'admin_kick',
        target: peerID,
      }));
      peersRef.current = peersRef.current.filter(p => p.peerID !== peerID);
      setPeers(peersRef.current.map(({peer, username, mic, video}) => ({peer, username, mic, video})));
    }
  };

  const startScreenShare = async () => {
    if (screenSharing) {
      stopScreenShare();
      return;
    }
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      peersRef.current.forEach(({peer}) => {
        const sender = peer._pc.getSenders().find(s => s.track.kind === 'video');
        if (sender) sender.replaceTrack(screenStream.getVideoTracks()[0]);
      });
      const videoTrack = screenStream.getVideoTracks()[0];
      stream.getVideoTracks()[0].stop();
      stream.removeTrack(stream.getVideoTracks()[0]);
      stream.addTrack(videoTrack);
      if (userVideo.current) {
        userVideo.current.srcObject = screenStream;
        userVideo.current.style.transform = 'none';
      }

      videoTrack.onended = () => {
        stopScreenShare();
      };

      setStream(screenStream);
      setScreenSharing(true);
    } catch (err) {
      console.error("Screen share error:", err);
    }
  };

  const stopScreenShare = async () => {
    const webcamStream = await navigator.mediaDevices.getUserMedia({
      video: videoOn,
      audio: micOn,
    });
    peersRef.current.forEach(({peer}) => {
      const sender = peer._pc.getSenders().find(s => s.track.kind === 'video');
      if (sender) sender.replaceTrack(webcamStream.getVideoTracks()[0]);
    });
    if (userVideo.current) {
      userVideo.current.srcObject = webcamStream;
      userVideo.current.style.transform = 'scaleX(-1)';
    }
    setStream(webcamStream);
    setScreenSharing(false);
  };

  const sendMessage = () => {
    if (!chatInput.trim() || !socketRef.current) return;
    socketRef.current.send(JSON.stringify({
      type: 'chat_message',
      username: currentUser,
      message: chatInput.trim(),
    }));
    setChatInput('');
  };

  const handleChatKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const endCall = () => {
    // Close all peers
    peersRef.current.forEach(({ peer }) => peer.destroy());
    peersRef.current = [];
    setPeers([]);
    // Close socket and redirect to homepage or landing page
    if (socketRef.current) socketRef.current.close();
    if (stream) stream.getTracks().forEach(track => track.stop());
    navigate('/dashboard'); 
  };

  const isAdmin = currentUser === adminUsername;

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Share Tech Mono', monospace", color: '#00fff7', backgroundColor: '#0f141f' }}>
      {/* Video + controls section */}
      <div style={{ flex: 3, padding: '1rem', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ marginBottom: '1rem', textShadow: '0 0 10px #00fff7' }}>Room: {roomName}</h2>
        <h3 style={{ marginBottom: '1rem', fontWeight: '600', textTransform: 'capitalize' }}>Purpose: {purpose.replace('_', ' ')}</h3>

        <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={toggleMic} style={{ ...buttonStyle, backgroundColor: micOn ? '#00fff7' : '#b12d25', boxShadow: `0 0 10px ${micOn ? '#00fff7' : '#b12d25'}` }}>
            {micOn ? '🎤 Mute Mic' : '🔇 Unmute Mic'}
          </button>
          <button onClick={toggleVideo} style={{ ...buttonStyle, backgroundColor: videoOn ? '#00fff7' : '#b12d25', boxShadow: `0 0 10px ${videoOn ? '#00fff7' : '#b12d25'}` }}>
            {videoOn ? 'Turn Off Video' : 'Turn On Video'}
          </button>
          <button onClick={screenSharing ? stopScreenShare : startScreenShare} style={{ ...buttonStyle, backgroundColor: screenSharing ? '#b12d25' : '#00fff7' }}>
            {screenSharing ? 'Stop Sharing' : 'Share Screen'}
          </button>
          <button onClick={endCall} style={{ ...buttonStyle, backgroundColor: '#b12d25' }}>
            📞 Hang Up
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', flexGrow: 1, overflowY: 'auto' }}>
          <ParticipantVideo
            videoRef={userVideo}
            username={currentUser}
            isAdmin={isAdmin}
            mic={micOn}
            video={videoOn}
            isLocal={true}
          />
          {peers.map(({ peer, username, mic, video }, index) => (
            <RemoteVideo
              key={index}
              peer={peer}
              username={username}
              isAdmin={username === adminUsername}
              mic={mic}
              video={video}
              isAdminUser={isAdmin}
              onMute={() => adminToggleMute(peersRef.current[index].peerID, true)}
              onUnmute={() => adminToggleMute(peersRef.current[index].peerID, false)}
              onKick={() => adminKickUser(peersRef.current[index].peerID)}
            />
          ))}
        </div>
      </div>

      {/* Sidebar: Participants + Chat */}
      <div style={{ width: '320px', borderLeft: '1px solid #00fff7', display: 'flex', flexDirection: 'column' }}>
        {/* Participants List */}
        <div style={{ padding: '1rem', borderBottom: '1px solid #00fff7', flexShrink: 0 }}>
          <h3>Participants</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ padding: '4px 0', fontWeight: isAdmin ? '700' : 'normal', color: isAdmin ? '#00fff7' : 'inherit' }}>
              {currentUser} {isAdmin ? '(Admin)' : ''}
              <span style={{ marginLeft: '8px' }}>{micOn ? '🎤' : '🔇'}</span>
              <span style={{ marginLeft: '4px' }}>{videoOn ? '📹' : '🚫'}</span>
            </li>
            {peers.map(({ username, mic, video }, i) => (
              <li key={i} style={{ padding: '4px 0', fontWeight: username === adminUsername ? '700' : 'normal', color: username === adminUsername ? '#00fff7' : 'inherit' }}>
                {username} {username === adminUsername ? '(Admin)' : ''}
                <span style={{ marginLeft: '8px' }}>{mic ? '🎤' : '🔇'}</span>
                <span style={{ marginLeft: '4px' }}>{video ? '📹' : '🚫'}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat */}
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: '1rem' }}>
          <h3>Chat</h3>
          <div style={{ flexGrow: 1, overflowY: 'auto', border: '1px solid #00fff7', borderRadius: '8px', padding: '8px', marginBottom: '8px', color: '#00fff7' }}>
            {chatMessages.map((msg, i) => (
              <div key={i} style={{ marginBottom: '6px' }}>
                <strong>{msg.username}: </strong><span>{msg.message}</span>
              </div>
            ))}
          </div>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleChatKeyPress}
            placeholder="Type a message and press Enter"
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid #00fff7',
              backgroundColor: '#0f141f',
              color: '#00fff7',
            }}
          />
        </div>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: '10px 20px',
  border: 'none',
  borderRadius: '8px',
  color: '#010a14',
  cursor: 'pointer',
  fontWeight: '700',
  transition: 'background-color 0.3s ease',
  fontSize: '16px',
};

function ParticipantVideo({ videoRef, username, isAdmin, mic, video, isLocal }) {
  return (
    <div style={{ position: 'relative', minWidth: '300px', minHeight: '200px' }}>
      <video
        ref={videoRef}
        autoPlay
        muted={isLocal}
        style={{
          width: '300px',
          borderRadius: '8px',
          border: '1px solid #00fff7',
          boxShadow: '0 0 12px #00fff7',
          transform: isLocal ? 'scaleX(-1)' : 'none',
        }}
      />
      <div style={labelStyle}>
        {username} {isAdmin ? '(Admin)' : ''}
        <span style={{ marginLeft: 8 }}>{mic ? '🎤' : '🔇'}</span>
        <span style={{ marginLeft: 4 }}>{video ? '📹' : '🚫'}</span>
      </div>
    </div>
  );
}

function RemoteVideo({ peer, username, isAdmin, mic, video, isAdminUser, onMute, onUnmute, onKick }) {
  const ref = useRef();

  useEffect(() => {
    peer.on('stream', stream => {
      if (ref.current) {
        ref.current.srcObject = stream;
        ref.current.style.transform = 'none';
      }
    });
  }, [peer]);

  return (
    <div style={{ position: 'relative', minWidth: '300px', minHeight: '200px' }}>
      <video
        playsInline
        autoPlay
        ref={ref}
        style={{
          width: '300px',
          borderRadius: '8px',
          border: '1px solid #00fff7',
          boxShadow: '0 0 12px #00fff7',
        }}
      />
      <div style={labelStyle}>
        {username} {isAdmin ? '(Admin)' : ''}
        <span style={{ marginLeft: 8 }}>{mic ? '🎤' : '🔇'}</span>
        <span style={{ marginLeft: 4 }}>{video ? '📹' : '🚫'}</span>

        {isAdminUser && !isAdmin && (
          <span style={{ marginLeft: 12 }}>
            {mic ? (
              <button style={adminButtonStyle} onClick={onMute}>Mute</button>
            ) : (
              <button style={adminButtonStyle} onClick={onUnmute}>Unmute</button>
            )}
            <button style={adminButtonStyle} onClick={onKick}>Kick</button>
          </span>
        )}
      </div>
    </div>
  );
}

const labelStyle = {
  position: 'absolute',
  bottom: 4,
  left: 8,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#00fff7',
  padding: '2px 8px',
  borderRadius: '4px',
  fontWeight: '700',
  fontSize: '14px',
};

const adminButtonStyle = {
  border: 'none',
  borderRadius: '4px',
  padding: '4px 8px',
  backgroundColor: '#b12d25',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '14px',
  marginLeft: '4px',
};
