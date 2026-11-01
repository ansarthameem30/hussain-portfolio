'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { CloseIcon, SunIcon, MoonIcon } from '@/components/Icons/Icons';
import styles from './ThemeStudio.module.css';

export default function ThemeStudio() {
  const {
    themeId,
    theme,
    setTheme,
    toggleLightDark,
    availableThemes,
    isThemeStudioOpen,
    closeThemeStudio,
  } = useTheme();

  const [filter, setFilter] = useState<'all' | 'dark' | 'light'>('all');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isThemeStudioOpen) {
      document.body.style.overflow = 'hidden';
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeThemeStudio();
      };
      window.addEventListener('keydown', onKeyDown);
      return () => {
        window.removeEventListener('keydown', onKeyDown);
        document.body.style.overflow = '';
      };
    }
  }, [isThemeStudioOpen, closeThemeStudio]);

  if (!isThemeStudioOpen) return null;

  const filteredThemes = availableThemes.filter((t) => {
    if (filter === 'dark') return !t.isLight;
    if (filter === 'light') return t.isLight;
    return true;
  });

  return (
    <div
      className={styles.overlay}
      onClick={closeThemeStudio}
      role="dialog"
      aria-modal="true"
      aria-label="Theme Studio"
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.header}>
          <div>
            <div className={styles.headerTitleGroup}>
              <h2 className={styles.title}>Theme Studio</h2>
              <span className={styles.countBadge}>{availableThemes.length} Curated Profiles</span>
            </div>
            <p className={styles.subtitle}>
              Bespoke color grading profiles engineered for executive clarity
            </p>
          </div>
          <button
            className={styles.closeBtn}
            onClick={closeThemeStudio}
            aria-label="Close Theme Studio"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tabBtn} ${filter === 'all' ? styles.tabBtnActive : ''}`}
            onClick={() => setFilter('all')}
          >
            All Themes ({availableThemes.length})
          </button>
          <button
            className={`${styles.tabBtn} ${filter === 'dark' ? styles.tabBtnActive : ''}`}
            onClick={() => setFilter('dark')}
          >
            Executive Dark ({availableThemes.filter((t) => !t.isLight).length})
          </button>
          <button
            className={`${styles.tabBtn} ${filter === 'light' ? styles.tabBtnActive : ''}`}
            onClick={() => setFilter('light')}
          >
            Crisp Daylight ({availableThemes.filter((t) => t.isLight).length})
          </button>
        </div>

        {/* Cards Grid */}
        <div className={styles.body}>
          {filteredThemes.map((t) => {
            const isSelected = themeId === t.id;
            return (
              <div
                key={t.id}
                className={`${styles.themeCard} ${isSelected ? styles.themeCardActive : ''}`}
                onClick={() => setTheme(t.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setTheme(t.id);
                  }
                }}
              >
                {isSelected && (
                  <span className={styles.activeCheck} aria-label="Active theme">
                    ✓
                  </span>
                )}

                {/* Miniature UI Mockup */}
                <div
                  className={styles.mockup}
                  style={{
                    backgroundColor: t.preview.bg,
                    borderColor: isSelected ? t.preview.accent : 'rgba(255,255,255,0.08)',
                  }}
                >
                  <div className={styles.mockupHeader}>
                    <div
                      className={styles.mockupDot}
                      style={{ backgroundColor: t.preview.text }}
                    />
                    <div
                      className={styles.mockupBtn}
                      style={{ backgroundColor: t.preview.accent }}
                    />
                  </div>
                  <div
                    className={styles.mockupCard}
                    style={{ backgroundColor: t.preview.card }}
                  >
                    <div
                      className={styles.mockupLine}
                      style={{ backgroundColor: t.preview.text }}
                    />
                    <div
                      className={styles.mockupLineSub}
                      style={{ backgroundColor: t.preview.accent }}
                    />
                    <div className={styles.mockupBar}>
                      <div
                        className={styles.mockupBarFill}
                        style={{ backgroundColor: t.preview.accent }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Info */}
                <div className={styles.cardMeta}>
                  <span className={styles.vibeBadge}>{t.vibe}</span>
                </div>
                <h3 className={styles.cardTitle}>{t.label}</h3>
                <p className={styles.cardTagline}>{t.tagline}</p>

                {/* Swatch dots */}
                <div className={styles.swatches}>
                  <span
                    className={styles.swatch}
                    style={{ backgroundColor: t.preview.bg }}
                    title={`Background: ${t.preview.bg}`}
                  />
                  <span
                    className={styles.swatch}
                    style={{ backgroundColor: t.preview.card }}
                    title={`Card: ${t.preview.card}`}
                  />
                  <span
                    className={styles.swatch}
                    style={{ backgroundColor: t.preview.accent }}
                    title={`Accent: ${t.preview.accent}`}
                  />
                  <span
                    className={styles.swatch}
                    style={{ backgroundColor: t.preview.text }}
                    title={`Text: ${t.preview.text}`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <span className={styles.footerHint}>
            Instant persistence via local storage · Custom token pipeline
          </span>
          <button
            className={styles.toggleQuickBtn}
            onClick={toggleLightDark}
          >
            {theme.isLight ? (
              <>
                <MoonIcon size={14} />
                <span>Toggle to Royal Amethyst</span>
              </>
            ) : (
              <>
                <SunIcon size={14} />
                <span>Toggle to Daylight Crisp</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
