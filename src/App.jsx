import React, { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  Terminal,
  Activity,
  ShieldAlert,
  Handshake,
  Database,
  Cpu,
  Zap,
  Lock,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Mock Data & Constants ---
const INITIAL_AGENTS = [
  { id: 'AG-882', task: 'DeFi Arbitrage', status: 'autonomous', health: 98, logs: ['Scanning liquidity pools...', 'Path found: ETH -> USDC -> FIL'] },
  { id: 'AG-104', task: 'Patient Triage', status: 'autonomous', health: 92, logs: ['Analyzing symptoms...', 'Checking medical history...'] },
  { id: 'AG-449', task: 'Fleet Delivery', status: 'stalled', health: 45, logs: ['Target reached.', 'Error: Obstruction at Gate 4. PIN required.'] },
];

const uptimeData = Array.from({ length: 24 }, (_, i) => {
  const hoursAgo = 23 - i;
  return {
    time: `${hoursAgo}h`,
    uptime: 98 + Math.random() * 2 // between 98 and 100
  };
});

const App = () => {
  const { isConnected } = useAccount();
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [activeIntervention, setActiveIntervention] = useState(null);
  const [walletBalance, setWalletBalance] = useState(124.50);
  const [cidHistory, setCidHistory] = useState([
    { id: 'log_01', type: 'Training Data', cid: 'bafybeigdyrzt5sfp7udm7hu76uh7y', date: '2 mins ago' }
  ]);
  const [notifications, setNotifications] = useState([]);
  const [walletConnected, setWalletConnected] = useState(false);

  // --- Logic: Simulation Loop ---
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly stall an agent to trigger a "Handshake"
      setAgents(prev => prev.map(a => {
        if (a.status === 'autonomous' && Math.random() > 0.95) {
          addNotification(`Agent ${a.id} requires manual override!`, 'warning');
          return { ...a, status: 'stalled', health: 40, logs: [...a.logs, 'CRITICAL: Ambiguous state reached. Requesting Human Handshake...'] };
        }
        return a;
      }));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const addNotification = (msg, type) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  };

  const handleResolve = (agentId, solution) => {
    const newCid = `bafy...${Math.random().toString(36).substring(7)}`;

    setAgents(prev => prev.map(a =>
      a.id === agentId
        ? { ...a, status: 'autonomous', health: 100, logs: [...a.logs, `Human override: ${solution}`, 'Handshake complete. Resuming...'] }
        : a
    ));

    setCidHistory(prev => [{ id: `log_${Date.now()}`, type: 'Override Memory', cid: newCid, date: 'Just now' }, ...prev]);
    setWalletBalance(prev => prev + 5.00);
    setActiveIntervention(null);
    addNotification(`Task resolved. 5.00 FIL credited to wallet.`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Header / Top Nav */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
              <Handshake className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase italic">
              Agentic <span className="text-blue-500">Handshake</span>
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
              <Database className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-mono text-slate-400">FILECOIN: CONNECTED</span>
            </div>
            <ConnectButton />
            <div className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-lg">
              <span className="text-xs text-blue-400 font-medium uppercase tracking-wider">Rewards</span>
              <span className="text-sm font-mono font-bold text-white">{walletBalance.toFixed(2)} FIL</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-screen">

        {/* Left Column: Active Agents */}
        <section className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Fleet Status
            </h2>
            <span className="text-xs text-slate-500">Monitoring {agents.length} Active Nodes</span>
          </div>

          <div className="grid gap-4">
            {agents.map(agent => (
              <div
                key={agent.id}
                className={`p-5 rounded-xl border transition-all duration-300 ${agent.status === 'stalled'
                  ? 'bg-red-500/5 border-red-500/30 shadow-lg shadow-red-500/5'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${agent.status === 'stalled' ? 'bg-red-500/20' : 'bg-slate-800'}`}>
                      <Cpu className={`w-6 h-6 ${agent.status === 'stalled' ? 'text-red-400' : 'text-blue-400'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-slate-400 uppercase tracking-tighter">{agent.id}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-widest ${agent.status === 'stalled' ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-500/10 text-emerald-500'
                          }`}>
                          {agent.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white">{agent.task}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Health</p>
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${agent.health > 80 ? 'bg-emerald-500' : 'bg-red-500'}`}
                          style={{ width: `${agent.health}%` }}
                        />
                      </div>
                    </div>
                    {agent.status === 'stalled' && (
                      <button
                        onClick={() => setActiveIntervention(agent)}
                        className="bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-red-600/20 transition-all active:scale-95 flex items-center gap-2"
                      >
                        <Zap className="w-4 h-4" />
                        INTERVENE
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-black/40 rounded-lg border border-slate-800/50 font-mono text-[11px] text-slate-400 space-y-1">
                  {agent.logs.map((log, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-slate-600">[{i}]</span>
                      <span className={log.includes('CRITICAL') ? 'text-red-400' : ''}>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Global Ledger (Web3 Feed) */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col h-full overflow-hidden">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-emerald-500" />
              Sovereign Ledger
            </h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Every handshake is archived on Filecoin as a cryptographic memory for future training.
            </p>

            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {cidHistory.map(item => (
                <div key={item.id} className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 group hover:border-blue-500/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-400/10 px-2 py-0.5 rounded">
                      {item.type}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono italic">{item.date}</span>
                  </div>
                  <p className="text-xs font-mono text-slate-300 break-all mb-3 bg-slate-900 p-2 rounded">
                    CID: {item.cid}
                  </p>
                  <button className="text-[10px] text-slate-500 group-hover:text-blue-400 flex items-center gap-1 font-bold uppercase tracking-widest transition-colors">
                    <ExternalLink className="w-3 h-3" />
                    Verify on Filecoin
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-slate-800 space-y-4">
              <div className="bg-blue-600/5 p-4 rounded-xl border border-blue-500/20">
                <div className="flex items-center gap-3 text-blue-400 mb-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase">AI Ethics Guardrail</span>
                </div>
                <p className="text-xs text-slate-400">
                  Verification protocol active. Human oversight required for 10.4% of current fleet ops.
                </p>
              </div>
            </div>
          </div>

          {/* Agent Uptime Chart */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col flex-1 min-h-96">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 shrink-0">
              <Activity className="w-5 h-5 text-blue-500" />
              Agent Uptime (24h)
            </h2>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={uptimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" fontSize={10} />
                <YAxis stroke="#9ca3af" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="uptime" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </aside>
      </main>

      {/* Intervention Modal */}
      {activeIntervention && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-red-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-white" />
                <h3 className="text-lg font-bold text-white tracking-wide">EMERGENCY OVERRIDE: {activeIntervention.id}</h3>
              </div>
              <button onClick={() => setActiveIntervention(null)} className="text-white hover:bg-white/10 p-1 rounded transition-colors">
                <Activity className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-black/40 rounded-xl p-4 border border-slate-800 font-mono text-sm text-blue-300 mb-6">
                <div className="flex items-start gap-2 mb-2">
                  <ChevronRight className="w-4 h-4 mt-1 shrink-0" />
                  <p><span className="text-slate-500">context:</span> {activeIntervention.task}</p>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-1 shrink-0" />
                  <p><span className="text-slate-500">current_error:</span> <span className="text-red-400 underline decoration-red-400/30">Ambiguous state detected at coordinate 44.2.0. Manual validation required to proceed.</span></p>
                </div>
              </div>

              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-2 tracking-widest">
                Resolution Input (Handshake Payload)
              </label>
              <textarea
                autoFocus
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white font-mono text-sm focus:outline-none focus:border-blue-500/50 transition-colors mb-4 placeholder:text-slate-700"
                rows={4}
                placeholder="Enter instructions or code to resolve the agent deadlock..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.metaKey) handleResolve(activeIntervention.id, e.target.value);
                }}
              />

              <div className="flex items-center justify-between">
                <p className="text-[10px] text-slate-500 flex items-center gap-1 italic">
                  <Lock className="w-3 h-3" />
                  Resolution will be cryptographically signed by your wallet.
                </p>
                <button
                  onClick={() => handleResolve(activeIntervention.id, "Override submitted via dashboard.")}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                  RESOLVE & SIGN
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
        {notifications.map(n => (
          <div key={n.id} className={`flex items-center gap-3 px-6 py-3 rounded-full border shadow-2xl animate-in slide-in-from-bottom-5 duration-300 ${n.type === 'warning' ? 'bg-red-500/10 border-red-500/50 text-red-200' : 'bg-emerald-500/10 border-emerald-500/50 text-emerald-200'
            }`}>
            {n.type === 'warning' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span className="text-sm font-medium tracking-tight">{n.msg}</span>
          </div>
        ))}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>
    </div>
  );
};

export default App;