import { Github, Twitter, MessageCircle, ArrowUpRight } from 'lucide-react';
import { FaDiscord, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative bg-[#0a0a0a] pt-20 overflow-hidden">
      <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-[#ff2929]/20 via-[#ff2929]/5 to-transparent pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-12">

          <div className="md:col-span-2">
            <a href="/" className="inline-block mb-6">
              <h3 className="text-3xl font-bold font-syne text-white tracking-tight flex items-center gap-2">
                <img src='/web-app-manifest-512x512.png' className='h-16 w-16'/>
                Pulse
              </h3>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              The Heartbeat of High-Performance Networking
            </p>
            
            <div className="mt-8 flex gap-3">
              <SocialButton icon={FaGithub} href="https://github.com/Pulse-MC/" />
              <SocialButton icon={FaDiscord} href="https://dsc.gg/Pulse-MC" />
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 font-syne">Product</h4>
            <ul className="space-y-4">
              <FooterLink href="https://jd.pulsemc.dev/" isExternal>JavaDocs</FooterLink>
              <FooterLink href="https://github.com/Pulse-MC/Pulse-Paper/blob/main/README.md" isExternal>Benchmarks</FooterLink>
              <FooterLink href="https://bstats.org/plugin/server-implementation/Pulse" isExternal>bStats</FooterLink>
              <FooterLink href="/releases">Releases</FooterLink>
              <FooterLink href="/devbuilds">Devbuilds</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 font-syne">Company</h4>
            <ul className="space-y-4">
              <FooterLink href="https://github.com/Pulse-MC" isExternal>About Us</FooterLink>
              <FooterLink href="https://github.com/Pulse-MC/.github/tree/main/assets" isExternal>Brand Assets</FooterLink>
            </ul>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-1 text-sm text-gray-400">
          <span>Pulse is</span>
          <a 
            href="https://github.com/Pulse-MC/Website"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-0.5 hover:text-[#ff2929] transition-colors font-medium text-[#ff2929]"
          >
            open source.
            <ArrowUpRight size={12} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
          </a>
        </div>

        <div className="border-t border-white/10 pt-8 pb-32 md:pb-40 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2026 PulseMC. All rights reserved.</p>
          <p className="text-center md:text-right opacity-60">
            NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.
          </p>
        </div>
      </div>

      <div className="absolute bottom-[-5%] left-0 right-0 flex justify-center pointer-events-none select-none overflow-hidden">
        <h1 className="text-[20vw] leading-[0.8] font-black font-syne text-transparent bg-clip-text bg-gradient-to-t from-white/30 to-white/0 tracking-tighter mix-blend-overlay">
          PULSE
        </h1>
      </div>
    </footer>
  );
}

function FooterLink({ href, children, isExternal = false }: { href: string, children: React.ReactNode, isExternal?: boolean }) {
  return (
    <li>
      <a 
        href={href} 
        className="group flex items-center gap-1 text-gray-400 hover:text-[#ff2929] transition-colors text-sm"
      >
        {children}
        {isExternal && <ArrowUpRight size={12} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />}
      </a>
    </li>
  );
}

function SocialButton({ icon: Icon, href }: { icon: any, href: string }) {
  return (
    <a
      href={href}
      target='_blank'
      className="w-10 h-10 bg-white/5 hover:bg-[#ff2929]/10 border border-white/10 hover:border-[#ff2929]/50 rounded-lg flex items-center justify-center transition-all group"
    >
      <Icon size={18} className="text-gray-400 group-hover:text-[#ff2929] transition-colors" />
    </a>
  );
}