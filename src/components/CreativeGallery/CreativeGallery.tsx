'use client';

import { useState } from 'react';
import {
  creativeConfig,
  type CreativeCategory,
  type CreativeItem,
} from '@/config/content/creative.config';
import styles from './CreativeGallery.module.css';
import {
  PlayIcon,
  EyeIcon,
  CloseIcon,
  TrendingUpIcon,
  SparklesIcon,
  CheckCircleIcon,
} from '@/components/Icons/Icons';

export default function CreativeGallery() {
  const [activeCategory, setActiveCategory] = useState<CreativeCategory>('all');
  const [selectedItem, setSelectedItem] = useState<CreativeItem | null>(null);

  const filteredItems =
    activeCategory === 'all'
      ? creativeConfig.items
      : creativeConfig.items.filter((item) => item.category === activeCategory);

  return (
    <section id="creative" className={`section ${styles.section}`}>
      <div className="container">
        {/* Section Header */}
        <div className={styles.header}>
          <div className="section-badge">
            <span>Paid Social & Creative Strategy</span>
          </div>
          <h2 className={styles.title}>{creativeConfig.heading}</h2>
          <p className={styles.subheading}>{creativeConfig.subheading}</p>
          <div className={styles.disclaimerBadge}>
            <span className={styles.disclaimerDot} />
            <span>{creativeConfig.disclaimer}</span>
          </div>
        </div>

        {/* Filter Chips with mobile overflow scrolling */}
        <div className={styles.filterWrapper}>
          <div className={styles.filterRow} role="tablist" aria-label="Creative category filter">
            {creativeConfig.categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={isActive}
                  id={`tab-${cat.id}`}
                  className={`${styles.filterChip} ${isActive ? styles.filterChipActive : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 12 Tiles Grid */}
        <div className={styles.grid}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`${styles.card} ${item.format === 'reel' ? styles.cardReel : styles.cardPost}`}
              onClick={() => setSelectedItem(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setSelectedItem(item);
              }}
              aria-label={`View creative sample: ${item.title}`}
            >
              {/* Card visual mockup container */}
              <div
                className={styles.mockupContainer}
                style={{ background: item.colorScheme.bg }}
              >
                {/* Format pill & Category badge */}
                <div className={styles.topBar}>
                  <span
                    className={`${styles.formatBadge} ${
                      item.format === 'reel' ? styles.reelBadge : styles.postBadge
                    }`}
                  >
                    {item.format === 'reel' ? (
                      <>
                        <PlayIcon size={10} />
                        Reel {item.duration}
                      </>
                    ) : (
                      <>
                        <EyeIcon size={12} />
                        Post ({item.ratio})
                      </>
                    )}
                  </span>

                  <span className={styles.categoryBadge}>{item.colorScheme.badge}</span>
                </div>

                {/* Central Visual / Hook */}
                <div className={styles.mockupContent}>
                  {item.format === 'reel' && (
                    <div className={styles.playButtonOverlay}>
                      <div className={styles.playCircle}>
                        <PlayIcon size={14} />
                      </div>
                    </div>
                  )}

                  <p className={styles.hookText}>{item.hook}</p>
                </div>

                {/* Bottom stats pill */}
                <div className={styles.performanceRow}>
                  <span className={styles.performancePill}>
                    <TrendingUpIcon size={11} className={styles.pillIcon} />
                    <span>{item.performanceHighlight}</span>
                  </span>
                </div>
              </div>

              {/* Card Footer info */}
              <div className={styles.cardInfo}>
                <div className={styles.infoMeta}>
                  <span className={styles.industryTag}>{item.categoryLabel}</span>
                  <span className={styles.inspectBtn}>Inspect strategy →</span>
                </div>
                <h3 className={styles.itemTitle}>{item.title}</h3>
                <p className={styles.itemDesc}>{item.description}</p>

                {/* Tags */}
                <div className={styles.tagList}>
                  {item.tags.map((tag, i) => (
                    <span key={i} className={styles.pillTag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Detail View */}
        {selectedItem && (
          <div
            className={styles.modalOverlay}
            onClick={() => setSelectedItem(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div
              className={styles.modalBody}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.closeBtn}
                onClick={() => setSelectedItem(null)}
                aria-label="Close details"
              >
                <CloseIcon size={16} />
              </button>

              <div className={styles.modalGrid}>
                {/* Visual simulation side */}
                <div
                  className={styles.modalVisual}
                  style={{ background: selectedItem.colorScheme.bg }}
                >
                  <div className={styles.modalFormat}>
                    {selectedItem.format.toUpperCase()} · {selectedItem.ratio}
                  </div>
                  <div className={styles.modalHook}>{selectedItem.hook}</div>
                  <div className={styles.modalStatBadge}>
                    <TrendingUpIcon size={13} />
                    <span>{selectedItem.performanceHighlight}</span>
                  </div>
                </div>

                {/* Strategy breakdown side */}
                <div className={styles.modalDetails}>
                  <div className="section-badge">
                    <span>{selectedItem.categoryLabel}</span>
                  </div>
                  <h3 id="modal-title" className={styles.modalTitle}>
                    {selectedItem.title}
                  </h3>
                  <p className={styles.modalDesc}>{selectedItem.description}</p>

                  <div className={styles.modalSection}>
                    <h4 className={styles.modalSectionTitle}>Conversion Architecture</h4>
                    <ul className={styles.modalList}>
                      <li>
                        <strong>Hook Strategy:</strong> Designed to stop the scroll in first 1.5 seconds.
                      </li>
                      <li>
                        <strong>Target Placements:</strong> Meta Ads (Instagram Reels, Feed, Stories) & YouTube Shorts.
                      </li>
                      <li>
                        <strong>Conversion Goal:</strong> Direct form lead submission or instant WhatsApp message.
                      </li>
                    </ul>
                  </div>

                  <div className={styles.modalSection}>
                    <h4 className={styles.modalSectionTitle}>Targeting & Format Tags</h4>
                    <div className={styles.tagList}>
                      {selectedItem.tags.map((tag, i) => (
                        <span key={i} className={styles.pillTag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.modalDisclaimer}>
                    {creativeConfig.disclaimer}
                  </div>

                  <button
                    className="btn btn--primary btn--sm"
                    onClick={() => setSelectedItem(null)}
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
