import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer — AutoCapital Wheels',
  description: 'Read the general disclaimer of AutoCapital Wheels regarding vehicle information, pricing, and warranties.',
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6]/30 pt-20">
      {/* Header */}
      <div className="bg-[#faf9f6] text-neutral-900 py-14 px-4 border-b border-neutral-200/60">
        <div className="container-custom max-w-4xl text-center">
          <div className="w-10 h-0.5 bg-amber-500 mx-auto mb-4" />
          <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-900">Disclaimer</h1>
          <p className="text-neutral-500 text-sm font-light mt-2">
            General limitations of liability and information policies.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom max-w-4xl py-12 px-4">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-10 space-y-6 text-neutral-600 font-light leading-relaxed text-sm sm:text-base">
          
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-neutral-900">No Warranties</h2>
            <p>
              The information, specifications, pricing, and availability of vehicles listed on the AutoCapital Wheels website are provided "as is" and "as available". We do not warrant the absolute accuracy, completeness, or reliability of any details, including mileage statements or paint condition, without a physical verification.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-neutral-900">Indicative Pricing</h2>
            <p>
              Prices listed on this website represent standard estimates and are strictly indicative. The final purchase price of any vehicle is finalized only via a signed physical invoice at the time of transaction. Any booking request submitted through the website does not guarantee delivery or price locking.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-neutral-900">Third-Party Links</h2>
            <p>
              Our website may contain links to third-party services (such as bank finance portals or map navigation services). AutoCapital Wheels is not responsible for the contents, privacy terms, or actions of external websites, and clicking such links is done at the user\'s own discretion.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
