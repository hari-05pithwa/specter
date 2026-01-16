// // components/ChatBubble.jsx
// import { motion } from 'framer-motion';
// import { useEffect, useState } from 'react';
// import { Clock, Download, FileText } from 'lucide-react';

// const DESTRUCT_TIME = 30;

// export default function ChatBubble({ msg }) {
//   const [timeLeft, setTimeLeft] = useState(DESTRUCT_TIME);
//   const [isExpired, setIsExpired] = useState(false);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => { 
//         if (prev <= 1) { 
//           setIsExpired(true); 
//           return 0; 
//         } 
//         return prev - 1; 
//       });
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   if (isExpired) return null;

//   return (
//     <motion.div 
//       initial={{ opacity: 0, x: msg.sender === 'me' ? 20 : -20 }} 
//       animate={{ opacity: 1, x: 0 }} 
//       exit={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }} 
//       className={`flex flex-col w-full ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
//     >
//       <div className={`max-w-[85%] p-3 rounded border backdrop-blur-xl relative overflow-hidden ${
//         msg.sender === 'me' 
//           ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100' 
//           : 'bg-zinc-900/80 border-emerald-900/50 text-emerald-500'
//       }`}>
//         <p className="text-sm break-words whitespace-pre-wrap">{msg.text}</p>
        
//         {msg.fileUrl && (
//           <a 
//             href={msg.fileUrl} 
//             download={msg.fileName} 
//             className="mt-3 p-2 bg-black/40 border border-emerald-500/20 rounded flex items-center gap-3 hover:bg-emerald-500/10 transition-all cursor-pointer no-underline group"
//           >
//             <FileText size={18} className="text-emerald-500" />
//             <div className="flex flex-col overflow-hidden">
//               <span className="text-[10px] text-emerald-300 truncate font-bold">{msg.fileName}</span>
//               <span className="text-[8px] flex items-center gap-1 uppercase text-emerald-600 font-black">
//                 <Download size={8} /> Decrypted_Download
//               </span>
//             </div>
//           </a>
//         )}
        
//         <div 
//           className="absolute bottom-0 left-0 h-[1px] bg-emerald-500/60" 
//           style={{ width: `${(timeLeft / DESTRUCT_TIME) * 100}%` }} 
//         />
//       </div>
//       <div className="flex items-center gap-1 mt-1 text-[8px] uppercase tracking-[0.2em] opacity-60 italic">
//         <Clock size={8} /> REDACTION: {timeLeft}S
//       </div>
//     </motion.div>
//   );
// }









import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Clock, Download, FileCode, CheckCheck } from 'lucide-react';

const DESTRUCT_TIME = 30;

export default function ChatBubble({ msg }) {
  const [timeLeft, setTimeLeft] = useState(DESTRUCT_TIME);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (isExpired) return null;
  const isMe = msg.sender === 'me';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: isMe ? 20 : -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
      className={`flex flex-col w-full ${isMe ? 'items-end' : 'items-start'}`}
    >
      <div className={`relative max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-xl backdrop-blur-md border ${
        isMe ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-50' : 'bg-white/5 border-white/10 text-slate-200'
      }`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
        
        {msg.fileUrl && (
          <a href={msg.fileUrl} download={msg.fileName} className="mt-3 flex items-center gap-3 p-3 bg-black/20 rounded-xl border border-white/5 hover:bg-indigo-500/20 transition-all group no-underline">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><FileCode size={18} /></div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-[11px] font-semibold truncate text-slate-200">{msg.fileName}</span>
              <span className="text-[9px] uppercase tracking-tighter text-indigo-400 font-bold flex items-center gap-1"><Download size={10} /> Secure Download</span>
            </div>
          </a>
        )}

        <div className="absolute bottom-0 left-0 h-[2px] bg-indigo-500/40 transition-all duration-1000 ease-linear" style={{ width: `${(timeLeft / DESTRUCT_TIME) * 100}%` }} />
      </div>
      <div className="flex items-center gap-2 mt-1.5 px-1 opacity-40">
        <span className="text-[9px] font-bold tracking-widest uppercase flex items-center gap-1 text-slate-400"><Clock size={10} /> {timeLeft}s</span>
        {isMe && <CheckCheck size={12} className="text-indigo-400" />}
      </div>
    </motion.div>
  );
}