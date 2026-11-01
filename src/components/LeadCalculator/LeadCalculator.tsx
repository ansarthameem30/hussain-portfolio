'use client';

import { useState } from 'react';
import styles from './LeadCalculator.module.css';
import {
  ArrowRightIcon,
  DownloadIcon,
  SparklesIcon,
  TrendingUpIcon,
} from '@/components/Icons/Icons';

const DEFAULT_BUDGET = 50000;
const DEFAULT_CPL = 1000;

export default function LeadCalculator() {
  const [budget, setBudget] = useState(DEFAULT_BUDGET);
  const [cpl, setCpl] = useState(DEFAULT_CPL);

  const currentLeads = Math.floor(budget / cpl);
  // Apply the 56% CPL reduction from the best account
  const newCpl = cpl * (1 - 0.56);
  const newLeads = Math.floor(budget / newCpl);
  const extraLeads = newLeads - currentLeads;
  const pctIncrease = Math.round((extraLeads / currentLeads) * 100);

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(v);

  return (
    <section id="calculator" className={`section ${styles.section}`}>
      <div className="container">
        {/* Unified Section Header */}
        <div className={styles.sectionHeader}>
          <div className="section-badge">
            <span>Interactive Model</span>
          </div>
          <h2 className={styles.heading}>What would a lower cost per lead mean for you?</h2>
          <p className={styles.sub}>
            Adjust your monthly ad budget and current cost per lead to see projected lead expansion under search query pruning and bid tuning.
          </p>
        </div>

        {/* Symmetric Dual-Card Grid */}
        <div className={styles.grid}>
          {/* Left Card: Input Controls */}
          <div className={styles.controlCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTag}>Input Variables</span>
              <h3 className={styles.cardTitle}>Account Parameters</h3>
            </div>

            <div className={styles.inputs}>
              {/* Budget Input */}
              <div className={styles.inputGroup}>
                <div className={styles.labelRow}>
                  <label htmlFor="calc-budget" className={styles.label}>
                    Monthly Ad Budget
                  </label>
                  <span className={styles.currentVal}>{formatCurrency(budget)}</span>
                </div>
                <div className={styles.inputWrap}>
                  <span className={styles.inputPrefix}>₹</span>
                  <input
                    id="calc-budget"
                    type="number"
                    className={`input ${styles.calcInput}`}
                    value={budget}
                    min={5000}
                    max={5000000}
                    step={5000}
                    onChange={(e) => setBudget(Math.max(1000, Number(e.target.value)))}
                  />
                </div>
                <input
                  type="range"
                  className={styles.slider}
                  min={10000}
                  max={500000}
                  step={5000}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  aria-label="Monthly budget slider"
                />
              </div>

              {/* CPL Input */}
              <div className={styles.inputGroup}>
                <div className={styles.labelRow}>
                  <label htmlFor="calc-cpl" className={styles.label}>
                    Current Cost Per Lead (CPL)
                  </label>
                  <span className={styles.currentVal}>{formatCurrency(cpl)}</span>
                </div>
                <div className={styles.inputWrap}>
                  <span className={styles.inputPrefix}>₹</span>
                  <input
                    id="calc-cpl"
                    type="number"
                    className={`input ${styles.calcInput}`}
                    value={cpl}
                    min={100}
                    max={20000}
                    step={100}
                    onChange={(e) => setCpl(Math.max(50, Number(e.target.value)))}
                  />
                </div>
                <input
                  type="range"
                  className={styles.slider}
                  min={200}
                  max={5000}
                  step={50}
                  value={cpl}
                  onChange={(e) => setCpl(Number(e.target.value))}
                  aria-label="Cost per lead slider"
                />
              </div>
            </div>

            {/* Note callout inside left card */}
            <div className={styles.noteCard}>
              <SparklesIcon size={16} className={styles.noteIcon} />
              <p>
                Based on Account 1 data: spend rose 5.6% while CPL fell 56%.
                Illustration only; actual performance depends on niche dynamics.
              </p>
            </div>
          </div>

          {/* Right Card: Output Projection (Matching Card) */}
          <div className={styles.resultCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTag}>Performance Forecast</span>
              <h3 className={styles.cardTitle}>Projected Lead Volume</h3>
            </div>

            <div className={styles.comparison}>
              <div className={styles.col}>
                <span className={styles.colLabel}>Current Baseline</span>
                <div className={styles.bigNum}>{currentLeads}</div>
                <span className={styles.colSub}>leads / month</span>
                <div className={styles.colMeta}>@ {formatCurrency(cpl)} / lead</div>
              </div>

              <div className={styles.arrowWrap}>
                <ArrowRightIcon size={20} className={styles.arrowIcon} />
              </div>

              <div className={`${styles.col} ${styles.colAccent}`}>
                <span className={styles.colLabel}>Optimized (-56% CPL)</span>
                <div className={styles.bigNumAccent}>{newLeads}</div>
                <span className={styles.colSub}>leads / month</span>
                <div className={styles.colMeta}>@ {formatCurrency(Math.round(newCpl))} / lead</div>
              </div>
            </div>

            <div className={styles.deltaBox}>
              <TrendingUpIcon size={18} className={styles.deltaIcon} />
              <div className={styles.deltaText}>
                <strong>+{extraLeads} additional qualified inquiries</strong>
                <span>+{pctIncrease}% volume expansion with zero extra ad spend</span>
              </div>
            </div>

            <div className={styles.cardActions}>
              <a href="#contact" className="btn btn--primary" id="calc-cta">
                <span>Discuss your account targets</span>
                <ArrowRightIcon size={15} />
              </a>

              <a
                href="#checks"
                className="btn btn--secondary btn--sm"
                id="btn-sample-report"
              >
                <DownloadIcon size={14} />
                <span>See sample reporting deck</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
