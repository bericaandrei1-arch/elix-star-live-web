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

export default function Copyright() {
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
          <h1 className="font-bold text-lg">Copyright & Audio Policy</h1>
          <div className="w-6" />
        </header>

        <div className="text-xs text-white/60">Last updated: {effectiveDate}</div>

        <Section title="Copyright Notice">
          <p>
            ElixStarLive respects intellectual property rights. Users may only upload content they own or have permission
            to use, including music and sound recordings.
          </p>
        </Section>

        <Section title="Audio Safety">
          <ul className="list-disc pl-5 space-y-1">
            <li>We provide a selection of royalty-free / licensed / original audio for creators when available.</li>
            <li>Creators are responsible for ensuring that any third-party audio they use is properly licensed.</li>
            <li>We may mute, remove, or limit distribution of content to address rights complaints.</li>
          </ul>
        </Section>

        <Section title="Report Copyright Infringement">
          <p>
            Send a notice to <span className="text-[#E6B36A] font-semibold">{supportEmail}</span> with:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your name and contact information.</li>
            <li>Details of the copyrighted work.</li>
            <li>The URL(s) or clear identification of the allegedly infringing content.</li>
            <li>A statement of good-faith belief that the use is not authorized.</li>
            <li>A statement that the information is accurate and you are the rights holder (or authorized agent).</li>
          </ul>
        </Section>

        <Section title="What happens next">
          <ul className="list-disc pl-5 space-y-1">
            <li>We review the report and may mute/remove the content while investigating.</li>
            <li>We may contact the uploader for clarification or counter-information.</li>
            <li>Repeat infringers may have their accounts suspended or terminated.</li>
          </ul>
        </Section>
      </div>
    </div>
  );
}

