import workflowData from '@/data/content/workflow.json';
const howIWorkConfig = workflowData.processSteps;
import styles from './HowIWork.module.css';
import {
  SearchCheckIcon,
  SlidersIcon,
  SparklesIcon,
  BarChartIcon,
} from '@/components/Icons/Icons';

const stepIcons: Record<string, React.ReactNode> = {
  'step-audit': <SearchCheckIcon size={22} />,
  'step-prioritise': <SlidersIcon size={22} />,
  'step-test': <SparklesIcon size={22} />,
  'step-report': <BarChartIcon size={22} />,
};

export default function HowIWork() {
  return (
    <section id="how-i-work" className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <div className="section-badge">
            <span>Methodology</span>
          </div>
          <h2 className={styles.heading}>How I work</h2>
          <p className={styles.sub}>
            Four steps, every single sprint. Data first, systematic testing, and measurable business growth.
          </p>
        </div>

        <div className={styles.steps}>
          {howIWorkConfig.map((step, i) => (
            <div key={step.id} id={step.id} className={styles.step}>
              <div className={styles.cardTop}>
                <div className={styles.iconWrap}>
                  {stepIcons[step.id] ?? <SparklesIcon size={22} />}
                </div>
                <span className={styles.number}>{step.number}</span>
              </div>

              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.desc}>{step.description}</p>

              <div className={styles.stepFooter}>
                <span className={styles.stepIndicator}>Phase {i + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
