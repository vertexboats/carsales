import React, { useEffect, useState } from 'react';

/**
 * PageLoader
 * A crisp automotive-themed full-screen page transition that plays on every
 * route change. It auto-dismisses after a brief animated sequence:
 *   1. Slide-in progress bar sweeps left → right at the very top of viewport.
 *   2. A centred car silhouette SVG drives across the bar then fades out.
 *   3. The whole overlay fades out, revealing the new page.
 *
 * Usage: drop <PageLoader key={routeKey} /> whenever the route changes so React
 * remounts it and the animation replays.
 */

interface PageLoaderProps {
  /** Optional callback fired when the exit animation is complete. */
  onDone?: () => void;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ onDone }) => {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');

  useEffect(() => {
    // Phase 1: Progress bar sweeps across → 420 ms
    const t1 = setTimeout(() => setPhase('hold'), 420);
    // Phase 2: Hold briefly so car silhouette is visible → 180 ms
    const t2 = setTimeout(() => setPhase('out'), 600);
    // Phase 3: Fade-out animation → 300 ms, then call onDone
    const t3 = setTimeout(() => onDone?.(), 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        opacity: phase === 'out' ? 0 : 1,
        transition: phase === 'out' ? 'opacity 280ms cubic-bezier(0.4,0,0.2,1)' : 'none',
      }}
    >
      {/* Full-page backdrop — only visible during the hold phase */}
      <div
        className="absolute inset-0 bg-[#040401]"
        style={{
          opacity: phase === 'in' ? 0 : phase === 'hold' ? 0 : 0,
        }}
      />

      {/* ─── TOP PROGRESS RAIL ─── */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/10 overflow-hidden">
        <div
          className="h-full bg-[#FF3600] rounded-full origin-left"
          style={{
            transform: phase === 'in' ? 'scaleX(0)' : 'scaleX(1)',
            transition: phase === 'in'
              ? 'transform 420ms cubic-bezier(0.25,0,0.1,1)'
              : 'none',
          }}
        />
      </div>

      {/* ─── SWEEPING CAR SILHOUETTE ─── */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] flex items-center overflow-hidden pointer-events-none"
        style={{ marginTop: '-14px' }}
      >
        <div
          style={{
            transform: phase === 'in'
              ? 'translateX(-80px)'
              : phase === 'hold'
              ? 'translateX(calc(100vw - 80px))'
              : 'translateX(calc(100vw + 80px))',
            transition: phase === 'in'
              ? 'transform 420ms cubic-bezier(0.25,0,0.1,1)'
              : phase === 'hold'
              ? 'none'
              : 'transform 240ms linear',
            opacity: phase === 'out' ? 0 : 1,
          }}
        >
          {/* Minimal side-silhouette car SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 72 32"
            fill="none"
            width="72"
            height="32"
            className="drop-shadow-[0_0_6px_rgba(255,54,0,0.6)]"
          >
            {/* Body */}
            <path
              d="M6 20 C6 20 8 12 18 10 L30 8 C34 7 40 7 44 8 L56 12 C62 13 66 16 66 20 L66 24 C66 24 54 24 52 24 L20 24 C18 24 6 24 6 24 Z"
              fill="#FF3600"
            />
            {/* Cabin */}
            <path
              d="M20 10 L26 4 L46 4 L52 10 Z"
              fill="#FF3600"
              opacity="0.85"
            />
            {/* Windshield tint */}
            <path
              d="M28 10 L31 5 L41 5 L44 10 Z"
              fill="white"
              opacity="0.15"
            />
            {/* Front wheel */}
            <circle cx="52" cy="24" r="5" fill="#040401" stroke="#FF3600" strokeWidth="1.5" />
            <circle cx="52" cy="24" r="2" fill="#FF3600" />
            {/* Rear wheel */}
            <circle cx="20" cy="24" r="5" fill="#040401" stroke="#FF3600" strokeWidth="1.5" />
            <circle cx="20" cy="24" r="2" fill="#FF3600" />
            {/* Headlight */}
            <ellipse cx="65" cy="20" rx="3" ry="2" fill="white" opacity="0.8" />
          </svg>
        </div>
      </div>
    </div>
  );
};

/**
 * usePageTransition
 * Hook that manages a unique key per route-change so PageLoader remounts cleanly.
 *
 * Usage inside AppRouter:
 *   const { loaderKey, isLoading, triggerTransition } = usePageTransition();
 *   // call triggerTransition() before every navigatePublic() call, or
 *   // just wrap publicContent with <PageLoader key={loaderKey} />.
 */
export function usePageTransition() {
  const [loaderKey, setLoaderKey] = useState(0);

  const triggerTransition = () => {
    setLoaderKey((k) => k + 1);
  };

  return { loaderKey, triggerTransition };
}
