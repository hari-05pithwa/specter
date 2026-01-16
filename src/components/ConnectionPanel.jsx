// import { Zap, ShieldAlert } from 'lucide-react';

// export default function ConnectionPanel({ targetId, setTargetId, onConnect }) {
//   return (
//     <div className="p-6 border-b border-emerald-900/20 bg-emerald-900/5">
//       <div className="flex items-center gap-3 mb-4 opacity-70">
//         <ShieldAlert size={16} />
//         <span className="text-[10px] uppercase tracking-widest">Handshake Required for P2P Bridge</span>
//       </div>
//       <div className="flex gap-2">
//         <input 
//           type="text" 
//           placeholder="ENTER TARGET_ID" 
//           className="bg-black border border-emerald-900 p-2 flex-grow text-emerald-500 outline-none uppercase"
//           value={targetId}
//           onChange={(e) => setTargetId(e.target.value)}
//         />
//         <button 
//           onClick={onConnect}
//           className="bg-emerald-600 text-black px-6 font-bold flex items-center gap-2 hover:bg-emerald-400"
//         >
//           <Zap size={14} /> INITIALIZE
//         </button>
//       </div>
//     </div>
//   );
// }





import { Globe, ArrowRight, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ConnectionPanel({ targetId, setTargetId, onConnect, disabled }) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-[#030712]/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 glass-panel rounded-3xl space-y-6 text-center shadow-indigo-500/10 shadow-2xl"
      >
        <div className="inline-flex p-4 bg-indigo-500/10 rounded-2xl text-indigo-400">
          <Globe className="w-8 h-8 animate-pulse" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white tracking-tight">Establish P2P Bridge</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Enter a target Node ID to initiate a zero-knowledge, encrypted tunnel.
          </p>
        </div>

        <input 
          type="text"
          placeholder="ENTER TARGET_ID..."
          className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-center text-sm font-mono tracking-[0.3em] uppercase outline-none focus:border-indigo-500/50 transition-all text-indigo-100"
          value={targetId}
          onChange={(e) => setTargetId(e.target.value.toUpperCase())}
          maxLength={6}
        />

        <button 
          onClick={onConnect}
          disabled={disabled || targetId.length < 3}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-20 shadow-lg shadow-indigo-500/20"
        >
          {disabled ? "Handshaking..." : "Initialize Bridge"}
          <ArrowRight size={18} />
        </button>

        <div className="flex items-center justify-center gap-2 text-[9px] text-slate-600 uppercase font-black">
          <ShieldAlert size={12} /> No Data is Stored on Servers
        </div>
      </motion.div>
    </div>
  );
}