// import { Terminal as TerminalIcon } from 'lucide-react';

// export default function TerminalLog({ logs }) {
//   return (
//     <div className="w-full md:w-72 bg-black/80 p-4 border-t md:border-t-0 md:border-l border-emerald-900/30 overflow-y-auto custom-scrollbar">
//       <div className="flex items-center gap-2 text-emerald-800 mb-4 border-b border-emerald-900/20 pb-2">
//         <TerminalIcon size={14} />
//         <span className="text-xs font-bold tracking-[0.2em] uppercase">Security_Kernel</span>
//       </div>
      
//       <div className="space-y-3">
//         {logs.map((log, i) => (
//           <div key={i} className="flex flex-col gap-1">
//             <span className="text-[9px] text-emerald-900 font-bold">
//               [{new Date().toLocaleTimeString()}]
//             </span>
//             <span className={`text-[10px] leading-tight ${
//               log.includes('ERROR') ? 'text-red-500' : 
//               log.includes('PACKET') ? 'text-blue-400' : 'text-emerald-600/80'
//             }`}>
//               {log}
//             </span>
//           </div>
//         ))}
//         {logs.length === 0 && (
//           <span className="text-[10px] text-emerald-950 italic">Awaiting kernel events...</span>
//         )}
//       </div>
//     </div>
//   );
// }








import { useEffect, useRef } from 'react';

export default function TerminalLog({ logs }) {
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-black/20 rounded-2xl border border-white/5 overflow-hidden">
      <div className="p-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Kernel_Monitor</span>
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-slate-700" />
          <div className="w-1 h-1 rounded-full bg-slate-700" />
        </div>
      </div>
      
      <div className="flex-grow p-4 overflow-y-auto font-mono text-[9px] space-y-2 custom-scrollbar">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-2 leading-relaxed">
            <span className="text-indigo-500/40">[{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}]</span>
            <span className={log.includes('ERROR') ? 'text-rose-400/80' : 'text-slate-400'}>{log}</span>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}