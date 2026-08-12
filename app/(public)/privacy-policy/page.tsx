import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — AutoCapital Wheels',
  description: 'Read the privacy policy of AutoCapital Wheels to understand how we collect, store, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6]/30 pt-20">
      {/* Header */}
      <div className="bg-[#faf9f6] text-neutral-900 py-14 px-4 border-b border-neutral-200/60">
        <div className="container-custom max-w-4xl text-center">
          <div className="w-10 h-0.5 bg-amber-500 mx-auto mb-4" />
          <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-900">Privacy Policy</h1>
          <p className="text-neutral-500 text-sm font-light mt-2">
            Last Updated: August 2026. Learn how we handle your personal information.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom max-w-4xl py-12 px-4">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-10 space-y-6 text-neutral-600 font-light leading-relaxed text-sm sm:text-base">
          
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-neutral-900">1. Information We Collect</h2>
            <p>
              We collect information that you directly provide to us, including when you register an account, list your vehicle for sale, submit a contact enquiry, or request a test drive. This information may include:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-500">
              <li>Contact details such as your name, email address, physical address, and mobile number.</li>
              <li>Vehicle details (when listing a car for sale) including registration number, service logs, and photos.</li>
              <li>Authentication data used to verify identity (Google profile data, login emails).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-neutral-900">2. How We Use Your Information</h2>
            <p>
              The data we collect is utilized strictly to provide our services and ensure seamless transactions. Specifically, we use it to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-500">
              <li>Process buy/sell requests and respond to enquiries.</li>
              <li>Authenticate your account and maintain secure customer profiles.</li>
              <li>Communicate updates, verify vehicle documentation, and provide client support via email or WhatsApp.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-neutral-900">3. Data Sharing & Security</h2>
            <p>
              AutoCapital Wheels respects your privacy. We do not sell or trade your personal information to third parties. We may only share necessary details with authorized service partners (such as RC transfer assistants or valuation inspectors) to fulfill transactions, under strict confidentiality agreements.
            </p>
            <p>
              We utilize standard industry practices, secure database structures (via Supabase), and authentication protocols to safeguard your personal credentials and information.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-neutral-900">4. Your Privacy Rights</h2>
            <p>
              You have the right to access, edit, or request the deletion of your personal account credentials or listed vehicle details at any time. For profile modifications or database deletion requests, please contact us directly at <span className="font-semibold text-neutral-900">autocapitalwheels@gmail.com</span>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
