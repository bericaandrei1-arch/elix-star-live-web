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

export default function Privacy() {
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
          <h1 className="font-bold text-lg">Privacy Policy</h1>
          <div className="w-6" />
        </header>

        <div className="text-xs text-white/60">Effective date: {effectiveDate}</div>

        <Section title="1. What we collect">
          <ul className="list-disc pl-5 space-y-1">
            <li>Account data: email, username, and basic profile fields you provide.</li>
            <li>Content: videos, captions, comments, and interactions you post in the Service.</li>
            <li>Technical data: device/browser information, IP address, and basic logs for security.</li>
          </ul>
        </Section>

        <Section title="2. Why we collect it">
          <ul className="list-disc pl-5 space-y-1">
            <li>To provide login, accounts, and core app features.</li>
            <li>To keep the platform safe, prevent abuse, and enforce our Terms.</li>
            <li>To improve performance and user experience.</li>
          </ul>
        </Section>

        <Section title="3. Audio & content moderation">
          <p>
            We may process user content to detect and respond to copyright complaints, abuse reports, and safety issues.
            This can include muting or removing audio/video.
          </p>
        </Section>

        <Section title="4. Sharing">
          <p>
            We do not sell your personal data. We may share data with service providers that help us run the Service (for
            example authentication, storage, analytics), under appropriate safeguards.
          </p>
        </Section>

        <Section title="5. Cookies & local storage">
          <p>
            The Service may use local storage to remember preferences (for example “remember me” or saved login details).
            You can clear this from your browser settings.
          </p>
        </Section>

        <Section title="6. Data retention">
          <p>
            We keep data as long as needed to provide the Service and comply with legal obligations. You may request
            deletion of your account, subject to applicable laws and legitimate interests.
          </p>
        </Section>

        <Section title="7. Your rights">
          <p>
            Depending on your location, you may have rights to access, correct, delete, or export your data. To request,
            contact <span className="text-[#E6B36A] font-semibold">{supportEmail}</span>.
          </p>
        </Section>

        <Section title="8. Contact">
          <p>
            Privacy questions: <span className="text-[#E6B36A] font-semibold">{supportEmail}</span>
          </p>
        </Section>
      </div>
    </div>
  );
}

