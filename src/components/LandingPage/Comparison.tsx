import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Zap, Terminal, Activity, Monitor, Cpu, Layers } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type LogEntry = {
  id: string;
  text: string;
  time: string;
};

type Packet = {
  id: string;
};

const LOG_DATA = [
    "[DEBUG] Zombie spawned (ID: 402)",
    "[DEBUG] Zombie equiped minecraft:diamond_sword",
    "[DEBUG] Zombie equiped minecraft:iron_helmet",
    "[DEBUG] Zombie teleported (x: 100, y: 64, z: 712)",
    "[DEBUG] Zombie walk (x: 114, y: 65, z: 713)",
];

const ConsoleDemo = () => {
    const isMounted = useRef(true);

    const [vanillaLogs, setVanillaLogs] = useState<LogEntry[]>([]);
    const [pulseLogs, setPulseLogs] = useState<LogEntry[]>([]);
    const [flyingPacketsV, setFlyingPacketsV] = useState<Packet[]>([]);
    const [pulseBeam, setPulseBeam] = useState(false);

    useEffect(() => {
        isMounted.current = true;

        const runSimulation = async () => {
            while (isMounted.current) {
                setVanillaLogs([]);
                setPulseLogs([]);
                setFlyingPacketsV([]);
                setPulseBeam(false);

                await new Promise(r => setTimeout(r, 500));
                if (!isMounted.current) break;

                for (let i = 0; i < LOG_DATA.length; i++) {
                    if (!isMounted.current) break;

                    const packetId = `pkt-${crypto.randomUUID()}-${i}`;
                    setFlyingPacketsV(prev => [...prev, { id: packetId }]);

                    await new Promise(r => setTimeout(r, 300));
                    if (!isMounted.current) break;

                    const newLog: LogEntry = {
                        id: `log-v-${crypto.randomUUID()}-${i}`,
                        text: LOG_DATA[i],
                        time: new Date().toLocaleTimeString('en-US', { hour12: false })
                    };

                    setVanillaLogs(prev => {
                        if (prev.some(l => l.text === newLog.text)) return prev;
                        return [...prev, newLog];
                    });
                    
                    setFlyingPacketsV(prev => prev.filter(p => p.id !== packetId));

                    await new Promise(r => setTimeout(r, 150));
                }

                if (!isMounted.current) break;

                await new Promise(r => setTimeout(r, 1000));
                if (!isMounted.current) break;

                setPulseBeam(true);

                await new Promise(r => setTimeout(r, 600));
                if (!isMounted.current) break;

                const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });
                const batchLogs = LOG_DATA.map((text, idx) => ({
                    id: `log-p-${crypto.randomUUID()}-${idx}`,
                    text,
                    time: currentTime
                }));

                setPulseLogs(batchLogs);
                setPulseBeam(false);

                await new Promise(r => setTimeout(r, 3000));
            }
        };

        runSimulation();

        return () => {
            isMounted.current = false;
        }; 
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full mt-12">

            <div className="bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col gap-4 overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 font-mono text-xs">VANILLA (PAPER)</span>
                    <Activity size={14} className="text-[#ff2929]" />
                </div>
                
                <div className="flex items-center justify-between px-4 h-20 relative">
                    <div className="z-10 bg-black border border-gray-700 p-2 rounded-lg">
                        <Server size={20} className="text-gray-400" />
                    </div>

                    <div className="flex-1 relative h-full mx-4 overflow-hidden">
                        <div className="absolute top-1/2 w-full h-[1px] bg-gray-800" />
                        <AnimatePresence mode="popLayout">
                            {flyingPacketsV.map((packet) => (
                                <motion.div
                                    key={packet.id}
                                    initial={{ left: "0%", opacity: 1 }}
                                    animate={{ left: "100%", opacity: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "linear" }}
                                    className="absolute top-1/2 -mt-1.5 w-3 h-3 bg-[#ff2929] rounded-full shadow-[0_0_10px_#ff2929]"
                                />
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="z-10 bg-black border border-gray-700 p-2 rounded-lg text-gray-400">
                        <Monitor />
                    </div>
                </div>

                <div className="h-44 bg-[#0a0a0a] rounded border border-white/5 p-3 font-mono text-[10px] md:text-xs text-green-400/80 overflow-hidden font-bold shadow-inner flex flex-col">
                    <div className="opacity-50 mb-2 border-b border-white/5 pb-1 shrink-0">user@client:~$ tail -f network.log</div>
                    <div className="flex flex-col justify-end min-h-0">
                        {vanillaLogs.map((log) => (
                            <motion.div 
                                key={log.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-1 text-red-400 whitespace-nowrap overflow-hidden text-ellipsis"
                            >
                                <span className="text-gray-600">[{log.time}]</span> {log.text}
                            </motion.div>
                        ))}
                        {vanillaLogs.length === 0 && <span className="animate-pulse text-gray-700">Waiting for data...</span>}
                    </div>
                </div>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col gap-4 overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 font-mono text-xs">PULSE SOFTWARE</span>
                    <Zap size={14} className="text-emerald-500" />
                </div>

                <div className="flex items-center justify-between px-4 h-20 relative">
                    <div className="absolute left-12 right-12 top-1/2 h-[4px] -mt-[2px] z-0 overflow-hidden">
                        <AnimatePresence>
                            {pulseBeam && (
                                <motion.div 
                                    initial={{ width: "0%", opacity: 1 }}
                                    animate={{ width: "100%" }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.6, ease: "circIn" }}
                                    className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981]"
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    <div className={cn("z-10 bg-black border p-2 rounded-lg transition-colors duration-500", pulseBeam ? "border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "border-gray-700")}>
                        <Server size={20} className={pulseBeam ? "text-emerald-500" : "text-gray-400"} />
                    </div>
                    
                    <div className="flex-1 h-full mx-4 flex items-center justify-center z-10">
                         <span className={cn("text-[10px] font-mono transition-colors bg-black/50 px-2 rounded", pulseBeam ? "text-emerald-500" : "text-transparent")}>
                            BATCH SIZE: {LOG_DATA.length}
                         </span>
                    </div>

                    <div className={cn("z-10 bg-black border p-2 rounded-lg transition-colors duration-200 delay-500", !pulseBeam && pulseLogs.length > 0 ? "border-emerald-500 bg-emerald-900/20 text-emerald-500" : "border-gray-700 text-gray-400")}>
                        <Monitor />
                    </div>
                </div>

                <div className="h-44 bg-[#0a0a0a] rounded border border-white/5 p-3 font-mono text-[10px] md:text-xs text-emerald-400 overflow-hidden font-bold shadow-inner flex flex-col">
                    <div className="opacity-50 mb-2 border-b border-white/5 pb-1 shrink-0">user@client:~$ tail -f pulse_network.log</div>
                    <div className="flex flex-col justify-end min-h-0">
                        {pulseLogs.map((log) => (
                            <motion.div 
                                key={log.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mb-1 whitespace-nowrap overflow-hidden text-ellipsis"
                            >
                                <span className="text-gray-600">[{log.time}]</span> {log.text}
                            </motion.div>
                        ))}
                        {pulseLogs.length === 0 && <span className="animate-pulse text-gray-700">Buffering state...</span>}
                    </div>
                </div>
            </div>

        </div>
    );
};

const CPULoadDemo = () => {
    const [vInterrupts, setVInterrupts] = useState<string[]>([]);
    const [pInterrupts, setPInterrupts] = useState<string[]>([]);
    const [vCount, setVCount] = useState(0);
    const [pCount, setPCount] = useState(0);

    useEffect(() => {
        const vInterval = setInterval(() => {
            const id = crypto.randomUUID();
            setVInterrupts(prev => [...prev.slice(-10), id]);
            setVCount(c => c + 1);
            setTimeout(() => setVInterrupts(prev => prev.filter(i => i !== id)), 600);
        }, 75);

        const pInterval = setInterval(() => {
            const id = crypto.randomUUID();
            setPInterrupts([id]);
            setPCount(c => c + 1);
            setTimeout(() => setPInterrupts([]), 800);
        }, 2000);

        return () => { clearInterval(vInterval); clearInterval(pInterval); };
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full mt-8">
            <div className="bg-black/40 border border-white/10 rounded-xl p-6 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-8">
                    <div className="space-y-1">
                        <h4 className="text-white font-bold text-sm uppercase tracking-tight">Paper</h4>
                        <p className="text-[10px] text-red-500/70 font-mono">CPU Overload Risk</p>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-mono font-bold text-red-500">{vCount}</span>
                        <p className="text-[9px] text-gray-500 uppercase">Total Context Switches</p>
                    </div>
                </div>

                <div className="flex items-center justify-between relative px-2">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10"><Layers className="text-gray-400" size={24} /></div>
                    
                    <div className="flex-1 h-20 relative mx-4">
                        <AnimatePresence>
                            {vInterrupts.map(id => (
                                <motion.div
                                    key={id}
                                    initial={{ left: "0%", opacity: 0, y: -2 }}
                                    animate={{ left: "100%", opacity: [0, 1, 1, 0], y: -2 }}
                                    transition={{ duration: 0.6, ease: "linear" }}
                                    className="absolute top-1/2 -mt-2 w-4 h-4 bg-red-500/20 rounded flex items-center justify-center"
                                    style={{ transform: 'translateY(-50%)' }}
                                >
                                    <Zap size={8} className="text-red-500 h-full w-full" />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div className="absolute top-1/2 w-full h-[1px] bg-red-900/20" />
                    </div>

                    <motion.div 
                        animate={vInterrupts.length > 0 ? { x: [-1, 1, -1], rotate: [-1, 1, 0] } : {}}
                        transition={{ repeat: Infinity, duration: 0.1 }}
                        className={cn("p-4 rounded-xl border transition-colors", vInterrupts.length > 0 ? "bg-red-500/10 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]" : "bg-white/5 border-white/10")}
                    >
                        <Cpu className={vInterrupts.length > 0 ? "text-red-500" : "text-gray-500"} size={32} />
                    </motion.div>
                </div>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-xl p-6 relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <div className="space-y-1">
                        <h4 className="text-white font-bold text-sm uppercase tracking-tight">Pulse</h4>
                        <p className="text-[10px] text-emerald-500/70 font-mono">Optimized Efficiency</p>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-mono font-bold text-emerald-500">{pCount}</span>
                        <p className="text-[9px] text-gray-500 uppercase">Total Context Switches</p>
                    </div>
                </div>

                <div className="flex items-center justify-between relative px-2">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10"><Layers className="text-gray-400" size={24} /></div>
                    
                    <div className="flex-1 h-20 relative mx-4">
                        <AnimatePresence>
                            {pInterrupts.map(id => (
                                <motion.div
                                    key={id}
                                    initial={{ left: "0%", opacity: 0, y: -2 }}
                                    animate={{ left: "100%", opacity: [0, 1, 1, 0], y: -2 }}
                                    transition={{ duration: 0.6, ease: "linear" }}
                                    className="absolute top-1/2 -mt-2 w-4 h-4 bg-emerald-500/20 rounded flex items-center justify-center"
                                    style={{ transform: 'translateY(-50%)' }}
                                >
                                    <Zap size={8} className="text-emerald-500 h-full w-full" />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div className="absolute top-1/2 w-full h-[1px] bg-emerald-900/20" />
                    </div>

                    <motion.div 
                        animate={pInterrupts.length > 0 ? { scale: [1, 1.05, 1] } : {}}
                        className={cn("p-4 rounded-xl border transition-colors duration-500", pInterrupts.length > 0 ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]" : "bg-white/5 border-white/10")}
                    >
                        <Cpu className={pInterrupts.length > 0 ? "text-emerald-500" : "text-gray-500"} size={32} />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default function NetworkComparisonSection() {
  return (
    <section className="relative w-full py-24 px-4 bg-[#050505] overflow-hidden text-white flex flex-col items-center">
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
            backgroundImage: 'radial-gradient(circle at center, #222 1px, transparent 1px)',
            backgroundSize: '24px 24px'
        }}
      />
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#ff2929]/10 to-transparent pointer-events-none" />

      <div className="max-w-6xl w-full z-10 relative">
        <div className="text-center mb-16">
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-white mb-4"
          >
            Data <span className="text-[#ff2929]">Fragmentation</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Visualizing the impact of packet batching on CPU interrupts and network latency.
          </motion.p>
        </div>
        <div>
            <div className="flex items-center gap-2 mb-6">
                <Terminal className="text-[#ff2929]" size={20} />
                <h3 className="text-xl font-bold uppercase tracking-wider text-[#808080]">// 1. Network Replication Jitter</h3>
            </div>
            <ConsoleDemo />

            <div className="flex items-center gap-2 mb-6 pt-16">
                <Terminal className="text-[#ff2929]" size={20} />
                <h3 className="text-xl font-bold uppercase tracking-wider text-[#808080]">// 2. CPU Context Switching</h3>
            </div>
            <CPULoadDemo />
        </div>

      </div>
    </section>
  );
}