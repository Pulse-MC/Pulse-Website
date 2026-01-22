import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Check, ChevronRight, Archive, Beaker, Loader2, AlertCircle } from 'lucide-react';
import Modal from '../global/Modal';
import Button from '../global/Button';
import { useNavigate } from 'react-router-dom';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PlatformMeta {
  id: string;
  name: string;
  description: string;
}

interface ApiRelease {
  version: string;
  platform: string;
  build_id: string;
  size?: string;
  file_size: string;
  releaseDate?: string;
  release_date?: string;
}

const PLATFORMS_META: PlatformMeta[] = [
  { id: 'paper', name: 'Paper', description: 'High-performance server' },
  { id: 'purpur', name: 'Purpur', description: 'Feature-rich server' },
  { id: 'fabric', name: 'Fabric', description: 'Lightweight mod loader' },
];

// --- Компонент Анимации ---
const DownloadAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [stage, setStage] = useState<'enter' | 'explode'>('enter');

  useEffect(() => {
    const timer1 = setTimeout(() => setStage('explode'), 50);

    const timer2 = setTimeout(onComplete, 750);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return createPortal(
    <div 
      className={`fixed inset-0 z-[9999] flex justify-center items-center pointer-events-none transition-all duration-1000 ease-out bg-black/100
        ${stage === 'explode' ? 'opacity-0' : 'opacity-100'}
      `}
    >
      <div className="relative flex justify-center items-center">
        <div className={`relative z-10 bg-[#ff2929] rounded-full flex items-center justify-center shadow-lg shadow-[#ff2929]/40 transition-all duration-500
            ${stage === 'explode' ? 'w-24 h-24 scale-125' : 'w-20 h-20 scale-100'}
        `}>
           <Download className="text-white" size={40} />
        </div>

        
        <div className={`absolute rounded-full border-2 border-[#ff2929] transition-all duration-700 ease-out
            ${stage === 'explode' ? 'w-[75rem] h-[75rem] opacity-0 border-4' : 'w-20 h-20 opacity-100'}
        `} />
        
        <div className={`absolute rounded-full border border-[#ff2929]/50 transition-all duration-700 ease-out delay-75
            ${stage === 'explode' ? 'w-[150rem] h-[150rem] opacity-0' : 'w-20 h-20 opacity-100'}
        `} />
        
        <div className={`absolute rounded-full border border-[#ff2929]/30 transition-all duration-700 ease-out delay-150
            ${stage === 'explode' ? 'w-[225rem] h-[225rem] opacity-0' : 'w-20 h-20 opacity-100'}
        `} />
      </div>
    </div>,
    document.body
  );
};

export default function DownloadModal({ isOpen, onClose }: DownloadModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [releases, setReleases] = useState<ApiRelease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [isDownloading, setIsDownloading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(false);
      setIsDownloading(false);
      fetch('https://api.pulsemc.dev/releases')
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch');
          return res.json();
        })
        .then((data) => {
          setReleases(Array.isArray(data.data) ? data.data : []);
          setIsLoading(false);
        })
        .catch(() => {
          setError(true);
          setIsLoading(false);
        });
    } else {
      const timer = setTimeout(() => {
        setStep(1);
        setSelectedVersion('');
        setSelectedPlatform('');
        setIsDownloading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const uniqueVersions = useMemo(() => {
    const versions = new Set(releases.map((r) => r.version));
    return Array.from(versions).sort((a, b) => 
      b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' })
    );
  }, [releases]);

  const handleVersionSelect = (version: string) => {
    setSelectedVersion(version);
    setStep(2);
  };

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform);
    setStep(3);
  };

  const handleClose = () => {
    if (isDownloading) return; 
    onClose();
  };

  const handleDownloadClick = (link: string) => {
    const linkElement = document.createElement('a');
    linkElement.href = link;
    linkElement.setAttribute('download', 'pulse');
    document.body.appendChild(linkElement);
    linkElement.click();
    linkElement.remove();
    setIsDownloading(true);
  };

  const handleAnimationComplete = () => {
    onClose();
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const getDownloadData = () => {
    const data = releases.find(
      (d) => d.version === selectedVersion && d.platform.toLowerCase() === selectedPlatform.toLowerCase()
    );
    
    if (!data) return null;

    return {
      link: `https://api.pulsemc.dev/release/download/${data.build_id}` || '404',
      size: data.size || data.file_size || "0",
      date: data.releaseDate || data.release_date || new Date().toISOString().split('T')[0]
    };
  };

  const downloadData = getDownloadData();

  return (
    <>
      {isDownloading && <DownloadAnimation onComplete={handleAnimationComplete} />}

      <div className={`transition-opacity duration-200 ${isDownloading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Modal isOpen={isOpen} onClose={handleClose} title="Download Pulse">
          <div className="min-h-[400px]">
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      step >= s
                        ? 'bg-[#ff2929] text-white'
                        : 'bg-white/5 text-gray-500'
                    }`}
                  >
                    {step > s ? <Check size={20} /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                        step > s ? 'bg-[#ff2929]' : 'bg-white/10'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p>Fetching latest releases...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-64 text-red-400">
                <AlertCircle className="mb-4" size={32} />
                <p>Failed to load versions.</p>
                <button onClick={handleClose} className="mt-4 text-white hover:underline">Close</button>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-2xl font-bold text-white mb-2">Select Minecraft Version</h3>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 text-sm">
                      <p className="text-gray-400">Choose the version you want to use</p>
                      
                      <div className="hidden sm:block w-px h-4 bg-white/10 mx-1" />
                      <span className=" text-gray-500 text-xs uppercase font-bold tracking-wider">Or go to:</span>

                      <div className="flex items-center gap-2">
                        <Button variant='secondary' size='small' icon={Archive} onClick={() => navigate('/releases')}>
                            Releases
                        </Button>
                        <Button variant='secondary' size='small' icon={Beaker} onClick={() => navigate('/devbuilds')}>
                            Dev Builds
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                      {uniqueVersions.map((version) => (
                        <button
                          key={version}
                          onClick={() => handleVersionSelect(version)}
                          className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#ff2929]/50 hover:bg-[#ff2929]/5 transition-all text-left group relative overflow-hidden"
                        >
                          <div className="relative z-10">
                            <div className="text-xl font-bold text-white mb-1">{version}</div>
                            <div className="text-sm text-gray-500 group-hover:text-[#ff2929] transition-colors">
                              Latest Release
                            </div>
                          </div>
                        </button>
                      ))}
                      {uniqueVersions.length === 0 && (
                        <div className="col-span-2 text-center text-gray-500 py-8">
                          No versions found.
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-2xl font-bold text-white mb-4">Select Platform</h3>
                    <p className="text-gray-400 mb-6">
                      Version: <span className="text-[#ff2929]">{selectedVersion}</span>
                    </p>
                    <div className="space-y-3">
                      {PLATFORMS_META.map((platform) => {
                        const isAvailable = releases.some(
                          (r) => r.version === selectedVersion && r.platform.toLowerCase() === platform.id.toLowerCase()
                        );

                        return (
                          <button
                            key={platform.id}
                            disabled={!isAvailable}
                            onClick={() => isAvailable && handlePlatformSelect(platform.id)}
                            className={`w-full p-6 rounded-xl border transition-all text-left group flex items-center justify-between
                              ${isAvailable 
                                ? 'bg-white/5 border-white/10 hover:border-[#ff2929]/50 hover:bg-[#ff2929]/5 cursor-pointer' 
                                : 'bg-white/[0.02] border-white/5 opacity-50 cursor-not-allowed grayscale'
                              }`}
                          >
                            <div>
                              <div className={`text-xl font-bold mb-1 ${isAvailable ? 'text-white' : 'text-gray-500'}`}>
                                {platform.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {isAvailable ? platform.description : 'Not available for this version'}
                              </div>
                            </div>
                            {isAvailable && (
                              <ChevronRight className="text-gray-500 group-hover:text-[#ff2929] transition-colors" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      className="mt-6 text-gray-400 hover:text-white transition-colors"
                    >
                      ← Back to version selection
                    </button>
                  </motion.div>
                )}

                {step === 3 && downloadData && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 bg-[#ff2929]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="text-[#ff2929]" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Ready to Download</h3>
                    <div className="bg-white/5 rounded-xl p-6 mb-6 text-left">
                      <div className="flex justify-between mb-3">
                        <span className="text-gray-400">Version:</span>
                        <span className="text-white font-semibold">{selectedVersion}</span>
                      </div>
                      <div className="flex justify-between mb-3">
                        <span className="text-gray-400">Platform:</span>
                        <span className="text-white font-semibold capitalize">{selectedPlatform}</span>
                      </div>
                      <div className="flex justify-between mb-3">
                        <span className="text-gray-400">Size:</span>
                        <span className="text-white font-semibold">{formatBytes(parseInt(downloadData.size))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Release Date:</span>
                        <span className="text-white font-semibold">{downloadData.date}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDownloadClick(downloadData.link)}
                      variant="primary"
                      size="large"
                      icon={Download}
                      className="w-full"
                    >
                      Download Pulse
                    </Button>
                    <button
                      onClick={() => setStep(2)}
                      className="mt-4 text-gray-400 hover:text-white transition-colors"
                    >
                      ← Change platform
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </Modal>
      </div>
    </>
  );
}