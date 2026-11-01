'use client';

import { useState } from 'react';
import { checksConfig } from '@/config/content/checks.config';
import { siteConfig } from '@/config/site.config';
import styles from './ChecksAndCall.module.css';
import {
  ClockIcon,
  LocationPinIcon,
  CheckCircleIcon,
  LockIcon,
  CloseIcon,
  ArrowRightIcon,
  WhatsAppIcon,
  DownloadIcon,
  ShieldAlertIcon,
} from '@/components/Icons/Icons';

export default function ChecksAndCall() {
  const [showSampleModal, setShowSampleModal] = useState(false);

  return (
    <section id="checks" className={`section ${styles.section}`}>
      <div className="container">
        {/* Section Header */}
        <div className={styles.header}>
          <div className="section-badge">
            <span>Diagnostics & Due Diligence</span>
          </div>
          <h2 className={styles.title}>{checksConfig.heading}</h2>
          <p className={styles.subheading}>{checksConfig.subheading}</p>
        </div>

        {/* 1. Three Things I Check First */}
        <div className={styles.threeChecksWrapper}>
          <div className={styles.subHeaderBox}>
            <h3 className={styles.blockTitle}>{checksConfig.threeChecks.title}</h3>
            <p className={styles.blockDesc}>{checksConfig.threeChecks.description}</p>
          </div>

          <div className={styles.checksGrid}>
            {checksConfig.threeChecks.items.map((check) => (
              <div key={check.number} className={styles.checkCard}>
                <div className={styles.checkHeader}>
                  <span className={styles.checkNumber}>{check.number}</span>
                  <span className={styles.checkBadge}>{check.badge}</span>
                </div>
                <h4 className={styles.checkTitle}>{check.title}</h4>
                <p className={styles.checkDetail}>{check.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Grid with Recommendations, Book a Call & Sample Review */}
        <div className={styles.bottomGrid}>
          {/* Left: Book a 15-min call Card */}
          <div className={styles.callCard}>
            <div className={styles.callTag}>Direct Diagnostic Access</div>
            <h3 className={styles.callTitle}>{checksConfig.bookCall.title}</h3>
            <p className={styles.callDesc}>{checksConfig.bookCall.description}</p>

            <div className={styles.callMeta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Duration</span>
                <span className={styles.metaVal}>
                  <ClockIcon size={14} className={styles.metaIcon} />
                  {checksConfig.bookCall.duration}
                </span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Format</span>
                <span className={styles.metaVal}>
                  <LocationPinIcon size={14} className={styles.metaIcon} />
                  {checksConfig.bookCall.format}
                </span>
              </div>
            </div>

            <ul className={styles.perksList}>
              {checksConfig.bookCall.perks.map((perk, i) => (
                <li key={i} className={styles.perkItem}>
                  <CheckCircleIcon size={15} className={styles.perkCheck} />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>

            <div className={styles.callActions}>
              <a
                id="btn-book-calendar-call"
                href="#contact"
                className="btn btn--primary"
                onClick={(e) => {
                  e.preventDefault();
                  const contactEl = document.getElementById('contact');
                  if (contactEl) {
                    contactEl.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <span>{checksConfig.bookCall.buttonLabel}</span>
              </a>

              <a
                id="btn-call-whatsapp"
                href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                  'Hi Malik, I would like to schedule a 15-minute ad performance diagnostic.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--secondary"
              >
                <WhatsAppIcon size={16} />
                <span>WhatsApp Instant Chat</span>
              </a>
            </div>
          </div>

          {/* Right column: Honest Recommendations + Sample Review */}
          <div className={styles.secondaryCol}>
            {/* Recommendations Card */}
            <div className={styles.recCard}>
              <div className={styles.recHeader}>
                <h4 className={styles.recTitle}>{checksConfig.recommendations.title}</h4>
                <span className={styles.recBadge}>Verified Policy</span>
              </div>
              <p className={styles.recMessage}>
                {checksConfig.recommendations.placeholderMessage}
              </p>
              <div className={styles.recFooter}>
                <LockIcon size={14} className={styles.recLockIcon} />
                <span className={styles.recNote}>{checksConfig.recommendations.note}</span>
              </div>
            </div>

            {/* Extras 2: Sample Campaign Review Card */}
            <div className={styles.sampleCard}>
              <div className={styles.sampleTag}>Reporting Artifact</div>
              <h4 className={styles.sampleTitle}>{checksConfig.sampleReport.title}</h4>
              <p className={styles.sampleSubtitle}>{checksConfig.sampleReport.subtitle}</p>
              <p className={styles.sampleDesc}>{checksConfig.sampleReport.description}</p>

              <button
                id="btn-sample-report"
                className="btn btn--secondary btn--sm"
                onClick={() => setShowSampleModal(true)}
              >
                <DownloadIcon size={14} />
                <span>{checksConfig.sampleReport.buttonLabel}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sample Report Modal */}
        {showSampleModal && (
          <div
            className={styles.modalOverlay}
            onClick={() => setShowSampleModal(false)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.modalClose}
                onClick={() => setShowSampleModal(false)}
                aria-label="Close modal"
              >
                <CloseIcon size={16} />
              </button>

              <div className={styles.modalHeader}>
                <div className="section-badge">
                  <span>Sanitized Client Sample Review</span>
                </div>
                <h3 className={styles.modalTitle}>Executive Paid Search & Social Review</h3>
                <p className={styles.modalMeta}>
                  Prepared by Abdul Malik Hussain · Senior Performance Marketer
                </p>
              </div>

              <div className={styles.sampleDeckPreview}>
                <div className={styles.deckSection}>
                  <div className={styles.deckSectionHead}>1. Performance Summary (WoW & MoM)</div>
                  <div className={styles.deckTable}>
                    <div className={styles.deckTableRow}>
                      <span>Qualified Inquiries</span>
                      <strong>241 (+141% YoY)</strong>
                    </div>
                    <div className={styles.deckTableRow}>
                      <span>Blended Cost / Inq.</span>
                      <strong>₹840 (−56% YoY)</strong>
                    </div>
                    <div className={styles.deckTableRow}>
                      <span>Impression Share (Top)</span>
                      <strong>74.2% (+12.8%)</strong>
                    </div>
                  </div>
                </div>

                <div className={styles.deckSection}>
                  <div className={styles.deckSectionHead}>2. What Worked This Sprint</div>
                  <ul className={styles.deckBulletList}>
                    <li>
                      <CheckCircleIcon size={14} className={styles.deckCheck} />
                      <span>Pruned 42 wasteful search query strings, reclaiming ₹18,400 monthly burn.</span>
                    </li>
                    <li>
                      <CheckCircleIcon size={14} className={styles.deckCheck} />
                      <span>Scaled Phrase match variations on top 3 high-converting cluster terms.</span>
                    </li>
                    <li>
                      <CheckCircleIcon size={14} className={styles.deckCheck} />
                      <span>Restructured ad copy to emphasize upfront pricing, improving CTR to 4.2%.</span>
                    </li>
                  </ul>
                </div>

                <div className={styles.deckSection}>
                  <div className={styles.deckSectionHead}>3. Action Plan for Upcoming Cycle</div>
                  <ul className={styles.deckBulletList}>
                    <li>
                      <CheckCircleIcon size={14} className={styles.deckCheck} />
                      <span>Allocate 15% budget to expand localized Performance Max test.</span>
                    </li>
                    <li>
                      <CheckCircleIcon size={14} className={styles.deckCheck} />
                      <span>Launch 3 new video hooks targeting weekend decision makers.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <span className={styles.modalNote}>
                  * Identifiable client names, exact budgets, and proprietary domains are redacted.
                </span>
                <button
                  className="btn btn--primary btn--sm"
                  onClick={() => setShowSampleModal(false)}
                >
                  Dismiss Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
