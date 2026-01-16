import Peer from 'peerjs';

class WebRTCManager {
  constructor(callbacks) {
    this.peer = null;
    this.connection = null;
    this.callbacks = callbacks;
  }

  init(id) {
    // Prevent multiple instances from fighting for the same ID
    if (this.peer && !this.peer.destroyed) return;

    this.peer = new Peer(id, {
      debug: 1,
      // Increased heartbeat to prevent "Signaling Lost" on weak networks
      pingInterval: 3000, 
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      }
    });

    this.peer.on('open', (assignedId) => {
      this.callbacks.onLog(`SYSTEM: Node Secured. ID: ${assignedId}`);
      this.callbacks.onStatusChange('IDLE');
    });

    this.peer.on('disconnected', () => {
      // This is often triggered by Next.js hot-reloading
      this.callbacks.onLog('WARN: Signaling link flickered. Reconnecting...');
      this.peer.reconnect();
    });

    this.peer.on('error', (err) => {
      // Filter out annoying "lost connection" logs if it's already reconnecting
      if (err.type === 'disconnected') return;
      this.callbacks.onLog(`ERROR: ${err.type}`);
    });

    this.peer.on('connection', (conn) => {
      if (this.connection) return;
      this.connection = conn;
      this.setupConnectionListeners();
    });
  }

  connectToPeer(targetId) {
    if (!this.peer || this.peer.destroyed) {
      this.callbacks.onLog("ERROR: Engine offline. Refresh page.");
      return;
    }
    this.connection = this.peer.connect(targetId, { reliable: true });
    this.setupConnectionListeners();
  }

  setupConnectionListeners() {
    this.connection.on('open', () => {
      this.callbacks.onStatusChange('CONNECTED');
      this.callbacks.onLog('SYSTEM: P2P Tunnel Established.');
    });
    this.connection.on('data', (data) => this.callbacks.onMessage(data));
    this.connection.on('close', () => {
      this.callbacks.onStatusChange('IDLE');
      this.connection = null;
    });
  }

  send(payload) {
    if (this.connection?.open) {
      this.connection.send(payload);
    }
  }
}

export default WebRTCManager;