import experienceConfig from '@/data/content/experience.json';
import styles from './Experience.module.css';
import {
  BriefcaseIcon,
  GraduationCapIcon,
  CheckCircleIcon,
} from '@/components/Icons/Icons';

export default function Experience() {
  return (
    <section id="experience" className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-badge">
          <span>Career Timeline</span>
        </div>
        <h2 className={styles.heading}>Experience & Education</h2>
        <p className={styles.sub}>
          4+ years dedicated exclusively to paid media performance, media analysis, and full-funnel optimization.
        </p>

        <div className={styles.timeline}>
          {experienceConfig.map((entry, i) => (
            <div
              key={entry.id}
              id={entry.id}
              className={`${styles.entry} ${entry.type === 'education' ? styles.education : ''}`}
            >
              {/* Timeline connector node */}
              <div className={styles.connector}>
                <div className={styles.nodeIcon}>
                  {entry.type === 'education' ? (
                    <GraduationCapIcon size={14} />
                  ) : (
                    <BriefcaseIcon size={14} />
                  )}
                </div>
                {i < experienceConfig.length - 1 && <div className={styles.line} />}
              </div>

              {/* Card Content */}
              <div className={styles.content}>
                <div className={styles.header}>
                  <div>
                    <h3 className={styles.title}>{entry.title}</h3>
                    <p className={styles.org}>
                      {entry.organisation}
                      <span className={styles.loc}> · {entry.location}</span>
                    </p>
                  </div>
                  <div className={styles.right}>
                    <span className={styles.period}>{entry.period}</span>
                    {entry.badge && (
                      <span className={styles.badge}>{entry.badge}</span>
                    )}
                  </div>
                </div>

                {entry.highlights.length > 0 && (
                  <ul className={styles.highlights}>
                    {entry.highlights.map((h, j) => (
                      <li key={j} className={styles.highlight}>
                        <CheckCircleIcon size={14} className={styles.checkIcon} />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
