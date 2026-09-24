const fs = require('fs');
let content = fs.readFileSync('client/src/components/LiveQueueRadar.jsx', 'utf8');

// Add getClosestProcessingToken
content = content.replace(
  /const badge = getCongestionBadge\(congestion\);/,
  `const badge = getCongestionBadge(congestion);

  const getClosestProcessingToken = () => {
    if (!queueState?.processingTokens || queueState.processingTokens.length === 0) return 'None';
    
    // Extract numerical part of hero token (e.g., "A-127" -> 127)
    const heroTarget = heroToken?.tokenNumber ? parseInt(heroToken.tokenNumber.replace(/\\D/g, ''), 10) : 127;
    
    let closestToken = queueState.processingTokens[0].tokenNumber;
    let minDiff = Infinity;
    
    for (const pt of queueState.processingTokens) {
      const ptNum = parseInt(pt.tokenNumber.replace(/\\D/g, ''), 10);
      if (!isNaN(ptNum)) {
        const diff = Math.abs(heroTarget - ptNum);
        if (diff < minDiff) {
          minDiff = diff;
          closestToken = pt.tokenNumber;
        }
      }
    }
    return closestToken;
  };`
);

// Theme fixes using replacements
content = content.replace(
  'bg-gradient-to-br from-slate-900 via-slate-800 to-agri-950 rounded-3xl text-white p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-slate-700/50',
  'bg-white rounded-3xl text-slate-800 p-6 sm:p-8 shadow-sm relative overflow-hidden border border-slate-200/90'
);

content = content.replace(
  'bg-agri-500/20 rounded-full blur-3xl',
  'bg-agri-100/50 rounded-full blur-3xl'
);
content = content.replace(
  'bg-blue-500/10 rounded-full blur-3xl',
  'bg-blue-50/50 rounded-full blur-3xl'
);

content = content.replace(
  'relative z-10 border-b border-slate-700/60 pb-5',
  'relative z-10 border-b border-slate-100 pb-5'
);

content = content.replace(
  'bg-agri-500/20 border border-agri-400/40 flex items-center justify-center text-agri-400',
  'bg-agri-100 border border-agri-200/40 flex items-center justify-center text-agri-700'
);

content = content.replace(
  'text-xs font-semibold tracking-wider text-agri-400 uppercase',
  'text-xs font-semibold tracking-wider text-agri-700 uppercase'
);

content = content.replace(
  'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30',
  'bg-emerald-100 text-emerald-800 border border-emerald-200'
);

content = content.replace(
  'bg-emerald-400 mr-1 animate-ping',
  'bg-emerald-500 mr-1 animate-ping'
);

content = content.replace(
  'font-extrabold text-white',
  'font-extrabold text-slate-900'
);

content = content.replace(
  'bg-slate-800/90 border border-slate-600/60 rounded-2xl px-4 py-2 flex items-center space-x-3 shadow-inner',
  'bg-white border border-slate-200 rounded-2xl px-4 py-2 flex items-center space-x-3 shadow-sm'
);

content = content.replace(
  'text-[10px] font-medium text-slate-400 uppercase tracking-wider',
  'text-[10px] font-medium text-slate-500 uppercase tracking-wider'
);

content = content.replace(
  'text-xl sm:text-2xl font-black text-amber-400 tracking-tight',
  'text-xl sm:text-2xl font-black text-agri-700 tracking-tight'
);

content = content.replace(
  "{queueState?.processingTokens?.[0]?.tokenNumber || 'None'}",
  "{getClosestProcessingToken()}"
);

// Metrics container replacement
content = content.replace(/bg-slate-800\/60 border border-slate-700\/70 hover:border-agri-500\/50 transition-all rounded-2xl p-4 sm:p-5 flex flex-col justify-between backdrop-blur-xs/g, 'bg-slate-50/80 border border-slate-200 hover:border-agri-300 transition-all rounded-2xl p-4 sm:p-5 flex flex-col justify-between backdrop-blur-xs');

content = content.replace(/text-slate-400/g, 'text-slate-500');
content = content.replace(/text-white/g, 'text-slate-900');
content = content.replace(/border-slate-700\/50/g, 'border-slate-200/80');

content = content.replace('text-blue-400', 'text-blue-500');
content = content.replace('text-purple-400', 'text-purple-500');
content = content.replace('text-emerald-400', 'text-emerald-500');

content = content.replace('text-rose-300', 'text-rose-600 font-medium');
content = content.replace('text-emerald-300', 'text-emerald-600 font-medium');

// ETA Metric
content = content.replace(
  'bg-gradient-to-br from-agri-950/80 to-slate-800/80 border border-agri-500/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-lg glow-green backdrop-blur-xs relative overflow-hidden',
  'bg-gradient-to-br from-agri-50 to-emerald-50 border border-agri-300/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm relative overflow-hidden'
);

content = content.replace('text-agri-300 mb-2', 'text-agri-800 mb-2');
content = content.replace('text-agri-400', 'text-agri-600');
content = content.replace('text-agri-300 tracking-tight', 'text-agri-900 tracking-tight');
content = content.replace('text-agri-400 font-semibold', 'text-agri-700 font-semibold');

content = content.replace('bg-emerald-500/20 text-emerald-400', 'bg-emerald-100 text-emerald-700');
content = content.replace('bg-rose-500/20 text-rose-400', 'bg-rose-100 text-rose-700');

content = content.replace('text-agri-300/80', 'text-agri-700/90 font-semibold');
content = content.replace('border-agri-700/40', 'border-agri-200/70');

// Metric 4
content = content.replace('text-amber-400 tracking-tight', 'text-slate-900 tracking-tight');

// Callout
content = content.replace(
  'bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10',
  'bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10'
);

content = content.replace('bg-agri-500/20 text-agri-400', 'bg-agri-100 text-agri-700');
content = content.replace('text-slate-300', 'text-slate-600');
content = content.replace('text-amber-400 font-bold', 'text-agri-700 font-bold');
content = content.replace('text-xs text-agri-400 font-medium', 'text-xs text-agri-600 font-bold');

fs.writeFileSync('client/src/components/LiveQueueRadar.jsx', content);
console.log('Fixed LiveQueueRadar.jsx gracefully');
