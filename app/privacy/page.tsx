import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | IslandLoaf",
  description:
    "Learn how IslandLoaf collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar user={null} />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="gradient-text text-3xl font-bold mb-2">
          Privacy Policy
        </h1>
        <p className="text-surface-400 text-sm mb-10">
          Effective date: 15 February 2026
        </p>

        <div className="prose-policy space-y-8 text-surface-300 text-[15px] leading-relaxed">
          <p>
            This Privacy Policy explains how <strong className="text-white">IslandLoaf</strong>{" "}
            (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) collects, uses, and
            protects information when you use the IslandLoaf Creator Marketplace
            (the &quot;Platform&quot;). By using the Platform you agree to the
            practices described here.
          </p>

          <Section title="1. Information We Collect">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong className="text-white">Account data</strong> — email address, user
                ID, and authentication metadata processed via Supabase Auth.
              </li>
              <li>
                <strong className="text-white">Profile data</strong> — name, avatar, bio,
                TikTok / Instagram / YouTube handles, and website URL you
                provide.
              </li>
              <li>
                <strong className="text-white">Campaign &amp; submission data</strong> —
                campaigns you create or join, video URLs you submit, timestamps,
                and moderation decisions.
              </li>
              <li>
                <strong className="text-white">Performance metrics</strong> — views, likes,
                comments, derived scores, and leaderboard rankings from approved
                sources.
              </li>
              <li>
                <strong className="text-white">Payment data</strong> — entry-fee and payout
                request records. We <em>do not</em> store full card numbers;
                payments are handled by our payment providers.
              </li>
              <li>
                <strong className="text-white">Device &amp; usage data</strong> — IP address,
                browser/device information, and server logs for security and
                debugging.
              </li>
              <li>
                <strong className="text-white">Cookies / local storage</strong> — used to
                maintain your session and improve the experience.
              </li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Provide authentication, accounts, roles, and approvals.</li>
              <li>
                Operate campaigns, leaderboards, scoring, and moderation
                workflows.
              </li>
              <li>
                Process entry fees, wallet balances, transactions, and payouts
                (where enabled).
              </li>
              <li>Prevent fraud, abuse, and policy violations.</li>
              <li>
                Improve, maintain, and secure the Platform; provide customer
                support.
              </li>
            </ul>
          </Section>

          <Section title="3. How We Share Your Information">
            <p>We may share data with:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>
                <strong className="text-white">Service providers</strong> — Supabase
                (hosting, auth, database), payment processors (e.g.&nbsp;PayHere,
                Stripe) when enabled, and analytics tools.
              </li>
              <li>
                <strong className="text-white">Brands and creators</strong> — as needed to
                operate campaigns (e.g.&nbsp;leaderboard entries, approved
                submission results).
              </li>
              <li>
                <strong className="text-white">Legal &amp; safety</strong> — if required by
                law, regulation, or legal process, or to protect rights, users,
                or the Platform.
              </li>
            </ul>
          </Section>

          <Section title="4. Data Retention">
            <p>
              We retain personal data as long as your account is active or as
              needed to operate the Platform, comply with legal obligations,
              resolve disputes, and enforce agreements.
            </p>
          </Section>

          <Section title="5. Security">
            <p>
              We use commercially reasonable safeguards including access
              controls, encryption in transit, and role-based security policies.
              No method of transmission or storage is 100&nbsp;% secure, and we
              cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="6. Your Rights">
            <p>
              Depending on your jurisdiction you may have the right to access,
              correct, delete, or export your personal data. To exercise these
              rights, contact us at{" "}
              <a
                href="mailto:aicodeagency@gmail.com"
                className="text-electric hover:underline"
              >
                aicodeagency@gmail.com
              </a>
              .
            </p>
          </Section>

          <Section title="7. Children">
            <p>
              The Platform is not directed at children under 13 (or the minimum
              age in your jurisdiction). We do not knowingly collect data from
              children.
            </p>
          </Section>

          <Section title="8. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. The latest
              version will always be available on this page with a revised
              effective date.
            </p>
          </Section>

          <Section title="9. Contact Us">
            <p>
              If you have questions about this Privacy Policy, please email us
              at{" "}
              <a
                href="mailto:aicodeagency@gmail.com"
                className="text-electric hover:underline"
              >
                aicodeagency@gmail.com
              </a>
              .
            </p>
          </Section>
        </div>

        <div className="mt-12 pt-8 border-t border-surface-800/50">
          <Link
            href="/"
            className="text-sm text-surface-400 hover:text-electric transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white mb-3">{title}</h2>
      {children}
    </section>
  );
}
