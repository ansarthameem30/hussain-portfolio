import certificationsConfig from '@/data/content/certifications.json';
import styles from './Certifications.module.css';
import { AwardIcon, ArrowUpRightIcon } from '@/components/Icons/Icons';

const statusClass: Record<string, string> = {
  active: 'chip--active',
  expired: 'chip--expired',
  'no-expiry': 'chip--no-expiry',
};

export default function Certifications() {
  return (
    <section id="certifications" className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <div className="section-badge">
            <span>Certifications & Continuous Learning</span>
          </div>
          <h2 className={styles.heading}>Credentials & learning</h2>
          <p className={styles.sub}>
            Paid media certifications listed first. Full transparency on active status vs renewal dates.
          </p>
        </div>

        <div className={styles.grid}>
          {certificationsConfig.map((cert) => (
            <div key={cert.id} id={cert.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.issuerBadge}>
                  <AwardIcon size={18} />
                </div>
                <span className={`chip ${statusClass[cert.status]}`}>
                  {cert.statusLabel}
                </span>
              </div>

              <h3 className={styles.certName}>{cert.name}</h3>

              <div className={styles.meta}>
                <span className={styles.issuer}>{cert.issuer}</span>
                <span className={styles.dot}>·</span>
                <span className={styles.issued}>Issued {cert.issued}</span>
              </div>

              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn btn--secondary btn--sm ${styles.credBtn}`}
                  id={`${cert.id}-credential`}
                >
                  <span>Verify credential</span>
                  <ArrowUpRightIcon size={14} />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
