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

// Replace JSX from return statement downwards
const jsxStart = content.indexOf('return (');
const updatedJsx = `return (
    <div className="bg-white rounded-3xl text-slate-800 p-6 sm:p-8 shadow-sm relative overflow-hidden border border-slate-200/90">
      {/* Decorative background glow circles */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-agri-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10 border-b border-slate-100 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-agri-100 border border-agri-200/40 flex items-center justify-center text-agri-700">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold tracking-wider text-agri-700 uppercase">
                {t('liveQueueDominant')}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-ping" />
                LIVE
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Pune District APMC Procurement Mandi
            </h2>
          </div>
        </div>

        {/* Token Badge */}
        <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 flex items-center space-x-3 shadow-sm">
          <div className="text-right">
            <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Currently Processing</div>
            <div className="text-xl sm:text-2xl font-black text-agri-700 tracking-tight">
              {getClosestProcessingToken()}
            </div>
          </div>
        </div>
      </div>

      {/* Main 4 Telemetry Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6 relative z-10">
        {/* Metric 1: People Ahead */}
        <div className="bg-slate-50/80 border border-slate-200 hover:border-agri-300 transition-all rounded-2xl p-4 sm:p-5 flex flex-col justify-between backdrop-blur-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">{t('peopleAhead')}</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{peopleAhead}</span>
            <span className="text-xs text-slate-500">farmers</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 flex items-center space-x-1 border-t border-slate-200/80 pt-2">
            {congestion === 'HIGH' || congestion === 'CRITICAL' ? (
              <span className="text-rose-600 font-medium leading-tight">More farmers arriving right now.</span>
            ) : (
              <span className="text-emerald-600 font-medium leading-tight">Queue is moving steadily.</span>
            )}
          </div>
        </div>

        {/* Metric 2: Active Counters */}
        <div className="bg-slate-50/80 border border-slate-200 hover:border-agri-300 transition-all rounded-2xl p-4 sm:p-5 flex flex-col justify-between backdrop-blur-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">{t('activeCounters')}</span>
            <Compass className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{activeCounters}</span>
            <span className="text-xs text-slate-500">/ 6 active</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 flex items-center space-x-1 border-t border-slate-200/80 pt-2">
            <span className="leading-tight">Counters processing actively.</span>
          </div>
        </div>

        {/* Metric 3: Estimated Waiting Time */}
        <div className="bg-gradient-to-br from-agri-50 to-emerald-50 border border-agri-300/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-agri-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t('estimatedWait')}</span>
            <Clock className="w-4 h-4 text-agri-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-agri-900 tracking-tight">
              {estimatedWaitMin}
            </span>
            <span className="text-xs text-agri-700 font-semibold">{t('minutes')}</span>
            
            {/* Visual ETA Change Indicator */}
            {etaChange !== 0 && (
              <div className={\`flex items-center text-xs font-bold px-1.5 py-0.5 rounded animate-bounce \${etaChange < 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}\`}>
                {etaChange < 0 ? <ArrowDown className="w-3 h-3 mr-0.5"/> : <ArrowUp className="w-3 h-3 mr-0.5"/>}
                {Math.abs(etaChange)}m
              </div>
            )}
          </div>
          <div className="mt-3 text-[11px] text-agri-700/90 flex items-center space-x-1 border-t border-agri-200/70 pt-2 font-semibold">
            <span>Powered by AI Analysis</span>
          </div>
        </div>

        {/* Metric 4: Recommended Arrival & Congestion */}
        <div className="bg-slate-50/80 border border-slate-200 hover:border-agri-300 transition-all rounded-2xl p-4 sm:p-5 flex flex-col justify-between backdrop-blur-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">{t('recommendedArrival')}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {recommendedArrival}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-200/80 pt-2">
            <span className="text-[11px] text-slate-500">Queue Status:</span>
            <span className={\`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border \${badge.bg}\`}>
              <span className={\`w-1.5 h-1.5 rounded-full mr-1 \${badge.dot}\`} />
              {badge.text}
            </span>
          </div>
        </div>
      </div>

      {/* Smart Intelligence Callout Bar */}
      <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-start sm:items-center space-x-3">
          <div className="p-2 rounded-xl bg-agri-100 text-agri-700 mt-0.5 sm:mt-0">
            <AlertCircle className="w-4 h-4" />
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            <strong className="text-slate-900 font-bold">Smart Recommendation:</strong> Avoid waiting in the sun. Based on {peopleAhead} farmers ahead of you and {activeCounters} active counters, plan your arrival for <span className="text-agri-700 font-bold">{recommendedArrival}</span>.
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs text-agri-600 font-bold hidden md:inline">"The Queue Comes To You"</span>
        </div>
      </div>
    </div>
  );
}`;

content = content.substring(0, jsxStart) + updatedJsx;

fs.writeFileSync('client/src/components/LiveQueueRadar.jsx', content);
console.log('Fixed LiveQueueRadar.jsx');
