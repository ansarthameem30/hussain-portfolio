import { skillsConfig } from '@/config/content/skills.config';
import styles from './Expertise.module.css';

export default function Expertise() {
  return (
    <section id="expertise" className={`section ${styles.section}`}>
      <div className="container">
        <span className="section-label">Expertise</span>
        <h2 className={styles.heading}>Skills & tools</h2>
        <p className={styles.sub}>
          No percentage bars — just what I actually know and use.
        </p>

        <div className={styles.groups}>
          {skillsConfig.map((group) => (
            <div key={group.id} id={group.id} className={styles.group}>
              <h4 className={styles.groupLabel}>{group.group}</h4>
              <div className={styles.chips}>
                {group.skills.map((skill) => (
                  <span key={skill} className="chip">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
