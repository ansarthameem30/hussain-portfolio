'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site.config';
import { useTheme } from '@/providers/ThemeProvider';
import ThemeStudio from '@/components/ThemeStudio/ThemeStudio';
import styles from './Header.module.css';
import {
  WhatsAppIcon,
  DownloadIcon,
  CloseIcon,
  SunIcon,
  MoonIcon,
} from '@/components/Icons/Icons';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const {
    themeId,
    theme,
    toggleLightDark,
    openThemeStudio,
  } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleNavClick = () => setMobileOpen(false);

  return (
    <>
      <header
        className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
        id="header"
      >
        <div className={`container ${styles.inner}`}>
          {/* Logo */}
          <Link href="#hero" className={styles.logo} onClick={handleNavClick}>
            <span className={styles.logoName}>{siteConfig.shortTitle}</span>
            <span className={styles.logoRole}>{siteConfig.role}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className={styles.nav} aria-label="Main navigation">
            {siteConfig.navLinks.map((link) => (
              <a key={link.href} href={link.href} className={styles.navLink}>
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Controls */}
          <div className={styles.actions}>
            {/* Quick Light/Dark Toggle */}
            <button
              id="btn-quick-theme-toggle"
              className={`${styles.themeQuickBtn} ${themeId === 'light' ? styles.themeBtnLight : ''}`}
              onClick={toggleLightDark}
              aria-label="Toggle light or dark mode"
              title={themeId === 'light' ? 'Switch to Dark Mode (Emerald Obsidian)' : 'Switch to Executive Light Mode'}
            >
              {themeId === 'light' ? <MoonIcon size={17} /> : <SunIcon size={17} />}
            </button>

            {/* Theme Studio Button (Launches Studio Modal) */}
            <button
              id="btn-open-theme-studio"
              className={styles.themeStudioBtn}
              onClick={openThemeStudio}
              aria-label="Open Theme Studio"
              title="Explore 3 Curated Executive Profiles"
            >
              <PaletteIcon />
              <span className={styles.themeStudioLabel}>{theme.label}</span>
              <span className={styles.themeStudioCount}>3</span>
            </button>

            {/* WhatsApp (Always visible) */}
            <a
              id="btn-header-whatsapp"
              href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                siteConfig.whatsappMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappBtn}
              aria-label="Chat on WhatsApp"
            >
              <WhatsAppIcon size={18} />
            </a>

            {/* Desktop Resume Button */}
            <a
              id="btn-header-resume"
              href={siteConfig.resumeUrl}
              download
              className={`btn btn--primary ${styles.desktopResumeBtn}`}
            >
              <DownloadIcon size={14} />
              <span>Resume</span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              id="btn-mobile-menu"
              className={styles.hamburger}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <CloseIcon size={20} className={styles.hamburgerIcon} />
              ) : (
                <div className={styles.hamburgerBars}>
                  <span className={styles.bar} />
                  <span className={styles.bar} />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Drawer (Full screen overlay with smooth blur) */}
        {mobileOpen && (
          <div className={styles.mobileNavOverlay} onClick={() => setMobileOpen(false)}>
            <div
              className={styles.mobileNavContent}
              onClick={(e) => e.stopPropagation()}
              aria-label="Mobile navigation"
            >
              <div className={styles.mobileNavHeader}>
                <span className={styles.mobileNavTitle}>Navigation</span>
                <button
                  className={styles.mobileNavClose}
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <CloseIcon size={18} />
                </button>
              </div>

              <nav className={styles.mobileNavList}>
                {siteConfig.navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={styles.mobileNavLink}
                    onClick={handleNavClick}
                  >
                    <span>{link.label}</span>
                    <span className={styles.navArrow}>→</span>
                  </a>
                ))}
              </nav>

              {/* Mobile Theme Studio Launcher */}
              <div className={styles.mobileThemeSection}>
                <span className={styles.mobileSectionLabel}>Theme Studio</span>
                <button
                  className={styles.mobileThemeStudioBtn}
                  onClick={() => {
                    setMobileOpen(false);
                    openThemeStudio();
                  }}
                >
                  <PaletteIcon />
                  <div className={styles.mobileThemeStudioText}>
                    <strong>Explore 3 Executive Profiles</strong>
                    <small>Active: {theme.label} ({theme.vibe})</small>
                  </div>
                  <span className={styles.navArrow}>→</span>
                </button>
              </div>

              {/* Mobile Action CTAs */}
              <div className={styles.mobileCtas}>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                    siteConfig.whatsappMessage
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--secondary"
                  onClick={handleNavClick}
                >
                  <WhatsAppIcon size={16} />
                  <span>WhatsApp Message</span>
                </a>

                <a
                  href={siteConfig.resumeUrl}
                  download
                  className="btn btn--primary"
                  onClick={handleNavClick}
                >
                  <DownloadIcon size={15} />
                  <span>Download Resume (PDF)</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Theme Studio Modal */}
      <ThemeStudio />
    </>
  );
}

function PaletteIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}
