import { motion } from 'framer-motion';
import MagicBento from '../ui/Features';

export default function Features() {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 font-syne">
            Built for <span className="text-[#ff2929]">Performance</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Every feature designed to minimize latency and maximize throughput
          </p>
        </motion.div>

        <div className="w-full flex justify-center">
          <div className="max-w-7xl mx-auto w-full">
            <MagicBento/>
          </div>
        </div>
      </div>
    </section>
  );
}
