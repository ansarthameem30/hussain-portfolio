'use client';

import React, { useState, useEffect } from 'react';
import styles from './admin.module.css';

type ContentType = 'profile' | 'projects' | 'skills' | 'experience' | 'certifications' | 'stats' | 'workflow';

export default function AdminDashboardPage() {
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active section & loaded data
  const [activeSection, setActiveSection] = useState<ContentType>('profile');
  const [contentData, setContentData] = useState<any>(null);
  const [rawJson, setRawJson] = useState<string>('');
  const [viewMode, setViewMode] = useState<'form' | 'json'>('form');

  // Status & notifications
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [githubConnected, setGithubConnected] = useState(false);

  // Commit modal
  const [showCommitModal, setShowCommitModal] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');

  // Check auth on load
  useEffect(() => {
    fetch('/api/admin/content?type=profile')
      .then((res) => {
        if (res.status === 401) {
          setIsAuthed(false);
        } else if (res.ok) {
          setIsAuthed(true);
          return res.json();
        }
      })
      .then((data) => {
        if (data && data.success) {
          setContentData(data.data);
          setRawJson(JSON.stringify(data.data, null, 2));
          setGithubConnected(data.githubConnected);
        }
      })
      .catch(() => setIsAuthed(false));
  }, []);

  // Fetch section content when section changes
  const loadSection = async (section: ContentType) => {
    setActiveSection(section);
    setIsLoading(true);
    setNotification(null);
    try {
      const res = await fetch(`/api/admin/content?type=${section}`);
      const result = await res.json();
      if (result.success) {
        setContentData(result.data);
        setRawJson(JSON.stringify(result.data, null, 2));
        setGithubConnected(result.githubConnected);
      } else {
        setNotification({ type: 'error', message: result.error || 'Failed to load content' });
      }
    } catch {
      setNotification({ type: 'error', message: 'Network error loading content' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const result = await res.json();
      if (result.success) {
        setIsAuthed(true);
        loadSection('profile');
      } else {
        setLoginError(result.error || 'Invalid master password');
      }
    } catch {
      setLoginError('Error connecting to login API');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setIsAuthed(false);
    setContentData(null);
  };

  const handleSaveAndPublish = async () => {
    setIsSaving(true);
    setNotification(null);

    let payload = contentData;
    if (viewMode === 'json') {
      try {
        payload = JSON.parse(rawJson);
      } catch (err) {
        setNotification({ type: 'error', message: 'Invalid JSON format. Please fix syntax errors before saving.' });
        setIsSaving(false);
        return;
      }
    }

    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeSection,
          data: payload,
          commitMessage: commitMessage || `Update ${activeSection} via Portfolio CMS Admin`,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setNotification({
          type: 'success',
          message: `${result.message} ${result.result.destination === 'github' ? '🚀 GitHub Commit pushed, triggering Vercel build!' : '💾 Local JSON updated.'}`,
        });
        setShowCommitModal(false);
        setCommitMessage('');
        // Reload fresh content
        loadSection(activeSection);
      } else {
        setNotification({
          type: 'error',
          message: result.error + (result.details ? `: ${JSON.stringify(result.details)}` : ''),
        });
      }
    } catch {
      setNotification({ type: 'error', message: 'Network error publishing content.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Render Login Screen if not authenticated
  if (isAuthed === false) {
    return (
      <div className={styles.loginWrapper}>
        <div className={styles.loginCard}>
          <div style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2rem' }}>🔒</div>
          <h1 className={styles.loginTitle}>Portfolio Admin</h1>
          <p className={styles.loginSubtitle}>Enter the admin key to manage portfolio content</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Admin Password"
              className={styles.loginInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
            {loginError && <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem' }}>{loginError}</p>}
            <button type="submit" className={styles.loginBtn}>
              Unlock Dashboard
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: '0.75rem' }}>
            Protected with HttpOnly Session Tokens
          </div>
        </div>
      </div>
    );
  }

  if (isAuthed === null) {
    return (
      <div className={styles.loginWrapper}>
        <p style={{ color: '#94a3b8' }}>Checking authorization...</p>
      </div>
    );
  }

  // Admin Dashboard UI
  return (
    <div className={styles.adminContainer}>
      {/* Top Navigation */}
      <header className={styles.adminHeader}>
        <div className={styles.brandGroup}>
          <span className={styles.brandBadge}>CMS</span>
          <h2 className={styles.adminTitle}>Abdul Malik Hussain Portfolio Admin</h2>
        </div>

        <div className={styles.headerActions}>
          <span className={styles.statusPill}>
            <span className={styles.statusDot}></span>
            {githubConnected ? 'GitHub Connected (Live)' : 'Local Mode'}
          </span>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none' }}
          >
            View Live Site ↗
          </a>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Log Out
          </button>
        </div>
      </header>

      <div className={styles.adminBody}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', padding: '0 0.5rem 0.5rem' }}>
            CONTENT SECTIONS
          </div>
          {[
            { id: 'profile', label: '👤 Profile & Bio' },
            { id: 'projects', label: '📈 Projects / Case Studies' },
            { id: 'skills', label: '⚡ Skills & Expertise' },
            { id: 'experience', label: '💼 Experience & Education' },
            { id: 'certifications', label: '🏆 Certifications' },
            { id: 'stats', label: '🔢 Numbers Strip' },
            { id: 'workflow', label: '⚙️ How I Work & Checks' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => loadSection(item.id as ContentType)}
              className={`${styles.navItem} ${activeSection === item.id ? styles.navItemActive : ''}`}
            >
              {item.label}
            </button>
          ))}

          <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5 }}>
              <strong>Publishing Workflow:</strong><br />
              1. Edit in Form or JSON<br />
              2. Zod validates schema<br />
              3. Commits to GitHub<br />
              4. Vercel auto-deploys
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className={styles.contentArea}>
          {/* Notifications */}
          {notification && (
            <div className={notification.type === 'success' ? styles.alertSuccess : styles.alertError}>
              <span>{notification.message}</span>
              <button
                onClick={() => setNotification(null)}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Section Header */}
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Editor
              </h2>
              <p className={styles.sectionDesc}>
                Changes are validated against the strict Zod schema before publishing.
              </p>
            </div>

            <div className={styles.actionGroup}>
              <div style={{ display: 'inline-flex', background: '#1e293b', borderRadius: '8px', padding: '3px' }}>
                <button
                  type="button"
                  onClick={() => setViewMode('form')}
                  style={{
                    padding: '0.4rem 0.8rem',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    background: viewMode === 'form' ? '#f59e0b' : 'transparent',
                    color: viewMode === 'form' ? '#0b0f17' : '#94a3b8',
                    fontWeight: viewMode === 'form' ? 600 : 400,
                  }}
                >
                  Form View
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRawJson(JSON.stringify(contentData, null, 2));
                    setViewMode('json');
                  }}
                  style={{
                    padding: '0.4rem 0.8rem',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    background: viewMode === 'json' ? '#f59e0b' : 'transparent',
                    color: viewMode === 'json' ? '#0b0f17' : '#94a3b8',
                    fontWeight: viewMode === 'json' ? 600 : 400,
                  }}
                >
                  Raw JSON
                </button>
              </div>

              <button
                onClick={() => setShowCommitModal(true)}
                disabled={isLoading || isSaving}
                className={styles.publishBtn}
              >
                Publish Changes →
              </button>
            </div>
          </div>

          {isLoading ? (
            <p style={{ color: '#94a3b8' }}>Loading section data...</p>
          ) : viewMode === 'json' ? (
            /* JSON Mode */
            <div className={styles.formCard}>
              <div className={styles.cardTitle}>
                <span>Direct JSON Editor</span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Validates on save</span>
              </div>
              <textarea
                value={rawJson}
                onChange={(e) => setRawJson(e.target.value)}
                className={styles.jsonEditor}
                rows={22}
              />
            </div>
          ) : (
            /* Form Mode (dynamic based on section) */
            <div>
              {activeSection === 'profile' && contentData && (
                <>
                  <div className={styles.formCard}>
                    <h3 className={styles.cardTitle}>Identity & Headlines</h3>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Full Name</label>
                        <input
                          type="text"
                          value={contentData.name || ''}
                          onChange={(e) => setContentData({ ...contentData, name: e.target.value })}
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Role / Title</label>
                        <input
                          type="text"
                          value={contentData.role || ''}
                          onChange={(e) => setContentData({ ...contentData, role: e.target.value })}
                          className={styles.input}
                        />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Hero Headline</label>
                      <input
                        type="text"
                        value={contentData.headline || ''}
                        onChange={(e) => setContentData({ ...contentData, headline: e.target.value })}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Subheadline</label>
                      <textarea
                        value={contentData.subheadline || ''}
                        onChange={(e) => setContentData({ ...contentData, subheadline: e.target.value })}
                        className={styles.textarea}
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className={styles.formCard}>
                    <h3 className={styles.cardTitle}>Bio & Background</h3>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Short Bio (About Card)</label>
                      <textarea
                        value={contentData.shortBio || ''}
                        onChange={(e) => setContentData({ ...contentData, shortBio: e.target.value })}
                        className={styles.textarea}
                        rows={3}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Full Bio (Paragraph 1)</label>
                      <textarea
                        value={contentData.fullBio?.[0] || ''}
                        onChange={(e) => {
                          const bio = [...(contentData.fullBio || [])];
                          bio[0] = e.target.value;
                          setContentData({ ...contentData, fullBio: bio });
                        }}
                        className={styles.textarea}
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className={styles.formCard}>
                    <h3 className={styles.cardTitle}>Direct Contact Links</h3>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Email Address</label>
                        <input
                          type="email"
                          value={contentData.contact?.email || ''}
                          onChange={(e) =>
                            setContentData({
                              ...contentData,
                              contact: { ...contentData.contact, email: e.target.value },
                            })
                          }
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>WhatsApp Number</label>
                        <input
                          type="text"
                          value={contentData.contact?.whatsapp || ''}
                          onChange={(e) =>
                            setContentData({
                              ...contentData,
                              contact: { ...contentData.contact, whatsapp: e.target.value },
                            })
                          }
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>LinkedIn Profile URL</label>
                        <input
                          type="url"
                          value={contentData.contact?.linkedin || ''}
                          onChange={(e) =>
                            setContentData({
                              ...contentData,
                              contact: { ...contentData.contact, linkedin: e.target.value },
                            })
                          }
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Calendly / Booking URL</label>
                        <input
                          type="text"
                          value={contentData.contact?.calendarLink || ''}
                          onChange={(e) =>
                            setContentData({
                              ...contentData,
                              contact: { ...contentData.contact, calendarLink: e.target.value },
                            })
                          }
                          className={styles.input}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Projects & Results Form */}
              {activeSection === 'projects' && contentData && (
                <div>
                  <div className={styles.formCard}>
                    <h3 className={styles.cardTitle}>Case Studies ({contentData.caseStudies?.length || 0})</h3>
                    {contentData.caseStudies?.map((cs: any, idx: number) => (
                      <div
                        key={cs.id || idx}
                        style={{
                          background: '#0d131f',
                          padding: '1.25rem',
                          borderRadius: '8px',
                          marginBottom: '1rem',
                          border: '1px solid rgba(255,255,255,0.05)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 600, color: '#f59e0b' }}>{cs.account}</span>
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ID: {cs.id}</span>
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>Headline</label>
                          <input
                            type="text"
                            value={cs.headline || ''}
                            onChange={(e) => {
                              const studies = [...contentData.caseStudies];
                              studies[idx].headline = e.target.value;
                              setContentData({ ...contentData, caseStudies: studies });
                            }}
                            className={styles.input}
                          />
                        </div>
                        <div className={styles.formGrid}>
                          {cs.metrics?.map((m: any, mIdx: number) => (
                            <div key={mIdx} className={styles.formGroup}>
                              <label className={styles.label}>{m.label}</label>
                              <input
                                type="text"
                                value={m.value || ''}
                                onChange={(e) => {
                                  const studies = [...contentData.caseStudies];
                                  studies[idx].metrics[mIdx].value = e.target.value;
                                  setContentData({ ...contentData, caseStudies: studies });
                                }}
                                className={styles.input}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Default JSON fallback for complex nested sections in Form Mode */}
              {activeSection !== 'profile' && activeSection !== 'projects' && (
                <div className={styles.formCard}>
                  <div className={styles.cardTitle}>
                    <span>{activeSection.toUpperCase()} Content Data</span>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Interactive Data View</span>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    You can inspect and fine-tune all entries here with instant schema validation upon publishing:
                  </p>
                  <textarea
                    value={rawJson}
                    onChange={(e) => {
                      setRawJson(e.target.value);
                      try {
                        setContentData(JSON.parse(e.target.value));
                      } catch {
                        // Keep typing in JSON
                      }
                    }}
                    className={styles.jsonEditor}
                    rows={18}
                  />
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Commit & Publish Modal */}
      {showCommitModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <h3 style={{ marginTop: 0, color: '#fff', fontSize: '1.25rem' }}>Publish Changes</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Publishing will validate data against the schema and commit changes to{' '}
              <strong style={{ color: '#f59e0b' }}>
                {githubConnected ? 'GitHub (main branch)' : 'Local Project Data'}
              </strong>
              {githubConnected && ' which automatically triggers a Vercel production rebuild.'}
            </p>

            <div className={styles.formGroup} style={{ marginTop: '1.25rem' }}>
              <label className={styles.label}>Commit / Change Summary</label>
              <input
                type="text"
                placeholder={`Update ${activeSection} via Admin Dashboard`}
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                className={styles.input}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
              <button
                type="button"
                onClick={() => setShowCommitModal(false)}
                className={styles.secondaryBtn}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAndPublish}
                disabled={isSaving}
                className={styles.publishBtn}
              >
                {isSaving ? 'Validating & Publishing...' : 'Confirm & Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
