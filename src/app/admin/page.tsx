'use client';

import React, { useState, useEffect } from 'react';
import styles from './admin.module.css';
import {
  UserIcon,
  BarChartIcon,
  ZapIcon,
  BriefcaseIcon,
  AwardIcon,
  HashIcon,
  GitMergeIcon,
  LockIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ExternalLinkIcon,
  LogOutIcon,
  SaveIcon,
  CodeIcon,
  EditIcon,
  MenuIcon,
  CloseIcon,
  GitHubIcon,
  RefreshIcon,
} from '@/components/Icons/AdminIcons';

type ContentType = 'profile' | 'projects' | 'skills' | 'experience' | 'certifications' | 'stats' | 'workflow';

interface SectionNavItem {
  id: ContentType;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: SectionNavItem[] = [
  { id: 'profile', label: 'Profile & Identity', icon: <UserIcon size={18} /> },
  { id: 'projects', label: 'Projects & Case Studies', icon: <BarChartIcon size={18} /> },
  { id: 'stats', label: 'Numbers Strip', icon: <HashIcon size={18} /> },
  { id: 'skills', label: 'Skills & Tools', icon: <ZapIcon size={18} /> },
  { id: 'experience', label: 'Experience & Degrees', icon: <BriefcaseIcon size={18} /> },
  { id: 'certifications', label: 'Certifications', icon: <AwardIcon size={18} /> },
  { id: 'workflow', label: 'How I Work & Leaks', icon: <GitMergeIcon size={18} /> },
];

export default function AdminDashboardPage() {
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Check auth on initial load
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
    setMobileMenuOpen(false);
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
        setNotification({ type: 'error', message: result.error || 'Failed to load content.' });
      }
    } catch {
      setNotification({ type: 'error', message: 'Network error loading content.' });
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
      setLoginError('Error connecting to authentication service.');
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
      } catch (err: any) {
        setNotification({ type: 'error', message: `Invalid JSON syntax: ${err.message}` });
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
          message: `${result.message} ${result.result?.destination === 'github' ? 'Changes pushed to GitHub. Vercel deployment triggered!' : 'Local workspace JSON updated.'}`,
        });
        setShowCommitModal(false);
        setCommitMessage('');
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

  // Render Login Lock Screen if unauthenticated
  if (isAuthed === false) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginIconCircle}>
            <LockIcon size={24} />
          </div>
          <h1 className={styles.loginTitle}>Admin Console</h1>
          <p className={styles.loginSubtitle}>
            Enter your master password to authenticate and edit portfolio content.
          </p>
          <form onSubmit={handleLogin}>
            <div className={styles.loginInputWrap}>
              <input
                type="password"
                placeholder="Enter admin password..."
                className={styles.loginInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
            </div>
            {loginError && (
              <div style={{ color: '#f87171', fontSize: '0.825rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertCircleIcon size={16} />
                <span>{loginError}</span>
              </div>
            )}
            <button type="submit" className={styles.loginSubmitBtn}>
              <LockIcon size={16} />
              <span>Unlock Admin Panel</span>
            </button>
          </form>
          <div className={styles.loginFooter}>
            Session protected with secure HttpOnly cookies
          </div>
        </div>
      </div>
    );
  }

  if (isAuthed === null) {
    return (
      <div className={styles.loginContainer}>
        <div style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
          <RefreshIcon size={18} />
          <span>Verifying credentials...</span>
        </div>
      </div>
    );
  }

  // Active Section Title Formatter
  const currentNav = NAV_ITEMS.find((n) => n.id === activeSection);

  return (
    <div className={styles.adminRoot}>
      {/* Top Header */}
      <header className={styles.topNav}>
        <div className={styles.navBrand}>
          <button
            type="button"
            className={styles.mobileMenuBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
          </button>
          <span className={styles.brandPill}>CMS</span>
          <h1 className={styles.brandName}>
            Abdul Malik Hussain <span>· Portfolio Studio</span>
          </h1>
        </div>

        <div className={styles.navActions}>
          <span className={styles.connectionBadge}>
            <span className={styles.connectionDot}></span>
            <GitHubIcon size={14} />
            <span>{githubConnected ? 'GitHub Live' : 'Local Data'}</span>
          </span>

          <a href="/" target="_blank" rel="noopener noreferrer" className={styles.siteLink}>
            <span>View Site</span>
            <ExternalLinkIcon size={14} />
          </a>

          <button onClick={handleLogout} className={styles.logoutBtn} title="Log Out">
            <LogOutIcon size={15} />
            <span>Exit</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className={styles.dashboardBody}>
        {/* Sidebar Nav */}
        <aside className={`${styles.sidebar} ${mobileMenuOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarGroupLabel}>Content Architecture</div>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => loadSection(item.id)}
              className={`${styles.navButton} ${activeSection === item.id ? styles.navButtonActive : ''}`}
            >
              <span className={styles.navButtonIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          <div className={styles.sidebarFooter}>
            <div style={{ color: '#ffd23f', fontWeight: 600, marginBottom: '0.35rem' }}>
              Publishing Workflow
            </div>
            1. Edit Form or JSON<br />
            2. Validate schema<br />
            3. Commit directly to GitHub<br />
            4. Vercel auto-deploys
          </div>
        </aside>

        {/* Content Viewport */}
        <main className={styles.mainViewport}>
          {/* Status Notifications */}
          {notification && (
            <div className={notification.type === 'success' ? styles.bannerSuccess : styles.bannerError}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                {notification.type === 'success' ? <CheckCircleIcon size={18} /> : <AlertCircleIcon size={18} />}
                <span>{notification.message}</span>
              </div>
              <button
                onClick={() => setNotification(null)}
                className={styles.bannerCloseBtn}
                aria-label="Close notification"
              >
                <CloseIcon size={16} />
              </button>
            </div>
          )}

          {/* Section Controller */}
          <div className={styles.viewHeader}>
            <div className={styles.titleArea}>
              <h2 className={styles.viewTitle}>
                {currentNav?.icon}
                <span>{currentNav?.label}</span>
              </h2>
              <p className={styles.viewSubtitle}>
                Edit and preview section content. Every update is verified by strict Zod schema validation.
              </p>
            </div>

            <div className={styles.actionRow}>
              {/* Segmented Switcher */}
              <div className={styles.modeSegmented}>
                <button
                  type="button"
                  onClick={() => setViewMode('form')}
                  className={`${styles.segmentBtn} ${viewMode === 'form' ? styles.segmentBtnActive : ''}`}
                >
                  <EditIcon size={14} />
                  <span>Form View</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRawJson(JSON.stringify(contentData, null, 2));
                    setViewMode('json');
                  }}
                  className={`${styles.segmentBtn} ${viewMode === 'json' ? styles.segmentBtnActive : ''}`}
                >
                  <CodeIcon size={14} />
                  <span>Raw JSON</span>
                </button>
              </div>

              {/* Publish Action Button */}
              <button
                type="button"
                onClick={() => setShowCommitModal(true)}
                disabled={isLoading || isSaving}
                className={styles.publishPrimaryBtn}
              >
                <SaveIcon size={16} />
                <span>Publish Section</span>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div style={{ padding: '3rem 0', textAlign: 'center', color: '#94a3b8' }}>
              <RefreshIcon size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: '0.5rem' }} />
              <div>Loading section data...</div>
            </div>
          ) : viewMode === 'json' ? (
            /* ── JSON Raw Code Mode ── */
            <div className={styles.codeEditorWrapper}>
              <div className={styles.codeEditorHeader}>
                <span>src/data/content/{activeSection}.json</span>
                <span>Type: UTF-8 JSON</span>
              </div>
              <textarea
                value={rawJson}
                onChange={(e) => setRawJson(e.target.value)}
                className={styles.codeTextarea}
                spellCheck={false}
              />
            </div>
          ) : (
            /* ── Dedicated Clean Form Editors ── */
            <div>
              {/* 1. Profile Section Form */}
              {activeSection === 'profile' && contentData && (
                <>
                  <div className={styles.cardSection}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardHeading}>Identity & Hero Presentation</h3>
                      <span className={styles.cardBadge}>Core Profile</span>
                    </div>

                    <div className={styles.gridTwoCol}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Display Name</label>
                        <input
                          type="text"
                          value={contentData.name || ''}
                          onChange={(e) => setContentData({ ...contentData, name: e.target.value })}
                          className={styles.fieldInput}
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Professional Role</label>
                        <input
                          type="text"
                          value={contentData.role || ''}
                          onChange={(e) => setContentData({ ...contentData, role: e.target.value })}
                          className={styles.fieldInput}
                        />
                      </div>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Hero Main Headline</label>
                      <input
                        type="text"
                        value={contentData.headline || ''}
                        onChange={(e) => setContentData({ ...contentData, headline: e.target.value })}
                        className={styles.fieldInput}
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Subheadline</label>
                      <textarea
                        value={contentData.subheadline || ''}
                        onChange={(e) => setContentData({ ...contentData, subheadline: e.target.value })}
                        className={styles.fieldTextarea}
                        rows={3}
                      />
                    </div>

                    <div className={styles.gridTwoCol}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Location</label>
                        <input
                          type="text"
                          value={contentData.location || ''}
                          onChange={(e) => setContentData({ ...contentData, location: e.target.value })}
                          className={styles.fieldInput}
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Availability Tagline</label>
                        <input
                          type="text"
                          value={contentData.availability || ''}
                          onChange={(e) => setContentData({ ...contentData, availability: e.target.value })}
                          className={styles.fieldInput}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardSection}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardHeading}>Biography & Copy</h3>
                      <span className={styles.cardBadge}>About Section</span>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Short Bio (Summary Card)</label>
                      <textarea
                        value={contentData.shortBio || ''}
                        onChange={(e) => setContentData({ ...contentData, shortBio: e.target.value })}
                        className={styles.fieldTextarea}
                        rows={3}
                      />
                    </div>

                    {contentData.fullBio?.map((paragraph: string, pIdx: number) => (
                      <div key={pIdx} className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Full Bio (Paragraph {pIdx + 1})</label>
                        <textarea
                          value={paragraph}
                          onChange={(e) => {
                            const newBio = [...contentData.fullBio];
                            newBio[pIdx] = e.target.value;
                            setContentData({ ...contentData, fullBio: newBio });
                          }}
                          className={styles.fieldTextarea}
                          rows={3}
                        />
                      </div>
                    ))}
                  </div>

                  <div className={styles.cardSection}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardHeading}>Direct Communication Channels</h3>
                      <span className={styles.cardBadge}>Contact Links</span>
                    </div>

                    <div className={styles.gridTwoCol}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Email Address</label>
                        <input
                          type="email"
                          value={contentData.contact?.email || ''}
                          onChange={(e) =>
                            setContentData({
                              ...contentData,
                              contact: { ...contentData.contact, email: e.target.value },
                            })
                          }
                          className={styles.fieldInput}
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>WhatsApp (International Format)</label>
                        <input
                          type="text"
                          value={contentData.contact?.whatsapp || ''}
                          onChange={(e) =>
                            setContentData({
                              ...contentData,
                              contact: { ...contentData.contact, whatsapp: e.target.value },
                            })
                          }
                          className={styles.fieldInput}
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>LinkedIn Profile URL</label>
                        <input
                          type="url"
                          value={contentData.contact?.linkedin || ''}
                          onChange={(e) =>
                            setContentData({
                              ...contentData,
                              contact: { ...contentData.contact, linkedin: e.target.value },
                            })
                          }
                          className={styles.fieldInput}
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Booking / Diagnostic Link</label>
                        <input
                          type="text"
                          value={contentData.contact?.calendarLink || ''}
                          onChange={(e) =>
                            setContentData({
                              ...contentData,
                              contact: { ...contentData.contact, calendarLink: e.target.value },
                            })
                          }
                          className={styles.fieldInput}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* 2. Projects & Case Studies */}
              {activeSection === 'projects' && contentData && (
                <>
                  <div className={styles.cardSection}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardHeading}>Highlight Metrics Strip</h3>
                      <span className={styles.cardBadge}>4 Highlight Cards</span>
                    </div>
                    <div className={styles.gridTwoCol}>
                      {contentData.highlights?.map((hl: any, idx: number) => (
                        <div key={hl.id || idx} className={styles.itemCard}>
                          <div className={styles.itemHeader}>
                            <span className={styles.itemTitle}>{hl.label}</span>
                            <span className={styles.itemTag}>{hl.id}</span>
                          </div>
                          <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Metric Value</label>
                            <input
                              type="text"
                              value={hl.metric || ''}
                              onChange={(e) => {
                                const newHls = [...contentData.highlights];
                                newHls[idx].metric = e.target.value;
                                setContentData({ ...contentData, highlights: newHls });
                              }}
                              className={styles.fieldInput}
                            />
                          </div>
                          <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Metric Label</label>
                            <input
                              type="text"
                              value={hl.label || ''}
                              onChange={(e) => {
                                const newHls = [...contentData.highlights];
                                newHls[idx].label = e.target.value;
                                setContentData({ ...contentData, highlights: newHls });
                              }}
                              className={styles.fieldInput}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.cardSection}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardHeading}>
                        Numbered Case Studies ({contentData.caseStudies?.length || 0})
                      </h3>
                      <span className={styles.cardBadge}>Client Work</span>
                    </div>

                    {contentData.caseStudies?.map((cs: any, idx: number) => (
                      <div key={cs.id || idx} className={styles.itemCard}>
                        <div className={styles.itemHeader}>
                          <span className={styles.itemTitle}>{cs.account}</span>
                          <span className={styles.itemTag}>#{cs.id}</span>
                        </div>

                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>Headline</label>
                          <input
                            type="text"
                            value={cs.headline || ''}
                            onChange={(e) => {
                              const studies = [...contentData.caseStudies];
                              studies[idx].headline = e.target.value;
                              setContentData({ ...contentData, caseStudies: studies });
                            }}
                            className={styles.fieldInput}
                          />
                        </div>

                        {cs.subline !== undefined && (
                          <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Subline (Optional)</label>
                            <input
                              type="text"
                              value={cs.subline || ''}
                              onChange={(e) => {
                                const studies = [...contentData.caseStudies];
                                studies[idx].subline = e.target.value;
                                setContentData({ ...contentData, caseStudies: studies });
                              }}
                              className={styles.fieldInput}
                            />
                          </div>
                        )}

                        <div className={styles.gridThreeCol}>
                          {cs.metrics?.map((m: any, mIdx: number) => (
                            <div key={mIdx} className={styles.fieldGroup}>
                              <label className={styles.fieldLabel}>{m.label}</label>
                              <input
                                type="text"
                                value={m.value || ''}
                                onChange={(e) => {
                                  const studies = [...contentData.caseStudies];
                                  studies[idx].metrics[mIdx].value = e.target.value;
                                  setContentData({ ...contentData, caseStudies: studies });
                                }}
                                className={styles.fieldInput}
                              />
                            </div>
                          ))}
                        </div>

                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>What I Did (Bullet Points)</label>
                          {cs.whatIDid?.map((point: string, pIdx: number) => (
                            <textarea
                              key={pIdx}
                              value={point}
                              onChange={(e) => {
                                const studies = [...contentData.caseStudies];
                                studies[idx].whatIDid[pIdx] = e.target.value;
                                setContentData({ ...contentData, caseStudies: studies });
                              }}
                              className={styles.fieldTextarea}
                              rows={2}
                              style={{ marginBottom: '0.5rem' }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* 3. Numbers Strip Section */}
              {activeSection === 'stats' && Array.isArray(contentData) && (
                <div className={styles.cardSection}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardHeading}>5 Counter Statistics</h3>
                    <span className={styles.cardBadge}>Numbers Strip</span>
                  </div>
                  <div className={styles.gridTwoCol}>
                    {contentData.map((stat: any, idx: number) => (
                      <div key={stat.id || idx} className={styles.itemCard}>
                        <div className={styles.itemHeader}>
                          <span className={styles.itemTitle}>{stat.id}</span>
                          <span className={styles.itemTag}>
                            {stat.prefix}
                            {stat.value}
                            {stat.suffix}
                          </span>
                        </div>
                        <div className={styles.gridThreeCol}>
                          <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Prefix</label>
                            <input
                              type="text"
                              value={stat.prefix || ''}
                              onChange={(e) => {
                                const newStats = [...contentData];
                                newStats[idx].prefix = e.target.value;
                                setContentData(newStats);
                              }}
                              className={styles.fieldInput}
                            />
                          </div>
                          <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Number Value</label>
                            <input
                              type="number"
                              value={stat.value}
                              onChange={(e) => {
                                const newStats = [...contentData];
                                newStats[idx].value = Number(e.target.value);
                                setContentData(newStats);
                              }}
                              className={styles.fieldInput}
                            />
                          </div>
                          <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Suffix</label>
                            <input
                              type="text"
                              value={stat.suffix || ''}
                              onChange={(e) => {
                                const newStats = [...contentData];
                                newStats[idx].suffix = e.target.value;
                                setContentData(newStats);
                              }}
                              className={styles.fieldInput}
                            />
                          </div>
                        </div>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>Description Label</label>
                          <textarea
                            value={stat.label || ''}
                            onChange={(e) => {
                              const newStats = [...contentData];
                              newStats[idx].label = e.target.value;
                              setContentData(newStats);
                            }}
                            className={styles.fieldTextarea}
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Skills & Expertise */}
              {activeSection === 'skills' && Array.isArray(contentData) && (
                <div className={styles.cardSection}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardHeading}>Skill Groups & Tags</h3>
                    <span className={styles.cardBadge}>{contentData.length} Groups</span>
                  </div>

                  {contentData.map((group: any, idx: number) => (
                    <div key={group.id || idx} className={styles.itemCard}>
                      <div className={styles.itemHeader}>
                        <span className={styles.itemTitle}>{group.group}</span>
                        <span className={styles.itemTag}>{group.skills?.length} skills</span>
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Group Name</label>
                        <input
                          type="text"
                          value={group.group || ''}
                          onChange={(e) => {
                            const newGroups = [...contentData];
                            newGroups[idx].group = e.target.value;
                            setContentData(newGroups);
                          }}
                          className={styles.fieldInput}
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Skills (comma separated)</label>
                        <input
                          type="text"
                          value={group.skills?.join(', ') || ''}
                          onChange={(e) => {
                            const newGroups = [...contentData];
                            newGroups[idx].skills = e.target.value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean);
                            setContentData(newGroups);
                          }}
                          className={styles.fieldInput}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 5. Experience & Education */}
              {activeSection === 'experience' && Array.isArray(contentData) && (
                <div className={styles.cardSection}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardHeading}>Timeline Entries</h3>
                    <span className={styles.cardBadge}>{contentData.length} Items</span>
                  </div>

                  {contentData.map((exp: any, idx: number) => (
                    <div key={exp.id || idx} className={styles.itemCard}>
                      <div className={styles.itemHeader}>
                        <span className={styles.itemTitle}>
                          {exp.title} · {exp.organisation}
                        </span>
                        <span className={styles.itemTag}>{exp.period}</span>
                      </div>

                      <div className={styles.gridTwoCol}>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>Title / Role</label>
                          <input
                            type="text"
                            value={exp.title || ''}
                            onChange={(e) => {
                              const newExp = [...contentData];
                              newExp[idx].title = e.target.value;
                              setContentData(newExp);
                            }}
                            className={styles.fieldInput}
                          />
                        </div>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>Organisation / Company</label>
                          <input
                            type="text"
                            value={exp.organisation || ''}
                            onChange={(e) => {
                              const newExp = [...contentData];
                              newExp[idx].organisation = e.target.value;
                              setContentData(newExp);
                            }}
                            className={styles.fieldInput}
                          />
                        </div>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>Location</label>
                          <input
                            type="text"
                            value={exp.location || ''}
                            onChange={(e) => {
                              const newExp = [...contentData];
                              newExp[idx].location = e.target.value;
                              setContentData(newExp);
                            }}
                            className={styles.fieldInput}
                          />
                        </div>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>Period / Tenure</label>
                          <input
                            type="text"
                            value={exp.period || ''}
                            onChange={(e) => {
                              const newExp = [...contentData];
                              newExp[idx].period = e.target.value;
                              setContentData(newExp);
                            }}
                            className={styles.fieldInput}
                          />
                        </div>
                      </div>

                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Key Highlights (one per line)</label>
                        <textarea
                          value={exp.highlights?.join('\n') || ''}
                          onChange={(e) => {
                            const newExp = [...contentData];
                            newExp[idx].highlights = e.target.value
                              .split('\n')
                              .map((h) => h.trim())
                              .filter(Boolean);
                            setContentData(newExp);
                          }}
                          className={styles.fieldTextarea}
                          rows={4}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 6. Certifications */}
              {activeSection === 'certifications' && Array.isArray(contentData) && (
                <div className={styles.cardSection}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardHeading}>Certifications & Badges</h3>
                    <span className={styles.cardBadge}>{contentData.length} Certs</span>
                  </div>

                  <div className={styles.gridTwoCol}>
                    {contentData.map((cert: any, idx: number) => (
                      <div key={cert.id || idx} className={styles.itemCard}>
                        <div className={styles.itemHeader}>
                          <span className={styles.itemTitle}>{cert.name}</span>
                          <span className={styles.itemTag}>{cert.status}</span>
                        </div>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>Certification Name</label>
                          <input
                            type="text"
                            value={cert.name || ''}
                            onChange={(e) => {
                              const newCerts = [...contentData];
                              newCerts[idx].name = e.target.value;
                              setContentData(newCerts);
                            }}
                            className={styles.fieldInput}
                          />
                        </div>
                        <div className={styles.gridTwoCol}>
                          <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Issuer</label>
                            <input
                              type="text"
                              value={cert.issuer || ''}
                              onChange={(e) => {
                                const newCerts = [...contentData];
                                newCerts[idx].issuer = e.target.value;
                                setContentData(newCerts);
                              }}
                              className={styles.fieldInput}
                            />
                          </div>
                          <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Status Label</label>
                            <input
                              type="text"
                              value={cert.statusLabel || ''}
                              onChange={(e) => {
                                const newCerts = [...contentData];
                                newCerts[idx].statusLabel = e.target.value;
                                setContentData(newCerts);
                              }}
                              className={styles.fieldInput}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. Workflow & Checks */}
              {activeSection === 'workflow' && contentData && (
                <>
                  <div className={styles.cardSection}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardHeading}>Four-Step Process</h3>
                      <span className={styles.cardBadge}>How I Work</span>
                    </div>

                    <div className={styles.gridTwoCol}>
                      {contentData.processSteps?.map((step: any, idx: number) => (
                        <div key={step.id || idx} className={styles.itemCard}>
                          <div className={styles.itemHeader}>
                            <span className={styles.itemTitle}>
                              Step {step.number}: {step.title}
                            </span>
                            <span className={styles.itemTag}>{step.id}</span>
                          </div>
                          <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Title</label>
                            <input
                              type="text"
                              value={step.title || ''}
                              onChange={(e) => {
                                const newSteps = [...contentData.processSteps];
                                newSteps[idx].title = e.target.value;
                                setContentData({ ...contentData, processSteps: newSteps });
                              }}
                              className={styles.fieldInput}
                            />
                          </div>
                          <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Description</label>
                            <textarea
                              value={step.description || ''}
                              onChange={(e) => {
                                const newSteps = [...contentData.processSteps];
                                newSteps[idx].description = e.target.value;
                                setContentData({ ...contentData, processSteps: newSteps });
                              }}
                              className={styles.fieldTextarea}
                              rows={2}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.cardSection}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardHeading}>Three Things I Check First</h3>
                      <span className={styles.cardBadge}>Account Health Leaks</span>
                    </div>

                    {contentData.threeChecks?.items?.map((check: any, idx: number) => (
                      <div key={idx} className={styles.itemCard}>
                        <div className={styles.itemHeader}>
                          <span className={styles.itemTitle}>
                            {check.number}. {check.title}
                          </span>
                          <span className={styles.itemTag}>{check.badge}</span>
                        </div>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>Check Title</label>
                          <input
                            type="text"
                            value={check.title || ''}
                            onChange={(e) => {
                              const newItems = [...contentData.threeChecks.items];
                              newItems[idx].title = e.target.value;
                              setContentData({
                                ...contentData,
                                threeChecks: { ...contentData.threeChecks, items: newItems },
                              });
                            }}
                            className={styles.fieldInput}
                          />
                        </div>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>Diagnostic Detail</label>
                          <textarea
                            value={check.detail || ''}
                            onChange={(e) => {
                              const newItems = [...contentData.threeChecks.items];
                              newItems[idx].detail = e.target.value;
                              setContentData({
                                ...contentData,
                                threeChecks: { ...contentData.threeChecks, items: newItems },
                              });
                            }}
                            className={styles.fieldTextarea}
                            rows={3}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Commit & Publish Confirmation Modal */}
      {showCommitModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox}>
            <h3 className={styles.modalTitle}>
              <SaveIcon size={20} />
              <span>Confirm & Publish Changes</span>
            </h3>
            <p className={styles.modalDesc}>
              This action validates your changes against the data schema and commits directly to{' '}
              <strong style={{ color: '#ffd23f' }}>
                {githubConnected ? 'GitHub (main branch)' : 'local workspace'}
              </strong>
              {githubConnected && ', triggering an automated Vercel production rebuild.'}
            </p>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Commit / Change Summary</label>
              <input
                type="text"
                placeholder={`Update ${activeSection} via Portfolio Studio`}
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                className={styles.fieldInput}
              />
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => setShowCommitModal(false)}
                className={styles.secondaryActionBtn}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAndPublish}
                disabled={isSaving}
                className={styles.publishPrimaryBtn}
              >
                {isSaving ? 'Validating & Committing...' : 'Confirm & Commit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
