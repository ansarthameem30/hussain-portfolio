'use client';

import { useEffect, useRef, useState } from 'react';
import statsConfig from '@/data/content/stats.json';
import styles from './StatsStrip.module.css';

interface Stat {
  id: string;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  decimals?: number;
}

function useCountUp(target: number, duration = 1600, started = false) {
  // Always initialize with target so SSR, initial load, and LinkedIn in-app browser show real values immediately
  const [count, setCount] = useState(target);

  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    let raf: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    setCount(0);
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, started]);

  return count;
}

function StatItem({ stat, started }: { stat: Stat; started: boolean }) {
  const count = useCountUp(stat.value, 2000, started);
  const displayValue = `${stat.prefix ?? ''}${count}${stat.suffix ?? ''}`;

  return (
    <div className={styles.stat} id={stat.id}>
      <div className={styles.statValue}>{displayValue}</div>
      <p className={styles.statLabel}>{stat.label}</p>
    </div>
  );
}

export default function StatsStrip() {
  const ref = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats" ref={ref} className={styles.strip} aria-label="Key results">
      <div className={`container ${styles.grid}`}>
        {statsConfig.map((stat) => (
          <StatItem key={stat.id} stat={stat} started={started} />
        ))}
      </div>
    </section>
  );
}
