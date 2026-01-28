import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="text-sm font-bold text-white mb-2">{title}</h2>
      <div className="text-sm text-white/75 space-y-2 leading-6">{children}</div>
    </section>
  );
}

export default function Terms() {
  const navigate = useNavigate();
  const supportEmail = 'support@elixstarlive.co.uk';
  const effectiveDate = '2026-01-28';

  return (
    <div className="min-h-screen bg-black text-white p-4 flex justify-center">
      <div className="w-full max-w-[700px]">
        <header className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} aria-label="Back">
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-bold text-lg">Terms of Service</h1>
          <div className="w-6" />
        </header>

        <div className="text-xs text-white/60">Effective date: {effectiveDate}</div>

        <Section title="1. Overview">
          <p>
            These Terms govern your use of ElixStarLive (the “Service”). By using the Service, you agree to these Terms.
            If you do not agree, do not use the Service.
          </p>
        </Section>

        <Section title="2. Accounts & Security">
          <ul className="list-disc pl-5 space-y-1">
            <li>You must provide accurate account information and keep your credentials secure.</li>
            <li>You are responsible for activity under your account.</li>
            <li>We may suspend accounts for suspicious activity or Terms violations.</li>
          </ul>
        </Section>

        <Section title="3. User Content (UGC)">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              You keep ownership of content you upload (videos, comments, profile content), but you grant us a license to
              host, store, reproduce, display, and distribute it within the Service.
            </li>
            <li>
              You represent that you have all necessary rights to upload and share your content, including music, voice,
              and visuals.
            </li>
            <li>
              You may not upload content that infringes copyrights, violates privacy, or breaks the law.
            </li>
          </ul>
        </Section>

        <Section title="4. Audio & Music Policy (Copyright Safe)">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              The Service may offer royalty-free / licensed / original audio tracks. Track availability can change.
            </li>
            <li>
              If you use third-party music, you must have permission or a valid license. “No copyright” claims without
              a real license do not protect you.
            </li>
            <li>
              We may mute, remove, or restrict audio and/or videos when we receive a valid rights complaint or detect
              suspected infringement.
            </li>
          </ul>
        </Section>

        <Section title="5. Copyright Complaints (DMCA-style process)">
          <p>
            If you believe content on the Service infringes your copyright, contact us at{' '}
            <span className="text-[#E6B36A] font-semibold">{supportEmail}</span> with:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your full name and contact information.</li>
            <li>Identification of the copyrighted work.</li>
            <li>The in-app link(s) or description of the infringing content.</li>
            <li>A statement that you have a good-faith belief the use is not authorized.</li>
            <li>A statement that your notice is accurate and you are the rights holder or authorized to act.</li>
          </ul>
        </Section>

        <Section title="6. Prohibited Conduct">
          <ul className="list-disc pl-5 space-y-1">
            <li>Uploading illegal content, hate, harassment, sexual exploitation, or non-consensual content.</li>
            <li>Impersonation, fraud, or phishing.</li>
            <li>Attempting to bypass security or access data you do not have rights to.</li>
          </ul>
        </Section>

        <Section title="7. Moderation & Enforcement">
          <p>
            We may remove content, mute audio, limit distribution, or suspend accounts to protect users, comply with law,
            and enforce these Terms.
          </p>
        </Section>

        <Section title="8. Disclaimers">
          <p>
            The Service is provided “as is” and “as available”. We do not guarantee uninterrupted operation or that all
            content is licensed for every possible use. You are responsible for your content and your licensing.
          </p>
        </Section>

        <Section title="9. Contact">
          <p>
            Questions about these Terms: <span className="text-[#E6B36A] font-semibold">{supportEmail}</span>
          </p>
        </Section>
      </div>
    </div>
  );
}

