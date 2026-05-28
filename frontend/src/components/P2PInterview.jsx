import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Video, Mic, MicOff, VideoOff, PhoneOff, Copy, UserPlus, CheckCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function P2PInterview() {
  const [roomId, setRoomId] = useState('');
  const [inRoom, setInRoom] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected'); // Disconnected, Connecting, Connected

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const channelRef = useRef(null);

  const ICE_SERVERS = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  useEffect(() => {
    return () => {
      hangUp();
    };
  }, []);

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      return stream;
    } catch (err) {
      toast.error("Could not access camera or microphone!");
      console.error(err);
      throw err;
    }
  };

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = (event) => {
      if (event.candidate && channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'ice-candidate',
          payload: { candidate: event.candidate }
        });
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') {
        setConnectionStatus('Connected');
        toast.success("Peer connected!");
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setConnectionStatus('Disconnected');
        toast.error("Peer disconnected.");
      }
    };

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    peerConnectionRef.current = pc;
    return pc;
  };

  const createRoom = async () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(newRoomId);
    setIsCreator(true);
    setConnectionStatus('Waiting for peer...');
    
    await joinChannel(newRoomId, true);
  };

  const joinRoom = async (e) => {
    e.preventDefault();
    if (!roomId) return;
    setIsCreator(false);
    setConnectionStatus('Connecting...');
    
    await joinChannel(roomId, false);
  };

  const joinChannel = async (id, creator) => {
    try {
      await initializeMedia();
      setInRoom(true);

      const channel = supabase.channel(`p2p-${id}`);
      channelRef.current = channel;

      channel.on('broadcast', { event: 'offer' }, async ({ payload }) => {
        if (!creator) return; // Only answerer should receive offer? No, creator sends offer, answerer receives it.
        // Wait, creator creates room. Answerer joins. Answerer should send offer?
        // Or creator sends offer when answerer joins.
        // Let's have Answerer send "peer-joined". Creator receives "peer-joined" and creates Offer.
      });

      channel.on('broadcast', { event: 'peer-joined' }, async () => {
        if (creator) {
          // Create Offer
          const pc = createPeerConnection();
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          
          channel.send({
            type: 'broadcast',
            event: 'offer',
            payload: { offer }
          });
        }
      });

      channel.on('broadcast', { event: 'offer' }, async ({ payload }) => {
        if (!creator) {
          const pc = createPeerConnection();
          await pc.setRemoteDescription(new RTCSessionDescription(payload.offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          
          channel.send({
            type: 'broadcast',
            event: 'answer',
            payload: { answer }
          });
        }
      });

      channel.on('broadcast', { event: 'answer' }, async ({ payload }) => {
        if (creator && peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(payload.answer));
        }
      });

      channel.on('broadcast', { event: 'ice-candidate' }, async ({ payload }) => {
        if (peerConnectionRef.current) {
          try {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(payload.candidate));
          } catch (e) {
            console.error('Error adding received ice candidate', e);
          }
        }
      });

      await channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          if (!creator) {
            // Tell creator we joined
            channel.send({
              type: 'broadcast',
              event: 'peer-joined',
              payload: {}
            });
          }
        }
      });
    } catch (e) {
      toast.error("Failed to connect to signaling server");
    }
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMicActive(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoActive(videoTrack.enabled);
      }
    }
  };

  const hangUp = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    setInRoom(false);
    setRoomId('');
    setConnectionStatus('Disconnected');
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast.success("Room ID copied!");
  };

  if (!inRoom) {
    return (
      <div className="glass-panel premium-3d cascade-reveal" style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem', textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(59, 130, 246, 0.2))', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
          <Video color="#10b981" size={40} />
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Practice with a Friend</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
          Create a room and share the code with your peer to start a real-time mock interview over video call.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <UserPlus size={32} color="#3b82f6" style={{ marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '1rem' }}>Host a Room</h3>
            <button onClick={createRoom} className="btn-primary" style={{ width: '100%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
              Create Room
            </button>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <RefreshCw size={32} color="#10b981" style={{ marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '1rem' }}>Join a Room</h3>
            <form onSubmit={joinRoom}>
              <input 
                type="text" 
                value={roomId} 
                onChange={(e) => setRoomId(e.target.value)} 
                placeholder="Enter Room ID" 
                className="input-field" 
                style={{ marginBottom: '1rem', textAlign: 'center', textTransform: 'uppercase' }}
                required
              />
              <button type="submit" className="btn-primary" style={{ width: '100%', background: 'linear-gradient(135deg, #10b981, #3b82f6)' }}>
                Join Room
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel premium-3d cascade-reveal" style={{ padding: '2rem' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'rgba(0,0,0,0.3)', padding: '1rem 2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Room ID:</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff', letterSpacing: '2px' }}>{roomId}</span>
          <button onClick={copyRoomId} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}><Copy size={16} /></button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: connectionStatus === 'Connected' ? '#10b981' : '#f59e0b', boxShadow: `0 0 10px ${connectionStatus === 'Connected' ? '#10b981' : '#f59e0b'}` }}></div>
          <span style={{ color: connectionStatus === 'Connected' ? '#10b981' : '#f59e0b', fontWeight: '500' }}>{connectionStatus}</span>
        </div>
      </div>

      {/* Video Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        {/* Local Video */}
        <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', background: '#000', aspectRatio: '16/9', border: '2px solid rgba(59, 130, 246, 0.5)' }}>
          <video 
            ref={localVideoRef} 
            autoPlay 
            playsInline 
            muted 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} 
          />
          <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(0,0,0,0.6)', padding: '4px 12px', borderRadius: '20px', color: '#fff', fontSize: '0.9rem', backdropFilter: 'blur(4px)' }}>
            You (Local)
          </div>
        </div>

        {/* Remote Video */}
        <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', background: '#000', aspectRatio: '16/9', border: '2px solid rgba(16, 185, 129, 0.5)' }}>
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} 
          />
          {connectionStatus !== 'Connected' && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(20, 20, 30, 0.8)', color: 'var(--text-muted)' }}>
              Waiting for peer video...
            </div>
          )}
          <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(0,0,0,0.6)', padding: '4px 12px', borderRadius: '20px', color: '#fff', fontSize: '0.9rem', backdropFilter: 'blur(4px)' }}>
            Peer (Remote)
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
        <button 
          onClick={toggleMic}
          style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', background: micActive ? 'rgba(255,255,255,0.1)' : '#ef4444', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}
        >
          {micActive ? <Mic size={24} /> : <MicOff size={24} />}
        </button>
        <button 
          onClick={toggleVideo}
          style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', background: videoActive ? 'rgba(255,255,255,0.1)' : '#ef4444', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}
        >
          {videoActive ? <Video size={24} /> : <VideoOff size={24} />}
        </button>
        <button 
          onClick={hangUp}
          style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)' }}
        >
          <PhoneOff size={24} />
        </button>
      </div>
    </div>
  );
}
