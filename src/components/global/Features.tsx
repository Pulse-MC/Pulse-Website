  import React, { useRef, useEffect, useState } from 'react';
  import { gsap } from 'gsap';
  import { Layers, Zap, Package, Network, Activity, Plug } from 'lucide-react';

  export interface BentoCardProps {
    title?: string;
    description?: string;
    gradient?: string;
    borderColor?: string;
    textColor?: string;
  }

  export interface BentoProps {
    textAutoHide?: boolean;
    disableAnimations?: boolean;
    spotlightRadius?: number;
    spotlightColor?: string;
    radius?: number;
    damping?: number;
    fadeOut?: number;
  }

  const MOBILE_BREAKPOINT = 768;

  const cardData: BentoCardProps[] = [
    {
      title: 'Packet Batching',
      description: 'Groups multiple packets into single transmissions, reducing network overhead by up to 97%',
      gradient: 'linear-gradient(145deg,#4F46E5,#000)',
      borderColor: '#4F46E5',
    },
    {
      title: 'Zero Latency',
      description: 'Sub-millisecond processing with optimized protocol handling',
      gradient: 'linear-gradient(210deg,#10B981,#000)',
      borderColor: '#10B981',
    },
    {
      title: 'Smart Compression',
      description: 'Adaptive compression algorithms that balance speed and bandwidth',
      gradient: 'linear-gradient(165deg,#F59E0B,#000)',
      borderColor: '#F59E0B',
    },
    {
      title: 'Protocol Optimization',
      description: 'Native support for modern Minecraft protocols with backwards compatibility',
      gradient: 'linear-gradient(195deg,#EF4444,#000)',
      borderColor: '#EF4444',
    },
    {
      title: 'Real-time Analytics',
      description: 'Monitor network performance with built-in diagnostics',
      gradient: 'linear-gradient(225deg,#8B5CF6,#000)',
      borderColor: '#8B5CF6',
    },
    {
      title: 'Plugin Ready',
      description: 'Seamless integration with existing server infrastructure',
      gradient: 'linear-gradient(135deg,#06B6D4,#000)',
      borderColor: '#06B6D4',
    }
  ];

  const iconList = [Layers, Zap, Package, Network, Activity, Plug];

  const useMobileDetection = () => {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);
    return isMobile;
  };

  type SetterFn = (v: number | string) => void;

  const MagicBento: React.FC<BentoProps> = ({
    textAutoHide = false,
    disableAnimations = false,
    spotlightRadius = 600,
    spotlightColor = 'rgba(255, 255, 255, 0.25)',
    damping = 0.25,
    fadeOut = 0.5,
  }) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const fadeRef = useRef<HTMLDivElement>(null);
    
    const setX = useRef<SetterFn | null>(null);
    const setY = useRef<SetterFn | null>(null);
    const pos = useRef({ x: 0, y: 0 });

    const isMobile = useMobileDetection();
    const shouldDisableAnimations = disableAnimations || isMobile;
    
    useEffect(() => {
      if (shouldDisableAnimations || !rootRef.current) return;
      const el = rootRef.current;
      setX.current = gsap.quickSetter(el, '--x', 'px') as SetterFn;
      setY.current = gsap.quickSetter(el, '--y', 'px') as SetterFn;
      const { width, height } = el.getBoundingClientRect();
      pos.current = { x: width / 2, y: height / 2 };
      setX.current(pos.current.x);
      setY.current(pos.current.y);
    }, [shouldDisableAnimations]);

    const handleMove = (e: React.PointerEvent) => {
      if (shouldDisableAnimations || !rootRef.current) return;
      const r = rootRef.current.getBoundingClientRect();
      const targetX = e.clientX - r.left;
      const targetY = e.clientY - r.top;

      gsap.to(pos.current, {
        x: targetX,
        y: targetY,
        duration: damping,
        ease: 'power3.out',
        onUpdate: () => {
          setX.current?.(pos.current.x);
          setY.current?.(pos.current.y);
        },
        overwrite: true
      });

      if (fadeRef.current) {
          gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
      }
    };

    const handleLeave = () => {
      if (fadeRef.current) {
          gsap.to(fadeRef.current, { opacity: 1, duration: fadeOut, overwrite: true });
      }
    };

    const handleCardMove: React.MouseEventHandler<HTMLElement> = (e) => {
      if (shouldDisableAnimations) return;
      const c = e.currentTarget as HTMLElement;
      const rect = c.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      c.style.setProperty('--mouse-x', `${x}px`);
      c.style.setProperty('--mouse-y', `${y}px`);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      gsap.to(c, {
        rotateX,
        rotateY,
        duration: 0.1,
        ease: 'power2.out',
        transformPerspective: 1000
      });
    };

    const handleCardLeave: React.MouseEventHandler<HTMLElement> = (e) => {
      if (shouldDisableAnimations) return;
      const c = e.currentTarget as HTMLElement;
      gsap.to(c, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power2.out' });
    };

    return (
      <div
        ref={rootRef}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        className="relative w-full max-w-[1400px] mx-auto p-4 group select-none"
        style={{
          '--x': '50%',
          '--y': '50%',
          '--r': `${spotlightRadius}px`,
          '--spotlight-color': spotlightColor,
        } as React.CSSProperties}
      >
        <style>
          {`
            .card-responsive {
              display: grid;
              gap: 1.25rem;
              grid-template-columns: 1fr;
              width: 100%;
              grid-auto-rows: minmax(240px, auto); 
            }
            
            @media (min-width: 600px) {
              .card-responsive {
                grid-template-columns: repeat(2, 1fr);
              }
            }
            
            @media (min-width: 1024px) {
              .card-responsive {
                grid-template-columns: repeat(4, 1fr);
              }
              
              .card-responsive .bento-card:nth-child(3) {
                grid-column: span 2;
                grid-row: span 1;
              }
              
              .card-responsive .bento-card:nth-child(4) {
                grid-column: 1 / span 2;
                grid-row: 2 / span 1;
              }
              
              .card-responsive .bento-card:nth-child(6) {
                grid-column: 4;
                grid-row: 2;
              }
            }

            .text-clamp-1 {
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
            }
            .text-clamp-2 {
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
            }
          `}
        </style>

        <div ref={gridRef} className="card-responsive relative z-10">
          {cardData.map((card, index) => {
              const Icon = iconList[index] || Layers;
              
              return (
                <article
                  key={index}
                  className="bento-card relative flex flex-col justify-between p-6 rounded-[24px] overflow-hidden transition-all duration-300"
                  onMouseMove={handleCardMove}
                  onMouseLeave={handleCardLeave}
                  style={{
                    background: card.gradient || '#1a1a1a',
                    border: `1px solid ${card.borderColor || 'rgba(255,255,255,0.1)'}`,
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div
                      className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100 mix-blend-overlay"
                      style={{
                          background: 'radial-gradient(circle 250px at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 80%)',
                          zIndex: 20
                      }}
                  />

                  <div className="relative z-20 flex flex-col h-full text-white">
                      <div className="mb-6 inline-flex self-start p-3 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 text-white/90">
                          <Icon size={24} />
                      </div>
                      
                      <div className="mt-auto">
                          <h3 className={`font-bold text-xl mb-2 drop-shadow-md ${textAutoHide ? 'text-clamp-1' : ''}`}>
                              {card.title}
                          </h3>
                          <p className={`text-[0.95rem] text-white/90 leading-relaxed font-medium drop-shadow-sm ${textAutoHide ? 'text-clamp-2' : ''}`}>
                              {card.description}
                          </p>
                      </div>
                  </div>
                </article>
              );
          })}
        </div>

        {!shouldDisableAnimations && (
          <>
              <div
                  className="absolute inset-0 pointer-events-none z-30 rounded-[28px]"
                  style={{
                      backdropFilter: 'grayscale(1) brightness(0.6)',
                      WebkitBackdropFilter: 'grayscale(1) brightness(0.6)',
                      background: 'rgba(0,0,0,0.01)',
                      maskImage: `radial-gradient(circle var(--r) at var(--x) var(--y), 
                          transparent 0%, 
                          transparent 10%, 
                          rgba(0,0,0,0.1) 20%, 
                          rgba(0,0,0,0.4) 35%, 
                          rgba(0,0,0,0.8) 50%, 
                          white 100%)`,
                      WebkitMaskImage: `radial-gradient(circle var(--r) at var(--x) var(--y), 
                          transparent 0%, 
                          transparent 10%, 
                          rgba(0,0,0,0.1) 20%, 
                          rgba(0,0,0,0.4) 35%, 
                          rgba(0,0,0,0.8) 50%, 
                          white 100%)`,
                      inset: '-20px'
                  }}
              />

              <div
                  ref={fadeRef}
                  className="absolute inset-0 pointer-events-none z-40 rounded-[28px] transition-opacity"
                  style={{
                      backdropFilter: 'grayscale(1) brightness(0.6)',
                      WebkitBackdropFilter: 'grayscale(1) brightness(0.6)',
                      background: 'rgba(0,0,0,0.01)',
                      opacity: 1,
                      inset: '-20px'
                  }}
              />
          </>
        )}
      </div>
    );
  };

  export default MagicBento;