import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions | IslandLoaf",
  description:
    "The terms governing your use of the IslandLoaf Creator Marketplace.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar user={null} />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="gradient-text text-3xl font-bold mb-2">
          Terms &amp; Conditions
        </h1>
        <p className="text-surface-400 text-sm mb-10">
          Effective date: 15 February 2026
        </p>

        <div className="space-y-8 text-surface-300 text-[15px] leading-relaxed">
          <Section title="1. Acceptance">
            <p>
              By accessing or using the IslandLoaf Creator Marketplace (the
              &quot;Platform&quot;) operated by{" "}
              <strong className="text-white">IslandLoaf</strong>{" "}
              (&quot;we&quot;, &quot;us&quot;), you agree to these Terms &amp;
              Conditions and our{" "}
              <Link href="/privacy" className="text-electric hover:underline">
                Privacy Policy
              </Link>
              . If you do not agree, do not use the Platform.
            </p>
          </Section>

          <Section title="2. Accounts & Roles">
            <p>
              You must provide a valid email address and complete email OTP
              verification to create an account. Roles include{" "}
              <strong className="text-white">Creator</strong>,{" "}
              <strong className="text-white">Brand</strong>, and platform staff
              roles (Admin, Moderator). We may require account approval before
              certain features become available. You are responsible for
              maintaining the security of your account.
            </p>
          </Section>

          <Section title="3. Campaigns">
            <p>
              Brands may create campaigns specifying rules, deadlines, target
              platforms, entry fees, and prize pools. We reserve the right to
              pause, reject, or remove any campaign that violates these Terms,
              our policies, or applicable law.
            </p>
          </Section>

          <Section title="4. Creator Submissions">
            <p>
              Creators submit content links (e.g.&nbsp;TikTok, Instagram,
              YouTube URLs). By submitting, you represent that:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>You have the right to submit the content.</li>
              <li>
                The content complies with the relevant social platform&apos;s
                terms and applicable laws.
              </li>
              <li>
                The content does not infringe any third-party intellectual
                property or rights.
              </li>
            </ul>
          </Section>

          <Section title="5. Scoring & Leaderboards">
            <p>
              Performance scores are calculated using a published formula based
              on views, likes, and comments. Metrics are subject to an
              AI-assisted extraction and moderator approval pipeline.
              Leaderboards are provided on a best-effort basis and{" "}
              <strong className="text-white">
                are not guaranteed to be error-free
              </strong>
              . Rankings may change due to moderation decisions, corrections,
              fraud checks, or provider changes.
            </p>
          </Section>

          <Section title="6. Prizes, Wallets & Payouts">
            <p>
              Prize distribution and payouts may require identity verification
              and payment provider checks. We may delay or withhold payouts for
              fraud prevention, compliance, disputes, or rule violations. Wallet
              balances are maintained in the Platform&apos;s internal ledger and
              are not interest-bearing.
            </p>
          </Section>

          <Section title="7. Fees">
            <p>
              Entry fees (if applicable) are displayed on each campaign before
              you join. You are responsible for any taxes, bank charges, or fees
              imposed by your payment provider. Please review our{" "}
              <Link
                href="/refund-policy"
                className="text-electric hover:underline"
              >
                Refund Policy
              </Link>{" "}
              for details on refunds.
            </p>
          </Section>

          <Section title="8. Prohibited Conduct">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Fraud, metric manipulation, or botting.</li>
              <li>Harassment, hate speech, or illegal content.</li>
              <li>Impersonation of other users or brands.</li>
              <li>
                Attempts to bypass security, access controls, or approval
                processes.
              </li>
              <li>Any use that violates applicable law or regulation.</li>
            </ul>
          </Section>

          <Section title="9. Content Licence">
            <p>
              To operate the Platform, you grant IslandLoaf a limited,
              non-exclusive, royalty-free licence to display your profile
              information, submission links, and approved performance results
              within the Platform and in promotional materials related to
              campaigns you participate in, unless you request removal where
              applicable by contacting us.
            </p>
          </Section>

          <Section title="10. Termination">
            <p>
              We may suspend or terminate accounts that violate these Terms,
              pose a risk to other users, or for legal compliance. You may close
              your account at any time by contacting us at{" "}
              <a
                href="mailto:aicodeagency@gmail.com"
                className="text-electric hover:underline"
              >
                aicodeagency@gmail.com
              </a>
              .
            </p>
          </Section>

          <Section title="11. Disclaimers">
            <p>
              The Platform is provided{" "}
              <strong className="text-white">&quot;as is&quot;</strong> and{" "}
              <strong className="text-white">
                &quot;as available&quot;
              </strong>{" "}
              without warranties of any kind, whether express or implied,
              including but not limited to merchantability, fitness for a
              particular purpose, or non-infringement. We do not warrant
              uninterrupted or error-free service.
            </p>
          </Section>

          <Section title="12. Limitation of Liability">
            <p>
              To the maximum extent permitted by the laws of Sri Lanka,
              IslandLoaf shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages. Our total aggregate
              liability to you shall not exceed the amounts you paid to us in
              the three (3) months preceding the claim, or LKR&nbsp;25,000,
              whichever is greater.
            </p>
          </Section>

          <Section title="13. Governing Law & Disputes">
            <p>
              These Terms are governed by and construed in accordance with the
              laws of the{" "}
              <strong className="text-white">
                Democratic Socialist Republic of Sri Lanka
              </strong>
              . Any disputes arising from or relating to these Terms or the
              Platform shall be subject to the exclusive jurisdiction of the
              courts of Sri Lanka.
            </p>
          </Section>

          <Section title="14. Changes to These Terms">
            <p>
              We may update these Terms from time to time. Material changes will
              be communicated via email or a prominent notice on the Platform.
              Your continued use after changes constitutes acceptance.
            </p>
          </Section>

          <Section title="15. Contact">
            <p>
              Questions about these Terms? Email us at{" "}
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
