import { motion } from 'framer-motion';
import { Download, ChevronRight, Zap, ZapOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import Button from '../global/Button';
import FloatingLines from '../global/Background';
import LogoLoop from '../global/LogoLoop';
import CountUp from '../global/Counter';

interface HeroProps {
  onDownloadClick: () => void;
}

interface ServerStats {
  activeServers: number;
}

const PaperIcon = () => (
  <img src='/icons/software/paper.png' className='h-[60px]' alt="Paper" />
);

const PurpurIcon = () => (
  <img src='/icons/software/purpur.png' className='h-[60px]' alt="Purpur" /> 
);

const FabricIcon = () => (
  <img src='/icons/software/fabric.png' className='h-[60px]' alt="Fabric" />
);

const techLogos = [
  { node: <PaperIcon />, title: "Paper", href: "https://papermc.io" },
  { node: <PurpurIcon />, title: "Purpur", href: "https://purpurmc.org" },
  { node: <FabricIcon />, title: "Fabric", href: "https://fabricmc.net" },
];

export default function Hero({ onDownloadClick }: HeroProps) {
  const [serverStats, setServerStats] = useState<ServerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [opacity, setOpacity] = useState(0);
  const [showEffects, setShowEffects] = useState(false); 

  useEffect(() => {
    const savedSetting = localStorage.getItem('pulse_bg_effects');
    if (savedSetting !== null) {
      setShowEffects(JSON.parse(savedSetting));
    } else {
      const isMobile = window.innerWidth < 768;
      setShowEffects(!isMobile);
    }

    const fetchServerStats = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const response = await fetch('https://bstats.org/api/v1/plugins/28846/charts/servers/data?maxElements=1');
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const currentCount = data[data.length - 1][1];
          setServerStats({ activeServers: currentCount });
        } else {
          throw new Error('Invalid data format');
        }
        
        setOpacity(1);
      } catch (error) {
        console.error('Failed to fetch server stats:', error);
        setServerStats({ activeServers: 42 }); 
        setOpacity(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServerStats();
  }, []);

  const toggleEffects = () => {
    const newValue = !showEffects;
    setShowEffects(newValue);
    localStorage.setItem('pulse_bg_effects', JSON.stringify(newValue));
  };

  return (
    // УБРАЛИ px-4 отсюда, чтобы LogoLoop мог быть на всю ширину
    <section className="relative min-h-screen flex flex-col items-center justify-between overflow-hidden bg-[#0a0a0a]">
      
      <button
        onClick={toggleEffects}
        className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors backdrop-blur-md group"
        title={showEffects ? "Disable high performance effects" : "Enable background effects"}
      >
        {showEffects ? (
          <Zap className="w-5 h-5 text-[#ff2929]" />
        ) : (
          <ZapOff className="w-5 h-5 text-gray-400 group-hover:text-white" />
        )}
      </button>

      <div className="absolute inset-0 z-0 bg-[#060010]">
        {showEffects ? (
          <FloatingLines
            linesGradient={["#a21111","#9b2738","#6b1919"]}
            animationSpeed={1}
            interactive={true}
            bendRadius={5}
            bendStrength={-0.5}
            mouseDamping={0.05}
            parallax
            parallaxStrength={0.2}
          />
        ) : (
          <div className="absolute inset-0 w-full h-full">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            <div className="absolute bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-[#ff2929]/5 to-transparent" />
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-radial from-[#ff2929]/10 via-transparent to-transparent pointer-events-none z-0" />

      {/* Основной контент (Текст, кнопки). Добавили px-4 и w-full сюда */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 text-center pointer-events-none flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 pointer-events-auto"
        >
          <span className="inline-block px-4 py-2 bg-[#ff2929]/10 border border-[#ff2929]/30 rounded-full text-[#ff2929] text-sm font-semibold mb-6 backdrop-blur-sm">
            Next-Gen Networking Core
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold mb-6 pointer-events-auto"
        >
          <span className="text-white font-syne font-extrabold">Pulse</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed pointer-events-auto"
        >
          Revolutionary packet batching technology that reduces network overhead by{' '}
          <span className="text-[#ff2929] font-semibold">97%</span> and eliminates lag.
          Experience Minecraft networking reimagined.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pointer-events-auto"
        >
          <Button onClick={onDownloadClick} variant="primary" size="large" icon={Download}>
            Download Now
          </Button>
          <Button variant="secondary" size="large" icon={ChevronRight} onClick={() => window.open("https://jd.pulsemc.dev", "_blank")}>
            View Documentation
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto pointer-events-auto"
        >
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#ff2929] mb-2">
              <CountUp to={97} duration={2} />%
            </div>
            <div className="text-sm text-gray-400">Less Network Traffic</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#ff2929] mb-2">
              <CountUp to={85} duration={2} />%
            </div>
            <div className="text-sm text-gray-400">Fewer Syscalls</div>
          </div>
          <div className="text-center">
            <motion.div
              className="text-3xl md:text-4xl font-bold text-[#ff2929] mb-2"
              animate={{ opacity }}
              transition={{ duration: 0.5 }}
            >
              {isLoading ? (
                <span className="text-2xl text-gray-500">Calculating...</span>
              ) : serverStats ? (
                <>
                  <CountUp to={serverStats.activeServers} duration={2} separator="." />
                </>
              ) : (
                <span>N/A</span>
              )}
            </motion.div>
            <div className="text-sm text-gray-400">Active Servers</div>
          </div>
        </motion.div>
      </div>

      {/* Блок с логотипами на всю ширину (w-full и отсутствие px в родителе) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="relative z-10 w-full pb-8 pt-10"
      >
        <LogoLoop
          logos={techLogos}
          speed={120}
          direction="left"
          logoHeight={48}
          gap={40}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          fadeOutColor="#0a0a0a"
          ariaLabel="Compatible platforms"
          className=""
        />
      </motion.div>
    </section>
  );
}