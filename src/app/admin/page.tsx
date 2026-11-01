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
  GitHubIcon,
  RefreshIcon,
  CloseIcon,
  SparklesIcon,
  UploadIcon,
  FileTextIcon,
  ImageIcon,
} from '@/components/Icons/AdminIcons';

type ContentType =
  | 'profile'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'certifications'
  | 'stats'
  | 'workflow'
  | 'creative';

interface SectionNavItem {
  id: ContentType;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: SectionNavItem[] = [
  { id: 'profile', label: 'Profile & Identity', shortLabel: 'Profile', icon: <UserIcon size={16} /> },
  { id: 'projects', label: 'Projects & Results', shortLabel: 'Projects', icon: <BarChartIcon size={16} /> },
  { id: 'stats', label: 'Numbers Strip', shortLabel: 'Stats', icon: <HashIcon size={16} /> },
  { id: 'skills', label: 'Skills & Tools', shortLabel: 'Skills', icon: <ZapIcon size={16} /> },
  { id: 'experience', label: 'Experience & Timeline', shortLabel: 'Timeline', icon: <BriefcaseIcon size={16} /> },
  { id: 'certifications', label: 'Certifications', shortLabel: 'Certs', icon: <AwardIcon size={16} /> },
  { id: 'workflow', label: 'How I Work & Leaks', shortLabel: 'Workflow', icon: <GitMergeIcon size={16} /> },
  { id: 'creative', label: 'Creative Gallery', shortLabel: 'Creative', icon: <SparklesIcon size={16} /> },
];

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

  // Resume upload state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeUploadMsg, setResumeUploadMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    setIsUploadingResume(true);
    setResumeUploadMsg(null);
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      const res = await fetch('/api/admin/upload-resume', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setResumeUploadMsg({ type: 'success', text: data.message });
        setResumeFile(null);
        loadSection('profile');
      } else {
        setResumeUploadMsg({ type: 'error', text: data.error || 'Failed to upload resume.' });
      }
    } catch {
      setResumeUploadMsg({ type: 'error', text: 'Network error uploading resume.' });
    } finally {
      setIsUploadingResume(false);
    }
  };

  // Image / Headshot upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadMsg, setImageUploadMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleImageUpload = async () => {
    if (!imageFile) return;
    setIsUploadingImage(true);
    setImageUploadMsg(null);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImageUploadMsg({ type: 'success', text: data.message });
        setImageFile(null);
        loadSection('profile');
      } else {
        setImageUploadMsg({ type: 'error', text: data.error || 'Failed to upload photo.' });
      }
    } catch {
      setImageUploadMsg({ type: 'error', text: 'Network error uploading photo.' });
    } finally {
      setIsUploadingImage(false);
    }
  };

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
          commitMessage: commitMessage || `Update ${activeSection} via Portfolio Studio`,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setNotification({
          type: 'success',
          message: `${result.message} ${result.result?.destination === 'github' ? 'Changes committed to GitHub. Vercel build triggered!' : 'Local workspace JSON updated.'}`,
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

  // Login Screen
  if (isAuthed === false) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginIconCircle}>
            <LockIcon size={24} />
          </div>
          <h1 className={styles.loginTitle}>Admin Console</h1>
          <p className={styles.loginSubtitle}>
            Enter your master password to manage portfolio content.
          </p>
          <form onSubmit={handleLogin}>
            <div className={styles.loginInputWrap}>
              <input
                type="password"
                placeholder="Enter password..."
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
            Secured via HttpOnly credentials
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
          <span>Verifying authorization...</span>
        </div>
      </div>
    );
  }

  const currentNav = NAV_ITEMS.find((n) => n.id === activeSection);

  return (
    <div className={styles.adminRoot}>
      {/* ── Top Header Bar ── */}
      <header className={styles.topNav}>
        <div className={styles.navBrand}>
          <span className={styles.brandPill}>CMS</span>
          <span className={styles.brandName}>Portfolio Studio</span>
        </div>

        <div className={styles.navActions}>
          <span className={styles.connectionBadge} title={githubConnected ? 'GitHub API sync active' : 'Local file system mode'}>
            <span className={styles.connectionDot}></span>
            <GitHubIcon size={13} />
            <span>{githubConnected ? 'Live' : 'Local'}</span>
          </span>

          <a href="/" target="_blank" rel="noopener noreferrer" className={styles.iconBtn} title="View live site">
            <span>Site</span>
            <ExternalLinkIcon size={13} />
          </a>

          <button onClick={handleLogout} className={styles.logoutBtn} title="Sign Out">
            <LogOutIcon size={15} />
          </button>
        </div>
      </header>

      {/* ── Mobile Horizontal Swipeable Tabs Strip ── */}
      <div className={styles.mobileTabsStrip}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => loadSection(item.id)}
            className={`${styles.mobileTabItem} ${activeSection === item.id ? styles.mobileTabItemActive : ''}`}
          >
            <span>{item.icon}</span>
            <span>{item.shortLabel}</span>
          </button>
        ))}
      </div>

      {/* ── Main Dashboard ── */}
      <div className={styles.dashboardBody}>
        {/* Desktop Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarGroupLabel}>Content Architecture</div>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => loadSection(item.id)}
              className={`${styles.navButton} ${activeSection === item.id ? styles.navButtonActive : ''}`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          <div className={styles.sidebarFooter}>
            <div style={{ color: '#ffd23f', fontWeight: 600, marginBottom: '0.25rem' }}>
              Publishing Workflow
            </div>
            1. Edit Form or JSON<br />
            2. Validate schema<br />
            3. Direct GitHub push<br />
            4. Vercel auto-deploys
          </div>
        </aside>

        {/* Content Viewport */}
        <main className={styles.mainViewport}>
          {/* Notifications */}
          {notification && (
            <div className={notification.type === 'success' ? styles.bannerSuccess : styles.bannerError}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {notification.type === 'success' ? <CheckCircleIcon size={16} /> : <AlertCircleIcon size={16} />}
                <span>{notification.message}</span>
              </div>
              <button onClick={() => setNotification(null)} className={styles.bannerCloseBtn}>
                <CloseIcon size={15} />
              </button>
            </div>
          )}

          {/* Section Header Controls */}
          <div className={styles.viewHeader}>
            <div className={styles.titleArea}>
              <h2 className={styles.viewTitle}>
                {currentNav?.icon}
                <span>{currentNav?.label}</span>
              </h2>
              <p className={styles.viewSubtitle}>
                Edit and save changes. Every save is validated against the data schema.
              </p>
            </div>

            {/* Desktop Action Row */}
            <div className={styles.actionRow}>
              <div className={styles.modeSegmented}>
                <button
                  type="button"
                  onClick={() => setViewMode('form')}
                  className={`${styles.segmentBtn} ${viewMode === 'form' ? styles.segmentBtnActive : ''}`}
                >
                  <EditIcon size={13} />
                  <span>Form</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRawJson(JSON.stringify(contentData, null, 2));
                    setViewMode('json');
                  }}
                  className={`${styles.segmentBtn} ${viewMode === 'json' ? styles.segmentBtnActive : ''}`}
                >
                  <CodeIcon size={13} />
                  <span>JSON</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowCommitModal(true)}
                disabled={isLoading || isSaving}
                className={styles.publishPrimaryBtn}
              >
                <SaveIcon size={15} />
                <span>Publish</span>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div style={{ padding: '3rem 0', textAlign: 'center', color: '#94a3b8' }}>
              <RefreshIcon size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: '0.5rem' }} />
              <div>Loading data...</div>
            </div>
          ) : viewMode === 'json' ? (
            /* ── JSON Raw Code Mode ── */
            <div className={styles.codeEditorWrapper}>
              <div className={styles.codeEditorHeader}>
                <span>src/data/content/{activeSection}.json</span>
                <span>Validates on Publish</span>
              </div>
              <textarea
                value={rawJson}
                onChange={(e) => setRawJson(e.target.value)}
                className={styles.codeTextarea}
                spellCheck={false}
              />
            </div>
          ) : (
            /* ── Dedicated Form Editors ── */
            <div>
              {/* 1. Profile Section Form */}
              {activeSection === 'profile' && contentData && (
                <>
                  <div className={styles.cardSection}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardHeading}>Identity & Hero</h3>
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
                        <label className={styles.fieldLabel}>Role / Designation</label>
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
                      <label className={styles.fieldLabel}>Hero Subheadline</label>
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
                      <h3 className={styles.cardHeading}>About & Biography</h3>
                      <span className={styles.cardBadge}>Bio</span>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Short Summary Bio</label>
                      <textarea
                        value={contentData.shortBio || ''}
                        onChange={(e) => setContentData({ ...contentData, shortBio: e.target.value })}
                        className={styles.fieldTextarea}
                        rows={3}
                      />
                    </div>

                    {contentData.fullBio?.map((paragraph: string, pIdx: number) => (
                      <div key={pIdx} className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Bio Paragraph {pIdx + 1}</label>
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
                      <h3 className={styles.cardHeading}>Contact & Social Channels</h3>
                      <span className={styles.cardBadge}>Links</span>
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
                        <label className={styles.fieldLabel}>WhatsApp Number</label>
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
                        <label className={styles.fieldLabel}>LinkedIn URL</label>
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
                        <label className={styles.fieldLabel}>Booking / Calendly Link</label>
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

                  {/* PDF Resume Management Card */}
                  <div className={styles.cardSection}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardHeading}>
                        <FileTextIcon size={16} />
                        <span>Resume Management (PDF)</span>
                      </h3>
                      <span className={styles.cardBadge}>Direct Upload & Replace</span>
                    </div>

                    <div className={styles.resumeUploadCard}>
                      <div className={styles.resumeCardHeader}>
                        <div className={styles.resumeStatus}>
                          <CheckCircleIcon size={16} style={{ color: '#10b981' }} />
                          <span>Current File: <strong>Abdul-Malik-Hussain-Performance-Marketing.pdf</strong></span>
                        </div>
                        <a
                          href={contentData.contact?.resumeUrl || '/Abdul-Malik-Hussain-Performance-Marketing.pdf'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.fileChooseBtn}
                          style={{ textDecoration: 'none' }}
                        >
                          <span>Preview Current PDF</span>
                          <ExternalLinkIcon size={14} />
                        </a>
                      </div>

                      <div className={styles.resumeFilePicker}>
                        <label className={styles.fileChooseBtn}>
                          <UploadIcon size={15} />
                          <span>{resumeFile ? resumeFile.name : 'Select New PDF Resume'}</span>
                          <input
                            type="file"
                            accept=".pdf,application/pdf"
                            className={styles.fileInputHidden}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setResumeFile(e.target.files[0]);
                                setResumeUploadMsg(null);
                              }
                            }}
                          />
                        </label>

                        {resumeFile && (
                          <button
                            type="button"
                            onClick={handleResumeUpload}
                            disabled={isUploadingResume}
                            className={styles.fileUploadSubmitBtn}
                          >
                            <SaveIcon size={14} />
                            <span>{isUploadingResume ? 'Uploading...' : 'Upload & Replace Resume'}</span>
                          </button>
                        )}
                      </div>

                      {resumeUploadMsg && (
                        <div
                          style={{
                            fontSize: '0.825rem',
                            color: resumeUploadMsg.type === 'success' ? '#34d399' : '#f87171',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                          }}
                        >
                          {resumeUploadMsg.type === 'success' ? <CheckCircleIcon size={15} /> : <AlertCircleIcon size={15} />}
                          <span>{resumeUploadMsg.text}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* About Me Portrait / Headshot Management Card */}
                  <div className={styles.cardSection}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardHeading}>
                        <ImageIcon size={16} />
                        <span>About Me Portrait Photo</span>
                      </h3>
                      <span className={styles.cardBadge}>Upload & Instant Replace</span>
                    </div>

                    <div className={styles.portraitManagerCard}>
                      <div className={styles.portraitPreviewCol}>
                        <div className={styles.portraitPreviewFrame}>
                          <img
                            src={contentData.headshot || '/headshot.jpg'}
                            alt="Current portrait"
                            className={styles.portraitImg}
                          />
                        </div>
                        <a
                          href={contentData.headshot || '/headshot.jpg'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.fileChooseBtn}
                          style={{ textDecoration: 'none', fontSize: '0.75rem', height: '30px' }}
                        >
                          <span>Full Size</span>
                          <ExternalLinkIcon size={12} />
                        </a>
                      </div>

                      <div className={styles.portraitControlsCol}>
                        <div className={styles.resumeStatus}>
                          <CheckCircleIcon size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                          <span>Active File: <strong>{contentData.headshot || '/headshot.jpg'}</strong></span>
                        </div>

                        <div className={styles.resumeFilePicker}>
                          <label className={styles.fileChooseBtn}>
                            <UploadIcon size={15} />
                            <span>{imageFile ? imageFile.name : 'Select New Photo from Device'}</span>
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/jpg,image/webp"
                              className={styles.fileInputHidden}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setImageFile(e.target.files[0]);
                                  setImageUploadMsg(null);
                                }
                              }}
                            />
                          </label>

                          {imageFile && (
                            <button
                              type="button"
                              onClick={handleImageUpload}
                              disabled={isUploadingImage}
                              className={styles.fileUploadSubmitBtn}
                            >
                              <SaveIcon size={14} />
                              <span>{isUploadingImage ? 'Uploading & Replacing...' : 'Upload & Replace Photo'}</span>
                            </button>
                          )}
                        </div>

                        {imageUploadMsg && (
                          <div
                            style={{
                              fontSize: '0.825rem',
                              color: imageUploadMsg.type === 'success' ? '#34d399' : '#f87171',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                            }}
                          >
                            {imageUploadMsg.type === 'success' ? <CheckCircleIcon size={15} /> : <AlertCircleIcon size={15} />}
                            <span>{imageUploadMsg.text}</span>
                          </div>
                        )}

                        <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
                          <label className={styles.fieldLabel}>Or Direct Image URL / CDN Link</label>
                          <input
                            type="text"
                            value={contentData.headshot || ''}
                            onChange={(e) => setContentData({ ...contentData, headshot: e.target.value })}
                            className={styles.fieldInput}
                            placeholder="/headshot.jpg"
                          />
                        </div>
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
                      <h3 className={styles.cardHeading}>Highlight Metric Tiles</h3>
                      <span className={styles.cardBadge}>4 Tiles</span>
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
                            <label className={styles.fieldLabel}>Tile Label</label>
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
                      <span className={styles.cardBadge}>Results</span>
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
                          <label className={styles.fieldLabel}>What I Did (Accomplishments)</label>
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
                              style={{ marginBottom: '0.4rem' }}
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
                            <label className={styles.fieldLabel}>Value</label>
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
                    <h3 className={styles.cardHeading}>Skill Groups & Tools</h3>
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
                    <h3 className={styles.cardHeading}>Career & Education Timeline</h3>
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
                          <label className={styles.fieldLabel}>Role / Degree</label>
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
                          <label className={styles.fieldLabel}>Organisation / University</label>
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
                      <h3 className={styles.cardHeading}>Process Steps</h3>
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
                      <span className={styles.cardBadge}>Audit Leaks</span>
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
                          <label className={styles.fieldLabel}>Leak Title</label>
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

              {/* ── Creative Gallery Section Form ── */}
              {activeSection === 'creative' && (
                <>
                  <div className={styles.cardSection}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardHeading}>Creative Showcase Header</h3>
                      <span className={styles.cardBadge}>Copy & Positioning</span>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Section Heading</label>
                      <input
                        type="text"
                        value={contentData.heading || ''}
                        onChange={(e) => setContentData({ ...contentData, heading: e.target.value })}
                        className={styles.fieldInput}
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Confidentiality Disclaimer</label>
                      <input
                        type="text"
                        value={contentData.disclaimer || ''}
                        onChange={(e) => setContentData({ ...contentData, disclaimer: e.target.value })}
                        className={styles.fieldInput}
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Subheading / Intro</label>
                      <textarea
                        value={contentData.subheading || ''}
                        onChange={(e) => setContentData({ ...contentData, subheading: e.target.value })}
                        className={styles.fieldTextarea}
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className={styles.cardSection}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardHeading}>
                        <span>Creative Assets ({contentData.items?.length || 0})</span>
                      </h3>
                      <span className={styles.cardBadge}>Reels & High-CTR Posts</span>
                    </div>

                    {contentData.items?.map((item: any, idx: number) => (
                      <div key={item.id || idx} className={styles.itemCard}>
                        <div className={styles.itemHeader}>
                          <span className={styles.itemTitle}>
                            #{idx + 1} {item.title}
                          </span>
                          <span className={styles.itemTag}>
                            {item.format?.toUpperCase()} · {item.categoryLabel || item.category}
                          </span>
                        </div>

                        <div className={styles.fieldGrid2}>
                          <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Asset Title</label>
                            <input
                              type="text"
                              value={item.title || ''}
                              onChange={(e) => {
                                const newItems = [...contentData.items];
                                newItems[idx].title = e.target.value;
                                setContentData({ ...contentData, items: newItems });
                              }}
                              className={styles.fieldInput}
                            />
                          </div>

                          <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Format (reel | post | carousel)</label>
                            <input
                              type="text"
                              value={item.format || ''}
                              onChange={(e) => {
                                const newItems = [...contentData.items];
                                newItems[idx].format = e.target.value;
                                setContentData({ ...contentData, items: newItems });
                              }}
                              className={styles.fieldInput}
                            />
                          </div>
                        </div>

                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>Hook / Punchline</label>
                          <input
                            type="text"
                            value={item.hook || ''}
                            onChange={(e) => {
                              const newItems = [...contentData.items];
                              newItems[idx].hook = e.target.value;
                              setContentData({ ...contentData, items: newItems });
                            }}
                            className={styles.fieldInput}
                          />
                        </div>

                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>Strategy & Concept Description</label>
                          <textarea
                            value={item.description || ''}
                            onChange={(e) => {
                              const newItems = [...contentData.items];
                              newItems[idx].description = e.target.value;
                              setContentData({ ...contentData, items: newItems });
                            }}
                            className={styles.fieldTextarea}
                            rows={2}
                          />
                        </div>

                        <div className={styles.fieldGrid2}>
                          <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Performance Highlight (CTR / CVR)</label>
                            <input
                              type="text"
                              value={item.performanceHighlight || ''}
                              onChange={(e) => {
                                const newItems = [...contentData.items];
                                newItems[idx].performanceHighlight = e.target.value;
                                setContentData({ ...contentData, items: newItems });
                              }}
                              className={styles.fieldInput}
                            />
                          </div>

                          <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Duration / Ratio</label>
                            <input
                              type="text"
                              value={item.duration || item.ratio || ''}
                              onChange={(e) => {
                                const newItems = [...contentData.items];
                                newItems[idx].duration = e.target.value;
                                setContentData({ ...contentData, items: newItems });
                              }}
                              className={styles.fieldInput}
                            />
                          </div>
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

      {/* ── Mobile Sticky Bottom Action Bar ── */}
      <div className={styles.mobileStickyBar}>
        <div className={styles.modeSegmented}>
          <button
            type="button"
            onClick={() => setViewMode('form')}
            className={`${styles.segmentBtn} ${viewMode === 'form' ? styles.segmentBtnActive : ''}`}
          >
            <EditIcon size={13} />
            <span>Form</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setRawJson(JSON.stringify(contentData, null, 2));
              setViewMode('json');
            }}
            className={`${styles.segmentBtn} ${viewMode === 'json' ? styles.segmentBtnActive : ''}`}
          >
            <CodeIcon size={13} />
            <span>JSON</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowCommitModal(true)}
          disabled={isLoading || isSaving}
          className={styles.mobilePublishBtn}
        >
          <SaveIcon size={15} />
          <span>Publish {currentNav?.shortLabel}</span>
        </button>
      </div>

      {/* ── Commit & Publish Confirmation Modal with Live Preview ── */}
      {showCommitModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <h3 className={styles.modalTitle} style={{ margin: 0 }}>
                <SaveIcon size={18} />
                <span>Confirm & Publish Changes</span>
              </h3>
              <span className={styles.cardBadge} style={{ textTransform: 'uppercase' }}>
                {activeSection}
              </span>
            </div>

            <p className={styles.modalDesc}>
              Preview the updated JSON payload below. Once confirmed, this will validate against the schema and commit directly to{' '}
              <strong style={{ color: '#ffd23f' }}>
                {githubConnected ? 'GitHub (main branch)' : 'workspace JSON'}
              </strong>
              {githubConnected && ', triggering an automatic production build on Vercel.'}
            </p>

            {/* Live Payload Preview */}
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Live Payload Preview ({activeSection}.json)
                </span>
                <span style={{ fontSize: '0.72rem', color: '#ffd23f' }}>
                  {Array.isArray(contentData) ? `${contentData.length} entries` : typeof contentData === 'object' && contentData ? `${Object.keys(contentData).length} fields` : ''}
                </span>
              </div>
              <div className={styles.previewScrollBox}>
                {viewMode === 'json' ? rawJson : JSON.stringify(contentData, null, 2)}
              </div>
            </div>

            <div className={styles.fieldGroup} style={{ marginBottom: '1rem' }}>
              <label className={styles.fieldLabel}>Commit Summary / Note</label>
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
                Back to Edit
              </button>
              <button
                type="button"
                onClick={handleSaveAndPublish}
                disabled={isSaving}
                className={styles.publishPrimaryBtn}
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
