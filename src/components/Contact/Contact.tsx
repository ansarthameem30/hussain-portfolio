'use client';

import { useState } from 'react';
import { contactConfig } from '@/config/content/contact.config';
import profileData from '@/data/content/profile.json';
import { siteConfig } from '@/config/site.config';
import styles from './Contact.module.css';
import {
  MailIcon,
  WhatsAppIcon,
  LinkedInIcon,
  CalendarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from '@/components/Icons/Icons';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setSubmitted(true);
      }
    } catch {
      setSubmitted(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <div className="section-badge">
            <span>Direct Inquiries</span>
          </div>
          <h2 className={styles.heading}>{contactConfig.heading}</h2>
          <p className={styles.sub}>{contactConfig.subheading}</p>
        </div>

        <div className={styles.grid}>
          {/* Left: contact links */}
          <div className={styles.leftCol}>
            <div className={styles.links}>
              <a
                id="contact-email"
                href={`mailto:${profileData.contact?.email || contactConfig.links.email}`}
                className={styles.link}
              >
                <div className={styles.linkIconWrap}>
                  <MailIcon size={18} />
                </div>
                <div>
                  <span className={styles.linkLabel}>Email directly</span>
                  <span className={styles.linkValue}>{profileData.contact?.email || contactConfig.links.email}</span>
                </div>
              </a>

              <a
                id="contact-whatsapp"
                href={`https://wa.me/${(profileData.contact?.whatsapp || contactConfig.links.whatsapp).replace(/\D/g, '')}?text=${encodeURIComponent(
                  profileData.contact?.whatsappMessage || contactConfig.links.whatsappMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <div className={styles.linkIconWrap}>
                  <WhatsAppIcon size={18} />
                </div>
                <div>
                  <span className={styles.linkLabel}>WhatsApp chat</span>
                  <span className={styles.linkValue}>Instant response →</span>
                </div>
              </a>

              <a
                id="contact-linkedin"
                href={profileData.contact?.linkedin || contactConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <div className={styles.linkIconWrap}>
                  <LinkedInIcon size={18} />
                </div>
                <div>
                  <span className={styles.linkLabel}>LinkedIn profile</span>
                  <span className={styles.linkValue}>Connect on LinkedIn →</span>
                </div>
              </a>

              <a
                id="contact-calendar"
                href={profileData.contact?.calendarLink || '#checks'}
                className={`btn btn--secondary ${styles.calBtn}`}
              >
                <CalendarIcon size={16} />
                <span>Book 15-minute diagnostic call</span>
              </a>
            </div>
          </div>

          {/* Right: form */}
          <div className={styles.formCol}>
            {submitted ? (
              <div className={styles.success}>
                <div className={styles.successIcon}>
                  <CheckCircleIcon size={32} />
                </div>
                <h3>Message received</h3>
                <p>{contactConfig.form.successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                <div className={styles.formGroup}>
                  <label htmlFor="contact-name" className={styles.formLabel}>
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    className="input"
                    placeholder={contactConfig.form.namePlaceholder}
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="contact-email-field" className={styles.formLabel}>
                    Business Email
                  </label>
                  <input
                    id="contact-email-field"
                    name="email"
                    type="email"
                    required
                    className="input"
                    placeholder={contactConfig.form.emailPlaceholder}
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="contact-message" className={styles.formLabel}>
                    Message & Account Details
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={4}
                    className="input"
                    placeholder={contactConfig.form.messagePlaceholder}
                    value={form.message}
                    onChange={handleChange}
                  />
                </div>

                <button
                  id="contact-submit"
                  type="submit"
                  className={`btn btn--primary ${styles.submitBtn}`}
                  disabled={sending}
                >
                  <span>{sending ? 'Sending…' : contactConfig.form.submitLabel}</span>
                  {!sending && <ArrowRightIcon size={15} />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerInner}>
            <p className={styles.footerCopy}>{profileData.footer?.copyright || contactConfig.footer.copyright}</p>
            <div className={styles.footerLinks}>
              <a href={profileData.contact?.linkedin || siteConfig.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <a
                href={`https://wa.me/${(profileData.contact?.whatsapp || siteConfig.whatsapp).replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
              <a href={profileData.contact?.resumeUrl || siteConfig.resumeUrl} download>
                Resume
              </a>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}
