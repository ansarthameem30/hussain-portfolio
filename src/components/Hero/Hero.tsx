'use client';

import { useState, useMemo } from 'react';
import styles from './Hero.module.css';
import {
  LocationPinIcon,
  ArrowRightIcon,
  DownloadIcon,
  TrendingUpIcon,
  CheckCircleIcon,
} from '@/components/Icons/Icons';
import profileData from '@/data/content/profile.json';

interface VerticalPreset {
  id: string;
  name: string;
  industry: string;
  baseSpend: number;
  baseCpl: number;
  optimizedCpl: number;
  baseRoas: number;
  optimizedRoas: number;
  currency: string;
  leadsMultiplier: number;
  strategyNote: string;
}

const verticals: VerticalPreset[] = [
  {
    id: 'saas',
    name: 'B2B SaaS Scale',
    industry: 'Enterprise Cloud (Global)',
    baseSpend: 48000,
    baseCpl: 15.5,
    optimizedCpl: 6.8,
    baseRoas: 2.4,
    optimizedRoas: 5.5,
    currency: '$',
    leadsMultiplier: 2.28,
    strategyNote: 'Targeting high-intent search keywords + First-Party CAPI attribution pipeline.',
  },
  {
    id: 'healthcare',
    name: 'Healthcare & MedTech',
    industry: 'Multi-City Hospital Network',
    baseSpend: 35000,
    baseCpl: 22.0,
    optimizedCpl: 12.8,
    baseRoas: 2.8,
    optimizedRoas: 4.8,
    currency: '$',
    leadsMultiplier: 1.72,
    strategyNote: 'Hyper-local geo-radius bidding + call tracking conversion optimization.',
  },
  {
    id: 'real-estate',
    name: 'High-Ticket Real Estate',
    industry: 'Luxury Properties (Pan-India)',
    baseSpend: 55000,
    baseCpl: 31.0,
    optimizedCpl: 14.8,
    baseRoas: 3.1,
    optimizedRoas: 6.2,
    currency: '$',
    leadsMultiplier: 2.09,
    strategyNote: 'Meta Reels intent filtering + WhatsApp lead qualification automations.',
  },
];

export default function Hero() {
  const [selectedVertical, setSelectedVertical] = useState(0);
  const [budgetMultiplier, setBudgetMultiplier] = useState(1);
  const [activeLever, setActiveLever] = useState<'all' | 'intent' | 'tracking' | 'creative'>('all');

  const v = verticals[selectedVertical];

  // Dynamic calculations based on interactive levers and budget slider
  const dynamicStats = useMemo(() => {
    const spend = Math.round(v.baseSpend * budgetMultiplier);
    const boost = activeLever === 'all' ? 1.0 : activeLever === 'intent' ? 0.95 : 0.92;
    const optCpl = +(v.optimizedCpl * boost).toFixed(1);
    const baselineLeads = Math.round(spend / v.baseCpl);
    const optimizedLeads = Math.round(spend / optCpl);
    const leadSurgePct = Math.round(((optimizedLeads - baselineLeads) / baselineLeads) * 100);
    const cplReductionPct = Math.round(((v.baseCpl - optCpl) / v.baseCpl) * 100);
    const currentRoas = +(v.optimizedRoas * (activeLever === 'all' ? 1.0 : 0.95)).toFixed(1);

    return {
      spend,
      optCpl,
      baselineLeads,
      optimizedLeads,
      leadSurgePct,
      cplReductionPct,
      currentRoas,
    };
  }, [v, budgetMultiplier, activeLever]);

  return (
    <section id="hero" className={styles.hero}>
      {/* Ambient background mesh */}
      <div className={styles.mesh} aria-hidden="true">
        <div className={styles.meshOrb1} />
        <div className={styles.meshOrb2} />
        <div className={styles.meshGrid} />
      </div>

      <div className={`container ${styles.inner}`}>
        {/* Left Column: Value Proposition & CTAs */}
        <div className={styles.content}>
          <div className="animate-fade-up delay-1">
            <div className={styles.liveTelemetryBadge}>
              <span className={styles.livePulseDot} aria-hidden="true" />
              <span className={styles.liveRoleTag}>Senior Campaign Manager</span>
              <span className={styles.liveSepTag} aria-hidden="true">·</span>
              <span className={styles.liveSpecialtyTag}>Paid Media & SEM</span>
              <span className={styles.liveSpendChip}>
                <span className={styles.spendFullText}>$4M–$5M Monthly Spend</span>
                <span className={styles.spendShortText}>$4M–$5M Spend</span>
              </span>
            </div>
          </div>

          <h1 className={`${styles.headline} animate-fade-up delay-2`}>
            {profileData.headline}
          </h1>

          <p className={`${styles.subheadline} animate-fade-up delay-3`}>
            {profileData.subheadline}
          </p>

          {/* Quick Info Badges */}
          <div className={`${styles.metaPillsRow} animate-fade-up delay-4`}>
            <div className={styles.metaPill}>
              <LocationPinIcon size={13} className={styles.metaIcon} />
              <span>{profileData.location} (Open to Remote)</span>
            </div>
            <div className={`${styles.metaPill} ${styles.metaPillActive}`}>
              <span className={styles.metaPulseDot} />
              <span>{profileData.availability}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className={`${styles.buttons} animate-fade-up delay-5`}>
            <a
              id="btn-see-results"
              href="#results"
              className={`btn btn--primary ${styles.actionBtn}`}
            >
              <span>Explore Verified Results</span>
              <ArrowRightIcon size={15} />
            </a>
            <a
              id="btn-lets-talk"
              href={profileData.contact?.calendarLink || '#contact'}
              className={`btn btn--secondary ${styles.actionBtn}`}
            >
              <span>Book 15-Min Intro</span>
            </a>
            <a
              id="btn-download-resume"
              href={profileData.contact?.resumeUrl || '/Abdul-Malik-Hussain-Performance-Marketing.pdf'}
              download
              className={`btn btn--ghost ${styles.actionBtn}`}
            >
              <DownloadIcon size={14} />
              <span>Resume (PDF)</span>
            </a>
          </div>

          {/* Credibility Micro-Strip */}
          <div className={`${styles.credibilityStrip} animate-fade-up delay-5`}>
            <div className={styles.credItem}>
              <CheckCircleIcon size={13} className={styles.credCheck} />
              <span>Google & Microsoft Certified</span>
            </div>
            <div className={styles.credItem}>
              <CheckCircleIcon size={13} className={styles.credCheck} />
              <span>Meta Ads Specialist</span>
            </div>
            <div className={styles.credItem}>
              <CheckCircleIcon size={13} className={styles.credCheck} />
              <span>Attribution & Clean Data</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Performance Flight Simulator */}
        <div className={styles.flightDeck}>
          {/* Deck Header */}
          <div className={styles.deckTopBar}>
            <div className={styles.deckTitleRow}>
              <div className={styles.deckPulsePill}>
                <span className={styles.livePulseDot} />
                <span>Live Flight Simulator</span>
              </div>
              <span className={styles.deckLiveTag}>Audited Benchmark</span>
            </div>

            {/* Vertical Switcher Tabs */}
            <div className={styles.verticalTabs} role="tablist">
              {verticals.map((vt, i) => (
                <button
                  key={vt.id}
                  role="tab"
                  aria-selected={selectedVertical === i}
                  className={`${styles.verticalTab} ${selectedVertical === i ? styles.verticalTabActive : ''}`}
                  onClick={() => setSelectedVertical(i)}
                >
                  {vt.name}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Slider Section */}
          <div className={styles.simulatorControl}>
            <div className={styles.sliderHeader}>
              <span className={styles.controlLabel}>Simulate Monthly Ad Budget</span>
              <span className={styles.controlValue}>
                {v.currency}{dynamicStats.spend.toLocaleString('en-US')} / mo
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.25"
              value={budgetMultiplier}
              onChange={(e) => setBudgetMultiplier(parseFloat(e.target.value))}
              className={styles.budgetSlider}
              aria-label="Simulate Monthly Budget"
            />
            <div className={styles.sliderScale}>
              <span>{v.currency}{Math.round(v.baseSpend * 0.5).toLocaleString('en-US')}</span>
              <span>Baseline: {v.currency}{v.baseSpend.toLocaleString('en-US')}</span>
              <span>Scale: {v.currency}{Math.round(v.baseSpend * 2.5).toLocaleString('en-US')}</span>
            </div>
          </div>

          {/* Key Metrics Dashboard Grid */}
          <div className={styles.metricsGrid}>
            {/* Qualified Leads Card */}
            <div className={styles.metricCard}>
              <div className={styles.metricCardHeader}>
                <span className={styles.metricTitle}>Qualified Leads</span>
                <span className={styles.metricPillPositive}>+{dynamicStats.leadSurgePct}%</span>
              </div>
              <div className={styles.metricMainNumber}>
                {dynamicStats.optimizedLeads.toLocaleString('en-US')}
              </div>
              <div className={styles.metricSubComparison}>
                Baseline: {dynamicStats.baselineLeads.toLocaleString('en-US')} leads
              </div>
              <div className={styles.metricProgressTrack}>
                <div
                  className={styles.metricProgressFill}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Cost Per Lead (CPL) Card */}
            <div className={styles.metricCard}>
              <div className={styles.metricCardHeader}>
                <span className={styles.metricTitle}>Cost Per Lead (CAC)</span>
                <span className={styles.metricPillPositive}>-{dynamicStats.cplReductionPct}%</span>
              </div>
              <div className={styles.metricMainNumber}>
                {v.currency}{dynamicStats.optCpl}
              </div>
              <div className={styles.metricSubComparison}>
                Baseline: {v.currency}{v.baseCpl} CPL
              </div>
              <div className={styles.metricProgressTrack}>
                <div
                  className={styles.metricProgressFill}
                  style={{
                    width: `${Math.round((dynamicStats.optCpl / v.baseCpl) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Blended ROAS Gauge Card */}
            <div className={`${styles.metricCard} ${styles.metricCardFull}`}>
              <div className={styles.roasCardInner}>
                <div className={styles.roasDialWrap}>
                  <svg className={styles.roasSvg} viewBox="0 0 100 60">
                    <path
                      d="M 15 50 A 35 35 0 0 1 85 50"
                      fill="none"
                      stroke="var(--border)"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 15 50 A 35 35 0 0 1 85 50"
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="110"
                      strokeDashoffset={110 - (dynamicStats.currentRoas / 7.0) * 110}
                      style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                    />
                  </svg>
                  <div className={styles.roasNumberCenter}>
                    <strong>{dynamicStats.currentRoas}x</strong>
                    <small>ROAS</small>
                  </div>
                </div>

                <div className={styles.roasDetails}>
                  <div className={styles.roasTag}>Attributed Revenue Multiplier</div>
                  <p className={styles.roasStrategyText}>
                    {v.strategyNote}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Optimization Levers Strip */}
          <div className={styles.leversSection}>
            <span className={styles.leversLabel}>Active Strategy Levers:</span>
            <div className={styles.leversRow}>
              <button
                className={`${styles.leverBtn} ${activeLever === 'all' ? styles.leverBtnActive : ''}`}
                onClick={() => setActiveLever('all')}
              >
                <TrendingUpIcon size={12} />
                <span>Full Hussain Framework</span>
              </button>
              <button
                className={`${styles.leverBtn} ${activeLever === 'intent' ? styles.leverBtnActive : ''}`}
                onClick={() => setActiveLever('intent')}
              >
                <span>Search Intent SKAGs</span>
              </button>
              <button
                className={`${styles.leverBtn} ${activeLever === 'tracking' ? styles.leverBtnActive : ''}`}
                onClick={() => setActiveLever('tracking')}
              >
                <span>Server-Side CAPI</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Viewport Bottom Anchor Indicator */}
      <a href="#stats" className={styles.scrollIndicator} aria-label="Scroll down to stats">
        <span className={styles.scrollDot} />
        <span className={styles.scrollText}>Scroll for audited client telemetry</span>
        <span className={styles.scrollChevron}>↓</span>
      </a>
    </section>
  );
}
