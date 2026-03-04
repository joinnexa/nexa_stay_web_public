import React from "react";
import Link from "next/link";
import { LegalLayout } from "@/components/legal/LegalLayout";

const termsSections = [
  { id: "t1", label: "1. Agreement" },
  { id: "t2", label: "2. Eligibility" },
  { id: "t3", label: "3. Identity Verification" },
  { id: "t4", label: "4. Contact Masking" },
  { id: "t5", label: "5. Host Responsibilities" },
  { id: "t6", label: "6. Guest Responsibilities" },
  { id: "t7", label: "7. Occupants" },
  { id: "t8", label: "8. Payments" },
  { id: "t9", label: "9. Cancellations & Refunds" },
  { id: "t10", label: "10. Reviews" },
  { id: "t11", label: "11. Prohibited Conduct" },
  { id: "t12", label: "12. Suspension" },
  { id: "t13", label: "13. Liability" },
  { id: "t14", label: "14. Changes" },
  { id: "t15", label: "15. Local Compliance" },
  { id: "t16", label: "16. Contact" },
];

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      subtitle="Effective Date: 24 February 2026 · By using Nexa Stays, you agree to these terms."
      sections={termsSections}
      otherLinks={[
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/refund", label: "Refund Policy" },
      ]}
    >
      <div className="max-w-none [&_h2]:text-xl [&_h2]:mt-11 [&_h2]:mb-3 [&_h2]:pb-2.5 [&_h2]:border-b [&_h2]:border-nexa-line [&_h2]:first:mt-0 [&_h3]:text-base [&_h3]:mt-5 [&_h3]:mb-2.5 [&_h3]:text-nexa-ink-2 [&_p]:mb-3.5 [&_p]:text-sm [&_ul]:pl-5 [&_ul]:mb-3.5 [&_li]:text-sm [&_li]:text-nexa-ink-3 [&_li]:mb-2 [&_li]:marker:text-nexa-primary">
        <h2 id="t1">1. Agreement</h2>
        <p>
          These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of
          Nexa Stays. By creating an account or using the platform, you agree to
          these Terms.
        </p>
        <h2 id="t2">2. Eligibility and Accounts</h2>
        <p>
          You must provide accurate information and maintain the security of your
          account. Nexa Stays may restrict or suspend accounts for violations,
          fraud, or security risks.
        </p>
        <h2 id="t3">3. Mandatory Identity Verification</h2>
        <p>
          Identity verification is required during registration. Users may browse
          while verification is pending, but certain actions remain locked until
          verified:
        </p>
        <ul>
          <li>Booking stays</li>
          <li>Publishing listings</li>
          <li>Receiving payouts</li>
        </ul>
        <p>
          Nexa Stays may request additional verification when needed for safety,
          fraud prevention, or compliance.
        </p>
        <h2 id="t4">4. Contact Masking and Platform Communication</h2>
        <p>
          Contact details (phone/email) and exact property address may be masked
          until both sides are verified and a reservation is confirmed.
        </p>
        <div className="bg-nexa-primary-soft border-l-4 border-nexa-primary rounded-r-lg py-3.5 px-4 my-4 text-sm text-nexa-primary-dark">
          Users agree not to attempt to bypass the platform using masked details,
          coded messages, or off-platform payment requests.
        </div>
        <h2 id="t5">5. Listings and Host Responsibilities</h2>
        <p>Hosts must ensure listings are accurate and up-to-date, including:</p>
        <ul>
          <li>Correct property description and rules</li>
          <li>Accurate location</li>
          <li>Disclosed fees and policies</li>
          <li>Required walkthrough video and photo standards</li>
        </ul>
        <div className="bg-nexa-primary-soft border-l-4 border-nexa-primary rounded-r-lg py-3.5 px-4 my-4 text-sm text-nexa-primary-dark">
          Hosts must not add undisclosed fees after booking confirmation.
        </div>
        <h2 id="t6">6. Guest Responsibilities</h2>
        <p>Guests must:</p>
        <ul>
          <li>Provide accurate occupant information</li>
          <li>Respect house rules and local laws</li>
          <li>Avoid property damage and disturbances</li>
        </ul>
        <p>
          Undeclared occupants or rule violations may lead to cancellation
          without refund.
        </p>
        <h2 id="t7">7. Occupants Declaration</h2>
        <p>
          For safety and compliance, guests must declare all adult occupants as
          required during booking. Nexa Stays may restrict bookings that do not
          comply.
        </p>
        <h2 id="t8">8. Payments</h2>
        <p>
          Payments may be processed through external payment providers. Nexa
          Stays does not store raw card data. Payment failures may result in
          cancellation.
        </p>
        <h2 id="t9">9. Cancellations, Disputes, and Refunds</h2>
        <p>
          Refunds are governed by the{" "}
          <Link href="/refund" className="text-nexa-primary hover:underline">
            Refund Policy
          </Link>
          . Users agree to provide evidence when requesting refunds for
          &quot;different place&quot; or similar claims.
        </p>
        <h2 id="t10">10. Reviews, Ratings, and Content</h2>
        <p>
          Content must be truthful and not abusive, discriminatory, or illegal.
          Nexa Stays may remove content that violates policy.
        </p>
        <h2 id="t11">11. Prohibited Conduct</h2>
        <p>Users must not:</p>
        <ul>
          <li>Commit fraud or misrepresent identity</li>
          <li>Bypass contact masking or off-platform payment rules</li>
          <li>Harass other users</li>
          <li>Post illegal or harmful content</li>
          <li>Attempt to exploit refund systems</li>
        </ul>
        <h2 id="t12">12. Suspension and Termination</h2>
        <p>
          Nexa Stays may suspend or terminate accounts for safety, fraud
          prevention, repeated policy violations, or legal compliance.
        </p>
        <h2 id="t13">13. Limitation of Liability</h2>
        <p>
          Nexa Stays provides a platform connecting hosts and guests. To the
          maximum extent allowed by law, Nexa Stays is not liable for indirect
          losses resulting from third-party actions.
        </p>
        <h2 id="t14">14. Changes</h2>
        <p>
          We may update features, policies, and these Terms. Updates will be
          posted with a revised effective date.
        </p>
        <h2 id="t15">15. Local Compliance</h2>
        <p>
          Users must comply with all applicable local laws and regulations
          related to lodging, identity checks, and guest registration.
        </p>
        <h2 id="t16">16. Contact</h2>
        <div className="bg-nexa-bg-2 rounded-[22px] p-6">
          <h3 className="text-base mb-3">Reach Nexa Stays</h3>
          <p className="text-nexa-primary text-sm mb-1.5">
            📞 +212 6 9028 3339 — Customer Relations
          </p>
          <p className="text-nexa-primary text-sm">
            📞 +7 995 558-21-75 — Investments
          </p>
        </div>
      </div>
    </LegalLayout>
  );
}
