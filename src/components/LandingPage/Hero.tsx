import React, { useCallback, useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Download, ChevronRight, MessageCircle, Activity, Zap, Server } from 'lucide-react';
import Button from '../ui/Button';
import CountUp from '../ui/Counter';
import MarqueeModule from "react-fast-marquee";
const Marquee = (MarqueeModule as any).default || MarqueeModule;
import LightRays from '../ui/Light';

interface HeroProps {
  onDownloadClick: () => void;
}

interface ServerStats {
  activeServers: number;
}

const marqueeItems =[
  "Batching", "Packets", "Network", "Minecraft", "Performance", "New", "Fast"
];

function Hero({ onDownloadClick }: HeroProps) {
  const[serverStats, setServerStats] = useState<ServerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServerStats = async () => {
      try {
        const response = await fetch('https://bstats.org/api/v1/plugins/28846/charts/servers/data?maxElements=1');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          setServerStats({ activeServers: data[data.length - 1][1] });
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error('Failed to fetch server stats:', error);
        setServerStats({ activeServers: 42 }); // Fallback
      } finally {
        setIsLoading(false);
      }
    };
    fetchServerStats();
  },[]);

  const openDocs = useCallback(() => window.open('https://pulsemc.dev/docs', '_blank'),[]);
  const openDiscord = useCallback(() => window.open('https://dsc.gg/Pulse-MC', '_blank'),[]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#050505] selection:bg-[#ff2929]/30">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ff8080"
          raysSpeed={1}
          lightSpread={1}
          rayLength={2}
          pulsating={false}
          fadeDistance={1}
          saturation={1}
          followMouse
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
        />
      </div>
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#ff2929]/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-1/4 right-[-10%] w-[40%] h-[40%] bg-[#ff2929]/5 blur-[100px] rounded-full mix-blend-screen" />
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3rem_3rem][mask-image:radial-gradient(ellipse_80%_50%_at_50%_40%,#000_60%,transparent_100%)]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-20 flex-1 flex flex-col lg:flex-row items-center justify-center gap-16">
        
        <motion.div 
          className="flex-1 flex flex-col items-start text-left w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff2929]/10 to-transparent border border-[#ff2929]/20 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#ff2929] animate-pulse" />
              <span className="text-[#ff2929] text-sm font-semibold tracking-wide uppercase">Next-Gen Networking Core</span>
            </div>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black mb-6 tracking-tight text-white font-syne">
            PULSE
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-400 mb-10 max-w-xl leading-relaxed">
            Revolutionary packet batching technology that reduces network overhead by <span className="text-white font-bold px-2 py-0.5 rounded">97%</span> and eliminates lag. Experience Minecraft networking reimagined.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 w-full sm:w-auto">
            <Button onClick={onDownloadClick} variant="primary" size="large" icon={Download} className="w-full sm:w-auto shadow-[0_0_30px_-5px_#ff2929]">
              Download Now
            </Button>
            <Button variant="secondary" size="large" icon={ChevronRight} onClick={openDocs} className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border-white/10">
              Docs
            </Button>
            <Button variant="secondary" size="large" icon={MessageCircle} onClick={openDiscord} className="w-full sm:w-auto bg-[#5865F2]/10 hover:bg-[#5865F2]/20 text-[#5865F2] border-[#5865F2]/20">
              Discord
            </Button>
          </motion.div>
        </motion.div>

        {/* <motion.div 
          className="flex-1 w-full max-w-lg lg:max-w-none relative"
          initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, delay: 0.2, type: "spring" }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[#ff2929]/20 to-transparent rounded-3xl blur-2xl transform rotate-3" />
          
          <div className="relative bg-[#0f0f11]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#ff2929]" /> Live Performance
              </h3>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-[#ff2929]/30 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm flex items-center gap-2"><Zap className="w-4 h-4 text-[#ff2929]"/> Network Traffic</span>
                  <span className="text-[#ff2929] font-bold">-97%</span>
                </div>
                <div className="w-full bg-black/50 rounded-full h-2">
                  <motion.div initial={{ width: 0 }} animate={{ width: '3%' }} transition={{ duration: 2, delay: 0.5 }} className="bg-[#ff2929] h-2 rounded-full" />
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-[#ff2929]/30 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm flex items-center gap-2"><Activity className="w-4 h-4 text-white"/> Syscalls Reduction</span>
                  <span className="text-white font-bold">-85%</span>
                </div>
                <div className="w-full bg-black/50 rounded-full h-2">
                  <motion.div initial={{ width: 0 }} animate={{ width: '15%' }} transition={{ duration: 2, delay: 0.7 }} className="bg-white h-2 rounded-full" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#ff2929]/10 to-transparent rounded-2xl p-6 border border-[#ff2929]/20 text-center mt-2">
                <Server className="w-8 h-8 text-[#ff2929] mx-auto mb-2 opacity-80" />
                <div className="text-4xl font-black text-white mb-1 font-syne">
                  {isLoading ? (
                    <span className="text-2xl text-gray-500 animate-pulse">...</span>
                  ) : (
                    <CountUp to={serverStats?.activeServers || 0} duration={2} separator="." />
                  )}
                </div>
                <div className="text-sm text-[#ff2929] font-medium tracking-wide uppercase">Active Servers</div>
              </div>
            </div>
          </div>
        </motion.div> */}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="relative z-20 w-full mt-auto bg-[#0a0a0a]"
      >
        <div className="py-5 border-t border-white/5">
          <Marquee speed={50} gradient={false} autoFill={true} className="overflow-hidden">
            <div className="flex items-center">
              {marqueeItems.map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-700 uppercase tracking-widest font-syne px-8 hover:text-white transition-colors duration-300">
                    {item}
                  </span>
                  <img src="/favicon.svg" alt="logo" className="w-8 h-8 md:w-10 md:h-10 opacity-30 grayscale object-contain" />
                </div>
              ))}
            </div>
          </Marquee>
        </div>
      </motion.div>
    </section>
  );
}

export default React.memo(Hero);