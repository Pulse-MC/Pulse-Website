import { lazy, Suspense, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/LandingPage/Hero';

const Features = lazy(() => import('../components/LandingPage/Features'));
const Comparison = lazy(() => import('../components/LandingPage/Comparison'));
const Footer = lazy(() => import('../components/LandingPage/Footer'));
const DownloadModal = lazy(() => import('../components/LandingPage/DownloadModal'));

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-[#ff2929]/20 border-t-[#ff2929] rounded-full"
      />
    </div>
  );
}

export default function LandingPage() {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const openDownloadModal = useCallback(() => setIsDownloadModalOpen(true), []);
  const closeDownloadModal = useCallback(() => setIsDownloadModalOpen(false), []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Hero onDownloadClick={openDownloadModal} />

      <Suspense>
        <Features />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <Comparison />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <Footer />
      </Suspense>

      <Suspense fallback={null}>
        <DownloadModal
          isOpen={isDownloadModalOpen}
          onClose={closeDownloadModal}
        />
      </Suspense>
    </div>
  );
}
