import profileData from '@/data/content/profile.json';
import { siteConfig } from '@/config/site.config';
import styles from './About.module.css';
import Image from 'next/image';
import {
  ArrowRightIcon,
  DownloadIcon,
  CheckCircleIcon,
  BriefcaseIcon,
  BarChartIcon,
} from '@/components/Icons/Icons';

export default function About() {
  return (
    <section id="about" className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <div className="section-badge">
            <span>About me</span>
          </div>
          <h2 className={styles.sectionTitle}>The person behind the numbers</h2>
        </div>

        <div className={styles.grid}>
          {/* Left Card: Portrait & Quick Facts */}
          <div className={styles.photoCard}>
            <div className={styles.photoWrap}>
              <Image
                src={profileData.headshot || siteConfig.headshot || '/headshot.jpg'}
                alt={`${profileData.name || siteConfig.name} – Senior Campaign Manager`}
                width={400}
                height={460}
                className={styles.photo}
                priority={false}
                unoptimized
              />
              <div className={styles.photoOverlay} />
              <div className={styles.photoBadge}>
                <CheckCircleIcon size={13} className={styles.badgeIcon} />
                <span>Available for performance roles</span>
              </div>
            </div>

            {/* Quick facts inside the left card */}
            <div className={styles.quickFacts}>
              {profileData.quickFacts.map((fact) => (
                <div key={fact.label} className={styles.fact}>
                  <span className={styles.factLabel}>{fact.label}</span>
                  <span className={styles.factValue}>{fact.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Card: Editorial Story, Pillars & CTAs (Wrapped matching card) */}
          <div className={styles.storyCard}>
            <p className={styles.leadPara}>
              &ldquo;{profileData.shortBio}&rdquo;
            </p>

            <div className={styles.bioParagraphs}>
              {profileData.fullBio.map((para, i) => (
                <p key={i} className={styles.bioPara}>
                  {para}
                </p>
              ))}
            </div>

            {/* Pillars Grid */}
            <div className={styles.pillarsGrid}>
              <div className={styles.pillar}>
                <div className={styles.pillarIcon}>
                  <BriefcaseIcon size={16} />
                </div>
                <div>
                  <strong>$4M–$5M Monthly Spend</strong>
                  <p>Direct oversight of cross-channel multi-client ad accounts.</p>
                </div>
              </div>

              <div className={styles.pillar}>
                <div className={styles.pillarIcon}>
                  <BarChartIcon size={16} />
                </div>
                <div>
                  <strong>Engineering-Driven</strong>
                  <p>Mechanical engineering foundation prioritizing clean query telemetry.</p>
                </div>
              </div>
            </div>

            <div className={styles.ctas}>
              <a href="#contact" className="btn btn--primary">
                <span>Get in touch</span>
                <ArrowRightIcon size={15} />
              </a>
              <a href={siteConfig.resumeUrl} download className="btn btn--secondary">
                <DownloadIcon size={15} />
                <span>Download resume</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
