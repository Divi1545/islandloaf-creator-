import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Refund Policy | IslandLoaf",
  description:
    "Understand when and how refunds are handled on the IslandLoaf Creator Marketplace.",
};

export default function RefundPolicyPage() {
  return (
    <>
      <Navbar user={null} />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="gradient-text text-3xl font-bold mb-2">
          Refund / Return Policy
        </h1>
        <p className="text-surface-400 text-sm mb-10">
          Effective date: 15 February 2026
        </p>

        <div className="space-y-8 text-surface-300 text-[15px] leading-relaxed">
          <Section title="1. Digital Service">
            <p>
              IslandLoaf provides a digital service — the Creator Marketplace
              platform. There are no physical goods shipped or delivered. All
              services are delivered electronically upon access.
            </p>
          </Section>

          <Section title="2. Entry Fees">
            <p>
              Certain campaigns require an entry fee to participate. Unless
              required by applicable law,{" "}
              <strong className="text-white">
                entry fees are non-refundable
              </strong>{" "}
              once you join a campaign, because access to the campaign and
              participation are delivered immediately upon joining.
            </p>
          </Section>

          <Section title="3. When Refunds May Be Provided">
            <p>We may issue a refund in the following circumstances:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>
                <strong className="text-white">Campaign cancelled</strong> — The
                campaign is cancelled by IslandLoaf or the brand before the
                deadline and you had paid an entry fee.
              </li>
              <li>
                <strong className="text-white">Duplicate / erroneous charge</strong>{" "}
                — You were charged more than once or an incorrect amount due to
                a verified technical issue.
              </li>
              <li>
                <strong className="text-white">Unauthorised charge</strong> — A
                charge was made without your authorisation, and fraud is
                confirmed after investigation.
              </li>
            </ul>
          </Section>

          <Section title="4. Prize Payouts">
            <p>
              Payout requests are processed to the destination you provide
              (where enabled). Once a payout is marked as completed by the
              payment provider, the transaction may not be reversible. If a
              payout fails, the amount will be credited back to your IslandLoaf
              wallet.
            </p>
          </Section>

          <Section title="5. How to Request a Refund">
            <p>
              To request a refund, email{" "}
              <a
                href="mailto:aicodeagency@gmail.com"
                className="text-electric hover:underline"
              >
                aicodeagency@gmail.com
              </a>{" "}
              with the following details:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>Your account email address</li>
              <li>Campaign name</li>
              <li>Payment reference or transaction ID (if available)</li>
              <li>Reason for the refund request and any supporting evidence</li>
            </ul>
            <p className="mt-3">
              We aim to acknowledge refund requests within{" "}
              <strong className="text-white">5 business days</strong> and process
              approved refunds within{" "}
              <strong className="text-white">14 business days</strong>.
            </p>
          </Section>

          <Section title="6. Governing Law">
            <p>
              This Refund Policy is governed by the laws of the Democratic
              Socialist Republic of Sri Lanka. For full terms governing your use
              of the Platform, please refer to our{" "}
              <Link href="/terms" className="text-electric hover:underline">
                Terms &amp; Conditions
              </Link>
              .
            </p>
          </Section>

          <Section title="7. Contact">
            <p>
              Questions about refunds? Email us at{" "}
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
