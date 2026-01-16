// "use client";
// import React, { useEffect, useRef, useState } from 'react';
// import { AnimatePresence } from 'framer-motion';
// import { Shield, Send } from 'lucide-react';
// import { useSpecterStore } from '../hooks/useSpecterStore';
// import WebRTCManager from '../lib/WebRTCManager';
// import { encryptData, decryptData, generateSharedKey, exportKey, importKey } from '../lib/crypto';
// import { nanoid } from 'nanoid';

// import ChatBubble from '../components/ChatBubble';
// import ConnectionPanel from '../components/ConnectionPanel';
// import TerminalLog from '../components/TerminalLog';

// export default function SpecterTerminal() {
//   const { messages, logs, status, sharedKey, addMessage, addLog, setStatus, setSharedKey } = useSpecterStore();
//   const [input, setInput] = useState("");
//   const [targetId, setTargetId] = useState("");
//   const [isConnecting, setIsConnecting] = useState(false);
  
//   // Stable ID that doesn't change on re-render
//   const myIdRef = useRef(nanoid(6).toUpperCase());
//   const rtc = useRef(null);

//   useEffect(() => {
//     // Only init if rtc.current is null to prevent Next.js StrictMode double-mount issues
//     if (!rtc.current) {
//       rtc.current = new WebRTCManager({
//         onLog: (msg) => addLog(msg),
//         onStatusChange: (s) => {
//           setStatus(s);
//           if (s === 'CONNECTED' || s === 'IDLE') setIsConnecting(false);
//         },
//         onMessage: async (data) => {
//           if (data.type === 'KEY_SYNC') {
//             const key = await importKey(data.jwk);
//             setSharedKey(key);
//             addLog("SECURITY: Symmetric AES Key Synchronized.");
//             return;
//           }

//           try {
//             const currentKey = useSpecterStore.getState().sharedKey;
//             const decrypted = await decryptData(data, currentKey);
//             addMessage({ text: decrypted, sender: 'peer', timestamp: Date.now() });
//           } catch (e) {
//             addLog("ERROR: Decryption Failed.");
//           }
//         }
//       });
//       rtc.current.init(myIdRef.current);
//     }
//   }, [addLog, setStatus, setSharedKey, addMessage]);

//   const handleConnect = async () => {
//     if (isConnecting || status === 'CONNECTED' || !targetId) return;
    
//     setIsConnecting(true);
//     addLog(`SYSTEM: Initiating Bridge to ${targetId.toUpperCase()}...`);

//     try {
//       const key = await generateSharedKey();
//       const jwk = await exportKey(key);
//       setSharedKey(key);

//       rtc.current.connectToPeer(targetId.toUpperCase());

//       // Polling for the bridge to open before pushing the key
//       let attempts = 0;
//       const syncInterval = setInterval(() => {
//         if (useSpecterStore.getState().status === 'CONNECTED') {
//           rtc.current.send({ type: 'KEY_SYNC', jwk });
//           addLog("SECURITY: Handshake verified. Key Sync Sent.");
//           clearInterval(syncInterval);
//           setIsConnecting(false);
//         }
//         if (++attempts > 20) {
//           addLog("ERROR: Handshake timed out.");
//           clearInterval(syncInterval);
//           setIsConnecting(false);
//         }
//       }, 500);
//     } catch (err) {
//       addLog("ERROR: Bridge Failure.");
//       setIsConnecting(false);
//     }
//   };

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!input || status !== 'CONNECTED') return;

//     const encrypted = await encryptData(input, sharedKey);
//     rtc.current.send(encrypted);
//     addMessage({ text: input, sender: 'me', timestamp: Date.now() });
//     setInput("");
//   };

//   return (
//     <main className="min-h-screen bg-black text-emerald-500 font-mono p-4 md:p-8 relative selection:bg-emerald-500 selection:text-black">
//       <div className="max-w-5xl mx-auto border border-emerald-900/40 bg-black/80 backdrop-blur-xl rounded-lg h-[90vh] flex flex-col overflow-hidden shadow-2xl">
//         <header className="border-b border-emerald-900/50 p-4 flex justify-between items-center bg-emerald-950/10">
//           <div className="flex items-center gap-2">
//             <Shield className="w-5 h-5 text-emerald-400" />
//             <h1 className="text-xl font-bold tracking-widest">SPECTER_OS</h1>
//           </div>
//           <div className="flex items-center gap-4 text-[10px]">
//             <div className="flex items-center gap-2 uppercase tracking-widest">
//               <span className={`h-2 w-2 rounded-full ${status === 'CONNECTED' ? 'bg-emerald-400' : 'bg-red-600 animate-pulse'}`} />
//               <span className="font-bold">{status}</span>
//             </div>
//             <div className="px-2 py-1 border border-emerald-800 rounded bg-black">NODE_ID: {myIdRef.current}</div>
//           </div>
//         </header>

//         {status !== 'CONNECTED' && (
//           <ConnectionPanel 
//             targetId={targetId} 
//             setTargetId={setTargetId} 
//             onConnect={handleConnect} 
//             disabled={isConnecting}
//           />
//         )}

//         <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
//           <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
//             <AnimatePresence mode='popLayout'>
//               {messages.map((msg) => (
//                 <ChatBubble key={msg.timestamp} msg={msg} />
//               ))}
//             </AnimatePresence>
//           </div>
//           <TerminalLog logs={logs} />
//         </div>

//         <form onSubmit={handleSend} className="p-4 bg-black border-t border-emerald-900/30 flex gap-4 items-center">
//           <input 
//             type="text" 
//             placeholder={status === 'CONNECTED' ? ">> COMMAND ENTRY..." : ">> SYSTEM OFFLINE..."}
//             className="bg-transparent flex-grow outline-none text-emerald-400 placeholder:text-emerald-900 uppercase text-sm"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             disabled={status !== 'CONNECTED'}
//           />
//           <button type="submit" disabled={status !== 'CONNECTED'} className="text-emerald-500 hover:text-white transition-all">
//             <Send className="w-6 h-6" />
//           </button>
//         </form>
//       </div>
//     </main>
//   );
// }


// "use client";
// import React, { useEffect, useRef, useState } from 'react';
// import { AnimatePresence } from 'framer-motion';
// import { Shield, Send, Paperclip } from 'lucide-react';
// import { useSpecterStore } from '../hooks/useSpecterStore';
// import WebRTCManager from '../lib/WebRTCManager';
// import { encryptData, decryptData, generateSharedKey, exportKey, importKey, encryptFile, decryptFile } from '../lib/crypto';
// import { nanoid } from 'nanoid';

// import ChatBubble from '../components/ChatBubble';
// import ConnectionPanel from '../components/ConnectionPanel';
// import TerminalLog from '../components/TerminalLog';

// export default function SpecterTerminal() {
//   const { messages, logs, status, sharedKey, addMessage, addLog, setStatus, setSharedKey } = useSpecterStore();
//   const [input, setInput] = useState("");
//   const [targetId, setTargetId] = useState("");
//   const myIdRef = useRef(nanoid(6).toUpperCase());
//   const rtc = useRef(null);
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     if (!rtc.current) {
//       rtc.current = new WebRTCManager({
//         onLog: (msg) => addLog(msg),
//         onStatusChange: (s) => setStatus(s),
//         onMessage: async (data) => {
//           const currentKey = useSpecterStore.getState().sharedKey;

//           if (data.type === 'KEY_SYNC') {
//             const key = await importKey(data.jwk);
//             setSharedKey(key);
//             addLog("SECURITY: Handshake Key Synchronized.");
//             return;
//           }

//           if (data.type === 'FILE_TRANSFER') {
//             addLog(`PACKET: Incoming File [${data.fileName}]`);
//             const decrypted = await decryptFile(data.fileData, data.iv, currentKey);
//             const url = URL.createObjectURL(new Blob([decrypted], { type: data.fileType }));
//             addMessage({ text: `File: ${data.fileName}`, fileUrl: url, fileName: data.fileName, sender: 'peer', timestamp: Date.now() });
//             return;
//           }

//           try {
//             const decrypted = await decryptData(data, currentKey);
//             addMessage({ text: decrypted, sender: 'peer', timestamp: Date.now() });
//           } catch (e) { addLog("ERROR: Decryption Failed."); }
//         }
//       });
//       rtc.current.init(myIdRef.current);
//     }
//   }, [addLog, setStatus, setSharedKey, addMessage]);

//   const handleConnect = async () => {
//     if (!targetId || status === 'CONNECTED') return;
//     const key = await generateSharedKey();
//     const jwk = await exportKey(key);
//     setSharedKey(key);
//     rtc.current.connectToPeer(targetId.toUpperCase());
    
//     const sync = setInterval(() => {
//       if (useSpecterStore.getState().status === 'CONNECTED') {
//         rtc.current.send({ type: 'KEY_SYNC', jwk });
//         clearInterval(sync);
//       }
//     }, 500);
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!input || status !== 'CONNECTED') return;

//     const textToEncrypt = input;
//     setInput(""); // Immediate clear for UI responsiveness

//     try {
//       const encrypted = await encryptData(textToEncrypt, sharedKey);
//       rtc.current.send(encrypted);
//       addMessage({ text: textToEncrypt, sender: 'me', timestamp: Date.now() });
//     } catch (err) {
//       addLog("ERROR: Packet encryption failure.");
//     }
//   };

//   const handleFileDrop = async (e) => {
//     const file = e.target.files[0];
//     if (!file || status !== 'CONNECTED') return;
//     addLog(`FILE: Encrypting ${file.name}...`);
    
//     const reader = new FileReader();
//     reader.onload = async (ev) => {
//       const { encryptedBuffer, iv } = await encryptFile(ev.target.result, sharedKey);
//       rtc.current.send({ 
//         type: 'FILE_TRANSFER', 
//         fileData: encryptedBuffer, 
//         iv, 
//         fileName: file.name, 
//         fileType: file.type 
//       });
//       addMessage({ text: `Sent File: ${file.name}`, sender: 'me', timestamp: Date.now() });
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   return (
//     <main className="min-h-screen bg-black text-emerald-500 font-mono p-4 md:p-8">
//       <div className="max-w-5xl mx-auto border border-emerald-900/40 bg-black/80 rounded-lg h-[90vh] flex flex-col overflow-hidden shadow-2xl relative">
//         <header className="border-b border-emerald-900/50 p-4 flex justify-between items-center bg-emerald-950/10">
//           <div className="flex items-center gap-2"><Shield size={20} /> <span className="font-bold tracking-widest">SPECTER_OS</span></div>
//           <div className="flex items-center gap-4 text-[10px]">
//             <span className={`h-2 w-2 rounded-full ${status === 'CONNECTED' ? 'bg-emerald-400' : 'bg-red-600 animate-pulse'}`} />
//             <span className="border border-emerald-800 px-2 py-1 rounded tracking-tighter">NODE: {myIdRef.current}</span>
//           </div>
//         </header>

//         {status !== 'CONNECTED' && <ConnectionPanel targetId={targetId} setTargetId={setTargetId} onConnect={handleConnect} />}

//         <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
//           <div className="flex-grow p-6 overflow-y-auto space-y-4 custom-scrollbar">
//             <AnimatePresence mode="popLayout">
//               {messages.map((msg) => <ChatBubble key={msg.timestamp} msg={msg} />)}
//             </AnimatePresence>
//           </div>
//           <TerminalLog logs={logs} />
//         </div>

//         <form onSubmit={handleSendMessage} className="p-4 border-t border-emerald-900/30 flex gap-4 items-center bg-black">
//           <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileDrop} />
//           <button 
//             type="button" 
//             onClick={() => fileInputRef.current.click()} 
//             className="text-emerald-900 hover:text-emerald-400 transition-colors" 
//             disabled={status !== 'CONNECTED'}
//           >
//             <Paperclip size={20} />
//           </button>
          
//           <input 
//             className="bg-transparent flex-grow outline-none text-emerald-400 placeholder:text-emerald-950 uppercase text-sm" 
//             placeholder="COMMAND ENTRY..." 
//             value={input} 
//             onChange={(e) => setInput(e.target.value)} 
//             disabled={status !== 'CONNECTED'} 
//           />
          
//           <button type="submit" disabled={status !== 'CONNECTED' || !input} className="hover:text-white disabled:opacity-20">
//             <Send size={20} />
//           </button>
//         </form>
//       </div>
//     </main>
//   );
// }






// "use client";
// import React, { useEffect, useRef, useState } from 'react';
// import { AnimatePresence, motion } from 'framer-motion';
// import { ShieldCheck, Send, Paperclip, Fingerprint, Menu, X, Lock } from 'lucide-react';
// import { useSpecterStore } from '../hooks/useSpecterStore';
// import WebRTCManager from '../lib/WebRTCManager';
// import { encryptData, decryptData, generateSharedKey, exportKey, importKey, encryptFile, decryptFile } from '../lib/crypto';
// import { nanoid } from 'nanoid';

// import ChatBubble from '../components/ChatBubble';
// import ConnectionPanel from '../components/ConnectionPanel';
// import TerminalLog from '../components/TerminalLog';

// export default function SpecterTerminal() {
//   const { messages, logs, status, sharedKey, addMessage, addLog, setStatus, setSharedKey } = useSpecterStore();
//   const [input, setInput] = useState("");
//   const [targetId, setTargetId] = useState("");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isConnecting, setIsConnecting] = useState(false);
  
//   const myIdRef = useRef(nanoid(6).toUpperCase());
//   const rtc = useRef(null);
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     if (!rtc.current) {
//       rtc.current = new WebRTCManager({
//         onLog: (msg) => addLog(msg),
//         onStatusChange: (s) => {
//           setStatus(s);
//           if (s === 'CONNECTED' || s === 'IDLE') setIsConnecting(false);
//         },
//         onMessage: async (data) => {
//           const currentKey = useSpecterStore.getState().sharedKey;
//           if (data.type === 'KEY_SYNC') {
//             const key = await importKey(data.jwk);
//             setSharedKey(key);
//             addLog("SEC_LAYER: Identity Verified. Channel Secure.");
//             return;
//           }
//           if (data.type === 'FILE_TRANSFER') {
//             const decrypted = await decryptFile(data.fileData, data.iv, currentKey);
//             const url = URL.createObjectURL(new Blob([decrypted], { type: data.fileType }));
//             addMessage({ text: `Encrypted File: ${data.fileName}`, fileUrl: url, fileName: data.fileName, sender: 'peer', timestamp: Date.now() });
//             return;
//           }
//           try {
//             const decrypted = await decryptData(data, currentKey);
//             addMessage({ text: decrypted, sender: 'peer', timestamp: Date.now() });
//           } catch (e) { addLog("SEC_ERROR: Decryption Integrity Failure."); }
//         }
//       });
//       rtc.current.init(myIdRef.current);
//     }
//   }, [addLog, setStatus, setSharedKey, addMessage]);

//   const handleConnect = async () => {
//     if (!targetId || status === 'CONNECTED' || isConnecting) return;
//     setIsConnecting(true);
//     const key = await generateSharedKey();
//     const jwk = await exportKey(key);
//     setSharedKey(key);
//     rtc.current.connectToPeer(targetId.toUpperCase());
//     const sync = setInterval(() => {
//       if (useSpecterStore.getState().status === 'CONNECTED') {
//         rtc.current.send({ type: 'KEY_SYNC', jwk });
//         clearInterval(sync);
//         setIsConnecting(false);
//       }
//     }, 500);
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!input || status !== 'CONNECTED') return;
//     const text = input;
//     setInput(""); 
//     const encrypted = await encryptData(text, sharedKey);
//     rtc.current.send(encrypted);
//     addMessage({ text, sender: 'me', timestamp: Date.now() });
//   };

//   const handleFileDrop = async (e) => {
//     const file = e.target.files[0];
//     if (!file || status !== 'CONNECTED') return;
//     addLog(`FILE: Encrypting ${file.name}...`);
//     const reader = new FileReader();
//     reader.onload = async (ev) => {
//       const { encryptedBuffer, iv } = await encryptFile(ev.target.result, sharedKey);
//       rtc.current.send({ type: 'FILE_TRANSFER', fileData: encryptedBuffer, iv, fileName: file.name, fileType: file.type });
//       addMessage({ text: `Sent: ${file.name}`, sender: 'me', timestamp: Date.now() });
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   return (
//     <main className="h-screen w-full flex items-center justify-center p-0 md:p-6 lg:p-8 selection:bg-indigo-500/30">
//       <motion.div 
//         initial={{ opacity: 0, scale: 0.98 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="w-full h-full max-w-6xl glass-panel rounded-none md:rounded-3xl flex flex-col overflow-hidden relative shadow-2xl"
//       >
//         {/* Modern Header */}
//         <header className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-md z-50">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-indigo-500/20 rounded-xl">
//               <ShieldCheck className="w-6 h-6 text-indigo-400" />
//             </div>
//             <div className="hidden sm:block">
//               <h1 className="text-lg font-bold tracking-tight leading-none text-white">Specter</h1>
//               <span className="text-[10px] text-indigo-300/60 uppercase tracking-widest font-black">End-to-End P2P</span>
//             </div>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-full border border-white/5">
//               <span className={`w-2 h-2 rounded-full ${status === 'CONNECTED' ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]' : 'bg-rose-500'}`} />
//               <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">{status}</span>
//             </div>
//             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg transition-colors md:hidden text-white">
//               {isSidebarOpen ? <X size={20}/> : <Menu size={20}/>}
//             </button>
//           </div>
//         </header>

//         <div className="flex-grow flex overflow-hidden relative">
//           {/* Responsive Sidebar */}
//           <aside className={`absolute md:relative z-40 h-full w-72 border-r border-white/10 bg-[#030712]/95 md:bg-transparent backdrop-blur-xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
//             <div className="p-6 space-y-8 flex flex-col h-full">
//               <div className="space-y-3">
//                 <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Digital Identity</label>
//                 <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 text-indigo-100 shadow-inner">
//                   <Fingerprint className="w-5 h-5 text-indigo-400" />
//                   <span className="text-sm font-mono font-bold tracking-wider">{myIdRef.current}</span>
//                 </div>
//               </div>
//               <div className="flex-grow space-y-4 overflow-hidden">
//                 <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Security Feed</label>
//                 <TerminalLog logs={logs} />
//               </div>
//             </div>
//           </aside>

//           {/* Main Chat Interface */}
//           <div className="flex-grow flex flex-col bg-black/20 relative min-w-0">
//             {status !== 'CONNECTED' && (
//               <ConnectionPanel targetId={targetId} setTargetId={setTargetId} onConnect={handleConnect} disabled={isConnecting} />
//             )}

//             <div className="flex-grow overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar">
//               <AnimatePresence mode="popLayout">
//                 {messages.length === 0 && status === 'CONNECTED' && (
//                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full opacity-20 gap-3 text-white">
//                     <Lock size={40} />
//                     <span className="text-xs uppercase tracking-[0.3em]">Encrypted Channel Active</span>
//                   </motion.div>
//                 )}
//                 {messages.map((msg) => (
//                   <ChatBubble key={msg.timestamp} msg={msg} />
//                 ))}
//               </AnimatePresence>
//             </div>

//             {/* Modern Input Group */}
//             <div className="p-4 md:p-6 bg-white/5 border-t border-white/10 backdrop-blur-md">
//               <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3 items-center">
//                 <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileDrop} />
//                 <button 
//                   type="button" 
//                   onClick={() => fileInputRef.current.click()} 
//                   className="p-3 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-2xl transition-all"
//                   disabled={status !== 'CONNECTED'}
//                 >
//                   <Paperclip size={22} />
//                 </button>
//                 <div className="flex-grow">
//                   <input 
//                     className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600 text-sm text-white" 
//                     placeholder={status === 'CONNECTED' ? "Type a secure message..." : "Awaiting handshake..."} 
//                     value={input} 
//                     onChange={(e) => setInput(e.target.value)} 
//                     disabled={status !== 'CONNECTED'} 
//                   />
//                 </div>
//                 <motion.button 
//                   whileTap={{ scale: 0.95 }}
//                   type="submit" 
//                   disabled={status !== 'CONNECTED' || !input}
//                   className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-500 disabled:opacity-20 shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center"
//                 >
//                   <Send size={20} />
//                 </motion.button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </main>
//   );
// }

// "use client";
// import React, { useEffect, useRef, useState } from 'react';
// import { AnimatePresence, motion } from 'framer-motion';
// import { ShieldCheck, Send, Paperclip, Fingerprint, Menu, X, Lock, Cpu, CheckCircle2 } from 'lucide-react';
// import { useSpecterStore } from '../hooks/useSpecterStore';
// import WebRTCManager from '../lib/WebRTCManager';
// import { encryptData, decryptData, generateSharedKey, exportKey, importKey, encryptFile, decryptFile } from '../lib/crypto';
// import { nanoid } from 'nanoid';

// import ChatBubble from '../components/ChatBubble';
// import ConnectionPanel from '../components/ConnectionPanel';
// import TerminalLog from '../components/TerminalLog';

// export default function SpecterTerminal() {
//   const { messages, logs, status, sharedKey, addMessage, addLog, setStatus, setSharedKey } = useSpecterStore();
//   const [input, setInput] = useState("");
//   const [targetId, setTargetId] = useState("");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isConnecting, setIsConnecting] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);

//   const myIdRef = useRef(nanoid(6).toUpperCase());
//   const rtc = useRef(null);
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     if (!rtc.current) {
//       rtc.current = new WebRTCManager({
//         onLog: (msg) => addLog(msg),
//         onStatusChange: (s) => {
//           setStatus(s);
//           if (s === 'CONNECTED') {
//             setShowSuccess(true);
//             setTimeout(() => setShowSuccess(false), 1800); // Animation duration
//           }
//           if (s === 'IDLE' || s === 'DISCONNECTED') setIsConnecting(false);
//         },
//         onMessage: async (data) => {
//           const currentKey = useSpecterStore.getState().sharedKey;
//           if (data.type === 'KEY_SYNC') {
//             const key = await importKey(data.jwk);
//             setSharedKey(key);
//             addLog("SEC_LAYER: Symmetric Key Synchronized.");
//             return;
//           }
//           if (data.type === 'FILE_TRANSFER') {
//             const decrypted = await decryptFile(data.fileData, data.iv, currentKey);
//             const url = URL.createObjectURL(new Blob([decrypted], { type: data.fileType }));
//             addMessage({ text: `Encrypted File: ${data.fileName}`, fileUrl: url, fileName: data.fileName, sender: 'peer', timestamp: Date.now() });
//             return;
//           }
//           try {
//             const decrypted = await decryptData(data, currentKey);
//             addMessage({ text: decrypted, sender: 'peer', timestamp: Date.now() });
//           } catch (e) { addLog("SEC_ERROR: Decryption Integrity Failure."); }
//         }
//       });
//       rtc.current.init(myIdRef.current);
//     }
//   }, [addLog, setStatus, setSharedKey, addMessage]);

//   const handleConnect = async () => {
//     if (!targetId || status === 'CONNECTED' || isConnecting) return;
//     setIsConnecting(true);
//     const key = await generateSharedKey();
//     const jwk = await exportKey(key);
//     setSharedKey(key);
//     rtc.current.connectToPeer(targetId.toUpperCase());
    
//     const sync = setInterval(() => {
//       if (useSpecterStore.getState().status === 'CONNECTED') {
//         rtc.current.send({ type: 'KEY_SYNC', jwk });
//         clearInterval(sync);
//         setIsConnecting(false);
//       }
//     }, 500);
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!input || status !== 'CONNECTED') return;
//     const text = input;
//     setInput(""); 
//     const encrypted = await encryptData(text, sharedKey);
//     rtc.current.send(encrypted);
//     addMessage({ text, sender: 'me', timestamp: Date.now() });
//   };

//   return (
//     <main className="h-screen w-full flex items-center justify-center p-0 md:p-6 lg:p-8 bg-[#030712] overflow-hidden">
//       <AnimatePresence>
//         {showSuccess && <HandshakeOverlay />}
//       </AnimatePresence>

//       <motion.div 
//         initial={{ opacity: 0, scale: 0.98 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="w-full h-full max-w-6xl glass-panel rounded-none md:rounded-3xl flex flex-col overflow-hidden relative shadow-2xl z-10"
//       >
//         <header className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-md z-50">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-indigo-500/20 rounded-xl">
//               <ShieldCheck className="w-6 h-6 text-indigo-400" />
//             </div>
//             <div>
//               <h1 className="text-lg font-bold tracking-tight text-white leading-none">Specter</h1>
//               <span className="text-[10px] text-indigo-300/60 uppercase tracking-widest font-black">Secure P2P Node</span>
//             </div>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-full border border-white/5">
//               <span className={`w-2 h-2 rounded-full ${status === 'CONNECTED' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
//               <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">{status}</span>
//             </div>
//             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg md:hidden text-white">
//               {isSidebarOpen ? <X size={20}/> : <Menu size={20}/>}
//             </button>
//           </div>
//         </header>

//         <div className="flex-grow flex overflow-hidden">
//           <aside className={`absolute md:relative z-40 h-full w-72 border-r border-white/10 bg-[#030712]/95 md:bg-transparent transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
//             <div className="p-6 space-y-8 flex flex-col h-full">
//               <div className="space-y-3">
//                 <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest opacity-50">Node Identity</label>
//                 <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 text-indigo-100">
//                   <Fingerprint className="w-5 h-5 text-indigo-400" />
//                   <span className="text-sm font-mono font-bold tracking-wider">{myIdRef.current}</span>
//                 </div>
//               </div>
//               <TerminalLog logs={logs} />
//             </div>
//           </aside>

//           <div className="flex-grow flex flex-col bg-black/20 relative min-w-0">
//             {status !== 'CONNECTED' && (
//               <ConnectionPanel targetId={targetId} setTargetId={setTargetId} onConnect={handleConnect} disabled={isConnecting} />
//             )}
//             <div className="flex-grow overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar">
//               <AnimatePresence mode="popLayout">
//                 {messages.length === 0 && status === 'CONNECTED' && (
//                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full opacity-20 gap-3 text-white">
//                     <Lock size={40} />
//                     <span className="text-xs uppercase tracking-[0.3em]">Encrypted Bridge Active</span>
//                   </motion.div>
//                 )}
//                 {messages.map((msg) => <ChatBubble key={msg.timestamp} msg={msg} />)}
//               </AnimatePresence>
//             </div>

//             <form onSubmit={handleSendMessage} className="p-4 md:p-6 bg-white/5 border-t border-white/10">
//               <div className="max-w-4xl mx-auto flex gap-3 items-center">
//                 <button type="button" className="p-3 text-slate-400 hover:text-indigo-400 rounded-xl" disabled={status !== 'CONNECTED'}><Paperclip size={22} /></button>
//                 <input 
//                   className="flex-grow bg-black/40 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-indigo-500/50 text-white text-sm" 
//                   placeholder={status === 'CONNECTED' ? "Write a secure message..." : "Awaiting P2P bridge..."} 
//                   value={input} onChange={(e) => setInput(e.target.value)} disabled={status !== 'CONNECTED'} 
//                 />
//                 <button type="submit" disabled={status !== 'CONNECTED' || !input} className="p-4 bg-indigo-600 text-white rounded-xl shadow-indigo-500/20 shadow-lg transition-all">
//                   <Send size={20} />
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </motion.div>
//     </main>
//   );
// }

// // Particle Handshake Component
// function HandshakeOverlay() {
//   return (
//     <motion.div 
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-[100] bg-[#030712]/90 backdrop-blur-xl flex flex-col items-center justify-center pointer-events-none"
//     >
//       <div className="absolute inset-0 opacity-30">
//         <ParticleBackground />
//       </div>
      
//       <motion.div 
//         initial={{ scale: 0.8, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ type: "spring", damping: 12 }}
//         className="relative z-10 flex flex-col items-center gap-6"
//       >
//         <div className="p-6 bg-indigo-500/20 rounded-full border border-indigo-400/50 shadow-[0_0_50px_rgba(99,102,241,0.3)]">
//           <CheckCircle2 size={60} className="text-emerald-400" />
//         </div>
//         <div className="text-center">
//           <h2 className="text-2xl font-black uppercase tracking-[0.4em] text-white">Bridge_Established</h2>
//           <p className="text-indigo-400 text-[10px] font-bold tracking-[0.2em] mt-2 uppercase">Zero-Knowledge Key Sync Complete</p>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }

// // Canvas-based Particle System
// function ParticleBackground() {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     let particles = [];
    
//     const resize = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     };

//     class Particle {
//       constructor() {
//         this.reset();
//       }
//       reset() {
//         this.x = Math.random() * canvas.width;
//         this.y = Math.random() * canvas.height;
//         this.vx = (Math.random() - 0.5) * 2;
//         this.vy = (Math.random() - 0.5) * 2;
//         this.size = Math.random() * 2;
//       }
//       update() {
//         this.x += this.vx;
//         this.y += this.vy;
//         if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
//         if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
//       }
//       draw() {
//         ctx.fillStyle = '#6366f1';
//         ctx.beginPath();
//         ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
//         ctx.fill();
//       }
//     }

//     const init = () => {
//       particles = Array.from({ length: 100 }, () => new Particle());
//     };

//     const animate = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       particles.forEach(p => {
//         p.update();
//         p.draw();
//       });
//       requestAnimationFrame(animate);
//     };

//     window.addEventListener('resize', resize);
//     resize();
//     init();
//     animate();
    
//     return () => window.removeEventListener('resize', resize);
//   }, []);

//   return <canvas ref={canvasRef} className="w-full h-full" />;
// }









"use client";
import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldCheck, Send, Paperclip, Fingerprint, Menu, X, Lock, Cpu, CheckCircle2 } from 'lucide-react';
import { useSpecterStore } from '../hooks/useSpecterStore';
import WebRTCManager from '../lib/WebRTCManager';
import { encryptData, decryptData, generateSharedKey, exportKey, importKey, encryptFile, decryptFile } from '../lib/crypto';
import { nanoid } from 'nanoid';

import ChatBubble from '../components/ChatBubble';
import ConnectionPanel from '../components/ConnectionPanel';
import TerminalLog from '../components/TerminalLog';

export default function SpecterTerminal() {
  const { messages, logs, status, sharedKey, addMessage, addLog, setStatus, setSharedKey } = useSpecterStore();
  const [input, setInput] = useState("");
  const [targetId, setTargetId] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const myIdRef = useRef(nanoid(6).toUpperCase());
  const rtc = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!rtc.current) {
      rtc.current = new WebRTCManager({
        onLog: (msg) => addLog(msg),
        onStatusChange: (s) => {
          setStatus(s);
          if (s === 'CONNECTED') {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 1200); 
          }
          if (s === 'IDLE' || s === 'DISCONNECTED') setIsConnecting(false);
        },
        onMessage: async (data) => {
          const currentKey = useSpecterStore.getState().sharedKey;
          if (data.type === 'KEY_SYNC') {
            const key = await importKey(data.jwk);
            setSharedKey(key);
            addLog("SEC_LAYER: Symmetric Key Synchronized.");
            return;
          }
          if (data.type === 'FILE_TRANSFER') {
            const decrypted = await decryptFile(data.fileData, data.iv, currentKey);
            const url = URL.createObjectURL(new Blob([decrypted], { type: data.fileType }));
            addMessage({ text: `Encrypted File: ${data.fileName}`, fileUrl: url, fileName: data.fileName, sender: 'peer', timestamp: Date.now() });
            return;
          }
          try {
            const decrypted = await decryptData(data, currentKey);
            addMessage({ text: decrypted, sender: 'peer', timestamp: Date.now() });
          } catch (e) { addLog("SEC_ERROR: Decryption Integrity Failure."); }
        }
      });
      rtc.current.init(myIdRef.current);
    }
  }, [addLog, setStatus, setSharedKey, addMessage]);

  const handleConnect = async () => {
    if (!targetId || status === 'CONNECTED' || isConnecting) return;
    setIsConnecting(true);
    const key = await generateSharedKey();
    const jwk = await exportKey(key);
    setSharedKey(key);
    rtc.current.connectToPeer(targetId.toUpperCase());
    
    const sync = setInterval(() => {
      if (useSpecterStore.getState().status === 'CONNECTED') {
        rtc.current.send({ type: 'KEY_SYNC', jwk });
        clearInterval(sync);
        setIsConnecting(false);
      }
    }, 500);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input || status !== 'CONNECTED') return;
    const text = input;
    setInput(""); 
    const encrypted = await encryptData(text, sharedKey);
    rtc.current.send(encrypted);
    addMessage({ text, sender: 'me', timestamp: Date.now() });
  };

  const handleFileDrop = async (e) => {
    const file = e.target.files[0];
    if (!file || status !== 'CONNECTED') return;
    addLog(`FILE: Encrypting ${file.name}...`);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const { encryptedBuffer, iv } = await encryptFile(ev.target.result, sharedKey);
      rtc.current.send({ type: 'FILE_TRANSFER', fileData: encryptedBuffer, iv, fileName: file.name, fileType: file.type });
      addMessage({ text: `Sent: ${file.name}`, sender: 'me', timestamp: Date.now() });
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <main className="h-screen w-full flex items-center justify-center p-0 md:p-6 lg:p-8 bg-[#030712] overflow-hidden relative">
      
      {/* INFINITE BACKGROUND PARTICLES - Low Density & Subtle */}
      <ParticleBackground />

      <AnimatePresence>
        {showSuccess && <HandshakeOverlay />}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full h-full max-w-6xl glass-panel rounded-none md:rounded-3xl flex flex-col overflow-hidden relative shadow-2xl z-10"
      >
        <header className="px-4 py-4 md:px-6 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-md z-50">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-xl">
              <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-indigo-400" />
            </div>
            <div className="hidden xs:block">
              <h1 className="text-md md:text-lg font-bold tracking-tight text-white leading-none">Specter</h1>
              <span className="text-[9px] md:text-[10px] text-indigo-300/60 uppercase tracking-widest font-black">Secure P2P Node</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-100">
                <Fingerprint className="w-4 h-4 text-indigo-400 hidden sm:block" />
                <span className="text-[11px] md:text-xs font-mono font-bold tracking-wider">{myIdRef.current}</span>
             </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-full border border-white/5">
              <span className={`w-2 h-2 rounded-full ${status === 'CONNECTED' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-slate-300 hidden sm:inline">{status}</span>
            </div>
            
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg text-white">
              {isSidebarOpen ? <X size={20}/> : <Menu size={20}/>}
            </button>
          </div>
        </header>

        <div className="flex-grow flex overflow-hidden">
          <aside className={`absolute md:relative z-40 h-full w-72 border-r border-white/10 bg-[#030712]/95 md:bg-transparent transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            <div className="p-6 flex flex-col h-full">
              <div className="flex-grow space-y-4 overflow-hidden">
                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest opacity-50">Security Feed</label>
                <TerminalLog logs={logs} />
              </div>
            </div>
          </aside>

          <div className="flex-grow flex flex-col bg-black/20 relative min-w-0">
            {status !== 'CONNECTED' && (
              <ConnectionPanel targetId={targetId} setTargetId={setTargetId} onConnect={handleConnect} disabled={isConnecting} />
            )}
            <div className="flex-grow overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {messages.length === 0 && status === 'CONNECTED' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full opacity-20 gap-3 text-white">
                    <Lock size={40} />
                    <span className="text-xs uppercase tracking-[0.3em]">Encrypted Bridge Active</span>
                  </motion.div>
                )}
                {messages.map((msg) => <ChatBubble key={msg.timestamp} msg={msg} />)}
              </AnimatePresence>
            </div>

            <form onSubmit={handleSendMessage} className="p-4 md:p-6 bg-white/5 border-t border-white/10">
              <div className="max-w-4xl mx-auto flex gap-3 items-center">
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileDrop} />
                <button type="button" onClick={() => fileInputRef.current.click()} className="p-3 text-slate-400 hover:text-indigo-400 rounded-xl" disabled={status !== 'CONNECTED'}><Paperclip size={22} /></button>
                <input 
                  className="flex-grow bg-black/40 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-indigo-500/50 text-white text-sm" 
                  placeholder={status === 'CONNECTED' ? "Write a secure message..." : "Awaiting P2P bridge..."} 
                  value={input} onChange={(e) => setInput(e.target.value)} disabled={status !== 'CONNECTED'} 
                />
                <button type="submit" disabled={status !== 'CONNECTED' || !input} className="p-4 bg-indigo-600 text-white rounded-xl shadow-indigo-500/20 shadow-lg transition-all">
                  <Send size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

function HandshakeOverlay() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] bg-[#030712]/40 backdrop-blur-xl flex flex-col items-center justify-center pointer-events-none p-4"
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 200 }}
        className="relative z-10 flex flex-col items-center gap-4 md:gap-6"
      >
        <div className="p-4 md:p-6 bg-indigo-500/20 rounded-full border border-indigo-400/50 shadow-[0_0_50px_rgba(99,102,241,0.3)]">
          <CheckCircle2 className="w-10 h-10 md:w-16 md:h-16 text-emerald-400" />
        </div>
        
        <div className="text-center px-4">
          <h2 className="text-lg md:text-2xl font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-white">
            Bridge_Established
          </h2>
          <p className="text-indigo-400 text-[8px] md:text-[10px] font-bold tracking-[0.1em] md:tracking-[0.2em] mt-2 uppercase">
            Zero-Knowledge Key Sync Complete
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Persistant Ambient Particle Background
 * Optimized for low battery drain and subtle UI
 */
function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        // Very slow ambient movement
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * (window.innerWidth < 768 ? 1.2 : 2.0);
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
      draw() {
        // Very low opacity fill for subtle background effect
        ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => { 
      // Low particle count for "less is more" feel
      const count = window.innerWidth < 768 ? 20 : 45;
      particles = Array.from({ length: count }, () => new Particle()); 
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', () => {
      resize();
      init();
    });
    
    resize();
    init();
    animate();
    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}