'use client';

import { useState } from 'react';
import resultsConfig from '@/data/content/projects.json';
import styles from './Results.module.css';
import {
  TrendingUpIcon,
  TrendingDownIcon,
  ChevronDownIcon,
  CheckCircleIcon,
} from '@/components/Icons/Icons';

export default function Results() {
  const [openId, setOpenId] = useState<string | null>(
    resultsConfig.caseStudies.find((c) => c.defaultOpen)?.id ?? null
  );

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section id="results" className={`section ${styles.section}`}>
      <div className="container">
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className="section-badge">
            <span>Verified Track Record</span>
          </div>
          <h2 className={styles.heading}>What the data shows</h2>
          <p className={styles.subheading}>
            Real figures from managed accounts across Google, Microsoft, and Meta Ads.
            Client brand names are redacted for contractual confidentiality.
          </p>
        </div>

        {/* 4 Highlight Tiles */}
        <div className={styles.highlights}>
          {resultsConfig.highlights.map((tile) => (
            <div key={tile.id} id={tile.id} className={styles.highlightTile}>
              <div className={styles.highlightMetric}>{tile.metric}</div>
              <p className={styles.highlightLabel}>{tile.label}</p>
            </div>
          ))}
        </div>

        {/* Case Study Accordions */}
        <div className={styles.accordions}>
          {resultsConfig.caseStudies.map((cs, i) => {
            const isOpen = openId === cs.id;
            const primaryMetric = cs.metrics[0];

            return (
              <div
                key={cs.id}
                id={cs.id}
                className={`${styles.accordion} ${isOpen ? styles.open : ''}`}
              >
                {/* Accordion Row Header (Always uniform height and cleanly aligned) */}
                <button
                  type="button"
                  className={styles.accordionHeader}
                  onClick={() => toggle(cs.id)}
                  aria-expanded={isOpen}
                  aria-controls={`${cs.id}-body`}
                >
                  <div className={styles.headerLeft}>
                    <div className={styles.accountBadge}>
                      Account 0{i + 1}
                    </div>
                    <span className={styles.accountHeadline}>{cs.headline}</span>
                  </div>

                  <div className={styles.headerRight}>
                    {/* Primary quick badge (visible in closed state) */}
                    {primaryMetric && (
                      <span
                        className={`metric-badge ${
                          primaryMetric.positive
                            ? 'metric-badge--positive'
                            : 'metric-badge--neutral'
                        } ${styles.primaryBadge}`}
                      >
                        {primaryMetric.positive ? (
                          <TrendingUpIcon size={12} />
                        ) : (
                          <TrendingDownIcon size={12} />
                        )}
                        <span>{primaryMetric.label}</span>
                        <strong>{primaryMetric.value}</strong>
                      </span>
                    )}

                    {/* Chevron Indicator */}
                    <div
                      className={`${styles.chevronWrapper} ${
                        isOpen ? styles.chevronOpen : ''
                      }`}
                    >
                      <ChevronDownIcon size={18} />
                    </div>
                  </div>
                </button>

                {/* Expanded Body */}
                <div
                  id={`${cs.id}-body`}
                  className={styles.accordionBody}
                  role="region"
                  aria-hidden={!isOpen}
                >
                  <div className={styles.accordionContent}>
                    {/* All metrics breakdown in expanded view */}
                    <div className={styles.expandedMetricsRow}>
                      {cs.metrics.map((m) => (
                        <div key={m.label} className={styles.expandedMetricCard}>
                          <span className={styles.expandedMetricLabel}>{m.label}</span>
                          <span
                            className={`${styles.expandedMetricVal} ${
                              m.positive ? styles.positiveVal : styles.neutralVal
                            }`}
                          >
                            {m.positive ? (
                              <TrendingUpIcon size={13} />
                            ) : (
                              <TrendingDownIcon size={13} />
                            )}
                            {m.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {cs.subline && <p className={styles.subline}>{cs.subline}</p>}

                    <div className={styles.executionBox}>
                      <span className={styles.whatLabel}>Execution Strategy & What I Did</span>
                      <ul className={styles.whatList}>
                        {cs.whatIDid.map((item, j) => (
                          <li key={j} className={styles.whatItem}>
                            <CheckCircleIcon size={15} className={styles.checkIcon} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
